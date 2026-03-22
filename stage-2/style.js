/* ── VARIABLES ── */
:root {
  --bg:      #0D0F14;
  --surface: #161921;
  --surf2:   #1E222E;
  --border:  #2A3040;
  --text:    #D8E0F0;
  --muted:   #5A6480;
  --player:  #A566E8;   /* ghost/purple — Gengar */
  --enemy:   #E84040;
  --green:   #42C97A;
  --warn:    #F5C842;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Segoe UI', sans-serif;
  min-height: 100vh;
  padding-bottom: 3rem;
}

/* ── HEADER ── */
header {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
header h1 { font-size: 1.2rem; color: var(--player); letter-spacing: 0.1em; }
.back-link { font-size: 0.8rem; color: var(--muted); text-decoration: none; }
.back-link:hover { color: var(--text); }

/* ── MAIN ── */
main { max-width: 800px; margin: 1.5rem auto; padding: 0 1.5rem; }

/* ── HP SECTION ── */
.hp-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  border-radius: 4px;
}
.hp-block { flex: 1; display: flex; flex-direction: column; gap: 0.3rem; }
.hp-name { font-size: 0.78rem; text-transform: capitalize; letter-spacing: 0.05em; }
.hp-bar-wrap {
  height: 8px;
  background: var(--surf2);
  border-radius: 4px;
  overflow: hidden;
}
.hp-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}
.hp-bar.player   { background: var(--player); }
.hp-bar.opponent { background: var(--enemy); }
.hp-val { font-size: 0.75rem; color: var(--muted); }
.vs { color: var(--muted); font-size: 0.8rem; flex-shrink: 0; }

/* ── ARENA ── */
.arena {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border-radius: 4px;
}
.arena-label {
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  margin-bottom: 0.5rem;
}
.opponent-label { color: var(--enemy); }
.player-label   { color: var(--player); }

.arena-row { display: flex; gap: 6px; margin-bottom: 0.5rem; }

.arena-cell {
  width: 90px;
  height: 70px;
  border: 1px solid var(--border);
  background: var(--surf2);
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  position: relative;
  transition: border-color 0.15s, background 0.15s;
}

/* Opponent cell — always shows sprite at pos 1 */
.arena-cell.opp-pokemon { border-color: var(--enemy); }

/* Player active cell */
.arena-cell.player-here {
  border-color: var(--player);
  background: rgba(165, 102, 232, 0.1);
}

/* Warning — incoming attack */
.arena-cell.warning {
  border-color: var(--warn);
  background: rgba(245, 200, 66, 0.1);
}

/* Strike resolved */
.arena-cell.strike {
  border-color: var(--enemy);
  background: rgba(232, 64, 64, 0.15);
  animation: flash 0.3s ease;
}

@keyframes flash {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}

.arena-cell img {
  width: 48px;
  height: 48px;
  image-rendering: pixelated;
}

.arena-vs {
  text-align: center;
  color: var(--enemy);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  padding: 0.4rem 0;
}

/* ── CONTROLS ── */
.controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.moves-panel { display: flex; gap: 0.5rem; flex-wrap: wrap; flex: 1; }

.move-btn {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 0.6rem 1rem;
  font-size: 0.8rem;
  text-transform: capitalize;
  cursor: pointer;
  border-radius: 3px;
  transition: border-color 0.2s, opacity 0.2s;
  position: relative;
  overflow: hidden;
}
.move-btn:hover:not(:disabled) { border-color: var(--player); }
.move-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* Cooldown bar inside button */
.move-btn .cooldown-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: var(--player);
  transition: none;
}

.definitive-btn {
  background: #2A0050;
  border: 1px solid var(--player);
  color: var(--player);
  padding: 0.6rem 1.2rem;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  border-radius: 3px;
  transition: opacity 0.2s;
}
.definitive-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.definitive-btn:not(:disabled):hover { opacity: 0.8; }
.one-use { font-size: 0.65rem; display: block; color: var(--muted); }

/* ── BATTLE LOG ── */
.log-wrap {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  overflow: hidden;
}
.log-label {
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  color: var(--muted);
  padding: 0.5rem 1rem;
  border-bottom: 1px solid var(--border);
}
.battle-log {
  height: 140px;
  overflow-y: auto;
  padding: 0.7rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.log-entry { font-size: 0.8rem; color: var(--muted); }
.log-entry.hit    { color: var(--enemy); }
.log-entry.dodge  { color: var(--green); }
.log-entry.attack { color: var(--player); }
.log-entry.end    { color: var(--warn); font-weight: 700; }

/* ── END SCREEN ── */
.end-screen {
  position: fixed;
  inset: 0;
  background: rgba(13,15,20,0.92);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  z-index: 100;
}
.end-screen.hidden { display: none; }
.end-message {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-align: center;
}
#battle-again-btn {
  background: var(--player);
  border: none;
  color: #fff;
  padding: 0.8rem 2rem;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 3px;
  transition: opacity 0.2s;
}
#battle-again-btn:hover { opacity: 0.85; }