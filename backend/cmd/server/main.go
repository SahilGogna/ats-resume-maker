package main

import (
	"log"
	"net/http"
	"strings"
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
			"https://*.github.io", // GitHub Pages
		},
		AllowOriginFunc: func(origin string) bool {
			// Allow any GitHub Pages origin or localhost
			return origin == "http://localhost:3000" ||
				origin == "http://localhost:5173" ||
				strings.HasSuffix(origin, ".github.io")
		},
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
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
