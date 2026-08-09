<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# AGENTS.md (Frontend)

Instructions for any AI agent (Claude, Copilot, Cursor, etc.) working on this frontend.
The agent must follow these rules when reading, generating, or refactoring code.

---

## 0. Before writing any code

The agent must study the current architecture first — never generate code from a generic
mental template or from general Next.js knowledge alone.

1. Look at `entities/example_entity` — this is the **canonical reference** for how an entity
   should be structured: queries, mutations, types, zod schemas. Any new entity must follow
   this exact pattern.
2. Browse `shared/`, `widgets/`, `features/`, `views/`, `app/` to see how existing code is
   organized before adding to any of them.
3. Check `shared/config/i18n/locales/*.json` to see existing translation keys/namespaces
   before adding new ones — don't create a new namespace if a suitable one already exists.
4. Only after that — implement the change. New code must be indistinguishable in style from
   existing code.

If the architecture is unclear or the codebase has inconsistent examples, the agent must say
so explicitly and pick the most recent/dominant pattern rather than inventing a new one.

---

## 1. Tech stack

- Framework: **Next.js** (latest, App Router)
- Data fetching / server state: **TanStack Query** — mandatory for all API calls
- UI kit: **HeroUI** — mandatory for all UI components where a suitable component exists
- Icons: **@gravity-ui/icons** — mandatory, no other icon library, no inline SVGs unless the
  icon genuinely doesn't exist in the package
- Architecture: **Feature-Sliced Design (FSD)**
- i18n: `shared/config/i18n/locales` — `en` and `uk`
- packet manager: bun

---

## 2. Project structure (FSD)

```
src/
  ├── app/        — routing only (Next.js App Router pages, layouts, providers wiring)
  ├── views/       — full pages, compose widgets/features/entities into a screen
  ├── widgets/     — self-contained composite blocks (e.g. Header, Sidebar, Footer)
  ├── features/    — user-facing features (e.g. a modal, a form action, a filter)
  ├── entities/    — business entities: everything related to a domain model
  └── shared/      — reusable code with no business meaning of its own
```

### `app/`

- Routing only: `page.tsx`, `layout.tsx`, route groups, middleware, top-level providers.
- No business logic, no data fetching logic beyond wiring providers.

### `views/`

- One view = one full page's composition. Assembles widgets, features, and entities.
- Views themselves don't own API calls — they consume hooks/components from lower layers.

### `widgets/`

- Larger, mostly-independent UI blocks used across views (e.g. `Header`, `Navbar`, `Footer`).
- A widget can use entities and features, but must not be page-specific business logic.

### `features/`

- A concrete user interaction/feature: a modal, an action button with its logic, a form flow.
- Example: `features/change-language`, `features/login-modal`.

### `entities/`

- One folder per business entity (`entities/user`, `entities/auth`, `entities/example_entity`, etc.)
- Each entity folder contains, at minimum:
  ```
  entities/<entity-name>/
    ├── api/
    │     ├── queries.ts        — TanStack Query query hooks (useXQuery, useXListQuery, ...)
    │     └── mutations.ts      — TanStack Query mutation hooks (useCreateXMutation, ...)
    ├── model/
    │     ├── types.ts          — TS types/interfaces for the entity
    │     └── schema.ts         — zod schemas (+ exported inferred types) if validation/forms are needed
    └── index.ts                — public exports (barrel file)
  ```
- **Always check `entities/example_entity` first** — it defines the exact expected shape of
  query keys, hook naming, error handling, and file layout. Copy its pattern, don't reinvent it.
- Entities never import from `features`, `widgets`, `views`, or `app` (one-directional
  dependency: lower layers don't know about higher layers).

### `shared/`

- Truly generic, business-agnostic code: UI primitives not covered by HeroUI, utility
  functions, the API client instance, `shared/config/i18n/*`, constants, hooks with no
  domain meaning (`useDebounce`, `useMediaQuery`, etc.).

General FSD rule: a layer may only import from layers below it in this order:
`app → views → widgets → features → entities → shared`. Never import upward or sideways
across the same layer's unrelated slices.

---

## 3. Data fetching — TanStack Query is mandatory

- **Every** API call goes through TanStack Query (`useQuery` / `useMutation` /
  `useInfiniteQuery`, etc.). No raw `fetch`/`axios` calls inside components, no `useEffect` +
  manual state for server data.
- Query and mutation hooks live in the corresponding entity's `api/` folder
  (`entities/<name>/api/queries.ts`, `entities/<name>/api/mutations.ts`), following the shape
  established in `entities/example_entity`.
- Components/features/views never call the API layer directly — they call the entity's
  exported hooks (`useExampleEntityQuery()`, `useCreateExampleEntityMutation()`, etc.).
- Query keys must be defined consistently (typically as a factory/const array per entity) —
  reuse the pattern from `entities/example_entity`, don't hand-roll ad-hoc key arrays in
  every component.
- Mutations that should update cached data must use `invalidateQueries` / `setQueryData`
  consistently with how `example_entity` does it — no manual `window.location.reload()` or
  full refetch-everything patterns.
- Loading/error/empty states from `useQuery`/`useMutation` (`isPending`, `isError`, `data`)
  drive the UI — don't duplicate this state manually in `useState`.

---

## 4. UI — HeroUI first

- Always use a **HeroUI** component when one exists for the use case (`Button`, `Input`,
  `Modal`, `Table`, `Select`, `Tabs`, `Card`, `Spinner`, etc.) instead of writing a custom
  element from scratch.
- Only build a custom component when HeroUI genuinely has no equivalent — and in that case,
  it should still be styled consistently with the rest of the HeroUI-based UI (spacing,
  radii, color tokens).
- Don't override HeroUI internals with fragile CSS hacks — use the props/variants the
  component already exposes (`variant`, `color`, `size`, `radius`, etc.) first.
- Icons: always import from **`@gravity-ui/icons`**. Never use another icon set, emoji-as-icon,
  or a custom inline SVG unless the required icon truly doesn't exist in the package.

---

## 5. Error handling

### 5.1 What the backend returns

All API errors come back from the backend in this shape:

```json
{
  "error_code": "INVALID_TELEGRAM_ID_TOKEN"
}
```

`error_code` is always one of the backend's error enums (module-specific or common) — it is a
stable machine-readable string, never a human-readable message.

### 5.2 How the frontend must handle it

- The API client (in `shared/`) must normalize every failed response into a consistent error
  object that exposes `error_code` (fall back to `UNKNOWN_ERROR` if the backend response
  doesn't match the expected shape — never let a raw/unparsed error reach the UI).
- **Never hardcode an error message string in a component.** Every user-facing error message
  must be resolved by translating `error_code` through the `api_errors` i18n namespace:

  ```ts
  t(`api_errors.${error_code}`);
  ```

  with `api_errors.UNKNOWN_ERROR` as the guaranteed fallback key if the code is unrecognized.

- This translation must happen in one shared place (e.g. a `shared/lib/get-api-error-message`
  helper or an error-handling hook), not re-implemented per feature.
- TanStack Query's `isError`/`error` state is the source of truth for showing error UI —
  don't catch errors ad-hoc with `try/catch` around query calls in components.
- When adding a **new** backend error code, the agent must add a matching key to
  `api_errors` in **both** `en.json` and `uk.json` immediately — never leave a code
  untranslated or leave the UI to render a raw error code.

---

## 6. i18n — no hardcoded strings, ever

- No hardcoded user-facing strings anywhere in components — every piece of visible text goes
  through the i18n `t()` function.
- Translation files live at `shared/config/i18n/locales/en.json` and
  `shared/config/i18n/locales/uk.json`. **Both must always be kept in sync** — every key added
  to `en.json` gets a corresponding translated key in `uk.json` in the same commit/change,
  never left as a TODO.
- Structure: one top-level namespace per API error bucket, plus one top-level namespace per
  widget/feature/page/section. Example shape:

  ```json
  {
    "common": {
      "success": "Success!",
      "error": "Error"
    },
    "header": {
      "login_via_tg": "Login via Telegram"
    },
    "api_errors": {
      "BAD_REQUEST": "Bad request",
      "UNAUTHORIZED": "Authentication required",
      "UNKNOWN_ERROR": "Unknown error"
    },
    "auth": {
      "success_auth_desc": "You successfully logined via Telegram!"
    }
  }
  ```

- Namespacing rules:
  - `api_errors` — **only** backend error codes, keyed exactly as `error_code` is spelled
    (`SCREAMING_SNAKE_CASE`), value is the human-readable translated message.
  - `common` — truly shared strings reused across many places (generic "Success"/"Error"/
    "Cancel"/"Save", etc.).
  - Everything else — one namespace per widget/feature/view/section, named after that
    slice (`header`, `auth`, `example_entity_form`, etc.), matching the FSD slice it belongs to
    where reasonable.
- Before adding a new key, check whether an equivalent one already exists in `common` or in
  the relevant namespace — don't create near-duplicate keys with different names for the same
  string.
- Never leave a placeholder/English-only key that's missing from `uk.json` — both files must
  have the exact same key structure at all times.

---

## 7. General code quality

- Match the existing project style exactly (naming, formatting, import order, file layout) —
  treat neighboring files and `entities/example_entity` as the source of truth.
- Strict typing: avoid `any` unless truly unavoidable, no `@ts-ignore` without a comment
  explaining why. Prefer types inferred from zod schemas (`z.infer<typeof schema>`) over
  hand-written duplicate interfaces when a schema already exists.
- Forms use zod schemas from the relevant entity's `model/schema.ts` for validation — don't
  write ad-hoc validation logic in the component.
- Respect the Server Component / Client Component boundary: TanStack Query hooks, HeroUI
  interactive components, and anything using state/effects need `"use client"` — don't mark
  everything as a client component by default if it doesn't need to be.
- No hardcoded config values (API base URLs, feature flags, timeouts, etc.) — these come from
  environment variables (`process.env.NEXT_PUBLIC_*` where needed client-side) via a single
  typed config module in `shared/config`, never read ad-hoc via `process.env.X` scattered
  around the codebase.
- Don't duplicate logic — if similar UI/logic exists elsewhere, extract it into `shared` or
  the appropriate entity/feature instead of copy-pasting.
- Naming conventions:
  - Components — `PascalCase` files/exports.
  - Hooks — `camelCase`, prefixed with `use`.
  - Query hooks — `use<Entity>Query` / `use<Entity>ListQuery`.
  - Mutation hooks — `use<Action><Entity>Mutation` (e.g. `useCreateExampleEntityMutation`).
  - i18n keys — `snake_case`.

---

## 8. Things the agent must never do

- Never fetch data with raw `fetch`/`axios` inside a component instead of a TanStack Query hook.
- Never build a custom UI element when a HeroUI component already covers the case.
- Never use an icon from anywhere other than `@gravity-ui/icons`.
- Never hardcode a user-facing string instead of going through `t()`.
- Never hardcode an error message instead of resolving it via `api_errors.<error_code>`.
- Never add a translation key to `en.json` without the matching key in `uk.json` (and vice versa).
- Never invent a new entity/feature/widget structure without following `entities/example_entity`
  or the closest existing analogous slice.

---

## 9. Pre-submit checklist

- [ ] I checked `entities/example_entity` and followed its pattern for any new/changed entity.
- [ ] All API calls go through TanStack Query hooks defined in the entity's `api/` folder.
- [ ] All UI uses HeroUI components where a suitable one exists.
- [ ] All icons come from `@gravity-ui/icons`.
- [ ] No hardcoded user-facing strings — everything goes through `t()`.
- [ ] Any new `error_code` has a translated key in both `en.json` and `uk.json` under `api_errors`.
- [ ] Any new non-error string has a key in both `en.json` and `uk.json`, in the right namespace.
- [ ] New code respects FSD layer boundaries (no upward/sideways imports).
- [ ] File/folder structure and naming match the rest of the project.
