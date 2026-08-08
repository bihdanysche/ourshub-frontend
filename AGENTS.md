<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# SplitX Agent Instructions

## General

- Before making architectural decisions, inspect the existing codebase.
- Prefer extending existing patterns over introducing new ones.
- Keep code simple and consistent.
- Do not introduce unnecessary abstractions or dependencies.

---

## Tech Stack

Frontend:
- Next.js (latest App Router)
- React
- TypeScript
- Tailwind CSS
- TanStack Query
- shadcn/ui

---

## Next.js

This project uses the latest version of Next.js.

Do **not** rely on outdated knowledge.
Before suggesting framework-specific APIs or patterns, check the relevant documentation inside:

node_modules/next/dist/docs/

Pay attention to breaking changes and deprecations.

---

## Code Style

- Use TypeScript everywhere.
- Prefer functional components.
- Prefer composition over inheritance.
- Avoid `any`.
- Keep components small and focused.
- Extract reusable logic into hooks when appropriate.
- Follow existing naming conventions.
- Don't use magic strings

---

## Architecture

Frontend follows Feature-Sliced Design (FSD).

Do not create files or folders that violate the existing project structure.

---

## UI

- Use shadcn/ui components whenever possible.
- Prefer Tailwind utilities instead of custom CSS.
- Keep UI accessible.

---

## Before writing code

Always check whether similar functionality already exists in the project.

Reuse existing utilities, hooks, components and services whenever possible.

<!-- END:nextjs-agent-rules -->