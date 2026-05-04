# UCook — Smart Cookbook & Pantry Tracker

## Stack
- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS + Framer Motion
- **Backend**: .NET 8 Web API — Clean Architecture (Domain / Application / Infrastructure / API)
- **Database**: SQLite (dev) — swap connection string for Postgres/SQL Server in prod
- **Auth**: JWT (30-day tokens)

## Project Structure
```
UCook/
├── frontend/                   # React app
│   └── src/
│       ├── api/                # Axios API clients
│       ├── components/
│       │   ├── ui/             # Button, Input, Modal, Badge
│       │   ├── layout/         # Navbar, Layout (auth guard)
│       │   ├── pantry/         # PantryCard, QRScanner
│       │   └── recipes/        # RecipeCard
│       ├── pages/              # LandingPage, Login, Register, Dashboard, Pantry, Recipes, RecipeDetail
│       ├── stores/             # Zustand (auth + pantry)
│       ├── types/              # Shared TypeScript types
│       └── utils/              # cn(), mockData
└── backend/
    ├── UCook.Domain/           # Entities (User, PantryItem, Recipe, …)
    ├── UCook.Application/      # DTOs + service interfaces
    ├── UCook.Infrastructure/   # EF Core, JWT, service implementations
    └── UCook.API/              # ASP.NET controllers + Program.cs
```

## Getting Started

### Frontend
```bash
cd frontend
npm install
npm run dev          # http://localhost:3000
```

> **Demo mode**: The app works fully offline with mock data.
> Use `demo@ucook.app` / `demo123` on the login page.

### Backend
```bash
cd backend
dotnet restore

# Create initial EF migration (first time only)
dotnet ef migrations add InitialCreate --project UCook.Infrastructure --startup-project UCook.API

# Run
dotnet run --project UCook.API   # http://localhost:5000
# Swagger: http://localhost:5000/swagger
```

## Key Design Decisions

| Decision | Rationale |
|---|---|
| **Offline-first frontend** | App ships with full mock data so it's demonstrable without the backend running |
| **Zustand + persist** | Lightweight state with automatic localStorage persistence for auth token |
| **Clean Architecture** | Domain stays pure; Infrastructure owns EF & JWT; easy to swap DB or auth provider |
| **SQLite for dev** | Zero-config; change one connection string to move to Postgres |
| **Framer Motion** | Smooth layout animations on recipe/pantry grids without boilerplate |
| **QR/barcode simulation** | `html5-qrcode` for real camera scanning + manual entry fallback + demo code database |
