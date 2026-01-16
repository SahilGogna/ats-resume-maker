package models

// ResumeRequest represents the incoming resume data
type ResumeRequest struct {
	BasicDetails BasicDetails `json:"basicDetails"`
	Sections     []Section    `json:"sections"`
}

// BasicDetails contains personal information
type BasicDetails struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	City      string `json:"city"`
	Province  string `json:"province"`
	GitHub    string `json:"github,omitempty"`
	LinkedIn  string `json:"linkedin,omitempty"`
	Portfolio string `json:"portfolio,omitempty"`
}

// Section represents a resume section (profile, experience, etc.)
type Section struct {
	Type    string      `json:"type"`
	Content interface{} `json:"content"`
}

// ProfileSummaryContent represents profile summary section data
type ProfileSummaryContent struct {
	Format  string   `json:"format"` // "paragraph" or "bullets"
	Text    string   `json:"text,omitempty"`
	Bullets []string `json:"bullets,omitempty"`
}

// TechSkillsContent represents technical skills section data
type TechSkillsContent struct {
	Categories []SkillCategory `json:"categories"`
}

// SkillCategory represents a category of skills
type SkillCategory struct {
	Name   string `json:"name"`
	Skills string `json:"skills"`
}

// ExperienceContent represents experience section data
type ExperienceContent struct {
	Entries []ExperienceEntry `json:"entries"`
}

// ExperienceEntry represents a single work experience
type ExperienceEntry struct {
	Company   string   `json:"company"`
	Title     string   `json:"title"`
	Location  string   `json:"location"`
	StartDate string   `json:"startDate"`
	EndDate   string   `json:"endDate"`
	Bullets   []string `json:"bullets"`
}

// ProjectsContent represents projects section data
type ProjectsContent struct {
	Entries []ProjectEntry `json:"entries"`
}

// ProjectEntry represents a single project
type ProjectEntry struct {
	Name         string   `json:"name"`
	Description  []string `json:"description"`
	Technologies string   `json:"technologies,omitempty"`
	Link         string   `json:"link,omitempty"`
	Date         string   `json:"date,omitempty"`
}

// VolunteerContent represents volunteer section data
type VolunteerContent struct {
	Entries []VolunteerEntry `json:"entries"`
}

// VolunteerEntry represents a single volunteer role
type VolunteerEntry struct {
	Organization string   `json:"organization"`
	Title        string   `json:"title"`
	Location     string   `json:"location,omitempty"`
	StartDate    string   `json:"startDate"`
	EndDate      string   `json:"endDate"`
	Bullets      []string `json:"bullets"`
}

// EducationContent represents education section data
type EducationContent struct {
	Entries []EducationEntry `json:"entries"`
}

// EducationEntry represents a single education entry
type EducationEntry struct {
	Institution string `json:"institution"`
	Degree      string `json:"degree"`
	StartDate   string `json:"startDate"`
	EndDate     string `json:"endDate"`
}

// SuccessResponse represents a successful API response
type SuccessResponse struct {
	Success   bool   `json:"success"`
	Message   string `json:"message"`
	PDFUrl    string `json:"pdfUrl"`
	PDFBase64 string `json:"pdfBase64,omitempty"`
}

// ErrorResponse represents an error API response
type ErrorResponse struct {
	Success bool     `json:"success"`
	Error   string   `json:"error"`
	Details []string `json:"details,omitempty"`
}
