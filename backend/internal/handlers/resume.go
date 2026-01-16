package handlers

import (
	"encoding/base64"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"github.com/sahil/ats-resume-maker/backend/internal/latex"
	"github.com/sahil/ats-resume-maker/backend/internal/models"
)

var compiler *latex.Compiler

func init() {
	// Initialize compiler with template and output directories
	templateDir := getEnvOrDefault("TEMPLATE_DIR", "./templates")
	outputDir := getEnvOrDefault("OUTPUT_DIR", "./output")
	compiler = latex.NewCompiler(templateDir, outputDir)
}

func getEnvOrDefault(key, defaultVal string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return defaultVal
}

// CompileResume handles the resume compilation request
func CompileResume(c *gin.Context) {
	var request models.ResumeRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Success: false,
			Error:   "Invalid request format",
			Details: []string{err.Error()},
		})
		return
	}

	// Validate required fields
	if errs := validateRequest(&request); len(errs) > 0 {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Success: false,
			Error:   "Validation failed",
			Details: errs,
		})
		return
	}

	// Compile the resume
	pdfName, err := compiler.CompileResume(&request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Success: false,
			Error:   "LaTeX compilation failed",
			Details: []string{err.Error()},
		})
		return
	}

	// Read PDF and encode as base64
	outputDir := getEnvOrDefault("OUTPUT_DIR", "./output")
	pdfPath := filepath.Join(outputDir, pdfName)
	pdfContent, err := os.ReadFile(pdfPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Success: false,
			Error:   "Failed to read generated PDF",
			Details: []string{err.Error()},
		})
		return
	}

	pdfBase64 := base64.StdEncoding.EncodeToString(pdfContent)

	c.JSON(http.StatusOK, models.SuccessResponse{
		Success:   true,
		Message:   "Resume compiled successfully",
		PDFUrl:    "/api/download/" + pdfName,
		PDFBase64: pdfBase64,
	})
}

// DownloadPDF handles PDF file downloads
func DownloadPDF(c *gin.Context) {
	filename := c.Param("filename")

	// Sanitize filename to prevent path traversal
	filename = filepath.Base(filename)

	outputDir := getEnvOrDefault("OUTPUT_DIR", "./output")
	pdfPath := filepath.Join(outputDir, filename)

	// Check if file exists
	if _, err := os.Stat(pdfPath); os.IsNotExist(err) {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "PDF not found",
		})
		return
	}

	// Serve the file
	c.Header("Content-Type", "application/pdf")
	c.Header("Content-Disposition", "attachment; filename="+filename)
	c.File(pdfPath)
}

func validateRequest(req *models.ResumeRequest) []string {
	var errors []string

	if req.BasicDetails.FirstName == "" {
		errors = append(errors, "First name is required")
	}
	if req.BasicDetails.LastName == "" {
		errors = append(errors, "Last name is required")
	}
	if req.BasicDetails.Email == "" {
		errors = append(errors, "Email is required")
	}
	if req.BasicDetails.City == "" {
		errors = append(errors, "City is required")
	}
	if req.BasicDetails.Province == "" {
		errors = append(errors, "Province is required")
	}

	return errors
}
