# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kamida Blog is a personal tech blog built with Next.js 16 (App Router), Tailwind CSS v4, and JavaScript. It features markdown-based posts with AI-powered article summaries. Deployed on Vercel.

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

### Content System
- **Posts**: Markdown files in `src/posts/` with YAML frontmatter (`title`, `date`, `tag`, `category`)
- **Post loading**: `src/lib/posts.js` reads markdown files synchronously using `fs` + `gray-matter`, sorted by date descending
- **Rendering**: `marked` library with custom renderer for syntax highlighting (`highlight.js`) and heading anchors

### Routing (App Router)
- `/` — Home page with sidebar (avatar, social links) and posts grouped by category
- `/posts/[slug]` — Individual post page with AI summary sidebar
- `/about` — About page with personal info

### Theme System
- **CSS Variables**: All colors defined in `src/styles/theme.css` using CSS custom properties (`--bg-primary`, `--text-primary`, etc.)
- **Dark mode**: Toggled via `dark` class on `<html>` + `data-theme` attribute
- **Theme persistence**: localStorage with system preference fallback
- **FOUC prevention**: Inline script in `src/app/layout.jsx` runs before React hydration
- **Components use inline `style` props** with CSS variables (e.g., `style={{ color: 'var(--text-primary)' }}`)

### AI Summary Feature
- **API**: ChatAnywhere (OpenAI-compatible) at `https://api.chatanywhere.tech`
- **Environment variable**: `CHATANYWHERE_API_KEY` required (in `.env.local`)
- **Implementation**: `src/utils/api.js` → `articleSummary()` sends article content to GPT-3.5-turbo, returns `{ summary, highlights, tags }`
- **Display**: `AISummaryTypewriter` component renders with typewriter animation
- **Loading**: Uses React `Suspense` with skeleton fallback

### Key Components
- `Header.jsx` — Sticky navbar with glassmorphism, contains `ThemeToggle`
- `Footer.js` — Simple footer component
- `ThemeToggle.jsx` — Light/dark mode toggle button
- `AISummaryTypewriter.jsx` — Client component for animated AI summary display

### Styling
- Tailwind CSS v4 with `@tailwindcss/postcss` plugin
- Custom animations defined in `globals.css` (`fadeIn`, `leftIn`, `rightIn`, `slideUp`)
- Glassmorphism effects via backdrop-filter and CSS variables
- Component styles (`.card`, `.btn`, `.tag`, `.prose`) in `theme.css`

## Important Patterns

1. **Server Components by default**: Pages and data-fetching components are async Server Components
2. **Client Components**: Marked with `"use client"` — used for interactivity (Header, ThemeToggle, About page)
3. **Path aliases**: `@/` maps to `src/` (configured in `jsconfig.json`)
4. **Images**: Static assets in `public/` — use `next/image` for optimization
5. **No TypeScript**: Project uses JavaScript with JSDoc where needed

## Environment Variables

```
CHATANYWHERE_API_KEY=your_api_key  # Required for AI summary feature
```
