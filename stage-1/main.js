// ========== MAIN ==========
// Entry point for Stage 1. Wires everything together.

import TRAINER from '../trainer.config.js';
import { fetchPokemon, fetchMoves } from './api.js';
import {
  renderTrainerCard,
  renderSkeleton,
  renderPokemon,
  renderSearchError,
  clearSearchError,
  setGoBattleBtn,
} from './render.js';

// ========== STATE ==========
const state = {
  player:   null,
  opponent: null,
};

// ========== ABORT CONTROLLER ==========
let searchController = null;

// ========== DEBOUNCE ==========
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ========== LOAD FAVORITE POKEMON ==========
async function loadFavorite() {
  renderSkeleton('player-content');
  try {
    const pokemon = await fetchPokemon(TRAINER.favoritePokemon);
    const moves   = await fetchMoves(pokemon);
    state.player  = { pokemon, moves };
    renderPokemon('player-content', pokemon, moves, 'player');
    checkReady();
  } catch (err) {
    document.getElementById('player-content').innerHTML =
      `<p>Error: ${err.message}</p>`;
  }
}

// ========== SEARCH OPPONENT ==========
async function searchOpponent(query) {
  const q = query.trim().toLowerCase();
  if (!q) return;

  if (searchController) searchController.abort();
  searchController = new AbortController();

  clearSearchError();
  renderSkeleton('opponent-content');
  state.opponent = null;
  checkReady();

  try {
    const pokemon  = await fetchPokemon(q, searchController.signal);
    const moves    = await fetchMoves(pokemon);
    state.opponent = { pokemon, moves };
    renderPokemon('opponent-content', pokemon, moves, 'opponent');
    localStorage.setItem('lastOpponent', pokemon.name);
    checkReady();
  } catch (err) {
    if (err.name === 'AbortError') return;
    document.getElementById('opponent-content').innerHTML =
      `<p>No Pokemon found.</p>`;
    renderSearchError(`"${q}" not found.`);
  }
}

// ========== CHECK READY ==========
function checkReady() {
  setGoBattleBtn(!!(state.player && state.opponent));
}

// ========== GO TO BATTLE ==========
function goToBattle() {
  if (!state.player || !state.opponent) return;

  localStorage.setItem('battleData', JSON.stringify({
    player: {
      name:    state.player.pokemon.name,
      sprite:  state.player.pokemon.sprites.front_default,
      hp:      Math.floor(state.player.pokemon.stats.find(s => s.stat.name === 'hp').base_stat * 2.5),
      attack:  state.player.pokemon.stats.find(s => s.stat.name === 'attack').base_stat,
      types:   state.player.pokemon.types.map(t => t.type.name),
      moves:   state.player.moves,
    },
    opponent: {
      name:    state.opponent.pokemon.name,
      sprite:  state.opponent.pokemon.sprites.front_default,
      hp:      Math.floor(state.opponent.pokemon.stats.find(s => s.stat.name === 'hp').base_stat * 2.5),
      attack:  state.opponent.pokemon.stats.find(s => s.stat.name === 'attack').base_stat,
      types:   state.opponent.pokemon.types.map(t => t.type.name),
      moves:   state.opponent.moves,
    },
  }));

  window.location.href = '../stage-2/index.html';
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
  renderTrainerCard();
  loadFavorite();

  const lastOpponent = localStorage.getItem('lastOpponent');
  const searchInput  = document.getElementById('opponent-search');
  if (lastOpponent) {
    searchInput.value = lastOpponent;
    searchOpponent(lastOpponent);
  }

  const debouncedSearch = debounce(searchOpponent, 300);
  searchInput.addEventListener('input', (e) => {
    clearSearchError();
    debouncedSearch(e.target.value);
  });

  document.getElementById('go-battle-btn').addEventListener('click', goToBattle);
});