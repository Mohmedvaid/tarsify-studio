# Changelog

All notable changes to Tarsify Studio will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Tars Models architecture** - Complete rewrite from Notebooks to Tars Models
- Tars Models API documentation (`docs/api/API.md`)
- Migration guide for Notebooks → Tars Models (`docs/MIGRATION.md`)
- New types: `BaseModel`, `TarsModel`, `ConfigOverrides` (`src/types/api.ts`)
- New hooks: `useBaseModels`, `useTarsModels`, `useTarsModel`, `useCreateTarsModel`, `useUpdateTarsModel`, `useDeleteTarsModel`, `usePublishTarsModel` (`src/hooks/use-tars-models.ts`)
- New components: `TarsModelStatusBadge`, `BaseModelCard`, `TarsModelCard`, `TarsModelForm` (`src/components/tars-models/`)
- New pages: `/models`, `/models/new`, `/models/[id]`, `/models/[id]/edit`
- Dashboard now shows Tars Models stats (total models, runs, published count)
- This changelog file

### Changed

- Sidebar navigation: "Notebooks" → "My Models", removed Analytics link
- Dashboard: Refactored to show Tars Models overview instead of Notebooks
- API endpoints: Added `/api/studio/tars-models/*` routes
- Status values: Changed from lowercase (`draft`/`published`) to uppercase (`DRAFT`/`PUBLISHED`/`ARCHIVED`)
- Updated `README.md` to reflect Tars Models architecture
- Updated `DEVELOPMENT.md` with new implementation phases
- Updated `docs/api/auth.md` with current API version

### Deprecated

- Notebook API endpoints (`/api/studio/notebooks/*`) — use Tars Models API instead

### Removed

- All Notebooks code (`src/app/(dashboard)/notebooks/`, `src/components/notebooks/`)
- Earnings feature (`src/app/(dashboard)/earnings/`, `src/hooks/use-earnings.ts`)
- Analytics components (`src/components/analytics/`, `src/hooks/use-analytics.ts`)
- Notebook-related hooks (`src/hooks/use-notebooks.ts`)
- Mock data system (`src/lib/mock/` folder deleted)

---

## [0.2.0] - 2026-02-05

### Added

- Firebase App Hosting deployment
- GitHub Actions CI/CD pipeline (lint, test, security, build)
- GCP Secret Manager integration for secrets
- Analytics "Coming Soon" placeholder page

### Changed

- Migrated from middleware.ts to next.config.ts redirects (Next.js 16 compatibility)
- Notebook cards now fully clickable (removed 3-dot menu)
- All hooks now use real API (removed mock data branches)

### Removed

- Mock data generators
- Danger zone / delete button from notebook edit page
- Earnings from sidebar navigation

### Fixed

- Next.js 16 middleware deprecation warning
- Type imports pointing to deleted mock folder

---

## [0.1.0] - 2026-01-27

### Added

- Initial project setup with Next.js 15 + TypeScript
- Tailwind CSS 4 + shadcn/ui components
- Firebase Auth integration (tarsify-studio project)
- React Query + Zustand state management
- Auth pages (login, register)
- Dashboard layout with sidebar
- Notebooks CRUD pages (list, create, edit, view)
- File upload component (UI only)
- Settings page (profile, account)
- Analytics page (with mock data)
- Earnings page (with mock data)
- API client with auth headers
- Protected routes middleware

---

[Unreleased]: https://github.com/Mohmedvaid/tarsify-studio/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/Mohmedvaid/tarsify-studio/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/Mohmedvaid/tarsify-studio/releases/tag/v0.1.0
