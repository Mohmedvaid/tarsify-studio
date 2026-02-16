# Tarsify Studio

> Developer portal for creating and publishing AI models at [studio.tarsify.com](https://studio.tarsify.com)

## Overview

Tarsify Studio allows developers to:

- Browse platform **base models** (SDXL, Whisper, Chatterbox, etc.)
- Create branded **Tars Models** with custom configurations
- Publish models to the Tarsify marketplace
- Track analytics and earnings (coming soon)

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - UI components
- **Firebase Auth** - Authentication (tarsify-studio project)
- **React Query** - Data fetching
- **Zustand** - State management

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Configure Firebase credentials in .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Scripts

| Command             | Description      |
| ------------------- | ---------------- |
| `npm run dev`       | Start dev server |
| `npm run build`     | Production build |
| `npm run lint`      | Run ESLint       |
| `npm run test`      | Run unit tests   |
| `npm run typecheck` | TypeScript check |

## Documentation

| Document                               | Description                              |
| -------------------------------------- | ---------------------------------------- |
| [Development Guide](./DEVELOPMENT.md)  | Progress tracking, implementation phases |
| [Migration Guide](./docs/MIGRATION.md) | Tars Models migration checklist          |
| [API Reference](./docs/api/API.md)     | Full backend API documentation           |
| [Deployment](./docs/DEPLOYMENT.md)     | CI/CD and hosting setup                  |
| [Changelog](./CHANGELOG.md)            | Version history                          |

## Project Structure

```
src/
├── app/              # Next.js pages
│   ├── (auth)/       # Login, Register
│   └── (dashboard)/  # Protected pages (models, settings, etc.)
├── components/       # React components
├── hooks/            # Custom hooks (API integration)
├── lib/              # Utilities, API client
├── providers/        # Context providers
├── stores/           # Zustand stores
└── types/            # TypeScript types
```

## Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## License

Proprietary - Tarsify Inc.
