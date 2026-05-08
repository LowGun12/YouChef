# YouChef Agent Configuration

## Purpose

This file defines engineering standards, architecture, and project structure for YouChef.

All generated code must meet **production standard** — the same bar expected at a professional software company. This is not a prototype or learning project. Every decision should reflect how senior engineers build real products.

All generated code must prioritise:

- Production quality — no shortcuts, no placeholders, no "good enough for now"
- Performance — use the most efficient method available; avoid unnecessary queries, loops, re-renders, or allocations
- Maintainability — code should be immediately understandable to another senior engineer
- Scalability — design for growth; avoid patterns that break under load
- Separation of concerns — each layer does one thing and does it well
- Security — validate all input, never trust the client, protect all endpoints appropriately

The system must be designed to support increasing complexity over time without requiring rewrites.

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

| Role                | Hex       |
| ------------------- | --------- |
| Background          | `#0B0F0E` |
| Surface             | `#111716` |
| Elevated            | `#151C1A` |
| Border              | `#1F2A28` |
| Primary Green       | `#22C55E` |
| Primary Green Hover | `#16A34A` |
| Green Subtle        | `#052E1F` |
| Secondary Orange    | `#F97316` |
| Orange Subtle       | `#3B1D0E` |
| Text Primary        | `#F8FAFC` |
| Text Secondary      | `#94A3B8` |
| Text Muted          | `#64748B` |
| Success             | `#22C55E` |
| Warning             | `#F97316` |
| Error               | `#EF4444` |

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

- Use clear, descriptive naming — no abbreviations, no single-letter variables outside loops
- Avoid duplication — extract shared logic into utilities, hooks, or services
- Prefer the simplest solution that is also correct and scalable
- Keep functions small and focused — one responsibility per function
- Write modular and testable code — every unit of logic should be independently testable
- No dead code, no commented-out blocks, no TODO comments left in committed code
- Prefer explicit over implicit — make intent obvious from the code itself

---

## Performance Standards

### Backend
- Use `async`/`await` correctly — never block threads, never use `.Result` or `.Wait()`
- Use `IQueryable` and projection (`Select`) to avoid over-fetching from the database
- Never load entire entity graphs when only a subset of fields is needed
- Use `AsNoTracking()` for read-only queries
- Avoid N+1 queries — use `Include()` or batch queries appropriately
- Index frequently queried columns in the database

### Frontend
- Use `useMemo` and `useCallback` where recomputation is expensive
- Never derive state inside render that could be memoised
- Use React Query for all server state — no `useEffect` + `useState` for data fetching
- Invalidate only the specific query keys affected by a mutation
- Prefer optimistic updates for actions that are unlikely to fail (pantry add/remove)
- Avoid prop drilling beyond 2 levels — lift to store or context

---

## Security Standards

- Validate all inputs server-side regardless of client-side validation
- Never expose internal error messages or stack traces to the client
- All protected endpoints must require a valid JWT — no exceptions
- Sanitise all string inputs before persisting
- Never store secrets in source code — use environment variables
- Rate-limit authentication endpoints
- Use HTTPS in production

---

## Error Handling Standards

### Backend
- Use a global exception handling middleware — never let unhandled exceptions reach the client
- Return consistent error response shapes: `{ message: string, errors?: Record<string, string[]> }`
- Use appropriate HTTP status codes: 400 (validation), 401 (auth), 403 (forbidden), 404 (not found), 500 (server error)
- Log all exceptions with structured logging (request context, user id, timestamp)

### Frontend
- Every `useQuery` and `useMutation` must handle error state explicitly — no silent failures
- Show user-facing error messages that are actionable, not technical
- Never expose raw API error messages directly to the UI without sanitising

---

## Testing Standards

- All business logic in services must have unit tests
- All API endpoints must have integration tests
- Test edge cases, not just the happy path
- Tests must be fast, isolated, and deterministic
- No test should depend on external services or shared state

---

## Database Standards

- Use proper migrations — never `EnsureCreated` in production
- Every foreign key must have an explicit delete behaviour defined
- Index any column used in a `WHERE`, `JOIN`, or `ORDER BY` clause
- Never expose raw entity objects through the API — always map to DTOs
- Use transactions for operations that modify multiple tables

---

## Anti-Patterns to Avoid

- Business logic in controllers
- API calls inside UI components
- Deeply nested components
- Hardcoded values or magic strings
- Mixing concerns in a single file
- `.Result` or `.Wait()` on async methods
- `SELECT *` / over-fetching from the database
- Catching exceptions silently with empty catch blocks
- Using `any` type in TypeScript
- Storing sensitive data in localStorage without encryption

---

## Extensibility Guidelines

- Design features to be modular — adding a new feature should not require modifying existing ones
- Avoid tight coupling between components and services
- Use interfaces and abstraction at every layer boundary
- Ensure new features can be added without major refactoring of existing code

---

## Goal

Every feature and UI element should feel **intentional**, **clean**, **modern**, and **consistent**.

The final product must be indistinguishable from production software built by a senior engineering team. Code quality, architecture decisions, and UX polish should all reflect professional standards seen at well-run software companies.
