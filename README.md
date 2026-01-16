# ATS Resume Builder

A web-based application that generates professional, ATS-compliant resumes using React, Go, and LaTeX.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Go 1.21+
- Docker (optional, for containerized setup)

### Development Setup

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Backend:**
```bash
cd backend
go mod tidy
go run ./cmd/server
```

### Docker Setup
```bash
docker-compose up --build
```

## 📁 Project Structure

```
ats-resume-maker/
├── frontend/         # React + TypeScript + Tailwind
├── backend/          # Go + Gin + LaTeX
├── docs/             # Documentation
└── docker-compose.yml
```

## 📖 Documentation

- [Requirements](docs/REQUIREMENTS.md)
- [Technical Spec](docs/TECHNICAL_SPEC.md)
- [Architecture](docs/ARCHITECTURE.md)

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | Go 1.21, Gin, pdflatex |
| Deployment | Docker |

## 📝 License

MIT
