# Anime_Fighter

A browser-based 2D fighting game featuring anime-style characters battling across themed maps, inspired by Naruto's art style and combat feel. Two fighters face off with health bars, special moves, and explosive chakra effects — no installation required.

---

## Features

### Characters & Selection
- Character select screen with portrait cards and stat previews
- Unique fighters with distinct move sets, speeds, and special attacks
- Chakra/energy meters that power signature techniques

### Stages
- Multiple themed maps with parallax scrolling backgrounds
- Stage select screen with thumbnail previews
- Each map carries its own atmosphere and visual palette

### Combat System
- Two-player local support — Player 1 uses **WASD**, Player 2 uses **Arrow Keys**
- Fighter state machine: idle, run, jump, attack, hurt, block
- Attack hitbox collision detection
- Best-of-3 round logic with countdown timer and KO detection
- Simple AI opponent for single-player mode

### HUD & UI
- Dual health bars and chakra meters
- Round timer and round counter
- Toggle-able move list overlay
- Win/lose screen with Rematch and Main Menu buttons

### Visuals & Audio
- Dark backgrounds with vivid orange, electric blue, and deep purple accents
- Bold black ink outlines on sprites; clean, high-contrast, dramatic style
- Particle bursts: chakra flares, kunai trails in neon orange and white
- Sprite sheet animation system with smooth frame cycling
- Sound effect triggers for hits, blocks, and special moves

---

## How to Open

This is a fully static app — no server or build step needed.

1. Download or clone this repository.
2. Open `index.html` directly in your browser:

```
file:///path/to/Anime_Fighter/index.html
```

Or double-click `index.html` in your file manager.

**Recommended browsers:** Chrome 90+, Firefox 88+, Edge 90+

> Safari may restrict local audio autoplay. Use Chrome for the best experience.

---

## Controls

| Action | Player 1 | Player 2 |
|---|---|---|
| Move Left | `A` | `←` |
| Move Right | `D` | `→` |
| Jump | `W` | `↑` |
| Block | `S` | `↓` |
| Light Attack | `F` | `Numpad 1` |
| Heavy Attack | `G` | `Numpad 2` |
| Special Move | `H` | `Numpad 3` |

---

## Project Structure

```
Anime_Fighter/
├── index.html          # Entry point
├── style.css           # Global styles and HUD layout
├── main.js             # Game loop, round logic, input handler
├── fighter.js          # Fighter class and state machine
├── ai.js               # Single-player AI logic
├── collision.js        # Hitbox detection
├── assets/
│   ├── sprites/        # Sprite sheets per character
│   ├── backgrounds/    # Stage backgrounds (layered for parallax)
│   ├── audio/          # Hit, block, special SFX
│   └── ui/             # Portrait cards, HUD elements
└── README.md
```

---

## License

Assets and code are provided for personal and educational use. Naruto and related characters are the property of Masashi Kishimoto / Shueisha. This project is fan-made and not affiliated with or endorsed by any official rights holders.