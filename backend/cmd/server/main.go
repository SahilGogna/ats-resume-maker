package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/sahil/ats-resume-maker/backend/internal/handlers"
)

func main() {
	r := gin.Default()

	// CORS configuration - Allow GitHub Pages and local development
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost:3000",
			"http://localhost:5173",
			"https://sahilgogna.github.io",
		},
		AllowMethods:  []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:  []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders: []string{"Content-Length", "Content-Type"},
		MaxAge:        12 * time.Hour,
	}))

	// Health check endpoint
	r.GET("/api/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "healthy",
			"message": "ATS Resume Builder API is running",
		})
	})

	// Resume compilation endpoint
	r.POST("/api/compile-resume", handlers.CompileResume)

	// PDF download endpoint
	r.GET("/api/download/:filename", handlers.DownloadPDF)

	// Get port from environment variable (Render sets this)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Starting ATS Resume Builder API on :%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
