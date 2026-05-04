# UCook Agent Configuration

## Purpose

This file defines engineering standards, architecture, and project structure for UCook.

All generated code must prioritise:
- Maintainability
- Scalability
- Readability
- Separation of concerns

The system must be designed to support increasing complexity over time.

---

## High-Level Architecture

The project is split into two main applications:

- `/frontend` → React application (UI)
- `/backend` → ASP.NET Core Web API

These must remain fully decoupled and communicate only via HTTP APIs.

---

## Project Structure

### Root
```
/ucook
  /frontend
  /backend
  AGENT.md
  README.md
```

### Frontend Structure (React)
```
/frontend
  /src
    /components     # Reusable UI components (Button, Input, Modal, Badge)
    /features       # Feature-based modules
      /auth
      /pantry
      /recipes
    /hooks          # Custom React hooks
    /services       # API interaction layer
    /pages          # Route-level components
    /layouts        # Layout components (e.g. DashboardLayout)
    /stores         # Zustand state stores
    /types          # Type definitions
    /utils          # Helper functions
  /public
```

**Rules:**
- Use feature-based organisation where possible
- Keep components small and reusable
- Do not mix API logic inside UI components
- All API calls must go through `/services`

### Backend Structure (ASP.NET Core)
```
/backend
  /Controllers      # HTTP endpoints only — no business logic
  /Services         # Business logic
  /Interfaces       # Service and repository interfaces
  /Repositories     # Data access layer
  /Models
    /Domain         # Core business models
    /DTOs           # Data transfer objects
    /Entities       # Database entities
  /Data             # DbContext and configuration
  /Middleware       # Custom middleware
  /Utils            # Utility classes
```

**Rules:**
- Controllers must not contain business logic
- Services must contain all core logic
- Repositories handle database access only
- Use interfaces for all services and repositories

---

## Backend Standards

- Use dependency injection throughout
- Use async/await for all I/O operations
- Validate all incoming requests
- Return consistent API responses
- Never expose database entities directly

### API Design
- Follow REST conventions
- Use clear and consistent naming: `/api/recipes`, `/api/pantry`, `/api/auth`
- Use appropriate HTTP methods: GET, POST, PUT, DELETE

---

## Frontend Standards

- Use functional components only
- Use hooks for state and logic
- Extract reusable logic into custom hooks
- Keep UI and logic separate
- All API calls must go through `/services` — never call APIs directly inside components

---

## Design System

> These rules are strict. Do not deviate from them.

### Theme
- Dark mode only
- No pure black (`#000000`)

### Colours

| Role | Hex |
|---|---|
| Background | `#0B0F0E` |
| Surface | `#111716` |
| Elevated | `#151C1A` |
| Border | `#1F2A28` |
| Primary Green | `#22C55E` |
| Primary Green Hover | `#16A34A` |
| Green Subtle | `#052E1F` |
| Secondary Orange | `#F97316` |
| Orange Subtle | `#3B1D0E` |
| Text Primary | `#F8FAFC` |
| Text Secondary | `#94A3B8` |
| Text Muted | `#64748B` |
| Success | `#22C55E` |
| Warning | `#F97316` |
| Error | `#EF4444` |

Do not introduce new colours.

### UI/UX Rules
- Clean, minimal, modern UI
- Use spacing over borders where possible
- Rounded corners (`lg` or `xl`)
- Subtle hover animations (scale + glow)
- No cluttered layouts
- Prioritise readability

---

## State and Data Handling

- Keep state local where possible
- Lift state only when necessary
- Use clear data flow
- Handle loading and error states explicitly

---

## Code Quality Rules

- Use clear, descriptive naming
- Avoid duplication
- Prefer simple solutions over complex ones
- Keep functions small and focused
- Write modular and testable code

---

## Anti-Patterns to Avoid

- Business logic in controllers
- API calls inside UI components
- Deeply nested components
- Hardcoded values
- Mixing concerns in a single file

---

## Extensibility Guidelines

- Design features to be modular
- Avoid tight coupling between components
- Use interfaces and abstraction where appropriate
- Ensure new features can be added without major refactoring

---

## Goal

Every feature and UI element should feel **intentional**, **clean**, **modern**, and **consistent**.

The final product should be portfolio-quality and visually impressive.
