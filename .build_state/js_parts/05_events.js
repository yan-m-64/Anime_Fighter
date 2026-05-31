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