# Tarsify Studio

> Developer portal for AI notebook creators at [studio.tarsify.com](https://studio.tarsify.com)

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - UI components
- **Firebase Auth** - Authentication
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

| Command         | Description      |
| --------------- | ---------------- |
| `npm run dev`   | Start dev server |
| `npm run build` | Production build |
| `npm run lint`  | Run ESLint       |
| `npm run test`  | Run unit tests   |

## Documentation

- [Development Guide](./DEVELOPMENT.md) - Progress tracking, phases, setup
- [API Reference](./API.MD) - Backend API endpoints

## Project Structure

```
src/
├── app/           # Next.js pages
│   ├── (auth)/    # Login, Register
│   └── (dashboard)/ # Protected pages
├── components/    # React components
├── hooks/         # Custom hooks
├── lib/           # Utilities, API client
├── providers/     # Context providers
├── stores/        # Zustand stores
└── types/         # TypeScript types
```

## Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```
