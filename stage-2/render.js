// ========== RENDER ==========
// Only this file touches the DOM.

// ========== MAIN RENDER FUNCTION ==========
export function render(state) {
  renderHP(state);
  renderArena(state);
  renderControls(state);
  renderLog(state);
}

// ========== HP BARS ==========
function renderHP(state) {
  const playerPct   = Math.max(0, (state.playerHP / state.playerMaxHP) * 100).toFixed(1);
  const opponentPct = Math.max(0, (state.opponentHP / state.opponentMaxHP) * 100).toFixed(1);

  document.getElementById('player-hp-bar').style.width   = `${playerPct}%`;
  document.getElementById('opponent-hp-bar').style.width = `${opponentPct}%`;
  document.getElementById('player-hp-val').textContent   = `${state.playerHP} / ${state.playerMaxHP}`;
  document.getElementById('opponent-hp-val').textContent = `${state.opponentHP} / ${state.opponentMaxHP}`;
}

// ========== ARENA ==========
function renderArena(state) {
  // Player row
  const playerCells = document.querySelectorAll('#player-row .arena-cell');
  playerCells.forEach(cell => {
    const pos = parseInt(cell.dataset.pos);
    cell.className = 'arena-cell';
    cell.innerHTML = '';

    if (pos === state.playerPosition) {
      cell.classList.add('player-here');
      if (state.player?.sprite) {
        const img = document.createElement('img');
        img.src = state.player.sprite;
        img.alt = state.player.name;
        cell.appendChild(img);
      }
    }

    if (pos === state.incomingAttack) {
      cell.classList.add(state.locked ? 'strike' : 'warning');
    }
  });

  // Opponent row — fixed at center
  const oppCells = document.querySelectorAll('#opponent-row .arena-cell');
  oppCells.forEach(cell => {
    cell.className = 'arena-cell';
    cell.innerHTML = '';
    if (state.opponent?.sprite) {
      const img = document.createElement('img');
      img.src = state.opponent.sprite;
      img.alt = state.opponent.name;
      cell.appendChild(img);
    }
  });
}

// ========== CONTROLS ==========
function renderControls(state) {
  const buttons = document.querySelectorAll('.move-btn');
  buttons.forEach(btn => {
    btn.disabled = state.attackOnCooldown || state.phase !== 'fighting';
  });

  const defBtn = document.getElementById('definitive-btn');
  defBtn.disabled = state.definitiveUsed || state.phase !== 'fighting';
}

// ========== BATTLE LOG ==========
function renderLog(state) {
  const logEl = document.getElementById('battle-log');
  logEl.innerHTML = state.log.map(entry =>
    `<div class="log-entry ${entry.type}">${entry.text}</div>`
  ).join('');
  logEl.scrollTop = logEl.scrollHeight;
}

// ========== INITIAL NAMES ==========
export function renderInitialNames(state) {
  const playerDisplayName = state.player.nickname || state.player.name;
  document.getElementById('player-name').textContent   = playerDisplayName;
  document.getElementById('opponent-name').textContent = state.opponent.name;
}

// ========== END SCREEN ==========
export function showEndScreen(won) {
  const screen = document.getElementById('end-screen');
  const msg    = document.getElementById('end-message');
  screen.classList.remove('hidden');
  msg.textContent = won ? 'Victory!' : 'Defeated...';
  msg.style.color = won ? '#42C97A' : '#E84040';
}

export function hideEndScreen() {
  document.getElementById('end-screen').classList.add('hidden');
}

// ========== BUILD MOVE BUTTONS ==========
export function buildMoveButtons(moves, onMoveFire) {
  const panel = document.getElementById('moves-panel');
  const keys  = ['W', 'A', 'S', 'D'];
  panel.innerHTML = '';
  moves.forEach((move, index) => {
    const btn = document.createElement('button');
    btn.className = 'move-btn';
    btn.innerHTML = `
      <span class="move-key">${keys[index]}</span>
      ${move.name}
      <span class="move-power">PWR: ${move.power ?? '--'}</span>
      <div class="cooldown-bar" style="width:0%"></div>
    `;
    const cooldownBar = btn.querySelector('.cooldown-bar');
    btn.addEventListener('click', () => onMoveFire(move, cooldownBar));
    panel.appendChild(btn);
  });
}