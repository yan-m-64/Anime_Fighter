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