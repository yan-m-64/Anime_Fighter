// === Render ===

function updateHUD() {
  const p1Pct = Math.max(0, Math.min(100, p1.health));
  const p2Pct = Math.max(0, Math.min(100, p2.health));

  healthFillP1.style.width = p1Pct + '%';
  healthFillP2.style.width = p2Pct + '%';

  // Ghost bars drain toward current health
  const g1 = parseFloat(healthGhostP1.style.width) || 100;
  healthGhostP1.style.width = (g1 > p1Pct ? Math.max(p1Pct, g1 - 0.28) : p1Pct) + '%';
  const g2 = parseFloat(healthGhostP2.style.width) || 100;
  healthGhostP2.style.width = (g2 > p2Pct ? Math.max(p2Pct, g2 - 0.28) : p2Pct) + '%';

  healthFillP1.style.background = healthGradient(p1Pct);
  healthFillP2.style.background = healthGradient(p2Pct);

  chakraFillP1.style.width = Math.max(0, Math.min(100, p1.chakra)) + '%';
  chakraFillP2.style.width = Math.max(0, Math.min(100, p2.chakra)) + '%';

  const secs = Math.max(0, Math.ceil(roundTimer));
  timerEl.textContent = secs;
  timerEl.style.color = secs <= 10 ? '#ff1a1a' : '#f0eeff';

  roundNumEl.textContent = 'ROUND ' + roundNum;

  pip1_1.className = 'pip' + (p1.wins >= 1 ? ' pip-won' : '');
  pip1_2.className = 'pip' + (p1.wins >= 2 ? ' pip-won' : '');
  pip2_1.className = 'pip' + (p2.wins >= 1 ? ' pip-won' : '');
  pip2_2.className = 'pip' + (p2.wins >= 2 ? ' pip-won' : '');
}

function healthGradient(pct) {
  if (pct > 60) return 'linear-gradient(90deg,#2ecc40,#7fff00)';
  if (pct > 30) return 'linear-gradient(90deg,#ff851b,#ffaa00)';
  return 'linear-gradient(90deg,#ff1a1a,#ff4444)';
}

function updateParticles(delta) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx * delta * 0.06;
    p.y += p.vy * delta * 0.06;
    p.vy += 0.22;
    p.life -= delta;
    p.alpha = Math.max(0, p.life / p.maxLife);
    if (p.life <= 0) particles.splice(i, 1);
  }
}

function renderFrame(ctx) {
  const W = gameCanvas.width;
  const H = gameCanvas.height;
  const groundY = H - 80;

  ctx.clearRect(0, 0, W, H);
  drawBackground(ctx, W, H, groundY);
  drawFighterShadow(ctx, p1, groundY);
  drawFighterShadow(ctx, p2, groundY);
  drawFighter(ctx, p1, false);
  drawFighter(ctx, p2, true);
  drawParticles(ctx);
}

function drawBackground(ctx, W, H, groundY) {
  const map = MAPS[selectedMap] || MAPS[0];

  const skyGrd = ctx.createLinearGradient(0, 0, 0, groundY);
  skyGrd.addColorStop(0, map.skyTop);
  skyGrd.addColorStop(1, map.skyBottom);
  ctx.fillStyle = skyGrd;
  ctx.fillRect(0, 0, W, groundY);

  const floorGrd = ctx.createLinearGradient(0, groundY, 0, H);
  floorGrd.addColorStop(0, map.groundTop);
  floorGrd.addColorStop(1, map.groundBottom);
  ctx.fillStyle = floorGrd;
  ctx.fillRect(0, groundY, W, H - groundY);

  // Parallax orb layer
  const t = Date.now() * 0.00038;
  ctx.save();
  for (let i = 0; i < map.orbData.length; i++) {
    const o = map.orbData[i];
    const ox = ((o.x * W + t * o.speed * W) % W + W) % W;
    const oy = o.y * groundY;
    const grd = ctx.createRadialGradient(ox, oy, 0, ox, oy, o.r);
    grd.addColorStop(0, o.color + 'bb');
    grd.addColorStop(1, o.color + '00');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(ox, oy, o.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Silhouette mid-layer
  ctx.save();
  ctx.fillStyle = map.midColor;
  for (const s of map.midShapes) {
    ctx.fillRect(s.x * W, s.y * H, s.w * W, s.h * H);
  }
  ctx.restore();

  // Ground edge glow
  ctx.save();
  const edgeGrd = ctx.createLinearGradient(0, groundY - 3, 0, groundY + 10);
  edgeGrd.addColorStop(0, map.glowColor + 'cc');
  edgeGrd.addColorStop(1, map.glowColor + '00');
  ctx.fillStyle = edgeGrd;
  ctx.fillRect(0, groundY - 2, W, 12);
  ctx.restore();
}

function drawFighterShadow(ctx, fighter, groundY) {
  const cx = fighter.x + fighter.width * 0.5;
  const airDist = Math.abs(fighter.y + fighter.height - groundY);
  const scale = Math.max(0.15, 1 - airDist / 220);
  const sw = fighter.width * 0.52 * scale;
  const sh = 7 * scale;
  const grd = ctx.createRadialGradient(cx, groundY, 0, cx, groundY, sw);
  grd.addColorStop(0, 'rgba(0,0,0,0.5)');
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.ellipse(cx, groundY, sw, sh, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawFighter(ctx, fighter, isP2) {
  const char = ROSTER[fighter.charIndex] || ROSTER[0];
  const x = Math.round(fighter.x);
  const y = Math.round(fighter.y);
  const w = fighter.width;
  const h = fighter.height;

  ctx.save();

  if (!fighter.facingRight) {
    ctx.translate(x + w * 0.5, y + h * 0.5);
    ctx.scale(-1, 1);
    ctx.translate(-(x + w * 0.5), -(y + h * 0.5));
  }

  if (fighter.state === 'hurt') {
    ctx.globalAlpha = 0.4 + 0.6 * ((Math.sin(Date.now() * 0.09) + 1) * 0.5);
  }

  const body   = char.color;
  const accent = char.accent;
  const skin   = char.skinColor || '#f5c2a0';
  const hair   = char.hairColor || '#1a1a1a';

  if (fighter.state === 'special') drawChakraAura(ctx, x, y, w, h, accent);

  // Legs
  ctx.fillStyle = body;
  ctx.fillRect(x + w * 0.22, y + h * 0.62, w * 0.2,  h * 0.38);
  ctx.fillRect(x + w * 0.56, y + h * 0.62, w * 0.2,  h * 0.38);
  ctx.fillStyle = accent;
  ctx.fillRect(x + w * 0.22, y + h * 0.85, w * 0.2,  h * 0.055);
  ctx.fillRect(x + w * 0.56, y + h * 0.85, w * 0.2,  h * 0.055);

  // Torso
  ctx.fillStyle = body;
  ctx.fillRect(x + w * 0.18, y + h * 0.32, w * 0.64, h * 0.32);
  ctx.fillStyle = accent;
  ctx.fillRect(x + w * 0.37, y + h * 0.32, w * 0.07, h * 0.32);

  // Arms — pose depends on state
  ctx.fillStyle = skin;
  if (fighter.state === 'attack') {
    ctx.fillRect(x + w * 0.82, y + h * 0.33, w * 0.34, h * 0.11);
    ctx.fillRect(x + w * 0.04, y + h * 0.38, w * 0.15, h * 0.22);
    ctx.beginPath();
    ctx.arc(x + w * 1.16, y + h * 0.385, w * 0.085, 0, Math.PI * 2);
    ctx.fill();
  } else if (fighter.state === 'special') {
    ctx.fillRect(x + w * 0.82, y + h * 0.30, w * 0.28, h * 0.10);
    ctx.fillRect(x + w * 0.82, y + h * 0.44, w * 0.28, h * 0.10);
  } else if (fighter.state === 'block') {
    ctx.fillRect(x + w * 0.72, y + h * 0.22, w * 0.14, h * 0.32);
    ctx.fillRect(x + w * 0.72, y + h * 0.22, w * 0.30, h * 0.11);
    ctx.fillRect(x + w * 0.05, y + h * 0.38, w * 0.15, h * 0.18);
  } else if (fighter.state === 'jump') {
    ctx.fillRect(x - w * 0.10, y + h * 0.36, w * 0.22, h * 0.10);
    ctx.fillRect(x + w * 0.88, y + h * 0.36, w * 0.22, h * 0.10);
  } else {
    const swing = fighter.state === 'run' ? Math.sin(Date.now() * 0.016) * 0.09 : 0;
    ctx.fillRect(x + w * 0.82, y + h * (0.34 + swing),  w * 0.14, h * 0.24);
    ctx.fillRect(x + w * 0.04, y + h * (0.34 - swing),  w * 0.14, h * 0.24);
  }

  // Head
  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.arc(x + w * 0.5, y + h * 0.19, w * 0.21, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = hair;
  drawHairStyle(ctx, char.hairStyle, x, y, w, h);

  // Eye
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.arc(x + w * 0.60, y + h * 0.17, w * 0.053, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0a0a0a';
  ctx.beginPath();
  ctx.arc(x + w * 0.60, y + h * 0.17, w * 0.027, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.beginPath();
  ctx.arc(x + w * 0.614, y + h * 0.163, w * 0.01, 0, Math.PI * 2);
  ctx.fill();

  // Ink outlines
  ctx.strokeStyle = '#111';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x + w * 0.18, y + h * 0.32, w * 0.64, h * 0.32);
  ctx.beginPath();
  ctx.arc(x + w * 0.5, y + h * 0.19, w * 0.21, 0, Math.PI * 2);
  ctx.stroke();

  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawHairStyle(ctx, style, x, y, w, h) {
  const s = (style || 0) % 4;
  if (s === 0) {
    // Spiky — Naruto
    ctx.fillRect(x + w * 0.29, y + h * 0.02, w * 0.43, h * 0.10);
    for (let i = 0; i < 5; i++) {
      const bx = x + w * (0.31 + i * 0.10);
      ctx.beginPath();
      ctx.moveTo(bx, y + h * 0.09);
      ctx.lineTo(bx - w * 0.055, y - h * 0.05);
      ctx.lineTo(bx + w * 0.055, y - h * 0.05);
      ctx.closePath();
      ctx.fill();
    }
  } else if (s === 1) {
    // Long — Sasuke
    ctx.fillRect(x + w * 0.29, y - h * 0.055, w * 0.42, h * 0.145);
    ctx.fillRect(x + w * 0.63, y + h * 0.04, w * 0.13, h * 0.30);
  } else if (s === 2) {
    // Short wild
    ctx.beginPath();
    ctx.arc(x + w * 0.5, y + h * 0.10, w * 0.25, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x + w * 0.27, y + h * 0.07, w * 0.47, h * 0.13);
  } else {
    // Top-knot
    ctx.fillRect(x + w * 0.31, y + h * 0.00, w * 0.38, h * 0.12);
    ctx.fillRect(x + w * 0.43, y - h * 0.135, w * 0.15, h * 0.15);
  }
}

function drawChakraAura(ctx, x, y, w, h, color) {
  const cx = x + w * 0.5;
  const cy = y + h * 0.5;
  const r  = w * 0.88;
  const alpha = 0.22 + 0.18 * Math.sin(Date.now() * 0.007);
  const grd = ctx.createRadialGradient(cx, cy, r * 0.08, cx, cy, r);
  grd.addColorStop(0, color + 'cc');
  grd.addColorStop(0.45, color + '66');
  grd.addColorStop(1, color + '00');
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawParticles(ctx) {
  ctx.save();
  for (const p of particles) {
    if (p.alpha <= 0) continue;
    ctx.globalAlpha = p.alpha;
    ctx.shadowBlur = p.glow ? 10 : 0;
    ctx.shadowColor = p.color;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(0.5, p.size * p.alpha), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  ctx.restore();
}

function renderCharPreview(player, charIndex) {
  const char = ROSTER[charIndex];
  if (!char) return;
  const isP2 = player === 1;

  const canvas    = isP2 ? p2PreviewCanvas : p1PreviewCanvas;
  const nameEl    = isP2 ? p2Name          : p1Name;
  const statsEl   = isP2 ? p2Stats         : p1Stats;
  const portraitEl = isP2 ? p2Portrait     : p1Portrait;

  nameEl.textContent = char.name;
  portraitEl.style.borderColor = char.color;
  portraitEl.style.boxShadow   = '0 0 20px ' + char.color + '88';

  statsEl.innerHTML =
    buildStatRow('Power',   char.stats.power,   char.color)  +
    buildStatRow('Speed',   char.stats.speed,   char.accent) +
    buildStatRow('Defense', char.stats.defense, '#7744ff')   +
    buildStatRow('Chakra',  char.stats.chakra,  '#00ffe0');

  if (!canvas) return;
  canvas.width  = canvas.offsetWidth  || 160;
  canvas.height = canvas.offsetHeight || 200;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  ctx.clearRect(0, 0, W, H);

  const bgGrd = ctx.createRadialGradient(W * 0.5, H * 0.9, 4, W * 0.5, H * 0.5, W * 0.68);
  bgGrd.addColorStop(0, char.color + '55');
  bgGrd.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = bgGrd;
  ctx.fillRect(0, 0, W, H);

  drawFighter(ctx, {
    x: W * 0.14,
    y: H * 0.06,
    width:  W * 0.72,
    height: H * 0.88,
    state: 'idle',
    facingRight: !isP2,
    charIndex: charIndex,
    chakra: 0
  }, isP2);
}

function buildStatRow(label, val, color) {
  return '<div class="stat-row"><span>' + label + '</span>' +
    '<div class="stat-bar"><div style="width:' + val + '%;background:' + color +
    ';height:100%;border-radius:3px;transition:width .3s"></div></div></div>';
}

// Menu particle system
let menuParticleList = [];
let menuAnimId = null;
let menuPCanvas = null;
let menuPCtx = null;

function initMenuParticles() {
  menuPCanvas = document.getElementById('menuParticles');
  if (!menuPCanvas) return;
  menuPCanvas.width  = window.innerWidth;
  menuPCanvas.height = window.innerHeight;
  menuPCtx = menuPCanvas.getContext('2d');
  menuParticleList = [];
  for (let i = 0; i < 58; i++) menuParticleList.push(newMenuParticle(true));
  if (menuAnimId) cancelAnimationFrame(menuAnimId);
  tickMenuParticles();
}

function newMenuParticle(scatter) {
  const W = menuPCanvas ? menuPCanvas.width : 800;
  const H = menuPCanvas ? menuPCanvas.height : 600;
  const pal = ['#ff7400','#ffaa00','#ff6a00','#7b2fff','#00c6ff','#ffffff'];
  return {
    x: Math.random() * W,
    y: scatter ? Math.random() * H : H + 8,
    vx: (Math.random() - 0.5) * 0.65,
    vy: -(0.45 + Math.random() * 1.3),
    r: 1.2 + Math.random() * 2.8,
    alpha: 0.35 + Math.random() * 0.65,
    color: pal[Math.floor(Math.random() * pal.length)]
  };
}

function tickMenuParticles() {
  if (gameState !== 'menu') { menuAnimId = null; return; }
  if (!menuPCtx) return;
  const W = menuPCanvas.width;
  const H = menuPCanvas.height;
  menuPCtx.clearRect(0, 0, W, H);
  for (let i = 0; i < menuParticleList.length; i++) {
    const p = menuParticleList[i];
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 0.0024;
    if (p.y < -10 || p.alpha <= 0) { menuParticleList[i] = newMenuParticle(false); continue; }
    menuPCtx.save();
    menuPCtx.globalAlpha = p.alpha;
    menuPCtx.shadowBlur  = 8;
    menuPCtx.shadowColor = p.color;
    menuPCtx.fillStyle   = p.color;
    menuPCtx.beginPath();
    menuPCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    menuPCtx.fill();
    menuPCtx.restore();
  }
  menuAnimId = requestAnimationFrame(tickMenuParticles);
}