# OursHub Frontend

**OursHub** is a private social hub and shared expense manager designed for friend circles, squads, and crews. It provides a shared space for crews to collaborate, share media (photos, videos, audio with an interactive vinyl audio player, and documents), manage active sessions, and split group expenses with clear debt tracking and payment settlement.

The backend API for this application is located at [https://github.com/bihdanysche/ourshub-backend](https://github.com/bihdanysche/ourshub-backend).

---

## Features

- **Crews & Squads**: Create private spaces with custom avatars, cover images, member roles (Owner/Member), invite links, and QR codes.
- **Feed & Posts**: Share text, images, videos, audio, and documents. Includes post editing, deletion, lightbox media viewer, and a custom Web Audio API vinyl player with ID3 metadata parsing.
- **Group Expense Splitting**: Multi-step expense creation wizard supporting auto-equal and manual splitting modes, debt calculation, payment claims, and activity history logs.
- **Session Management**: View active user sessions with User-Agent browser/device detection and remote single or multi-session revocation.
- **Localization**: Full English (`en`) and Ukrainian (`uk`) language support powered by `react-i18next` with strict translation key parity.
- **Customization**: Dark and light theme toggle powered by `next-themes` and user profile/avatar crop modal.

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Library & Runtime**: [React 19](https://react.dev/), [Bun](https://bun.sh/)
- **State & Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest) (`@tanstack/react-query`) & [Axios](https://axios-http.com/)
- **UI Components**: [HeroUI](https://heroui.com/) (`@heroui/react`, `@heroui/styles`)
- **Icons**: [@gravity-ui/icons](https://github.com/gravity-ui/icons)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/postcss`
- **Form Management & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Localization**: `i18next`, `react-i18next`, `i18next-browser-languagedetector`
- **Media Tools**: `react-easy-crop`, `qrcode.react`

---

## Architecture (Feature-Sliced Design)

This repository strictly adheres to **Feature-Sliced Design (FSD)** principles to maintain clear separation of concerns and high scalability:

```
src/
├── app/         # App Router pages, global layouts, CSS, and root providers
├── views/       # Full page compositions (HomePage, CrewPage, SettingsPage, etc.)
├── widgets/     # Independent composite blocks (Header, CrewPosts, CrewSplits, etc.)
├── features/    # Concrete user actions (create-post, create-split, manage-split-expense, etc.)
├── entities/    # Domain business models (auth, crew, post, session, split)
└── shared/      # Generic utility code (api client, config, i18n, lib, providers, ui)
```

Layer dependency rules flow strictly downwards (`app -> views -> widgets -> features -> entities -> shared`).

---

## Backend Integration

- **Backend Repository**: [bihdanysche/ourshub-backend](https://github.com/bihdanysche/ourshub-backend)
- **API Base URL**: Configured via `NEXT_PUBLIC_API_URL` environment variable.
- **Authentication**: HTTP-only session cookies (`withCredentials: true`).
- **Token Refresh Queue**: Axios response interceptors automatically handle `401 Unauthorized` responses by executing `/auth/refresh` requests and queuing concurrent requests during token renewal.
- **Error Handling**: API errors return normalized `{ error_code: "STRING_CODE" }` structures which map directly to translated localized error messages via `t("api_errors.<error_code>")`.

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.3.14 or later) installed on your machine.

### Setup Instructions

1. **Clone the repository**:

   ```bash
   git clone https://github.com/bihdanysche/ourshub-frontend.git
   cd ourshub-frontend
   ```

2. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

3. **Install Dependencies**:

   ```bash
   bun install
   ```

4. **Run Development Server**:

   ```bash
   bun dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Linting & Type Checking**:

   ```bash
   bun run lint
   bun x tsc --noEmit
   ```

6. **Build for Production**:
   ```bash
   bun run build
   bun start
   ```
