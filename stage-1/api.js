const BASE_URL = 'https://pokeapi.co/api/v2';

// Trae un Pokémon por nombre o ID
export async function fetchPokemon(nameOrId, signal) {
  const url = `${BASE_URL}/pokemon/${nameOrId.toLowerCase()}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Pokémon "${nameOrId}" not found.`);
  return res.json();
}

// Trae los detalles de un movimiento (nombre y poder)
export async function fetchMove(url) {
  const res = await fetch(url);
  if (!res.ok) return { name: '—', power: null };
  const data = await res.json();
  return {
    name:  data.name,
    power: data.power ?? null,
  };
}

// Trae los primeros 4 movimientos de un Pokémon en paralelo
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