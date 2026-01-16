package latex

import (
	"bytes"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"text/template"

	"github.com/sahil/ats-resume-maker/backend/internal/models"
)

// Compiler handles LaTeX compilation to PDF
type Compiler struct {
	TemplateDir string
	OutputDir   string
}

// NewCompiler creates a new LaTeX compiler
func NewCompiler(templateDir, outputDir string) *Compiler {
	return &Compiler{
		TemplateDir: templateDir,
		OutputDir:   outputDir,
	}
}

// CompileResume generates a PDF from resume data
func (c *Compiler) CompileResume(req *models.ResumeRequest) (string, error) {
	// Create unique temp directory for this compilation
	tempDir, err := os.MkdirTemp("", "resume-*")
	if err != nil {
		return "", fmt.Errorf("failed to create temp directory: %w", err)
	}

	// Copy the .cls file to temp directory
	clsContent, err := os.ReadFile(filepath.Join(c.TemplateDir, "resume.cls"))
	if err != nil {
		return "", fmt.Errorf("failed to read resume.cls: %w", err)
	}
	if err := os.WriteFile(filepath.Join(tempDir, "resume.cls"), clsContent, 0644); err != nil {
		return "", fmt.Errorf("failed to write resume.cls: %w", err)
	}

	// Generate LaTeX content from template
	latexContent, err := c.generateLatex(req)
	if err != nil {
		os.RemoveAll(tempDir)
		return "", fmt.Errorf("failed to generate LaTeX: %w", err)
	}

	// Write .tex file
	texPath := filepath.Join(tempDir, "resume.tex")
	if err := os.WriteFile(texPath, []byte(latexContent), 0644); err != nil {
		os.RemoveAll(tempDir)
		return "", fmt.Errorf("failed to write .tex file: %w", err)
	}

	// Run pdflatex
	cmd := exec.Command("pdflatex",
		"-interaction=nonstopmode",
		"-output-directory="+tempDir,
		texPath,
	)

	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	if err := cmd.Run(); err != nil {
		os.RemoveAll(tempDir)
		return "", fmt.Errorf("pdflatex failed: %v\nstdout: %s\nstderr: %s", err, stdout.String(), stderr.String())
	}

	// Move PDF to output directory
	pdfName := fmt.Sprintf("%s_%s_Resume.pdf",
		sanitizeFilename(req.BasicDetails.FirstName),
		sanitizeFilename(req.BasicDetails.LastName))

	srcPdf := filepath.Join(tempDir, "resume.pdf")
	dstPdf := filepath.Join(c.OutputDir, pdfName)

	// Ensure output directory exists
	if err := os.MkdirAll(c.OutputDir, 0755); err != nil {
		os.RemoveAll(tempDir)
		return "", fmt.Errorf("failed to create output directory: %w", err)
	}

	pdfContent, err := os.ReadFile(srcPdf)
	if err != nil {
		os.RemoveAll(tempDir)
		return "", fmt.Errorf("failed to read generated PDF: %w", err)
	}

	if err := os.WriteFile(dstPdf, pdfContent, 0644); err != nil {
		os.RemoveAll(tempDir)
		return "", fmt.Errorf("failed to write PDF to output: %w", err)
	}

	// Cleanup temp directory
	os.RemoveAll(tempDir)

	return pdfName, nil
}

func (c *Compiler) generateLatex(req *models.ResumeRequest) (string, error) {
	tmpl := `\documentclass{resume}

\usepackage[left=0.4in,top=0.4in,right=0.4in,bottom=0.4in]{geometry}
\newcommand{\tab}[1]{\hspace{.2667\textwidth}\rlap{#1}}
\newcommand{\itab}[1]{\hspace{0em}\rlap{#1}}

\name{ {{.Name}} }
\address{ {{.Phone}} \\ {{.Location}} }
\address{ {{.ContactLine}} }

\begin{document}

{{.Sections}}

\end{document}
`

	// Build template data
	data := map[string]string{
		"Name":        EscapeString(req.BasicDetails.FirstName + " " + req.BasicDetails.LastName),
		"Phone":       "", // Phone not in current model, can be added
		"Location":    EscapeString(req.BasicDetails.City + ", " + req.BasicDetails.Province),
		"ContactLine": c.buildContactLine(req.BasicDetails),
		"Sections":    c.buildSections(req.Sections),
	}

	t, err := template.New("resume").Parse(tmpl)
	if err != nil {
		return "", err
	}

	var buf bytes.Buffer
	if err := t.Execute(&buf, data); err != nil {
		return "", err
	}

	return buf.String(), nil
}

func (c *Compiler) buildContactLine(bd models.BasicDetails) string {
	var parts []string

	if bd.Email != "" {
		parts = append(parts, fmt.Sprintf("\\href{mailto:%s}{%s}", bd.Email, EscapeString(bd.Email)))
	}
	if bd.LinkedIn != "" {
		// Extract display name from URL
		display := strings.TrimPrefix(bd.LinkedIn, "https://")
		display = strings.TrimPrefix(display, "http://")
		parts = append(parts, fmt.Sprintf("\\href{%s}{%s}", bd.LinkedIn, EscapeString(display)))
	}
	if bd.GitHub != "" {
		display := strings.TrimPrefix(bd.GitHub, "https://")
		display = strings.TrimPrefix(display, "http://")
		parts = append(parts, fmt.Sprintf("\\href{%s}{%s}", bd.GitHub, EscapeString(display)))
	}
	if bd.Portfolio != "" {
		display := strings.TrimPrefix(bd.Portfolio, "https://")
		display = strings.TrimPrefix(display, "http://")
		parts = append(parts, fmt.Sprintf("\\href{%s}{%s}", bd.Portfolio, EscapeString(display)))
	}

	return strings.Join(parts, " \\\\ ")
}

func (c *Compiler) buildSections(sections []models.Section) string {
	var sb strings.Builder

	for _, section := range sections {
		switch section.Type {
		case "profile_summary":
			sb.WriteString(c.buildProfileSummary(section.Content))
		case "tech_skills":
			sb.WriteString(c.buildTechSkills(section.Content))
		case "experience":
			sb.WriteString(c.buildExperience(section.Content))
		case "projects":
			sb.WriteString(c.buildProjects(section.Content))
		case "volunteer":
			sb.WriteString(c.buildVolunteer(section.Content))
		case "education":
			sb.WriteString(c.buildEducation(section.Content))
		}
	}

	return sb.String()
}

func (c *Compiler) buildProfileSummary(content interface{}) string {
	data, ok := content.(map[string]interface{})
	if !ok {
		return ""
	}

	var sb strings.Builder
	sb.WriteString("\\begin{rSection}{OBJECTIVE}\n\n")

	format, _ := data["format"].(string)
	if format == "paragraph" {
		text, _ := data["text"].(string)
		sb.WriteString("{" + EscapeString(text) + "}\n\n")
	} else {
		bullets, _ := data["bullets"].([]interface{})
		sb.WriteString("\\begin{itemize}\n")
		sb.WriteString("    \\itemsep -3pt {}\n")
		for _, b := range bullets {
			if s, ok := b.(string); ok {
				sb.WriteString("     \\item " + EscapeString(s) + "\n")
			}
		}
		sb.WriteString("\\end{itemize}\n")
	}

	sb.WriteString("\\end{rSection}\n\n")
	return sb.String()
}

func (c *Compiler) buildTechSkills(content interface{}) string {
	data, ok := content.(map[string]interface{})
	if !ok {
		return ""
	}

	categories, _ := data["categories"].([]interface{})
	if len(categories) == 0 {
		return ""
	}

	var sb strings.Builder
	sb.WriteString("\\begin{rSection}{SKILLS}\n\n")
	sb.WriteString("\\begin{tabular}{ @{} >{\\bfseries}l @{\\hspace{6ex}} l }\n")

	for _, cat := range categories {
		if c, ok := cat.(map[string]interface{}); ok {
			name, _ := c["name"].(string)
			skills, _ := c["skills"].(string)
			sb.WriteString(EscapeString(name) + " & " + EscapeString(skills) + "\\\\\n")
		}
	}

	sb.WriteString("\\end{tabular}\\\\\n")
	sb.WriteString("\\end{rSection}\n\n")
	return sb.String()
}

func (c *Compiler) buildExperience(content interface{}) string {
	data, ok := content.(map[string]interface{})
	if !ok {
		return ""
	}

	entries, _ := data["entries"].([]interface{})
	if len(entries) == 0 {
		return ""
	}

	var sb strings.Builder
	sb.WriteString("\\begin{rSection}{EXPERIENCE}\n\n")

	for _, entry := range entries {
		if e, ok := entry.(map[string]interface{}); ok {
			company, _ := e["company"].(string)
			title, _ := e["title"].(string)
			location, _ := e["location"].(string)
			startDate, _ := e["startDate"].(string)
			endDate, _ := e["endDate"].(string)
			bullets, _ := e["bullets"].([]interface{})

			sb.WriteString(fmt.Sprintf("\\textbf{%s} \\hfill %s - %s\\\\\n",
				EscapeString(title), EscapeString(startDate), EscapeString(endDate)))
			sb.WriteString(fmt.Sprintf("%s \\hfill \\textit{%s}\n",
				EscapeString(company), EscapeString(location)))

			if len(bullets) > 0 {
				sb.WriteString(" \\begin{itemize}\n")
				sb.WriteString("    \\itemsep -3pt {}\n")
				for _, b := range bullets {
					if s, ok := b.(string); ok {
						sb.WriteString("     \\item " + EscapeString(s) + "\n")
					}
				}
				sb.WriteString(" \\end{itemize}\n")
			}
			sb.WriteString("\n")
		}
	}

	sb.WriteString("\\end{rSection}\n\n")
	return sb.String()
}

func (c *Compiler) buildProjects(content interface{}) string {
	data, ok := content.(map[string]interface{})
	if !ok {
		return ""
	}

	entries, _ := data["entries"].([]interface{})
	if len(entries) == 0 {
		return ""
	}

	var sb strings.Builder
	sb.WriteString("\\begin{rSection}{PROJECTS}\n\n")

	for _, entry := range entries {
		if e, ok := entry.(map[string]interface{}); ok {
			name, _ := e["name"].(string)
			date, _ := e["date"].(string)
			desc, _ := e["description"].([]interface{})
			link, _ := e["link"].(string)

			// Project header line with name and date
			projectHeader := fmt.Sprintf("\\textbf{%s}", EscapeString(name))
			if link != "" {
				projectHeader += fmt.Sprintf(" \\href{%s}{(Link)}", link)
			}
			if date != "" {
				projectHeader += fmt.Sprintf(" \\hfill %s", EscapeString(date))
			}
			sb.WriteString(projectHeader + "\n")

			// Build bullet points like experience
			if len(desc) > 0 {
				sb.WriteString("\\vspace{-0.5em}\n")
				sb.WriteString(" \\begin{itemize}\n")
				sb.WriteString("    \\itemsep -3pt {}\n")
				for _, d := range desc {
					if s, ok := d.(string); ok {
						sb.WriteString("     \\item " + EscapeString(s) + "\n")
					}
				}
				sb.WriteString(" \\end{itemize}\n")
			}
			sb.WriteString("\n")
		}
	}

	sb.WriteString("\\end{rSection}\n\n")
	return sb.String()
}

func (c *Compiler) buildVolunteer(content interface{}) string {
	data, ok := content.(map[string]interface{})
	if !ok {
		return ""
	}

	entries, _ := data["entries"].([]interface{})
	if len(entries) == 0 {
		return ""
	}

	var sb strings.Builder
	sb.WriteString("\\begin{rSection}{VOLUNTEER EXPERIENCE}\n\n")

	for _, entry := range entries {
		if e, ok := entry.(map[string]interface{}); ok {
			org, _ := e["organization"].(string)
			title, _ := e["title"].(string)
			location, _ := e["location"].(string)
			startDate, _ := e["startDate"].(string)
			endDate, _ := e["endDate"].(string)
			bullets, _ := e["bullets"].([]interface{})

			sb.WriteString(fmt.Sprintf("\\textbf{%s} \\hfill %s - %s\\\\\n",
				EscapeString(title), EscapeString(startDate), EscapeString(endDate)))
			sb.WriteString(fmt.Sprintf("%s \\hfill \\textit{%s}\n",
				EscapeString(org), EscapeString(location)))

			if len(bullets) > 0 {
				sb.WriteString(" \\begin{itemize}\n")
				sb.WriteString("    \\itemsep -3pt {}\n")
				for _, b := range bullets {
					if s, ok := b.(string); ok {
						sb.WriteString("     \\item " + EscapeString(s) + "\n")
					}
				}
				sb.WriteString(" \\end{itemize}\n")
			}
			sb.WriteString("\n")
		}
	}

	sb.WriteString("\\end{rSection}\n\n")
	return sb.String()
}

func (c *Compiler) buildEducation(content interface{}) string {
	data, ok := content.(map[string]interface{})
	if !ok {
		return ""
	}

	entries, _ := data["entries"].([]interface{})
	if len(entries) == 0 {
		return ""
	}

	var sb strings.Builder
	sb.WriteString("\\begin{rSection}{Education}\n\n")

	for _, entry := range entries {
		if e, ok := entry.(map[string]interface{}); ok {
			institution, _ := e["institution"].(string)
			degree, _ := e["degree"].(string)
			startDate, _ := e["startDate"].(string)
			endDate, _ := e["endDate"].(string)

			dateStr := endDate
			if startDate != "" && endDate != "" {
				dateStr = startDate + " - " + endDate
			}

			sb.WriteString(fmt.Sprintf("{\\bf %s}, %s \\hfill {%s}\\\\\n",
				EscapeString(degree), EscapeString(institution), EscapeString(dateStr)))
		}
	}

	sb.WriteString("\n\\end{rSection}\n\n")
	return sb.String()
}

func sanitizeFilename(s string) string {
	// Remove any characters that could be problematic in filenames
	result := strings.ReplaceAll(s, " ", "_")
	result = strings.ReplaceAll(result, "/", "_")
	result = strings.ReplaceAll(result, "\\", "_")
	return result
}
