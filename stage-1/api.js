// stage-1/api.js
// All PokeAPI fetch calls live here.

const BASE_URL = 'https://pokeapi.co/api/v2';

/**
 * Fetch a single Pokémon by name or ID.
 * Returns the full PokeAPI pokemon object.
 * Throws if not found (404) or network error.
 */
export async function fetchPokemon(nameOrId, signal) {
  const url = `${BASE_URL}/pokemon/${nameOrId.toLowerCase()}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Pokémon "${nameOrId}" not found.`);
  return res.json();
}

/**
 * Fetch details for one move by URL.
 * Returns { name, power } — power may be null.
 */
export async function fetchMove(url) {
  const res = await fetch(url);
  if (!res.ok) return { name: '—', power: null };
  const data = await res.json();
  return {
    name:  data.name,
    power: data.power ?? null,
  };
}

/**
 * Fetch the first 4 moves for a pokémon in parallel.
 * Uses Promise.allSettled so a single failure doesn't break the rest.
 * Returns an array of { name, power } objects.
 */
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