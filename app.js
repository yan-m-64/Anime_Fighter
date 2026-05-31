// === State ===

const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 720;
const GROUND_Y = 580;
const GRAVITY = 0.6;
const JUMP_FORCE = -16;
const MOVE_SPEED = 4.5;
const MAX_HEALTH = 100;
const MAX_CHAKRA = 100;
const ROUND_DURATION = 99;
const MAX_ROUNDS = 3;
const WINS_TO_MATCH = 2;
const DELTA_CAP = 50;
const CHAKRA_REGEN_RATE = 0.08;
const CHAKRA_SPECIAL_COST = 30;
const ATTACK_DURATION = 18;
const HURT_DURATION = 14;
const BLOCK_DRAIN = 5;
const GHOST_DRAIN_SPEED = 0.4;
const KNOCKBACK_X = 7;
const KNOCKBACK_Y = -4;

const FIGHTER_STATES = {
  IDLE: 'idle',
  RUN: 'run',
  JUMP: 'jump',
  FALL: 'fall',
  ATTACK_LIGHT: 'attack_light',
  ATTACK_HEAVY: 'attack_heavy',
  SPECIAL: 'special',
  BLOCK: 'block',
  HURT: 'hurt',
  KO: 'ko'
};

const PARTICLE_TYPES = {
  HIT: 'hit',
  BLOCK: 'block',
  SPECIAL: 'special',
  KO: 'ko',
  CHAKRA: 'chakra',
  MENU: 'menu'
};

const ANIM_FRAMES = {
  idle:         { frames: 4, fps: 8 },
  run:          { frames: 6, fps: 12 },
  jump:         { frames: 3, fps: 10 },
  fall:         { frames: 2, fps: 8 },
  attack_light: { frames: 4, fps: 18 },
  attack_heavy: { frames: 5, fps: 14 },
  special:      { frames: 6, fps: 16 },
  block:        { frames: 2, fps: 6 },
  hurt:         { frames: 2, fps: 10 },
  ko:           { frames: 3, fps: 6 }
};

const CHARACTER_ROSTER = [
  {
    id: 'naruto',
    name: 'Naruto',
    color: '#ff7400',
    accentColor: '#ffaa00',
    stats: { power: 8, speed: 7, defense: 6, chakra: 9 },
    specialName: 'Rasengan',
    hitbox: { w: 60, h: 110 },
    attackBoxLight: { w: 80, h: 50, offsetX: 50, offsetY: 30 },
    attackBoxHeavy: { w: 100, h: 60, offsetX: 55, offsetY: 20 },
    attackBoxSpecial: { w: 120, h: 70, offsetX: 60, offsetY: 25 },
    damageLight: 8,
    damageHeavy: 15,
    damageSpecial: 25
  },
  {
    id: 'sasuke',
    name: 'Sasuke',
    color: '#3a2e6e',
    accentColor: '#7c4dff',
    stats: { power: 9, speed: 9, defense: 7, chakra: 8 },
    specialName: 'Chidori',
    hitbox: { w: 58, h: 112 },
    attackBoxLight: { w: 75, h: 48, offsetX: 50, offsetY: 32 },
    attackBoxHeavy: { w: 95, h: 58, offsetX: 55, offsetY: 22 },
    attackBoxSpecial: { w: 130, h: 65, offsetX: 65, offsetY: 30 },
    damageLight: 9,
    damageHeavy: 17,
    damageSpecial: 28
  },
  {
    id: 'sakura',
    name: 'Sakura',
    color: '#e91e8c',
    accentColor: '#ff64c8',
    stats: { power: 10, speed: 6, defense: 8, chakra: 7 },
    specialName: 'Cherry Punch',
    hitbox: { w: 55, h: 108 },
    attackBoxLight: { w: 70, h: 50, offsetX: 48, offsetY: 30 },
    attackBoxHeavy: { w: 105, h: 65, offsetX: 58, offsetY: 18 },
    attackBoxSpecial: { w: 110, h: 80, offsetX: 50, offsetY: 20 },
    damageLight: 10,
    damageHeavy: 20,
    damageSpecial: 30
  },
  {
    id: 'kakashi',
    name: 'Kakashi',
    color: '#4a4a5a',
    accentColor: '#00cfff',
    stats: { power: 9, speed: 8, defense: 9, chakra: 8 },
    specialName: 'Lightning Blade',
    hitbox: { w: 60, h: 115 },
    attackBoxLight: { w: 78, h: 50, offsetX: 52, offsetY: 32 },
    attackBoxHeavy: { w: 98, h: 62, offsetX: 56, offsetY: 24 },
    attackBoxSpecial: { w: 140, h: 60, offsetX: 70, offsetY: 30 },
    damageLight: 9,
    damageHeavy: 16,
    damageSpecial: 27
  }
];

const MAP_LIST = [
  {
    id: 'leaf_village',
    name: 'Leaf Village',
    bgColor: '#1a2a0a',
    layerColors: ['#0d1a05', '#1a3310', '#2a4a1a'],
    accentColor: '#4caf50',
    groundColor: '#3e2a10'
  },
  {
    id: 'valley_end',
    name: 'Valley of the End',
    bgColor: '#0a0a1a',
    layerColors: ['#050510', '#0d0d2a', '#1a1a3a'],
    accentColor: '#7c4dff',
    groundColor: '#1a0a2a'
  },
  {
    id: 'sand_desert',
    name: 'Sand Village',
    bgColor: '#1a1000',
    layerColors: ['#0d0800', '#2a1a00', '#3a2a05'],
    accentColor: '#ff7400',
    groundColor: '#4a3010'
  },
  {
    id: 'hidden_mist',
    name: 'Hidden Mist',
    bgColor: '#071520',
    layerColors: ['#030a12', '#0a1e30', '#10304a'],
    accentColor: '#00cfff',
    groundColor: '#0a2030'
  }
];

const KEY_BINDINGS = {
  p1: {
    left:        'KeyA',
    right:       'KeyD',
    jump:        'KeyW',
    block:       'KeyS',
    attackLight: 'KeyJ',
    attackHeavy: 'KeyK',
    special:     'KeyL'
  },
  p2: {
    left:        'ArrowLeft',
    right:       'ArrowRight',
    jump:        'ArrowUp',
    block:       'ArrowDown',
    attackLight: 'Numpad1',
    attackHeavy: 'Numpad2',
    special:     'Numpad3'
  }
};

const AI_REACTION_DELAY = 8;
const AI_ATTACK_RANGE = 140;
const AI_JUMP_CHANCE = 0.015;
const AI_SPECIAL_CHAKRA_THRESHOLD = 50;

let gameState = 'menu';

let selectedChars = [0, 1];
let selectedMap = 0;
let charSelectCursor = 0;

let roundTimer = ROUND_DURATION;
let roundNum = 1;
let isAIMode = false;

let animationFrameId = null;
let lastTimestamp = 0;

let keys = {};

let particles = [];

let sounds = {};
let audioCtx = null;

let menuParticleTimer = 0;

const makeFighterState = (startX, facingRight) => ({
  x: startX,
  y: GROUND_Y,
  vx: 0,
  vy: 0,
  health: MAX_HEALTH,
  healthGhost: MAX_HEALTH,
  chakra: MAX_CHAKRA,
  state: FIGHTER_STATES.IDLE,
  facingRight,
  frameIndex: 0,
  frameTimer: 0,
  stateTimer: 0,
  wins: 0,
  charIndex: 0,
  isGrounded: true,
  blocking: false,
  attackActive: false,
  hitThisSwing: false,
  aiReactionTimer: 0,
  aiIntent: null
});

let p1 = makeFighterState(300, true);
let p2 = makeFighterState(980, false);

// === DOM refs ===

const screenMenu = document.getElementById('screen-menu');
const screenHowtoplay = document.getElementById('screen-howtoplay');
const screenCharselect = document.getElementById('screen-charselect');
const screenMapselect = document.getElementById('screen-mapselect');
const screenGame = document.getElementById('screen-game');
const screenRoundwin = document.getElementById('screen-roundwin');
const screenMatchwin = document.getElementById('screen-matchwin');
const screenPause = document.getElementById('screen-pause');

const menuParticles = document.getElementById('menuParticles');
const btnVsPlayer = document.getElementById('btnVsPlayer');
const btnVsAI = document.getElementById('btnVsAI');
const btnHowToPlay = document.getElementById('btnHowToPlay');
const btnHowBack = document.getElementById('btnHowBack');

const p1Portrait = document.getElementById('p1Portrait');
const p1PreviewCanvas = document.getElementById('p1PreviewCanvas');
const p1Name = document.getElementById('p1Name');
const p1Stats = document.getElementById('p1Stats');
const charGrid = document.getElementById('charGrid');
const p2Portrait = document.getElementById('p2Portrait');
const p2PreviewCanvas = document.getElementById('p2PreviewCanvas');
const p2Name = document.getElementById('p2Name');
const p2Stats = document.getElementById('p2Stats');
const selectionStatus = document.getElementById('selectionStatus');
const btnCharNext = document.getElementById('btnCharNext');
const btnCharBack = document.getElementById('btnCharBack');

const mapGrid = document.getElementById('mapGrid');
const mapPreviewName = document.getElementById('mapPreviewName');
const btnMapBack = document.getElementById('btnMapBack');
const btnFight = document.getElementById('btnFight');

const hudP1Name = document.getElementById('hudP1Name');
const healthBarP1 = document.getElementById('healthBarP1');
const healthFillP1 = document.getElementById('healthFillP1');
const healthGhostP1 = document.getElementById('healthGhostP1');
const chakraBarP1 = document.getElementById('chakraBarP1');
const chakraFillP1 = document.getElementById('chakraFillP1');
const roundCounter = document.getElementById('roundCounter');
const pip1_1 = document.getElementById('pip1-1');
const pip1_2 = document.getElementById('pip1-2');
const roundNumEl = document.getElementById('roundNum');
const pip2_1 = document.getElementById('pip2-1');
const pip2_2 = document.getElementById('pip2-2');
const timerEl = document.getElementById('timer');
const hudP2Name = document.getElementById('hudP2Name');
const healthBarP2 = document.getElementById('healthBarP2');
const healthFillP2 = document.getElementById('healthFillP2');
const healthGhostP2 = document.getElementById('healthGhostP2');
const chakraBarP2 = document.getElementById('chakraBarP2');
const chakraFillP2 = document.getElementById('chakraFillP2');

const gameCanvas = document.getElementById('gameCanvas');
const ctx = gameCanvas.getContext('2d');

const roundAnnounce = document.getElementById('roundAnnounce');
const announceText = document.getElementById('announceText');
const announceSub = document.getElementById('announceSub');

const movelistOverlay = document.getElementById('movelistOverlay');
const movelistContent = document.getElementById('movelistContent');
const movelistToggle = document.getElementById('movelistToggle');
const pauseBtn = document.getElementById('pauseBtn');

const koText = document.getElementById('koText');
const winnerText = document.getElementById('winnerText');
const roundScore = document.getElementById('roundScore');

const victorName = document.getElementById('victorName');
const victorPortrait = document.getElementById('victorPortrait');
const victorCanvas = document.getElementById('victorCanvas');
const btnRematch = document.getElementById('btnRematch');
const btnMenuFromWin = document.getElementById('btnMenuFromWin');
const victoryParticles = document.getElementById('victoryParticles');

const btnResume = document.getElementById('btnResume');
const btnRestartMatch = document.getElementById('btnRestartMatch');
const btnMenuFromPause = document.getElementById('btnMenuFromPause');

const allScreens = document.querySelectorAll('.screen');

// === Core actions ===

const ROUND_DURATION = 99;
const GRAVITY = 1800;
const JUMP_VY = -700;

let lastTimestamp = 0;

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
    gameState = id.replace('screen-', '');
}

function initCharSelect() {
    charSelectCursor = 0;
    selectedChars[0] = 0;
    selectedChars[1] = 1;
    charGrid.innerHTML = '';
    roster.forEach((char, i) => {
        const card = document.createElement('div');
        card.className = 'char-card';
        card.dataset.index = i;
        card.style.cssText = `background:${char.color};border:2px solid #333;border-radius:8px;padding:10px;cursor:pointer;text-align:center;color:#fff;font-weight:bold;`;
        card.innerHTML = `<div style="font-size:13px;margin-top:4px;">${char.name}</div>`;
        charGrid.appendChild(card);
    });
    renderCharPreview(0, 0);
    renderCharPreview(1, 1);
    updateSelectionStatus();
}

function renderCharPreview(player, charIndex) {
    const char = roster[charIndex];
    if (!char) return;
    if (player === 0) {
        if (p1Portrait) p1Portrait.style.background = char.color;
        if (p1Name) p1Name.textContent = char.name;
        if (p1Stats) p1Stats.innerHTML =
            `<div>Speed: ${'★'.repeat(char.speed)}</div>` +
            `<div>Power: ${'★'.repeat(char.power)}</div>` +
            `<div>Defense: ${'★'.repeat(char.defense)}</div>`;
        if (p1PreviewCanvas) drawPreviewChar(p1PreviewCanvas, char, true);
    } else {
        if (p2Portrait) p2Portrait.style.background = char.color;
        if (p2Name) p2Name.textContent = char.name;
        if (p2Stats) p2Stats.innerHTML =
            `<div>Speed: ${'★'.repeat(char.speed)}</div>` +
            `<div>Power: ${'★'.repeat(char.power)}</div>` +
            `<div>Defense: ${'★'.repeat(char.defense)}</div>`;
        if (p2PreviewCanvas) drawPreviewChar(p2PreviewCanvas, char, false);
    }
}

function drawPreviewChar(canvas, char, facingRight) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.save();
    if (!facingRight) { ctx.translate(w, 0); ctx.scale(-1, 1); }
    const bx = w * 0.28, by = h * 0.3, bw = w * 0.42, bh = h * 0.38;
    ctx.fillStyle = char.color;
    ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 7); ctx.fill();
    ctx.strokeStyle = '#000'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = char.skinColor || '#f4c87a';
    ctx.beginPath(); ctx.arc(bx + bw / 2, by - 18, 18, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#000'; ctx.stroke();
    ctx.fillStyle = char.legColor || '#1a1a40';
    ctx.fillRect(bx + 4, by + bh, bw * 0.38, h * 0.22);
    ctx.fillRect(bx + bw * 0.52, by + bh, bw * 0.38, h * 0.22);
    ctx.fillStyle = char.accentColor || '#ffaa00';
    ctx.fillRect(bx, by, bw, 8);
    ctx.restore();
}

function updateSelectionStatus() {
    if (!selectionStatus) return;
    if (charSelectCursor === 0) selectionStatus.textContent = 'P1 — Choose your fighter!';
    else if (charSelectCursor === 1) selectionStatus.textContent = 'P2 — Choose your fighter!';
    else selectionStatus.textContent = 'Both ready! Press Next to continue.';
}

function initMapSelect() {
    mapGrid.innerHTML = '';
    maps.forEach((map, i) => {
        const thumb = document.createElement('div');
        thumb.className = 'map-thumb' + (i === selectedMap ? ' selected' : '');
        thumb.dataset.index = i;
        thumb.style.cssText = `background:${map.bgColor};border:3px solid ${i === selectedMap ? '#ff7400' : '#333'};border-radius:8px;padding:8px 12px;cursor:pointer;color:#fff;font-weight:bold;text-align:center;`;
        thumb.textContent = map.name;
        mapGrid.appendChild(thumb);
    });
    if (mapPreviewName) mapPreviewName.textContent = maps[selectedMap]?.name || '';
}

function createFighter(charIndex, startX, facingRight) {
    const char = roster[charIndex] || roster[0];
    return {
        charIndex, char,
        x: startX, y: 0,
        vx: 0, vy: 0,
        health: 100, chakra: 50,
        state: 'idle',
        facingRight,
        frameIndex: 0, frameTimer: 0,
        attackTimer: 0, hurtTimer: 0,
        isAttacking: false, isBlocking: false, isGrounded: true,
        attackBox: null,
        wins: 0,
        hitbox: { w: 58, h: 110 },
        intent: {}
    };
}

function startMatch() {
    cancelAnimationFrame(animationFrameId);
    const cw = gameCanvas.width;
    const savedWins = [p1 ? p1.wins : 0, p2 ? p2.wins : 0];
    p1 = createFighter(selectedChars[0], cw * 0.22, true);
    p2 = createFighter(selectedChars[1], cw * 0.72, false);
    p1.wins = savedWins[0];
    p2.wins = savedWins[1];
    roundNum = 1;
    roundTimer = ROUND_DURATION;
    particles.length = 0;
    updatePips();
    showScreen('screen-game');
    showRoundAnnounce('ROUND 1', 'FIGHT!', 1600);
    lastTimestamp = 0;
    animationFrameId = requestAnimationFrame(gameLoop);
}

function resetRound() {
    const cw = gameCanvas.width;
    roundTimer = ROUND_DURATION;
    particles.length = 0;
    const p1Wins = p1.wins, p2Wins = p2.wins;
    p1 = createFighter(selectedChars[0], cw * 0.22, true);
    p2 = createFighter(selectedChars[1], cw * 0.72, false);
    p1.wins = p1Wins;
    p2.wins = p2Wins;
    lastTimestamp = 0;
    animationFrameId = requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp) {
    if (gameState !== 'game') return;
    const rawDelta = timestamp - (lastTimestamp || timestamp);
    lastTimestamp = timestamp;
    const delta = Math.min(rawDelta, 50) / 1000;

    processInput();
    if (isAIMode) runAI(p2, p1);
    updateFighter(p1, p2, delta);
    updateFighter(p2, p1, delta);
    checkCollisions();
    tickTimer(delta);
    updateParticles(delta);
    updateHUD();
    renderFrame();

    animationFrameId = requestAnimationFrame(gameLoop);
}

function processInput() {
    p1.intent = {
        left:    !!keys['KeyA'],
        right:   !!keys['KeyD'],
        jump:    !!keys['KeyW'],
        block:   !!keys['KeyS'],
        attack:  !!keys['KeyG'],
        special: !!keys['KeyH']
    };
    p2.intent = {
        left:    !!keys['ArrowLeft'],
        right:   !!keys['ArrowRight'],
        jump:    !!keys['ArrowUp'],
        block:   !!keys['ArrowDown'],
        attack:  !!keys['KeyK'],
        special: !!keys['KeyL']
    };
}

function updateFighter(f, opponent, delta) {
    const cw = gameCanvas.width, ch = gameCanvas.height;
    const groundY = ch - f.hitbox.h - 22;
    const speed = (f.char.speed || 3) * 65;

    if (f.hurtTimer > 0) { f.hurtTimer -= delta; if (f.hurtTimer < 0) f.hurtTimer = 0; }
    if (f.attackTimer > 0) {
        f.attackTimer -= delta;
        if (f.attackTimer <= 0) {
            f.attackTimer = 0; f.isAttacking = false; f.attackBox = null;
        }
    }

    const canAct = f.hurtTimer <= 0 && f.attackTimer <= 0;

    // Face opponent
    if (f.x + f.hitbox.w / 2 < opponent.x + opponent.hitbox.w / 2) f.facingRight = true;
    else f.facingRight = false;

    if (canAct) {
        if (f.intent.block && f.isGrounded) {
            f.isBlocking = true;
            f.vx = 0;
            f.state = 'block';
        } else {
            f.isBlocking = false;
            if (f.intent.left && !f.intent.right) {
                f.vx = -speed;
                if (f.isGrounded) f.state = 'run';
            } else if (f.intent.right && !f.intent.left) {
                f.vx = speed;
                if (f.isGrounded) f.state = 'run';
            } else {
                f.vx = 0;
                if (f.isGrounded && f.state === 'run') f.state = 'idle';
            }
            if (f.intent.jump && f.isGrounded) {
                f.vy = JUMP_VY; f.isGrounded = false; f.state = 'jump';
                playSound('jump');
            }
            if (f.intent.special && !f.isAttacking && f.chakra >= 25) {
                triggerAttack(f, 'special');
                f.chakra -= 25;
            } else if (f.intent.attack && !f.isAttacking) {
                triggerAttack(f, 'attack');
            }
        }
    }

    if (!f.isGrounded) { f.vy += GRAVITY * delta; f.state = f.state !== 'attack' && f.state !== 'special' ? 'jump' : f.state; }
    f.x += f.vx * delta;
    f.y += f.vy * delta;

    if (f.y >= groundY) {
        f.y = groundY; f.vy = 0; f.isGrounded = true;
        if (f.state === 'jump') f.state = 'idle';
    }

    f.x = Math.max(0, Math.min(cw - f.hitbox.w, f.x));

    if (f.isGrounded && !['run','attack','special','hurt','block'].includes(f.state)) f.state = 'idle';

    f.chakra = Math.min(100, f.chakra + 6 * delta);

    const frameDur   = { idle:0.15, run:0.1, jump:0.14, attack:0.08, special:0.08, hurt:0.1, block:0.15 };
    const frameCount = { idle:4,    run:6,   jump:3,    attack:4,    special:5,    hurt:3,   block:2    };
    f.frameTimer += delta;
    const dur = frameDur[f.state] || 0.12;
    if (f.frameTimer >= dur) {
        f.frameTimer = 0;
        f.frameIndex = (f.frameIndex + 1) % (frameCount[f.state] || 4);
    }
}

function triggerAttack(f, type) {
    f.isAttacking = true;
    f.state = type;
    f.frameIndex = 0; f.frameTimer = 0;
    f.attackTimer = type === 'special' ? 0.48 : 0.28;
    const reach = type === 'special' ? 88 : 62;
    const offX = f.facingRight ? f.hitbox.w - 4 : -(reach - 4);
    f.attackBox = {
        x: f.x + offX, y: f.y + 18, w: reach, h: 64,
        damage: type === 'special' ? (f.char.power || 3) * 4 : (f.char.power || 3) * 2,
        knockback: type === 'special' ? 340 : 190,
        type, used: false
    };
    if (type === 'special') spawnParticles(f.x + f.hitbox.w / 2, f.y + 55, 'chakra');
    playSound(type === 'special' ? 'special' : 'attack');
}

function checkCollisions() {
    resolveAttack(p1, p2);
    resolveAttack(p2, p1);
}

function resolveAttack(attacker, defender) {
    const ab = attacker.attackBox;
    if (!ab || ab.used) return;
    const dx = ab.x < defender.x + defender.hitbox.w && ab.x + ab.w > defender.x;
    const dy = ab.y < defender.y + defender.hitbox.h && ab.y + ab.h > defender.y;
    if (!dx || !dy) return;
    ab.used = true;

    if (defender.isBlocking) {
        defender.health = Math.max(0, defender.health - Math.round(ab.damage * 0.12));
        spawnParticles(defender.x + defender.hitbox.w / 2, defender.y + 45, 'block');
        playSound('block');
    } else {
        defender.health = Math.max(0, defender.health - ab.damage);
        defender.hurtTimer = 0.22;
        defender.vx = attacker.facingRight ? ab.knockback : -ab.knockback;
        spawnParticles(defender.x + defender.hitbox.w / 2, defender.y + 50, ab.type === 'special' ? 'special_hit' : 'hit');
        playSound('hit');
        if (defender.health <= 0) endRound(attacker);
    }
}

function tickTimer(delta) {
    if (roundTimer <= 0) return;
    roundTimer = Math.max(0, roundTimer - delta);
    if (roundTimer <= 0) {
        if (p1.health > p2.health) endRound(p1);
        else if (p2.health > p1.health) endRound(p2);
        else endRound(null);
    }
}

function updateHUD() {
    if (healthFillP1) healthFillP1.style.width = Math.max(0, p1.health) + '%';
    if (healthFillP2) healthFillP2.style.width = Math.max(0, p2.health) + '%';
    if (healthGhostP1) healthGhostP1.style.width = Math.max(0, p1.health) + '%';
    if (healthGhostP2) healthGhostP2.style.width = Math.max(0, p2.health) + '%';
    if (chakraFillP1) chakraFillP1.style.width = Math.max(0, Math.min(100, p1.chakra)) + '%';
    if (chakraFillP2) chakraFillP2.style.width = Math.max(0, Math.min(100, p2.chakra)) + '%';
    if (timerEl) timerEl.textContent = Math.ceil(roundTimer).toString().padStart(2, '0');
    if (roundNumEl) roundNumEl.textContent = roundNum;
}

function updatePips() {
    [[pip1_1, pip1_2], [pip2_1, pip2_2]].forEach((pips, pi) => {
        const wins = pi === 0 ? p1.wins : p2.wins;
        pips.forEach((pip, i) => {
            if (!pip) return;
            pip.style.background = i < wins ? '#ff7400' : 'rgba(255,255,255,0.15)';
            pip.style.boxShadow = i < wins ? '0 0 8px #ff7400' : 'none';
        });
    });
}

function endRound(winner) {
    cancelAnimationFrame(animationFrameId);
    gameState = 'roundwin';

    if (winner === p1) {
        p1.wins++;
        if (koText) koText.textContent = 'K.O.!';
        if (winnerText) winnerText.textContent = (p1.char?.name || 'P1') + ' wins the round!';
    } else if (winner === p2) {
        p2.wins++;
        if (koText) koText.textContent = 'K.O.!';
        if (winnerText) winnerText.textContent = (p2.char?.name || 'P2') + ' wins the round!';
    } else {
        if (koText) koText.textContent = 'TIME OUT!';
        if (winnerText) winnerText.textContent = 'Double K.O. — Draw!';
    }

    updatePips();
    if (roundScore) roundScore.textContent = `P1  ${p1.wins} — ${p2.wins}  P2`;

    if (p1.wins >= 2 || p2.wins >= 2) {
        setTimeout(() => endMatch(p1.wins >= 2 ? p1 : p2), 1800);
    } else {
        roundNum++;
        showScreen('screen-roundwin');
    }
}

function endMatch(winner) {
    showScreen('screen-matchwin');
    const char = winner.char;
    if (victorName) victorName.textContent = char?.name || (winner === p1 ? 'Player 1' : 'Player 2');
    if (victorPortrait) victorPortrait.style.background = char?.color || '#ff7400';
    if (victorCanvas && char) drawPreviewChar(victorCanvas, char, true);
    spawnVictoryParticles();
}

function spawnVictoryParticles() {
    if (!victoryParticlesEl) return;
    victoryParticlesEl.innerHTML = '';
    const colors = ['#ff7400','#ffaa00','#00cfff','#ffffff','#cc00ff'];
    for (let i = 0; i < 28; i++) {
        const dot = document.createElement('div');
        const size = 6 + Math.random() * 10;
        dot.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:50%;` +
            `background:${colors[Math.floor(Math.random() * colors.length)]};` +
            `left:${Math.random() * 100}%;top:${100 + Math.random() * 20}%;` +
            `animation:floatUp ${0.8 + Math.random() * 1.2}s ease-out ${Math.random() * 0.6}s forwards;opacity:0;`;
        victoryParticlesEl.appendChild(dot);
    }
}

function spawnParticles(x, y, type) {
    const cfg = {
        hit:         { n:8,  colors:['#ff7400','#ffaa00','#fff'], spd:210, life:0.38, sz:6 },
        block:       { n:6,  colors:['#00cfff','#fff'],           spd:160, life:0.28, sz:5 },
        chakra:      { n:14, colors:['#ff7400','#ff6a00','#ffd'], spd:260, life:0.55, sz:9 },
        special_hit: { n:18, colors:['#ff7400','#fff','#c0f'],    spd:310, life:0.65, sz:11 },
        jump:        { n:4,  colors:['#aaa','#fff'],               spd:90,  life:0.22, sz:4 }
    }[type] || { n:8, colors:['#ff7400','#fff'], spd:200, life:0.4, sz:6 };

    for (let i = 0; i < cfg.n; i++) {
        const angle = (Math.PI * 2 * i / cfg.n) + Math.random() * 0.6;
        const spd = cfg.spd * (0.5 + Math.random() * 0.8);
        particles.push({
            x, y,
            vx: Math.cos(angle) * spd,
            vy: Math.sin(angle) * spd - 70,
            life: cfg.life, maxLife: cfg.life,
            color: cfg.colors[Math.floor(Math.random() * cfg.colors.length)],
            size: cfg.sz * (0.6 + Math.random() * 0.8)
        });
    }
}

function updateParticles(delta) {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx * delta;
        p.y += p.vy * delta;
        p.vy += 380 * delta;
        p.life -= delta;
        if (p.life <= 0) particles.splice(i, 1);
    }
}

function renderFrame() {
    if (!gameCanvas) return;
    const ctx = gameCanvas.getContext('2d');
    const cw = gameCanvas.width, ch = gameCanvas.height;
    const map = maps[selectedMap] || maps[0];
    const groundY = ch - 22;

    ctx.fillStyle = map.bgColor || '#0d0d1a';
    ctx.fillRect(0, 0, cw, ch);

    if (map.layers) {
        map.layers.forEach(layer => {
            const offset = (Date.now() * layer.speed * 0.0006) % cw;
            ctx.globalAlpha = layer.alpha || 0.6;
            ctx.fillStyle = layer.color;
            ctx.fillRect(-offset, ch * layer.yRatio, cw + offset, ch * layer.hRatio);
            ctx.fillRect(cw - offset, ch * layer.yRatio, cw, ch * layer.hRatio);
        });
        ctx.globalAlpha = 1;
    }

    ctx.fillStyle = map.groundColor || '#1a0800';
    ctx.fillRect(0, groundY, cw, ch - groundY);
    ctx.fillStyle = map.groundLine || '#ff7400';
    ctx.fillRect(0, groundY, cw, 3);

    drawFighterSprite(ctx, p1, ch);
    drawFighterSprite(ctx, p2, ch);

    particles.forEach(p => {
        ctx.globalAlpha = Math.max(0, p.life / p.maxLife) * 0.9;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;
}

function drawFighterSprite(ctx, f, ch) {
    const groundY = ch - 22;
    const fy = groundY - f.hitbox.h;
    const fw = f.hitbox.w, fh = f.hitbox.h;
    const char = f.char;
    const bob = f.state === 'idle' ? Math.sin(Date.now() * 0.005) * 3 : 0;
    const flash = f.hurtTimer > 0 && Math.floor(Date.now() / 55) % 2 === 0;

    ctx.save();
    ctx.translate(f.x + fw / 2, fy);
    if (!f.facingRight) ctx.scale(-1, 1);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.beginPath();
    ctx.ellipse(0, fh + 5, fw * 0.42, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Legs
    ctx.fillStyle = flash ? '#fff' : (char.legColor || '#1a1a40');
    if (f.state === 'run') {
        const sw = Math.sin(Date.now() * 0.018) * 14;
        ctx.fillRect(-fw * 0.38, fh * 0.6 + sw, fw * 0.3, fh * 0.4);
        ctx.fillRect(fw * 0.08, fh * 0.6 - sw, fw * 0.3, fh * 0.4);
    } else if (f.state === 'jump') {
        ctx.fillRect(-fw * 0.38, fh * 0.58, fw * 0.3, fh * 0.32);
        ctx.fillRect(fw * 0.08, fh * 0.58, fw * 0.3, fh * 0.32);
    } else {
        ctx.fillRect(-fw * 0.38, fh * 0.6 + bob, fw * 0.3, fh * 0.4);
        ctx.fillRect(fw * 0.08, fh * 0.6 + bob, fw * 0.3, fh * 0.4);
    }

    // Body
    ctx.fillStyle = flash ? '#fff' : (char.color || '#ff7400');
    ctx.beginPath();
    ctx.roundRect(-fw * 0.4, fh * 0.28 + bob, fw * 0.8, fh * 0.36, 7);
    ctx.fill();
    ctx.strokeStyle = '#000'; ctx.lineWidth = 2; ctx.stroke();

    // Accent stripe
    ctx.fillStyle = char.accentColor || '#ffaa00';
    ctx.fillRect(-fw * 0.4, fh * 0.28 + bob, fw * 0.8, 6);

    // Head
    ctx.fillStyle = flash ? '#fff' : (char.skinColor || '#f4c87a');
    ctx.beginPath();
    ctx.arc(0, fh * 0.18 + bob, fw * 0.26, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#000'; ctx.lineWidth = 2; ctx.stroke();

    // Eye
    ctx.fillStyle = char.eyeColor || '#cc2200';
    ctx.beginPath();
    ctx.arc(fw * 0.1, fh * 0.15 + bob, 4, 0, Math.PI * 2);
    ctx.fill();

    // Attack effect
    if (f.isAttacking && f.state === 'special') {
        ctx.strokeStyle = char.accentColor || '#ff7400';
        ctx.lineWidth = 5; ctx.globalAlpha = 0.75;
        ctx.beginPath();
        ctx.moveTo(fw * 0.42, fh * 0.38 + bob);
        ctx.quadraticCurveTo(fw * 0.9, fh * 0.3 + Math.sin(Date.now() * 0.025) * 14, fw * 1.4, fh * 0.38 + bob);
        ctx.stroke();
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = char.accentColor || '#ff7400';
        ctx.beginPath();
        ctx.arc(fw * 1.2, fh * 0.38, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    } else if (f.isAttacking) {
        ctx.fillStyle = '#ffcc00'; ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.arc(fw * 0.9, fh * 0.4 + bob, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    // Block shield
    if (f.isBlocking) {
        ctx.fillStyle = 'rgba(0,207,255,0.28)';
        ctx.strokeStyle = '#00cfff'; ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(fw * 0.46, fh * 0.46, 20, 34, 0, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
    }

    ctx.restore();
}

function showRoundAnnounce(text, sub, duration) {
    if (!roundAnnounce) return;
    if (announceText) announceText.textContent = text;
    if (announceSub) announceSub.textContent = sub;
    roundAnnounce.classList.add('active');
    setTimeout(() => roundAnnounce.classList.remove('active'), duration);
}

function runAI(f, opponent) {
    if (f.health <= 0 || f.hurtTimer > 0) { f.intent = {}; return; }
    const dx = (opponent.x + opponent.hitbox.w / 2) - (f.x + f.hitbox.w / 2);
    const absDx = Math.abs(dx);
    const intent = {};
    const attackRange = 85;

    if (f.health < 22 && absDx < 140) {
        intent.left = dx > 0;
        intent.right = dx < 0;
    } else if (absDx > attackRange + 15) {
        intent.left = dx < 0;
        intent.right = dx > 0;
    }

    if (f.isGrounded && Math.random() < 0.007) intent.jump = true;

    if (absDx < attackRange) {
        if (opponent.isAttacking && Math.random() < 0.38) {
            intent.block = true;
        } else if (f.chakra >= 25 && Math.random() < 0.018) {
            intent.special = true;
        } else if (Math.random() < 0.055) {
            intent.attack = true;
        }
    }

    f.intent = intent;
}

function playSound(name) {
    if (!sounds[name] || !audioCtx) return;
    try {
        const src = audioCtx.createBufferSource();
        src.buffer = sounds[name];
        src.connect(audioCtx.destination);
        src.start(0);
    } catch (_) {}
}

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

// === Events ===

window.addEventListener('keydown', e => {
  keys[e.code] = true;
  if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'ArrowDown') {
    e.preventDefault();
  }
});

window.addEventListener('keyup', e => {
  keys[e.code] = false;
});

btnVsPlayer.addEventListener('click', () => {
  isAIMode = false;
  charSelectCursor = 0;
  initCharSelect();
  showScreen('screen-charselect');
});

btnVsAI.addEventListener('click', () => {
  isAIMode = true;
  charSelectCursor = 0;
  initCharSelect();
  showScreen('screen-charselect');
});

btnHowToPlay.addEventListener('click', () => {
  showScreen('screen-howtoplay');
});

btnHowBack.addEventListener('click', () => {
  showScreen('screen-menu');
});

btnCharBack.addEventListener('click', () => {
  if (charSelectCursor === 1) {
    charSelectCursor = 0;
    renderCharPreview(0, selectedChars[0]);
    selectionStatus.textContent = 'P1 — Choose your fighter';
  } else {
    showScreen('screen-menu');
  }
});

btnCharNext.addEventListener('click', () => {
  if (charSelectCursor === 0) {
    if (selectedChars[0] === null || selectedChars[0] === undefined) return;
    if (isAIMode) {
      selectedChars[1] = Math.floor(Math.random() * roster.length);
      initMapSelect();
      showScreen('screen-mapselect');
    } else {
      charSelectCursor = 1;
      renderCharPreview(1, selectedChars[1] !== undefined ? selectedChars[1] : 0);
      selectionStatus.textContent = 'P2 — Choose your fighter';
    }
  } else if (charSelectCursor === 1) {
    if (selectedChars[1] === null || selectedChars[1] === undefined) return;
    initMapSelect();
    showScreen('screen-mapselect');
  }
});

charGrid.addEventListener('click', e => {
  const card = e.target.closest('.char-card');
  if (!card) return;
  const idx = parseInt(card.dataset.index, 10);
  if (isNaN(idx)) return;
  selectedChars[charSelectCursor] = idx;
  document.querySelectorAll('.char-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  renderCharPreview(charSelectCursor, idx);
});

btnMapBack.addEventListener('click', () => {
  if (isAIMode) {
    charSelectCursor = 0;
    initCharSelect();
    showScreen('screen-charselect');
  } else {
    charSelectCursor = 1;
    showScreen('screen-charselect');
  }
});

btnFight.addEventListener('click', () => {
  if (selectedMap === null || selectedMap === undefined) return;
  startMatch();
});

mapGrid.addEventListener('click', e => {
  const thumb = e.target.closest('.map-thumb');
  if (!thumb) return;
  const idx = parseInt(thumb.dataset.index, 10);
  if (isNaN(idx)) return;
  selectedMap = idx;
  document.querySelectorAll('.map-thumb').forEach(t => t.classList.remove('selected'));
  thumb.classList.add('selected');
  mapPreviewName.textContent = maps[idx] ? maps[idx].name : '';
  btnFight.disabled = false;
});

pauseBtn.addEventListener('click', () => {
  if (gameState === 'game') {
    gameState = 'pause';
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    showScreen('screen-pause');
  }
});

btnResume.addEventListener('click', () => {
  gameState = 'game';
  showScreen('screen-game');
  animationFrameId = requestAnimationFrame(gameLoop);
});

btnRestartMatch.addEventListener('click', () => {
  gameState = 'game';
  showScreen('screen-game');
  startMatch();
});

btnRematch.addEventListener('click', () => {
  startMatch();
});

btnMenuFromWin.addEventListener('click', () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  gameState = 'menu';
  showScreen('screen-menu');
});

btnMenuFromPause.addEventListener('click', () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  gameState = 'menu';
  showScreen('screen-menu');
});

movelistToggle.addEventListener('click', () => {
  const isVisible = movelistOverlay.style.display === 'flex';
  movelistOverlay.style.display = isVisible ? 'none' : 'flex';
  movelistToggle.textContent = isVisible ? '📋 Moves' : '✕ Close';
});

// === Validation/Polish ===

(function () {

  // ── Clamp helpers ──────────────────────────────────────────────────────────
  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  function clampFighter(f) {
    if (!f || !gameCanvas) return;
    const hw = (f.width || 60) / 2;
    f.x = clamp(f.x, hw, gameCanvas.width - hw);
    f.y = clamp(f.y, 0, GROUND_Y !== undefined ? GROUND_Y : gameCanvas.height - 80);
    f.health = clamp(f.health, 0, 100);
    f.chakra = clamp(f.chakra, 0, 100);
  }

  function clampTimer() {
    if (typeof roundTimer !== 'undefined') {
      roundTimer = Math.max(0, Math.floor(roundTimer));
    }
  }

  // ── HUD fill guard ─────────────────────────────────────────────────────────
  function safeSetFill(el, value) {
    if (!el) return;
    el.style.width = clamp(value, 0, 100) + '%';
  }

  // ── Override updateHUD to add clamping ──────────────────────────────────────
  const _origUpdateHUD = typeof updateHUD === 'function' ? updateHUD : null;
  updateHUD = function () {
    if (typeof p1 !== 'undefined') clampFighter(p1);
    if (typeof p2 !== 'undefined') clampFighter(p2);
    clampTimer();

    if (_origUpdateHUD) {
      try { _origUpdateHUD(); } catch (e) { console.warn('[HUD]', e); }
    } else {
      safeSetFill(healthFillP1,  p1 ? p1.health  : 100);
      safeSetFill(healthFillP2,  p2 ? p2.health  : 100);
      safeSetFill(chakraFillP1,  p1 ? p1.chakra  : 100);
      safeSetFill(chakraFillP2,  p2 ? p2.chakra  : 100);
      if (timer) timer.textContent = typeof roundTimer !== 'undefined' ? roundTimer : '--';
    }
  };

  // ── charSelectCursor guard: both players must pick before advancing ─────────
  const _origBtnFight = document.getElementById('btnFight');
  if (_origBtnFight) {
    _origBtnFight.addEventListener('click', function (e) {
      if (typeof selectedChars === 'undefined' ||
          selectedChars[0] == null || selectedChars[1] == null) {
        e.stopImmediatePropagation();
        showSelectionWarning();
      }
    }, true);
  }

  function showSelectionWarning() {
    const el = document.getElementById('selectionStatus');
    if (!el) return;
    const prev = el.textContent;
    el.textContent = 'Both players must select a fighter!';
    el.style.color = '#ff1a1a';
    setTimeout(function () {
      el.textContent = prev;
      el.style.color = '';
    }, 1800);
  }

  // ── AI guard: runAI is a no-op when isAIMode is false ──────────────────────
  const _origRunAI = typeof runAI === 'function' ? runAI : null;
  runAI = function (f, opponent) {
    if (!isAIMode) return;
    if (_origRunAI) {
      try { _origRunAI(f, opponent); } catch (e) { console.warn('[AI]', e); }
    }
  };

  // ── RAF / gameLoop error boundary ──────────────────────────────────────────
  const _origGameLoop = typeof gameLoop === 'function' ? gameLoop : null;
  if (_origGameLoop) {
    gameLoop = function (timestamp) {
      try {
        _origGameLoop(timestamp);
      } catch (e) {
        console.error('[gameLoop]', e);
        if (typeof animationFrameId !== 'undefined') {
          cancelAnimationFrame(animationFrameId);
        }
        const el = document.getElementById('announceText');
        if (el) el.textContent = 'An error occurred — please restart.';
      }
    };
  }

  // ── localStorage persistence ───────────────────────────────────────────────
  const LS_KEY = 'animeFighter_prefs';

  function savePrefs() {
    try {
      const prefs = {
        p1Char: Array.isArray(selectedChars) ? selectedChars[0] : null,
        p2Char: Array.isArray(selectedChars) ? selectedChars[1] : null,
        map:    typeof selectedMap !== 'undefined' ? selectedMap : 0,
        aiMode: typeof isAIMode   !== 'undefined' ? isAIMode    : false
      };
      localStorage.setItem(LS_KEY, JSON.stringify(prefs));
    } catch (_) {}
  }

  function loadPrefs() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const prefs = JSON.parse(raw);
      if (Array.isArray(selectedChars)) {
        if (prefs.p1Char != null) selectedChars[0] = prefs.p1Char;
        if (prefs.p2Char != null) selectedChars[1] = prefs.p2Char;
      }
      if (typeof selectedMap !== 'undefined' && prefs.map != null) selectedMap = prefs.map;
      if (typeof isAIMode   !== 'undefined' && prefs.aiMode != null) isAIMode = !!prefs.aiMode;
    } catch (_) {}
  }

  // ── Win-streak / match history ─────────────────────────────────────────────
  const HIST_KEY = 'animeFighter_history';

  function recordMatchResult(winnerLabel) {
    try {
      const hist = JSON.parse(localStorage.getItem(HIST_KEY) || '[]');
      hist.push({ winner: winnerLabel, ts: Date.now() });
      if (hist.length > 50) hist.splice(0, hist.length - 50);
      localStorage.setItem(HIST_KEY, JSON.stringify(hist));
    } catch (_) {}
  }

  // Hook into endMatch to persist results
  const _origEndMatch = typeof endMatch === 'function' ? endMatch : null;
  endMatch = function (winner) {
    if (winner && winner.name) recordMatchResult(winner.name);
    savePrefs();
    if (_origEndMatch) {
      try { _origEndMatch(winner); } catch (e) { console.warn('[endMatch]', e); }
    }
  };

  // ── Expose utilities for other modules ────────────────────────────────────
  window._af = window._af || {};
  Object.assign(window._af, { clamp, clampFighter, savePrefs, loadPrefs, safeSetFill });

  // ── Boot ──────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    loadPrefs();
  }, { once: true });

})();

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