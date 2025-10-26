## Project Setup

# Webinar Hub

A modern, browsable webinar gallery and lightweight content management solution.

## Project Overview

Webinar Hub is a front-end-focused gallery for webinar recordings and short-form video content. It provides a clean, responsive interface for discovering, browsing, and watching 30+ webinar recordings. The application targets product users, data practitioners, and technical decision makers who want a fast, visual way to find webinar content relevant to their needs.

### Goals

- Create an engaging, browsable interface for 30+ webinar recordings.
- Enable quick discovery of relevant content through intelligent search and filtering.
- Provide a superior user experience compared to the existing demo center.

## Success Metrics

Measure progress and success by tracking:

- Time-to-find: Users should be able to find a relevant webinar within 30 seconds on average.
- Engagement: Increased time on webinar content pages (watch time, page dwell).
- Discoverability: Higher click-throughs from gallery to detail pages.

## User Personas

- Sarah — Data Analyst
	- Needs: Visual browsing, short descriptions, quick access to segments or topics.
	- How features help: Grid/list thumbnails, topic filters, brief descriptions and AI summaries (when generated) help Sarah find useful sessions fast.

- Mike — Data Engineering Manager
	- Needs: Fast, exact search and filters, ability to quickly evaluate whether a webinar is relevant for his team.
	- How features help: Robust search, duration/date filters, integrations/tags and featured/popular indicators enable quick decisions.

## Core Features

1. Webinar Gallery View
- Grid / list layout toggle for different browsing preferences.
- Thumbnail preview with title, duration, date, and short description.
- Visual indicators for NEW, POPULAR, and FEATURED webinars.
- Smooth loading states and skeleton screens while data is loading.

2. Smart Search & Filtering
- Real-time search across titles, descriptions, topics, and authors.
- Filters by topic/category, duration ranges, recency/date ranges, integrations, and authors.
- Multi-select filters and clear active filters UI for easy removal.

3. Bookmarking
- Persistent bookmarking stored in localStorage for quick access across sessions.
- Dedicated bookmarked section on the homepage that appears only when bookmarks exist.

4. Content Management (CMS-friendly)
- Local JSON / CMS integration (e.g., Contentful) option for feeding webinar data.
- Form-based or CMS workflows to add/validate new webinars without code deploys.
- Preview capability prior to publishing when integrating with a CMS.

5. AI Summary (Frontend-only in this project)
- Optional AI-generated summary is presented on webinar detail pages.
- For this project the AI summaries are stored in the frontend and there is a "Generate Summary" button to reveal/generate summaries; no backend AI API is integrated.

## Design Requirements

- Modern, clean aesthetic aligned with Atlan brand tokens.
- Fully responsive layout (mobile / tablet / desktop).
- Smooth animations and transitions for primary interactions (fade-ins, skeleton loaders).
- Fast performance: initial load aim < 3s on mid-tier devices (optimizations applied such as lazy-loaded images and skeleton UI).

## Technical Requirements

### Must Have

- Component architecture: reusable, documented React components.
- Mock data: 5–10 sample webinars for local development; the app supports a larger catalogue.
- Responsive design and accessibility-conscious markup.
- Code quality: TypeScript (preferred), linting, and clear code structure.
- Performance: lazy loading images, optimized rendering for lists, and pagination.

### Nice to Have

- Full TypeScript coverage and unit tests for critical components.
- Storybook to document components and states.
- Accessibility testing (a11y) and remediation.
- Performance optimizations like memoization and virtualization for very large lists.

## Technology Stack & Rationale

- Framework: Next.js (recommended)
	- Rationale: Next.js provides server-side rendering (SSR) and static-site generation (SSG) options that significantly improve initial page load speed and SEO. For a webinar gallery that benefits from search engine discoverability and fast first paint, Next.js is an excellent choice. It also simplifies routing, image optimization, and has first-class TypeScript support.

- Front-end: React + TypeScript (current implementation)
	- Rationale: Component-based architecture, type-safety, and a strong ecosystem for UI libraries and testing.

- Styling: Tailwind CSS
	- Rationale: Utility-first approach enables fast, consistent UIs and small CSS bundles when used correctly.

- Data / CMS: Contentful (optional)
	- Rationale: Headless CMS allows non-technical editors to add webinars without code deploys. The app supports local JSON for quick demos and Contentful for production workflows.

### Note on AI summaries
- The AI summary feature is intentionally implemented without a backend API in this project. AI summaries are stored and managed in the frontend (or mock data) to keep scope small and avoid exposing API keys. Future improvements propose a secure backend service to generate and store summaries.

## Future Improvements

- Integrate a secure backend API (serverless or microservice) to generate and store AI summaries.
- Expand filtering to include transcript-based search and clip-level navigation within webinars.
- Add user accounts and server-side bookmark persistence so bookmarks sync across devices.
- Add analytics to measure find-time, conversion to watch, and segment popularity.
- Add automated unit and integration tests; adopt Storybook for component-driven development.

## Try it locally

1. Install dependencies

```bash
# Example using npm
npm install
```

2. Run the dev server

```bash
npm run dev
```

3. Open the app

- Visit http://localhost:3000 (or the port your dev server reports)

Live link: https://webinar-hub.vercel.app/