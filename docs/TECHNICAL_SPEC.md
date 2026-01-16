# ATS Resume Builder - Technical Specification

## Version 1.0

---

## 1. Technology Stack Overview

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND                             │
│  React 18 + TypeScript + Tailwind CSS                   │
│  react-hook-form + @dnd-kit + react-pdf                 │
└─────────────────────────────────────────────────────────┘
                          │
                          │ REST API (JSON)
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    BACKEND                              │
│  Go 1.21+ with Gin Web Framework                        │
│  pdflatex (TeX Live) for PDF generation                 │
└─────────────────────────────────────────────────────────┘
                          │
                          │ Docker
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  DEPLOYMENT                             │
│  Docker Compose (Frontend + Backend + TeX Live)         │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Frontend Stack

### 2.1 Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.x | UI component library |
| **TypeScript** | 5.x | Type safety and better DX |
| **Vite** | 5.x | Fast build tool and dev server |

### 2.2 Styling
| Technology | Purpose |
|------------|---------|
| **Tailwind CSS** | Utility-first CSS framework for rapid UI development |

### 2.3 Key Libraries
| Library | Purpose |
|---------|---------|
| **react-hook-form** | Performant form management with validation |
| **@dnd-kit/core** | Modern drag-and-drop for section reordering |
| **@dnd-kit/sortable** | Sortable preset for dnd-kit |
| **react-pdf** | PDF rendering in browser |
| **zod** | Schema validation for form data |

### 2.4 Why This Stack?
- **React + TypeScript**: Industry standard, excellent tooling, type safety prevents bugs
- **Tailwind CSS**: Rapid prototyping, consistent design system, small bundle size
- **react-hook-form**: Minimal re-renders, built-in validation, scales well
- **@dnd-kit**: Lightweight, accessible, great touch support vs. alternatives like react-beautiful-dnd

---

## 3. Backend Stack

### 3.1 Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| **Go** | 1.21+ | High-performance, compiled language |
| **Gin** | 1.9.x | Fast HTTP web framework |

### 3.2 LaTeX Integration
| Technology | Purpose |
|------------|---------|
| **TeX Live** | Full LaTeX distribution |
| **pdflatex** | PDF compiler via `exec.Command` |

### 3.3 Why Go + Gin?
- **Performance**: Compiled binary, efficient concurrency via goroutines
- **Simplicity**: Easy `exec.Command` for system calls to pdflatex
- **Memory Safety**: Garbage collected, no null pointer exceptions
- **Deployment**: Single binary, easy Docker containerization
- **Gin**: Minimal overhead, fast routing, good middleware support

### 3.4 Alternative Considered
| Option | Reason Not Chosen |
|--------|------------------|
| Node.js | Less performant for CPU-bound tasks, heavier container |
| Python | Slower execution, GIL limitations for concurrency |
| Rust | Higher complexity, overkill for this use case |

---

## 4. API Design

### 4.1 Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/compile-resume` | Submit resume data, receive PDF |
| `GET` | `/api/download/:filename` | Download compiled PDF |
| `GET` | `/api/health` | Health check endpoint |

### 4.2 Request/Response Flow
```
Frontend                    Backend                    pdflatex
   │                           │                          │
   │──POST /api/compile───────▶│                          │
   │   (JSON payload)          │                          │
   │                           │──Validate JSON──────────▶│
   │                           │                          │
   │                           │──Populate .tex template─▶│
   │                           │                          │
   │                           │──exec pdflatex──────────▶│
   │                           │                          │
   │                           │◀──Return .pdf file───────│
   │                           │                          │
   │◀──200 OK (PDF URL/Base64)─│                          │
   │                           │                          │
```

---

## 5. Docker Architecture

### 5.1 Container Strategy
```yaml
services:
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    
  backend:
    build: ./backend
    ports: ["8080:8080"]
    volumes:
      - ./templates:/app/templates
    depends_on:
      - texlive
      
  # TeX Live included in backend container for simplicity
```

### 5.2 Backend Dockerfile Strategy
```dockerfile
# Multi-stage build
FROM golang:1.21-alpine AS builder
# Build Go binary

FROM ubuntu:22.04 AS runtime
# Install texlive-full for pdflatex
# Copy Go binary
# Run application
```

---

## 6. LaTeX Processing

### 6.1 Template Handling
- Load base template (`resume_faangpath.tex`)
- Use Go `text/template` for dynamic content injection
- Escape LaTeX special characters: `& % $ # _ { } ~ ^ \`

### 6.2 Compilation Process
```go
cmd := exec.Command("pdflatex", 
    "-interaction=nonstopmode",
    "-output-directory=/tmp/output",
    "/tmp/resume.tex")
```

### 6.3 Cleanup Strategy
- Generate unique temp directory per request
- Compile PDF
- Return PDF to client
- Delete temp files via `defer` or background goroutine

---

## 7. Security Considerations

| Risk | Mitigation |
|------|------------|
| LaTeX injection | Escape all special characters before template population |
| Path traversal | Validate and sanitize filenames |
| DoS via compilation | Timeout on pdflatex execution (30s max) |
| Temp file accumulation | Background cleanup job + request-scoped cleanup |

---

## 8. Project Structure

```
ats-resume-maker/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── utils/
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── cmd/
│   │   └── server/
│   ├── internal/
│   │   ├── handlers/
│   │   ├── latex/
│   │   └── models/
│   ├── templates/
│   │   ├── resume.cls
│   │   └── resume_faangpath.tex
│   ├── go.mod
│   └── Dockerfile
├── docker-compose.yml
└── docs/
    ├── REQUIREMENTS.md
    ├── TECHNICAL_SPEC.md
    └── ARCHITECTURE.md
```
