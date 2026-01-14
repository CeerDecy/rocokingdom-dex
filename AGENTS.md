# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js App Router pages, layout, and global styles (`app/page.tsx`, `app/layout.tsx`, `app/globals.css`).
- `components/`: Reusable UI components (e.g., `components/HeaderBar.tsx`).
- `lib/`: Shared utilities and helpers (keep small, focused modules).
- `public/`: Static assets served at the site root (images, icons, etc.).

## Build, Test, and Development Commands
- `pnpm dev`: Run the development server with hot reload.
- `pnpm build`: Create a production build.
- `pnpm start`: Run the production server after build.
- `pnpm lint`: Run ESLint checks.

If you prefer npm, use `npm run <script>`, but keep lockfiles consistent.

## Coding Style & Naming Conventions
- Language: TypeScript + React (Next.js App Router).
- Indentation: 2 spaces in JSX/TSX.
- Components: `PascalCase` file and component names (e.g., `HeaderBar`).
- Functions/variables: `camelCase`.
- CSS: Tailwind utility classes; prefer composable class strings over inline styles.
- Formatting/Linting: ESLint via `pnpm lint` using `eslint-config-next`.

## Testing Guidelines
- No test framework is currently configured.
- If adding tests, place them near the feature (e.g., `app/__tests__/...`) and document the chosen runner (e.g., Vitest or Jest) in this file.

## Commit & Pull Request Guidelines
- Git history is not available in this workspace; no commit message convention can be inferred.
- Suggested default: concise, imperative messages (e.g., `Add attribute matchup page`).
- PRs should include: a clear description of changes, any relevant screenshots for UI updates, and links to related issues if applicable.

## Configuration Tips
- Tailwind v4 is configured in `app/globals.css` and `postcss.config.mjs`.
- Font setup lives in `app/layout.tsx`; update there when changing global typography.

## Agent Instructions
- For any UI creation or modification, always use the `ui-ux-pro-max` skill before making changes.
