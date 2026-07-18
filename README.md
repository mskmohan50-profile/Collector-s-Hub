# Collector's Hub

A responsive marketplace and community feed app for browsing listings (Bikes, Cars, Jewellery, Electronics, Mobile Phones, Shoes, Real Estate, Manuscripts & Books), tracking a personal collection, and engaging with a community feed — fully mock-data-driven, no backend required.

## Setup Instructions

```bash
npm install       # install dependencies
npm run dev        # start dev server → http://localhost:5173
npm run build       # production build
npm run preview      # preview production build
npm run lint          # lint
npm run typecheck      # type-check
```

No `.env`, database, or backend setup needed — the app runs entirely on mock data in `src/data.ts`. Product images are already included under `public/images/{category}/`.


## Assumptions Made

- No backend/database — all data (listings, posts, comments, likes) is static mock data. `@supabase/supabase-js` is listed in `package.json` but unused in code.
- No authentication — likes/saves/collection actions apply to a single implicit "visitor," not distinct user accounts.
- Persistence is `localStorage`-only (theme + collection data), not synced across devices.
- Category list (Bikes, Cars, Jewellery, Electronics, Mobile Phones, Shoes, Real Estate, Manuscripts & Books) is treated as fixed/final, not user-extensible.
- Images may fail to load (missing file in `public/images/`) — `SafeImage` assumes this and falls back gracefully instead of breaking the layout.
- "Estimated value" in Collection is a deterministic mock, not real valuation data.
- Currency is implicitly INR, shown as plain numbers with no formatting layer.

## Libraries Used

| Library | Purpose |
|---|---|
| React 18 + react-dom | UI framework 
| react-router-dom | Routing 
| TypeScript 
| Vite + @vitejs/plugin-react 
| Tailwind CSS + @tailwindcss/vite | Styling 
| PostCSS + autoprefixer | CSS pipeline 
| lucide-react | Icons |
| @supabase/supabase-js | In dependencies, unused in code 
| ESLint + typescript-eslint | Linting 

## Additional Features Implemented

- **Marketplace:** debounced search, category + condition filters, price/newest sort, grid/list toggle, listing detail page
- **Community Feed:** debounced search, category filter, optimistic likes, save/bookmark, post detail with comments
- **My Collection:** Owned/Wishlist/Selling tabs with live counts, move-between-collections, duplicate-prevention with toast feedback, search/filter/sort
- **Resilience:** `SafeImage` graceful fallback for broken images, skeleton loaders, error states with retry, distinct empty vs. no-results states, toast notifications
- **Theming:** dark mode with system-preference detection, persisted via `localStorage`
- **Performance:** lazy-loaded images, debounced search across Marketplace and Community

