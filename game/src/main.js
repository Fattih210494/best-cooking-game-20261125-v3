// Dapur Ceria v4 — bootstrap + game loop. Fixed logical canvas 1280x720.

import { H, W } from './config.js';
import { GameState } from './state.js';
import { render } from './render.js';
import { attachInput } from './input.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = W;
canvas.height = H;

const state = new GameState();
const mouse = attachInput(canvas, state);

// Exposed for play-testing (drives real clicks & reads live status).
window.__game = {
  state,
  status: () => state.status(),
  reset: () => state.reset(),
};

let last = performance.now();
let t = 0;
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  t += dt;
  state.update(dt);
  render(ctx, state, mouse, t);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
