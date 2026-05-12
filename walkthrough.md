# LLM Arena — UI Redesign Walkthrough

Inspired by [arena.ai](https://arena.ai/) — clean, flat dark UI. No gradients. Sharp, minimal.

## Design Principles Applied

- **No gradients** — all surfaces are flat colors (`#0a0a0a`, `#111111`, `#191919`, `#222222`)
- **Border hierarchy** — soft `#1f1f1f` inner borders, `#2a2a2a` outer borders
- **Clean typography** — Inter font, precise sizing scale, tight letter spacing on headings
- **Side-by-side solutions** — 2-column grid for solution cards (like arena.ai's model comparison)
- **Model tags in topbar** — Claude + GPT tags with color dots, just like the reference screenshot

## Files Changed

### `src/styles/global.css`
Full reset + Inter font import from Google Fonts. Removes all default margins.

### `src/styles/solvemate.css`
Complete rewrite (~580 lines → clean token-based system):
- CSS custom properties token system (`--bg`, `--surface`, `--border`, etc.)
- Sidebar: 256px, flat `#111111`, no gradient
- TopBar: 56px height, model tags pill-badges (green/purple dots)
- Solutions: **2-column grid** layout instead of vertical stack
- Empty state: Icon + heading + 6 suggestion chip buttons
- Composer: auto-growing textarea, sharp button corners
- Winner card: absolute-positioned `Winner` label badge

### `src/styles/auth.css`
- **Premium Video Background**: Uses a Pexels video bounded cleanly to the hero section (`min-height: 80vh`), completely masked with a 75% dark overlay so text remains critically legible.
- **Hero Fade Out**: The hero section seamlessly blends into the lower feature grid using a `linear-gradient` fade-to-black `::after` element.
- **Monochrome & Cyan/Blue Accents**: No messy purple gradients. Pure black (`#000000`) surfaces, `Inter` typography, and sharp Electric Blue, Emerald Green, and Teal glow bounds for the feature cards.
- **Landing CTA buttons**: Electric Blue primary button with smooth `-1px` transform on hover.

### `src/features/arena/ui/TopBar.jsx`
Added model tag pills displaying `claude-sonnet-4` and `gpt-5.4-mini` with colored dots.

### `src/features/arena/ui/ArenaPage.jsx`
Added `EmptyState` component with 6 clickable suggestion chips that pre-fill the composer.

### `src/features/arena/ui/MessageComposer.jsx`
- Switched `<input>` → auto-resizing `<textarea>`
- Enter to submit, Shift+Enter for newline

### `src/features/arena/ui/Sidebar.jsx`
- Uses Clerk `useUser()` to show real initials and name in user row
- Empty history state message

### `src/features/arena/ui/SolutionCard.jsx`
- Absolute-positioned `Winner` badge on winning card
- Null-safe `solution.bullets` check

### `src/features/auth/ui/LandingPage.jsx`
- Feature cards section added below the hero
- Refined copy: "The arena where AI models compete."

## Preview

![Landing page screenshot](file:///C:/Users/KIIT0001/.gemini/antigravity/brain/3cf67481-b37d-47d9-8e21-bb0833be6beb/arena_ui_redesign_1777053669481.png)

## Running Locally

```bash
cd "Desktop/llm arena/Frontend"
npm run dev
# → http://localhost:5174/
```
