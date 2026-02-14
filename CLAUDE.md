# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run check        # Run svelte-check for type checking
npm run check:watch  # Run svelte-check in watch mode
npm run lint         # Run ESLint
```

## Architecture

This is a SvelteKit 2 application using Svelte 5 syntax, deployed to Cloudflare Pages.

### Key Technologies
- **Frontend**: Svelte 5 with runes (`$state`, `$derived`, `$effect`, `$props`)
- **Backend**: PocketBase (self-hosted on Linode at api.bretteastmanstudio.com)
- **AI**: Google Gemini 2.5 Flash for the music history chatbot
- **Styling**: TailwindCSS with custom color tokens (primary, secondary, tertiary with numeric suffixes)
- **Deployment**: Cloudflare adapter

### Data Flow
- `src/hooks.server.ts` - Server hook that initializes PocketBase for each request, handles auth state via cookies, and protects `/chat` route
- `src/lib/pocketbase.ts` - Factory function that creates PocketBase instances (browser-side caches instance on window, server-side creates fresh per request)
- `src/lib/server/gemini.ts` - Server-only Gemini AI client with music historian system prompt

### Route Patterns
- Instrument pages (`/drums`, `/bass`, `/guitar`, `/theory`) - Load song data via `+page.ts` using PocketBase client-side, display with search and randomize features
- `/chat` - Protected route requiring authentication, communicates with `/api/chat` endpoint
- `/api/chat` - Server endpoint that enforces daily question limit (10/day per user), maintains conversation history with Gemini

### Type Definitions
- `src/lib/types.ts` - Shared types for songs, resources, chat messages, and Gemini API payloads
- `src/app.d.ts` - SvelteKit app types extending `App.Locals` with `pb` and `user`

### Environment Variables
- Prefix `PUBLIC_` for client-accessible vars
- Prefix `PRIVATE_` for server-only vars (e.g., `PRIVATE_GEMINI_API_KEY`)

### Components
- Components in `src/components/` use Svelte 5 `interface Props` pattern with `$props()` rune
- Icons via `Icon.svelte` component using Remix icons
