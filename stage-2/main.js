// ========== IMPORTS ==========
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

// ========== KEYBOARD HANDLER ==========
function onKeyDown(e) {
  if (state.phase !== 'fighting') return;

  // ── MOVEMENT: arrow keys ──
  if (!state.locked) {
    if (e.key === 'ArrowLeft'  && state.playerPosition > 1) state.playerPosition--;
    if (e.key === 'ArrowRight' && state.playerPosition < 3) state.playerPosition++;
    render(state);
  }

  // ── ATTACKS: WASD keys ──
  const moveButtons = document.querySelectorAll('.move-btn');
  if (e.key === 'w' || e.key === 'W') moveButtons[0]?.click();
  if (e.key === 'a' || e.key === 'A') moveButtons[1]?.click();
  if (e.key === 's' || e.key === 'S') moveButtons[2]?.click();
  if (e.key === 'd' || e.key === 'D') moveButtons[3]?.click();

  // ── DEFINITIVE MOVE: Q key ──
  if (e.key === 'q' || e.key === 'Q') {
    document.getElementById('definitive-btn')?.click();
  }
}

// ========== CHECK END WRAPPER ==========
function checkEnd() {
  checkBattleEnd((won) => {
    document.removeEventListener('keydown', onKeyDown);
    showEndScreen(won);
  });
}

// ========== START BATTLE ==========
function startBattle() {
  render(state);
  renderInitialNames(state);

  document.addEventListener('keydown', onKeyDown);

  buildMoveButtons(state.player.moves, (move, cooldownBarEl) => {
    playerAttack(move, render, checkEnd, cooldownBarEl);
  });

  document.getElementById('definitive-btn').addEventListener('click', () => {
    playerDefinitive(render, checkEnd);
  });

  scheduleNextAttack(render, checkEnd);
}

// ========== BATTLE AGAIN ==========
document.getElementById('battle-again-btn').addEventListener('click', () => {
  hideEndScreen();
  resetState();
  document.addEventListener('keydown', onKeyDown);
  render(state);
  scheduleNextAttack(render, checkEnd);
});

// ========== CHOOSE ANOTHER POKEMON ==========
document.getElementById('choose-pokemon-btn').addEventListener('click', () => {
  window.location.href = '../stage-1/index.html';
});

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
  const loaded = loadBattleData();

  if (!loaded) {
    document.getElementById('battle-main').innerHTML = `
      <div style="text-align:center; padding:3rem; font-family:'Press Start 2P',monospace; font-size:0.5rem; color:#E84040;">
        <p>No battle data found.</p>
        <br>
        <a href="../stage-1/index.html" style="color:#705898;">Go to Stage 1 first</a>
      </div>`;
    return;
  }

  startBattle();
});