// stage-2/render.js
// All DOM writes for Stage 2 live here. Only render(state) touches the DOM.

/**
 * Main render function — called every time state changes.
 * This is the ONLY place DOM is written.
 */
export function render(state) {
  renderHP(state);
  renderArena(state);
  renderControls(state);
  renderLog(state);
}

function renderHP(state) {
  const playerPct   = Math.max(0, (state.playerHP / state.playerMaxHP) * 100).toFixed(1);
  const opponentPct = Math.max(0, (state.opponentHP / state.opponentMaxHP) * 100).toFixed(1);

  document.getElementById('player-hp-bar').style.width   = `${playerPct}%`;
  document.getElementById('opponent-hp-bar').style.width = `${opponentPct}%`;
  document.getElementById('player-hp-val').textContent   = `${state.playerHP} / ${state.playerMaxHP}`;
  document.getElementById('opponent-hp-val').textContent = `${state.opponentHP} / ${state.opponentMaxHP}`;
}

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
      } else {
        cell.textContent = '🟣';
      }
    }

    if (pos === state.incomingAttack) {
      if (state.locked) {
        cell.classList.add('strike');
      } else {
        cell.classList.add('warning');
      }
    }
  });

  // Opponent row — opponent always at pos 1
  const oppCells = document.querySelectorAll('#opponent-row .arena-cell');
  oppCells.forEach(cell => {
    const pos = parseInt(cell.dataset.pos);
    cell.className = 'arena-cell';
    cell.innerHTML = '';
    if (pos === 1) {
      cell.classList.add('opp-pokemon');
      if (state.opponent?.sprite) {
        const img = document.createElement('img');
        img.src = state.opponent.sprite;
        img.alt = state.opponent.name;
        cell.appendChild(img);
      } else {
        cell.textContent = '🔴';
      }
    }
  });
}

function renderControls(state) {
  // Move buttons
  const panel = document.getElementById('moves-panel');
  const buttons = panel.querySelectorAll('.move-btn');
  buttons.forEach(btn => {
    btn.disabled = state.attackOnCooldown || state.phase !== 'fighting';
  });

  // Definitive button
  const defBtn = document.getElementById('definitive-btn');
  defBtn.disabled = state.definitiveUsed || state.phase !== 'fighting';
}

function renderLog(state) {
  const logEl = document.getElementById('battle-log');
  logEl.innerHTML = state.log.map(entry =>
    `<div class="log-entry ${entry.type}">${entry.text}</div>`
  ).join('');
  logEl.scrollTop = logEl.scrollHeight; // auto-scroll to bottom
}

/** Set up initial names in HP bars */
export function renderInitialNames(state) {
  const playerDisplayName = state.player.nickname || state.player.name;
  document.getElementById('player-name').textContent   = playerDisplayName;
  document.getElementById('opponent-name').textContent = state.opponent.name;
}

/** Show the end screen */
export function showEndScreen(won) {
  const screen = document.getElementById('end-screen');
  const msg    = document.getElementById('end-message');
  screen.classList.remove('hidden');
  msg.textContent = won ? '🏆 Victory!' : '💀 Defeated...';
  msg.style.color = won ? '#42C97A' : '#E84040';
}

/** Hide the end screen */
export function hideEndScreen() {
  document.getElementById('end-screen').classList.add('hidden');
}

/** Build move buttons in the panel (called once on init) */
export function buildMoveButtons(moves, onMoveFire) {
  const panel = document.getElementById('moves-panel');
  panel.innerHTML = '';
  moves.forEach(move => {
    const btn = document.createElement('button');
    btn.className = 'move-btn';
    btn.innerHTML = `${move.name} <span class="move-power">${move.power ?? '—'}</span><div class="cooldown-bar" style="width:0%"></div>`;

    const cooldownBar = btn.querySelector('.cooldown-bar');
    btn.addEventListener('click', () => onMoveFire(move, cooldownBar));
    panel.appendChild(btn);
  });
}