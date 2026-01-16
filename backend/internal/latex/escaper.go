package latex

import (
	"strings"
)

// specialChars maps LaTeX special characters to their escaped versions
var specialChars = map[string]string{
	"\\": "\\textbackslash{}",
	"&":  "\\&",
	"%":  "\\%",
	"$":  "\\$",
	"#":  "\\#",
	"_":  "\\_",
	"{":  "\\{",
	"}":  "\\}",
	"~":  "\\textasciitilde{}",
	"^":  "\\textasciicircum{}",
}

// EscapeString escapes special LaTeX characters in a string
func EscapeString(s string) string {
	result := s

	// Handle backslash first (before other replacements add more backslashes)
	result = strings.ReplaceAll(result, "\\", "\\textbackslash{}")

	// Handle other special characters
	for char, escaped := range specialChars {
		if char != "\\" { // Skip backslash, already handled
			result = strings.ReplaceAll(result, char, escaped)
		}
	}

	return result
}

// EscapeStringSlice escapes all strings in a slice
func EscapeStringSlice(slice []string) []string {
	escaped := make([]string, len(slice))
	for i, s := range slice {
		escaped[i] = EscapeString(s)
	}
	return escaped
}

// FormatURL creates a clickable LaTeX hyperref link
func FormatURL(url, displayText string) string {
	if url == "" {
		return ""
	}
	escapedDisplay := EscapeString(displayText)
	return "\\href{" + url + "}{" + escapedDisplay + "}"
}

// FormatBulletList formats a slice of strings as LaTeX itemize bullets
func FormatBulletList(items []string) string {
	if len(items) == 0 {
		return ""
	}

	var sb strings.Builder
	sb.WriteString("\\begin{itemize}\n")
	sb.WriteString("    \\itemsep -3pt {}\n")
	for _, item := range items {
		sb.WriteString("     \\item " + EscapeString(item) + "\n")
	}
	sb.WriteString("\\end{itemize}\n")
	return sb.String()
}
