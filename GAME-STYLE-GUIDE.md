# Game Style Guide — Clean Arcade

All games should follow these conventions for a consistent experience.

## Colors
- Background: `#0f172a`
- Text: `#e2e8f0`
- Muted text: `#94a3b8`
- Accent/primary: `#6366f1`
- Accent hover: `#4f46e5` or `#818cf8`
- Success/green: `#22c55e`
- Danger/red: `#ef4444`
- Warning/yellow: `#facc15`
- Info/blue: `#3b82f6`
- Panel/card bg: `#1e293b`
- Border: `#334155`

## Typography
- Font: `system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`
- Game title: `1.2rem`, bold, color `#facc15`, always visible during gameplay
- HUD text: `0.85rem`, color `#e2e8f0`
- HUD labels: color `#94a3b8`

## Layout
- Body: flex column, center aligned, `min-height: 100vh`, `touch-action: manipulation`
- Game title `<h1>` always shown at top during gameplay
- HUD row below title: flex, centered, gap `1rem`, wrapped in panel-bg divs
- Canvas/game area: centered, `max-width: 100%`, `border-radius: 0.5rem`
- Pause button: below game area, in document flow (never position:absolute/fixed)

## HUD Format
```html
<h1>Game Name</h1>
<div class="hud">
  <span>Score: <b id="scoreEl">0</b></span>
  <span>Best: <b id="highEl">0</b></span>
</div>
```

## Overlays
- Start: game name as `<h2>` in `#facc15`, short instruction `<p>`, Play `<button>`
- Game over: title, score line in `#22c55e`, best score, Play Again button
- Fixed inset:0, dark overlay `rgba(15, 23, 42, 0.92)`, z-index: 10
- Button: `background: #6366f1`, `color: #fff`, `padding: 0.75rem 2rem`

## Pause Button
```html
<div style="text-align:center;padding:8px 0">
  <button id="pauseBtn" onclick="togglePause()">⏸</button>
</div>
```
- Style: `background: #334155`, `color: #e2e8f0`, `border: 1px solid #475569`, `40x40px`
- Toggle between ⏸ and ▶
- P key triggers on desktop
- Hidden until game starts

## Save/Load
- Save on pause and game over: `parent.postMessage({type:'ca-save', slug:'SLUG', state:{highScore}}, '*')`
- Load listener: `window.addEventListener('message', ...)`
- Restore `highScore` from loaded state

## Responsive
- Canvas: `max-width: 100%` with `touch-action: none`
- Body: `touch-action: manipulation`
- Size canvas based on viewport, not fixed pixels
