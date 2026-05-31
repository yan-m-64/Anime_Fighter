Anime_Fighter is a browser-based 2D fighting game featuring anime-style characters battling across themed maps, inspired by Naruto's art style and combat feel. Two characters face off with health bars, special moves, and animated effects.

Key UI components:
- Character select screen with portrait cards and stats preview
- Map/stage select screen with thumbnail previews
- Game canvas (full-screen) with two character sprites
- HUD: dual health bars, chakra/energy meters, round timer, round counter
- Move list overlay (toggle button)
- Win/lose screen with rematch and menu buttons

JavaScript functionality:
- Keyboard input handler (WASD + arrow keys for two players)
- Fighter class with position, velocity, health, state machine (idle/run/jump/attack/hurt/block)
- Attack hitbox collision detection
- Sprite sheet animation system with frame cycling
- Background parallax scrolling per map
- Round logic: timer countdown, KO detection, best-of-3 tracking
- Simple AI opponent for single-player mode
- Sound effect triggers (hit, block, special move)

Color scheme and visual style:
- Dark backgrounds with vivid orange, electric blue, and deep purple accents (Naruto palette)
- Bold black ink outlines on sprites
- Particle bursts (chakra flares, kunai trails) in neon orange and white
- Pixel-art adjacent but slightly painterly — clean, high-contrast, dramatic