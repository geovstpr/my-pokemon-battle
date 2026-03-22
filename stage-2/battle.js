// stage-2/battle.js
// Battle state object + all loop/timer logic.

import TRAINER from '../trainer.config.js';

// ── BATTLE STATE ──
export let state = {
  playerHP:         0,
  playerMaxHP:      0,
  opponentHP:       0,
  opponentMaxHP:    0,
  playerPosition:   2,          // 1, 2, or 3
  locked:           false,       // true during attack lock window
  definitiveUsed:   false,
  attackOnCooldown: false,
  phase:            'fighting',  // 'fighting' | 'ended'
  incomingAttack:   null,        // null or 1|2|3
  log:              [],
  player:           null,        // raw data from localStorage
  opponent:         null,
};

// ── TIMER REFERENCES (must be cleared on battle end) ──
let attackTimeout = null;

// ── HELPER: Promise-based wait ──
export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ── DAMAGE FORMULAS ──
export function calcPlayerDamage(movePower) {
  const power = movePower ?? 60;
  return Math.floor(power * 0.3) + Math.floor(Math.random() * power * 0.4);
}

export function calcEnemyDamage(opponent) {
  return Math.floor(opponent.attack * 0.4) + Math.floor(Math.random() * 20);
}

// ── LOAD DATA FROM LOCALSTORAGE ──
export function loadBattleData() {
  const raw = localStorage.getItem('battleData');
  if (!raw) return false;
  const data = JSON.parse(raw);

  state.player   = data.player;
  state.opponent = data.opponent;

  state.playerHP      = data.player.hp;
  state.playerMaxHP   = data.player.hp;
  state.opponentHP    = data.opponent.hp;
  state.opponentMaxHP = data.opponent.hp;

  return true;
}

// ── ENEMY ATTACK LOOP (recursive setTimeout) ──
export async function scheduleNextAttack(renderFn, checkEndFn) {
  if (state.phase !== 'fighting') return;

  const delay = (3 + Math.random() * 7) * 1000; // 3–10 seconds
  attackTimeout = setTimeout(async () => {
    await resolveEnemyAttack(renderFn, checkEndFn);
    scheduleNextAttack(renderFn, checkEndFn); // chain next
  }, delay);
}

async function resolveEnemyAttack(renderFn, checkEndFn) {
  if (state.phase !== 'fighting') return;

  const targetCell = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
  state.incomingAttack = targetCell;
  state.locked = false;

  state.log.push({ text: `👻 Enemy targets cell ${targetCell}!`, type: 'hit' });
  renderFn(state);

  await wait(600); // warning window — player can still move

  state.locked = true;
  renderFn(state);

  if (state.playerPosition === targetCell) {
    const dmg = calcEnemyDamage(state.opponent);
    state.playerHP = Math.max(0, state.playerHP - dmg);
    state.log.push({ text: `💥 Hit! You took ${dmg} damage.`, type: 'hit' });
  } else {
    state.log.push({ text: `✅ Dodged!`, type: 'dodge' });
  }

  state.incomingAttack = null;
  state.locked = false;

  checkEndFn();
  renderFn(state);
}

// ── PLAYER FIRES A MOVE ──
export function playerAttack(move, renderFn, checkEndFn, cooldownBarEl) {
  if (state.attackOnCooldown || state.phase !== 'fighting') return;

  const dmg = calcPlayerDamage(move.power);
  state.opponentHP = Math.max(0, state.opponentHP - dmg);
  state.log.push({ text: `⚡ You used ${move.name} — ${dmg} damage!`, type: 'attack' });

  const cooldownMs = (2 + Math.random() * 2) * 1000; // 2–4 seconds
  startCooldown(cooldownMs, cooldownBarEl, renderFn);

  checkEndFn();
  renderFn(state);
}

// ── DEFINITIVE MOVE ──
export function playerDefinitive(renderFn, checkEndFn) {
  if (state.definitiveUsed || state.phase !== 'fighting') return;
  state.definitiveUsed = true;
  state.opponentHP = 0;
  state.log.push({ text: `💀 PHANTOM AMBUSH! Instant KO!`, type: 'attack' });
  checkEndFn();
  renderFn(state);
}

// ── COOLDOWN PROGRESS BAR (requestAnimationFrame) ──
function startCooldown(durationMs, barEl, renderFn) {
  const start = performance.now();
  state.attackOnCooldown = true;
  renderFn(state);

  function tick(now) {
    const elapsed = now - start;
    const pct = Math.min(elapsed / durationMs, 1);
    if (barEl) barEl.style.width = `${(1 - pct) * 100}%`; // bar drains left

    if (pct < 1) {
      requestAnimationFrame(tick);
    } else {
      state.attackOnCooldown = false;
      if (barEl) barEl.style.width = '0%';
      renderFn(state);
    }
  }

  requestAnimationFrame(tick);
}

// ── CHECK BATTLE END ──
export function checkBattleEnd(showEndFn) {
  if (state.playerHP <= 0 || state.opponentHP <= 0) {
    state.phase = 'ended';
    clearTimeout(attackTimeout);
    const won = state.opponentHP <= 0;
    state.log.push({ text: won ? TRAINER.winMessage : TRAINER.loseMessage, type: 'end' });
    showEndFn(won);
  }
}

// ── RESET STATE (Battle Again, no page reload) ──
export function resetState() {
  clearTimeout(attackTimeout);
  state.playerHP        = state.playerMaxHP;
  state.opponentHP      = state.opponentMaxHP;
  state.playerPosition  = 2;
  state.locked          = false;
  state.definitiveUsed  = false;
  state.attackOnCooldown = false;
  state.phase           = 'fighting';
  state.incomingAttack  = null;
  state.log             = [];
}