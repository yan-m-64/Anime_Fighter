// === Init ===

document.addEventListener('DOMContentLoaded', () => {

  // --- Character roster ---
  characterRoster = [
    {
      name: 'Kazuki',
      color: '#ff7400',
      accentColor: '#ffaa00',
      stats: { power: 8, speed: 7, defense: 5, chakra: 9 },
      moves: [
        { input: '→ → A / → → J', name: 'Wind Slash' },
        { input: '↓ → A / ↓ → J', name: 'Chakra Burst' },
        { input: '↑ A / ↑ J',     name: 'Sky Strike'  },
      ],
      hitboxes: { stand: { w: 48, h: 80 }, attack: { w: 64, h: 40, ox: 32 } },
    },
    {
      name: 'Seiryu',
      color: '#1a8fff',
      accentColor: '#00eaff',
      stats: { power: 6, speed: 9, defense: 6, chakra: 8 },
      moves: [
        { input: '→ → A / → → J', name: 'Lightning Dash' },
        { input: '↓ → A / ↓ → J', name: 'Thunder Bolt'   },
        { input: '↑ A / ↑ J',     name: 'Storm Kick'      },
      ],
      hitboxes: { stand: { w: 44, h: 76 }, attack: { w: 60, h: 36, ox: 28 } },
    },
    {
      name: 'Kurohana',
      color: '#9b30ff',
      accentColor: '#cc88ff',
      stats: { power: 9, speed: 5, defense: 8, chakra: 7 },
      moves: [
        { input: '→ → A / → → J', name: 'Shadow Fang'  },
        { input: '↓ → A / ↓ → J', name: 'Dark Petal'   },
        { input: '↑ A / ↑ J',     name: 'Void Smash'   },
      ],
      hitboxes: { stand: { w: 52, h: 84 }, attack: { w: 68, h: 44, ox: 36 } },
    },
    {
      name: 'Akemi',
      color: '#ff1a1a',
      accentColor: '#ff6666',
      stats: { power: 7, speed: 8, defense: 7, chakra: 7 },
      moves: [
        { input: '→ → A / → → J', name: 'Flame Wheel'  },
        { input: '↓ → A / ↓ → J', name: 'Ember Rush'   },
        { input: '↑ A / ↑ J',     name: 'Phoenix Rise' },
      ],
      hitboxes: { stand: { w: 46, h: 78 }, attack: { w: 62, h: 38, ox: 30 } },
    },
  ];

  // --- Map data ---
  mapData = [
    {
      name: 'Hidden Leaf Village',
      bgColor: '#1a2a0a',
      layers: ['#0d1f05', '#1a3a0d', '#2a5215'],
      groundY: 0.78,
      accentColor: '#33ff55',
    },
    {
      name: 'Valley of the End',
      bgColor: '#0a0a2a',
      layers: ['#050518', '#0d0d30', '#1a1a50'],
      groundY: 0.80,
      accentColor: '#4455ff',
    },
    {
      name: 'Sand Village Dunes',
      bgColor: '#2a1a00',
      layers: ['#1a0f00', '#2e1c00', '#4a2e00'],
      groundY: 0.76,
      accentColor: '#ffaa22',
    },
    {
      name: 'Rooftop Showdown',
      bgColor: '#0a0a0a',
      layers: ['#050505', '#111111', '#1e1e1e'],
      groundY: 0.72,
      accentColor: '#ff4400',
    },
  ];

  // --- Audio context + sounds ---
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  } catch (e) {
    audioCtx = null;
  }

  const soundFiles = {
    hit:       null,
    block:     null,
    special:   null,
    ko:        null,
    roundWin:  null,
    select:    null,
  };

  // Synthesise simple procedural sounds so the game works without asset files
  function synthSound(type) {
    if (!audioCtx) return null;
    const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.25, audioCtx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const t = i / audioCtx.sampleRate;
      let s = 0;
      if (type === 'hit')      s = Math.sin(2 * Math.PI * 220 * t) * Math.exp(-20 * t);
      else if (type === 'block') s = Math.sin(2 * Math.PI * 440 * t) * Math.exp(-30 * t);
      else if (type === 'special') s = Math.sin(2 * Math.PI * (880 - 600 * t) * t) * Math.exp(-8 * t);
      else if (type === 'ko')  s = Math.sin(2 * Math.PI * (110 + 40 * t) * t) * Math.exp(-5 * t);
      else if (type === 'roundWin') s = Math.sin(2 * Math.PI * (330 + 200 * t) * t) * Math.exp(-6 * t);
      else if (type === 'select') s = Math.sin(2 * Math.PI * 660 * t) * Math.exp(-40 * t);
      data[i] = Math.max(-1, Math.min(1, s));
    }
    return buf;
  }

  Object.keys(soundFiles).forEach(name => {
    sounds[name] = synthSound(name);
  });

  // --- Build move-list content ---
  function buildMoveList() {
    if (!els.movelistContent) return;
    const c1 = characterRoster[selectedChars[0]];
    const c2 = characterRoster[selectedChars[1]];
    const fmt = (char, player) => `
      <div class="movelist-player" style="color:${char.color}">
        <strong>${player}: ${char.name}</strong>
        <ul>${char.moves.map(m => `<li><kbd>${m.input}</kbd> ${m.name}</li>`).join('')}</ul>
      </div>`;
    els.movelistContent.innerHTML = fmt(c1, 'P1') + fmt(c2, 'P2');
  }
  // Expose so startMatch can call it after char selection is finalised
  window._buildMoveList = buildMoveList;

  // --- Attach all event listeners (defined in 05_events.js) ---
  attachEventListeners();

  // --- Kick off ---
  showScreen('screen-menu');
  startMenuParticles();
});