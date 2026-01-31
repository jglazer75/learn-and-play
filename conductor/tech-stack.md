# Tech Stack

## Core Technologies
- **Language:** TypeScript (for type safety and developer productivity).
- **Frontend Framework:** Next.js 16 (App Router) with React 19.
- **Styling & UI:** Material UI v6 (for base components) and Framer Motion (for animations and game-like interactions).

## Backend & Data
- **Database:** PostgreSQL (Primary data store for curriculum, progress, and settings).
- **ORM:** Prisma (for type-safe database access).
- **Deployment:** Docker & Docker Compose (for consistent environment across development and hosting).

## AI Integration
- **Abstracted AI Service:** A universal adapter pattern will be implemented to support multiple AI providers (Gemini, OpenAI, Anthropic, or local models), making the provider selectable by the user in the application settings.
