**State Variables**
- `gameState`: string — current screen ('menu'|'charselect'|'mapselect'|'game'|'pause'|'roundwin'|'matchwin')
- `p1`, `p2`: Fighter objects — position{x,y}, velocity{x,y}, health, chakra, state, facingRight, frameIndex, frameTimer, wins
- `selectedChars`: [p1Index, p2Index] — character roster indices
- `selectedMap`: number — map index
- `charSelectCursor`: number — which player is selecting (0=P1, 1=P2)
- `roundTimer`: number — seconds remaining
- `roundNum`: number — current round (1-3)
- `keys`: object — keyCode→boolean pressed map
- `animationFrameId`: number — requestAnimationFrame handle
- `isAIMode`: boolean
- `particles`: Particle[] — active particle effects
- `sounds`: object — named AudioBuffers

**Key DOM Targets**
All `#screen-*` divs toggled via `.active` class; `#gameCanvas` 2D context; health/chakra fill divs; `#timer`, `#roundNum`, `#announceText`, `#announceSub`, `#roundScore`, `#victorName`

**Function List**
- `showScreen(id)` — hide all .screen, add .active to target
- `initCharSelect()` — render charGrid portraits, reset cursor
- `renderCharPreview(player, charIndex)` — update portrait/stats panel
- `initMapSelect()` — render mapGrid thumbnails
- `startMatch()` — reset fighters, round state, launch game loop
- `gameLoop(timestamp)` — master RAF loop: input→update→collide→render
- `processInput()` — map keys to fighter intents
- `updateFighter(f, opponent)` — physics, state machine, animation frame advance
- `checkCollisions()` — AABB hitbox overlap, apply damage/knockback
- `renderFrame(ctx)` — clear, draw background parallax, fighters, particles, HUD
- `updateHUD()` — sync health/chakra fill widths, timer text
- `tickTimer(delta)` — decrement roundTimer, trigger KO on timeout
- `endRound(winner)` — show #screen-roundwin, update pip icons, check best-of-3
- `endMatch(winner)` — show #screen-matchwin, populate victor panel
- `spawnParticles(x, y, type)` — push particle objects to array
- `runAI(f, opponent)` — simple state-based decision tree for AI fighter
- `playSound(name)` — trigger AudioBuffer playback

**Event Listeners**
- `keydown`/`keyup` on window → update `keys`
- Click: `#btnVsPlayer`, `#btnVsAI`, `#btnHowToPlay`, `#btnHowBack`, `#btnCharNext`, `#btnCharBack`, `#btnFight`, `#btnMapBack`, `#btnResume`, `#btnRestartMatch`, `#btnRematch`, `#btnMenuFromWin`, `#btnMenuFromPause`, `#pauseBtn`, `#movelistToggle`
- Click on `#charGrid` items (delegation), `#mapGrid` items (delegation)

**Render/Update Loop**
RAF calls `gameLoop` each frame. Delta-time capped at 50ms. Order: processInput → updateFighter(p1) → updateFighter(p2) → checkCollisions → tickTimer → updateHUD → renderFrame → updateParticles.

**Validation Concerns**
- Clamp fighter x within canvas bounds; y floored at ground level
- Health/chakra clamped 0–100; fill width = `value + '%'`
- Timer floored at 0; no negative countdown
- charSelectCursor must confirm both players before advancing
- AI only active when `isAIMode === true`

**Initialization Sequence (DOMContentLoaded)**
1. Cache all DOM refs
2. Load sound assets (AudioContext + fetch)
3. Build character roster and map data arrays
4. Attach all event listeners
5. `showScreen('screen-menu')`, start menu particle animation