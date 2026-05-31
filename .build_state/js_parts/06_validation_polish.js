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