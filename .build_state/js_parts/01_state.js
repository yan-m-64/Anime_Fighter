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