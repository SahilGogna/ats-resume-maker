package main

import (
	"log"
	"net/http"
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

	log.Println("🚀 Starting ATS Resume Builder API on :8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
