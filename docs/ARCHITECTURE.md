# ATS Resume Builder - Architecture Document

## System Architecture Diagram

```mermaid
flowchart TB
    subgraph Client["🖥️ Client Browser"]
        UI["React Frontend<br/>TypeScript + Tailwind"]
        Preview["PDF Preview Panel<br/>react-pdf"]
    end

    subgraph Frontend["📦 Frontend Container"]
        Vite["Vite Dev Server<br/>Port 3000"]
    end

    subgraph Backend["📦 Backend Container"]
        direction TB
        Gin["Gin HTTP Server<br/>Port 8080"]
        Validator["JSON Validator"]
        TemplateEngine["Go Template Engine"]
        LaTeXProcessor["LaTeX Processor"]
        PDFLatex["pdflatex<br/>(TeX Live)"]
        FileManager["Temp File Manager"]
    end

    UI -->|"HTTP Request<br/>(JSON Payload)"| Vite
    Vite -->|"Proxy /api/*"| Gin
    Gin --> Validator
    Validator -->|"Valid Data"| TemplateEngine
    TemplateEngine -->|"Populated .tex"| LaTeXProcessor
    LaTeXProcessor -->|"exec.Command"| PDFLatex
    PDFLatex -->|".pdf File"| FileManager
    FileManager -->|"PDF Response"| Gin
    Gin -->|"PDF (Base64/URL)"| UI
    UI --> Preview
```

---

## Data Flow Architecture

```mermaid
sequenceDiagram
    participant User
    participant React as React Frontend
    participant Gin as Go Backend (Gin)
    participant Template as Template Engine
    participant LaTeX as pdflatex
    participant FS as File System

    User->>React: Fill resume form
    User->>React: Click "Compile Resume"
    React->>React: Validate form (react-hook-form + zod)
    React->>Gin: POST /api/compile-resume (JSON)
    
    Gin->>Gin: Validate JSON structure
    Gin->>Template: Pass resume data
    Template->>Template: Escape LaTeX special chars
    Template->>FS: Write populated .tex file
    
    Gin->>LaTeX: exec.Command("pdflatex", ...)
    LaTeX->>FS: Generate .pdf file
    FS->>Gin: Read PDF file
    
    alt Success
        Gin->>React: 200 OK (PDF URL or Base64)
        React->>User: Display PDF in preview
        User->>React: Click "Download"
        React->>Gin: GET /api/download/:filename
        Gin->>User: PDF file download
    else Compilation Error
        Gin->>React: 500 Error (details)
        React->>User: Display error message
    end
    
    Gin->>FS: Cleanup temp files
```

---

## Component Architecture

```mermaid
flowchart LR
    subgraph Frontend Components
        App["App.tsx"]
        Layout["SplitLayout"]
        
        subgraph FormPanel["Form Panel (Left)"]
            BasicDetails["BasicDetails<br/>(Fixed)"]
            DragContext["DndContext"]
            
            subgraph DraggableSections["Sortable Sections"]
                Summary["ProfileSummary"]
                Skills["TechSkills"]
                Experience["Experience"]
                Projects["Projects"]
                Volunteer["Volunteer"]
                Education["Education"]
            end
            
            CompileBtn["CompileButton"]
        end
        
        subgraph PreviewPanel["Preview Panel (Right)"]
            PDFViewer["PDFViewer<br/>(react-pdf)"]
            DownloadBtn["DownloadButton"]
        end
    end

    App --> Layout
    Layout --> FormPanel
    Layout --> PreviewPanel
    FormPanel --> BasicDetails
    FormPanel --> DragContext
    DragContext --> DraggableSections
    FormPanel --> CompileBtn
    PreviewPanel --> PDFViewer
    PreviewPanel --> DownloadBtn
```

---

## Backend Module Architecture

```mermaid
flowchart TB
    subgraph cmd["cmd/server"]
        Main["main.go<br/>Entry point"]
    end

    subgraph internal["internal/"]
        subgraph handlers["handlers/"]
            ResumeHandler["resume.go<br/>API handlers"]
            HealthHandler["health.go"]
        end

        subgraph latex["latex/"]
            Compiler["compiler.go<br/>pdflatex wrapper"]
            Escaper["escaper.go<br/>Special char handling"]
            TemplateLoader["template.go<br/>Load & populate"]
        end

        subgraph models["models/"]
            ResumeModel["resume.go<br/>Data structures"]
            ValidationModel["validation.go"]
        end

        subgraph middleware["middleware/"]
            CORS["cors.go"]
            Logger["logger.go"]
        end
    end

    subgraph templates["templates/"]
        ResumeClass["resume.cls"]
        ResumeTex["resume_faangpath.tex"]
    end

    Main --> handlers
    handlers --> latex
    handlers --> models
    latex --> templates
    Main --> middleware
```

---

## Deployment Architecture

```mermaid
flowchart TB
    subgraph DockerCompose["Docker Compose"]
        subgraph FrontendContainer["frontend:3000"]
            NodeServer["Node.js<br/>Vite Dev/Build"]
        end

        subgraph BackendContainer["backend:8080"]
            GoApp["Go Binary"]
            TexLive["TeX Live<br/>pdflatex"]
            Templates["LaTeX Templates"]
        end
    end

    subgraph Volumes["Volumes"]
        TemplateVol["./templates"]
        OutputVol["./output (optional)"]
    end

    User["👤 User Browser"] -->|":3000"| NodeServer
    NodeServer -->|"Proxy /api"| GoApp
    GoApp --> TexLive
    TemplateVol -.->|"mount"| Templates
```

---

## API Architecture

```mermaid
flowchart LR
    subgraph Endpoints["API Endpoints"]
        Compile["POST /api/compile-resume"]
        Download["GET /api/download/:filename"]
        Health["GET /api/health"]
    end

    subgraph Request["Request Payload"]
        BasicDetails["basicDetails{}"]
        Sections["sections[]"]
    end

    subgraph Response["Response"]
        Success["✅ 200: pdfUrl, pdfBase64"]
        BadReq["❌ 400: validation errors"]
        Error["❌ 500: compilation error"]
    end

    Compile --> Request
    Request --> Success
    Request --> BadReq
    Request --> Error
```

---

## File Structure

```
ats-resume-maker/
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── 📁 sections/
│   │   │   │   ├── BasicDetails.tsx
│   │   │   │   ├── ProfileSummary.tsx
│   │   │   │   ├── TechSkills.tsx
│   │   │   │   ├── Experience.tsx
│   │   │   │   ├── Projects.tsx
│   │   │   │   ├── Volunteer.tsx
│   │   │   │   └── Education.tsx
│   │   │   ├── 📁 layout/
│   │   │   │   ├── SplitLayout.tsx
│   │   │   │   └── DraggableSection.tsx
│   │   │   └── 📁 preview/
│   │   │       └── PDFPreview.tsx
│   │   ├── 📁 hooks/
│   │   │   ├── useResumeForm.ts
│   │   │   └── usePdfCompile.ts
│   │   ├── 📁 types/
│   │   │   └── resume.ts
│   │   ├── 📁 utils/
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── 📁 backend/
│   ├── 📁 cmd/
│   │   └── 📁 server/
│   │       └── main.go
│   ├── 📁 internal/
│   │   ├── 📁 handlers/
│   │   │   ├── resume.go
│   │   │   └── health.go
│   │   ├── 📁 latex/
│   │   │   ├── compiler.go
│   │   │   ├── escaper.go
│   │   │   └── template.go
│   │   ├── 📁 models/
│   │   │   ├── resume.go
│   │   │   └── response.go
│   │   └── 📁 middleware/
│   │       └── cors.go
│   ├── 📁 templates/
│   │   ├── resume.cls
│   │   └── resume_faangpath.tex
│   ├── go.mod
│   ├── go.sum
│   └── Dockerfile
│
├── 📁 docs/
│   ├── REQUIREMENTS.md
│   ├── TECHNICAL_SPEC.md
│   └── ARCHITECTURE.md
│
├── docker-compose.yml
└── README.md
```
