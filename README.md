# BULX Product Discovery

Live: https://bulx-catalog.vercel.app  
GitHub: https://github.com/IrynaKurnishova/bulx-catalog

## What I built

A product discovery page for 4,000 home goods items. The focus was on making search feel fast and useful, not just functional.

## Key decisions

**Search across title, brand, and tags** — not just title. A user searching "rattan" should find products where rattan appears in tags even if the word isn't in the title. This matches how people actually think about materials.

**Debounced input (300ms)** — avoids filtering on every keystroke. Feels snappier and doesn't thrash the computed property on slow input.

**Dirty data handling** — the dataset has real-world messiness: prices as strings with commas ("1,081.43"), null prices, titles with leading/trailing whitespace ("  VINTAGE OAK BIN "), null ratings, null images. I normalized all of this before rendering rather than letting it surface as broken UI.

**Skeleton loading state** — instead of a spinner, the grid shows placeholder cards while data loads. Reduces layout shift and feels more polished.

**Graceful fallbacks** — products with no image get a clean placeholder icon. Products with null price show "Price on request". Products with no reviews show "No reviews yet". Nothing breaks silently.

**CORS via Vercel rewrites** — the external JSON has no CORS headers. Rather than bundling the file locally (which would go stale), I added a Vercel rewrite rule to proxy the request server-side. This is the correct production approach.

## Tech stack

- Vue 3 + TypeScript + Vite
- TailwindCSS
- Deployed on Vercel

## What I'd do next

- Virtual scrolling for performance with 4,000 items (currently renders all filtered results)
- Price range slider filter
- Highlight matched text in search results
- "In stock only" toggle

## The tradeoff I'd watch

Rendering all 4,000 cards at once is fine for this demo but would hurt on mobile with a slow connection. The first fix would be windowing — only rendering cards in the viewport.
