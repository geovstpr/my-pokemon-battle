// ========== RENDER ==========
// All DOM writes live here. Nothing else touches the DOM.

import TRAINER from '../trainer.config.js';

// ========== TYPE COLOR MAP ==========
const TYPE_COLORS = {
  fire:     '#FF6030',
  water:    '#6890F0',
  grass:    '#48C878',
  electric: '#F8D030',
  psychic:  '#F85888',
  dragon:   '#7038F8',
  ghost:    '#705898',
  poison:   '#A040A0',
  normal:   '#A8A878',
  ice:      '#98D8D8',
  fighting: '#C03028',
  ground:   '#E0C068',
  flying:   '#A890F0',
  bug:      '#A8B820',
  rock:     '#B8A038',
  dark:     '#705848',
  steel:    '#B8B8D0',
  fairy:    '#EE99AC',
};

// ========== GET TYPE COLOR ==========
export function typeColor(typeName) {
  return TYPE_COLORS[typeName] ?? '#888';
}

// ========== RENDER TRAINER CARD ==========
export function renderTrainerCard() {
  const el = document.getElementById('trainer-info');
  el.innerHTML = `
    <span>${TRAINER.name}</span> &nbsp;·&nbsp;
    ${TRAINER.hometown} &nbsp;·&nbsp;
    <em>"${TRAINER.catchphrase}"</em>
  `;
}

// ========== RENDER SKELETON ==========
export function renderSkeleton(containerId) {
  const el = document.getElementById(containerId);
  el.innerHTML = `<p>Loading...</p>`;
}

// ========== RENDER POKEMON ==========
export function renderPokemon(containerId, pokemon, moves, side) {
  const el = document.getElementById(containerId);

  const primaryType = pokemon.types[0].type.name;
  const color = typeColor(primaryType);

  if (side === 'player') {
    document.documentElement.style.setProperty('--type-color', color);
  }

  const typeTags = pokemon.types
    .map(t => `<span class="type-tag">${t.type.name}</span>`)
    .join('');

  const statsHtml = pokemon.stats
    .filter(s => ['hp', 'attack', 'defense', 'speed'].includes(s.stat.name))
    .map(s => `<p>${s.stat.name}: ${s.base_stat}</p>`)
    .join('');

  const movesHtml = moves
    .map(m => `<p>${m.name} -- PWR: ${m.power ?? '--'}</p>`)
    .join('');

  const displayName = (side === 'player' && TRAINER.nickname)
    ? TRAINER.nickname
    : pokemon.name;

  el.innerHTML = `
    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
    <h3>${displayName}</h3>
    <div>${typeTags}</div>
    <div>${statsHtml}</div>
    <div>${movesHtml}</div>
  `;
}

// ========== RENDER SEARCH ERROR ==========
export function renderSearchError(message) {
  const el = document.getElementById('search-error');
  el.textContent = message;
}

// ========== CLEAR SEARCH ERROR ==========
export function clearSearchError() {
  const el = document.getElementById('search-error');
  el.textContent = '';
}

// ========== SET GO TO BATTLE BUTTON ==========
export function setGoBattleBtn(enabled) {
  document.getElementById('go-battle-btn').disabled = !enabled;
}