# ATS-Friendly Resume Builder - Requirements Document

## Version 1.0

---

## 1. Overview

The ATS-Friendly Resume Builder is a web application that enables users to create professional, ATS-compliant resumes through an intuitive form interface. The application generates high-quality PDF resumes using LaTeX templates, ensuring clean formatting optimized for Applicant Tracking Systems.

---

## 2. Core Features (V1 Scope)

### 2.1 Split-Screen Interface
| Feature | Description |
|---------|-------------|
| Left Panel (60%) | Form input with all resume sections |
| Right Panel (40%) | Live PDF preview after compilation |
| Responsive | Desktop and tablet support |

### 2.2 Resume Sections

#### Fixed Section (Non-draggable)
- **Basic Details**: First Name, Last Name, Email, City, Province, GitHub, LinkedIn, Portfolio

#### Draggable Sections
| Section | Key Fields |
|---------|------------|
| Profile Summary | Paragraph or bullet points format |
| Tech Skills | Categories with comma-separated skills |
| Experience | Company, Title, Location, Dates, Achievements |
| Projects | Name, Description, Technologies, Link, Date |
| Volunteer Roles | Organization, Title, Location, Dates, Description |
| Education | Institution, Degree, Start/End Dates |

### 2.3 Core Functionality
- **Drag-and-Drop**: Reorder all sections except Basic Details
- **Dynamic Entries**: Add/remove multiple entries within each section
- **Form Validation**: Required fields, email/URL format validation
- **PDF Compilation**: Generate ATS-friendly PDF via LaTeX
- **PDF Preview**: In-browser preview after compilation
- **Download**: Immediate PDF download as `FirstName_LastName_Resume.pdf`

---

## 3. User Flow

```
1. User fills resume form (left panel)
2. User reorders sections via drag-and-drop
3. User clicks "Compile Resume"
4. System validates input
5. Backend generates PDF via LaTeX
6. PDF displays in preview panel (right)
7. User downloads PDF
```

---

## 4. Technical Constraints

| Constraint | Requirement |
|------------|-------------|
| PDF Generation Time | < 10 seconds |
| Concurrent Requests | Support ≥ 10 simultaneous compilations |
| Security | Input sanitization, LaTeX character escaping |
| No Authentication | Anonymous usage, no user accounts |

---

## 5. Out of Scope (V1)

- User accounts and saved resumes
- Multiple template themes
- Resume import (LinkedIn, existing PDF)
- Cover letter generation
- Mobile-optimized editing experience
- Resume versioning/history
