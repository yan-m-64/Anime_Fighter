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