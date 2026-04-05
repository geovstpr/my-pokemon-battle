// ========== API ==========
// All PokeAPI fetch calls live here.

const BASE_URL = 'https://pokeapi.co/api/v2';

// ========== FETCH POKEMON ==========
export async function fetchPokemon(nameOrId, signal) {
  const url = `${BASE_URL}/pokemon/${nameOrId.toLowerCase()}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Pokemon "${nameOrId}" not found.`);
  return res.json();
}

// ========== FETCH MOVE ==========
export async function fetchMove(url) {
  const res = await fetch(url);
  if (!res.ok) return { name: '--', power: null };
  const data = await res.json();
  return {
    name:  data.name,
    power: data.power ?? null,
  };
}

// ========== FETCH MOVES ==========
// Fetches the first 4 moves in parallel.
// Uses Promise.allSettled so one failed move does not break the rest.
export async function fetchMoves(pokemon) {
  const moveSlots = pokemon.moves.slice(0, 4);
  const results = await Promise.allSettled(
    moveSlots.map(slot => fetchMove(slot.move.url))
  );
  return results.map(r =>
    r.status === 'fulfilled'
      ? r.value
      : { name: 'unknown', power: null }
  );
}