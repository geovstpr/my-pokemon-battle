# My Favorite Pokemon Battle

**Trainer:** Kiriito | **Pokemon:** Gengar | **Course:** Web Fundamentals 1

## Live URL
https://geovstpr.github.io/my-pokemon-battle/

## Video
https://www.loom.com/share/1a86792d8e7a45f1beb5346edd7cd83d

---

## My Favorite Pokemon
My favorite Pokemon is **Gengar**. Gengar is a Ghost/Poison type known for its
mischievous personality and powerful shadow-based attacks. I chose Gengar because
its combination of speed, special attack, and eerie aesthetic makes it one of the
most iconic and fun Pokemon to battle with.

---

## Definitive Move -- Phantom Ambush
**Name:** Phantom Ambush

**Flavor Text:** The user becomes unstoppable as they jump forward to the designated
location, then enters stealth and increases their movement speed by 30% for 7s.
The user exits stealth when they use an attack. If this Unite Move is used again,
the user becomes invincible as they jump out to attack, damaging opposing Pokemon
in the area of effect and decreasing their movement speed by 50% for 1.5s when it
hits. The user readies a boosted attack each time this move is used.

**Inspiration:** This move is inspired by Gengar's Unite Move in Pokemon UNITE,
which perfectly captures its ghost-like ability to vanish and strike from nowhere.

---

## Core Concepts -- Where They Appear

### 1. async/await and Promises
- **Stage 1** -- `stage-1/api.js` lines 5-25: `fetchPokemon()` and `fetchMoves()`
use `async/await` with `try/catch`. Move details use `Promise.allSettled` so one
failed move does not break the rest.
- **Stage 2** -- `stage-2/battle.js` lines 55-90: `resolveEnemyAttack()` is an
`async` function using `await wait(600)` for the warning window before resolving
the attack.

### 2. DOM Manipulation from State
- **Stage 1** -- `stage-1/render.js` lines 50-100: All DOM writes go through
dedicated functions like `renderPokemon()` and `renderSkeleton()`. No state is
read back from the DOM.
- **Stage 2** -- `stage-2/render.js` lines 10-70: The single `render(state)`
function drives all arena, HP bar, and log updates. Nothing else writes to the DOM.

### 3. Event Loop -- Timers and Debounce
- **Stage 1** -- `stage-1/main.js` lines 20-30: Debounce hand-written at 300ms.
`AbortController` cancels stale search requests when the user types a new character.
- **Stage 2** -- `stage-2/battle.js` lines 45-70: Enemy attack loop uses recursive
`setTimeout` instead of `setInterval`. Cooldown bar driven by `requestAnimationFrame`.

---

## Controls
- **Arrow keys** -- Move left and right to dodge
- **W / A / S / D** -- Use moves 1 / 2 / 3 / 4
- **Q** -- Phantom Ambush (1 use, instant KO)

---

## Known Issues / Incomplete Parts
- None at this time.

---

## Repository Structure
```
my-pokemon-battle/
├── index.html
├── trainer.config.js
├── stage-1/
│   ├── index.html
│   ├── main.js
│   ├── api.js
│   ├── render.js
│   └── style.css
├── stage-2/
│   ├── index.html
│   ├── main.js
│   ├── battle.js
│   ├── render.js
│   └── style.css
└── README.md
```