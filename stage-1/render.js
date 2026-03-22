// stage-1/render.js
// All DOM writes live here. Nothing else touches the DOM.

import TRAINER from '../trainer.config.js';

// ── TYPE COLOR MAP ──
const TYPE_COLORS = {
  fire:     '#FF6030',
  water:    '#6890F0',
  grass:    '#48C878',
  electric: '#F8D030',
  psychic:  '#F85888',
  dragon:   '#7038F8',
  ghost:    '#705898',
  normal:   '#A8A878',
  ice:      '#98D8D8',
  fighting: '#C03028',
  poison:   '#A040A0',
  ground:   '#E0C068',
  flying:   '#A890F0',
  bug:      '#A8B820',
  rock:     '#B8A038',
  dark:     '#705848',
  steel:    '#B8B8D0',
  fairy:    '#EE99AC',
};

/** Get hex color for a Pokémon type */
export function typeColor(typeName) {
  return TYPE_COLORS[typeName] ?? '#888';
}

/** Render the Trainer Card in the header */
export function renderTrainerCard() {
  const el = document.getElementById('trainer-info');
  el.innerHTML = `
    <span>${TRAINER.name}</span> &nbsp;·&nbsp;
    ${TRAINER.hometown} &nbsp;·&nbsp;
    <em>"${TRAINER.catchphrase}"</em>
  `;
}

/** Show a loading skeleton inside a container */
export function renderSkeleton(containerId) {
  const el = document.getElementById(containerId);
  el.innerHTML = `
    <div class="skeleton skeleton-sprite"></div>
    <div class="skeleton skeleton-line w60"></div>
    <div class="skeleton skeleton-line w80"></div>
    <div class="skeleton skeleton-line w40"></div>
    <div class="skeleton skeleton-line w80"></div>
    <div class="skeleton skeleton-line w60"></div>
  `;
}

/** Render a loaded Pokémon into a container.
 *  side: 'player' | 'opponent'
 */
export function renderPokemon(containerId, pokemon, moves, side) {
  const el = document.getElementById(containerId);

  const primaryType = pokemon.types[0].type.name;
  const color = typeColor(primaryType);

  // Apply type color to CSS variable (only for player side)
  if (side === 'player') {
    document.documentElement.style.setProperty('--type-color', color);
  }

  const typeTags = pokemon.types
    .map(t => `<span class="type-tag">${t.type.name}</span>`)
    .join('');

  // Stats we care about
  const statNames = { hp: 'HP', attack: 'ATK', defense: 'DEF', speed: 'SPD' };
  const statsHtml = pokemon.stats
    .filter(s => Object.keys(statNames).includes(s.stat.name))
    .map(s => {
      const pct = Math.min((s.base_stat / 255) * 100, 100).toFixed(1);
      return `
        <div class="stat-row">
          <span class="stat-label">${statNames[s.stat.name]}</span>
          <div class="stat-bar-wrap">
            <div class="stat-bar" style="width:${pct}%; background:${side === 'player' ? color : '#E84040'}"></div>
          </div>
          <span class="stat-val">${s.base_stat}</span>
        </div>`;
    }).join('');

  const movesHtml = moves.map(m => `
    <div class="move-item">
      <span>${m.name}</span>
      <span class="move-power">${m.power != null ? `PWR ${m.power}` : 'status'}</span>
    </div>`).join('');

  const displayName = (side === 'player' && TRAINER.nickname)
    ? TRAINER.nickname
    : pokemon.name;

  el.innerHTML = `
    <div class="pokemon-info">
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      <div class="poke-name" style="color:${side === 'player' ? color : '#E84040'}">${displayName}</div>
      <div class="type-tags">${typeTags}</div>
      <div class="stats">${statsHtml}</div>
      <div class="moves-title">Moves</div>
      <div class="moves-list">${movesHtml}</div>
    </div>
  `;
}

/** Show an inline error in the opponent search area */
export function renderSearchError(message) {
  const el = document.getElementById('search-error');
  el.textContent = message;
  el.classList.remove('hidden');
}

/** Clear the opponent search error */
export function clearSearchError() {
  const el = document.getElementById('search-error');
  el.textContent = '';
  el.classList.add('hidden');
}

/** Enable or disable the Go to Battle button */
export function setGoBattleBtn(enabled) {
  document.getElementById('go-battle-btn').disabled = !enabled;
}