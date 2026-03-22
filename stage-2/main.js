// stage-2/main.js
// Entry point for Stage 2 — wires everything together.

import {
  state,
  loadBattleData,
  scheduleNextAttack,
  playerAttack,
  playerDefinitive,
  checkBattleEnd,
  resetState,
} from './battle.js';

import {
  render,
  renderInitialNames,
  showEndScreen,
  hideEndScreen,
  buildMoveButtons,
} from './render.js';

// ── KEYBOARD HANDLER (registered once) ──
function onKeyDown(e) {
  if (state.phase !== 'fighting') return;
  if (state.locked) return; // ignore during lock window

  if (e.key === 'ArrowLeft'  && state.playerPosition > 1) state.playerPosition--;
  if (e.key === 'ArrowRight' && state.playerPosition < 3) state.playerPosition++;

  render(state);
}

// ── CHECK END WRAPPER ──
function checkEnd() {
  checkBattleEnd((won) => {
    document.removeEventListener('keydown', onKeyDown);
    showEndScreen(won);
  });
}

// ── START BATTLE ──
function startBattle() {
  render(state);
  renderInitialNames(state);
  document.addEventListener('keydown', onKeyDown);

  // Build move buttons from player's moves
  buildMoveButtons(state.player.moves, (move, cooldownBarEl) => {
    playerAttack(move, render, checkEnd, cooldownBarEl);
  });

  // Definitive Move button
  document.getElementById('definitive-btn').addEventListener('click', () => {
    playerDefinitive(render, checkEnd);
  });

  // Set the definitive button label from TRAINER (already hardcoded in HTML but good practice)
  scheduleNextAttack(render, checkEnd);
}

// ── BATTLE AGAIN ──
document.getElementById('battle-again-btn').addEventListener('click', () => {
  hideEndScreen();
  resetState();
  document.addEventListener('keydown', onKeyDown);
  render(state);
  scheduleNextAttack(render, checkEnd);
});

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  const loaded = loadBattleData();

  if (!loaded) {
    document.getElementById('battle-main').innerHTML = `
      <div style="text-align:center; padding:3rem; color:#E84040;">
        <p>No battle data found.</p>
        <a href="../stage-1/index.html" style="color:#A566E8;">← Go to Stage 1 first</a>
      </div>`;
    return;
  }

  startBattle();
});