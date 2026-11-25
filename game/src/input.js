// Dapur Ceria v4 — mouse + keyboard input: hit zones for trays, stations,
// plates, customers, pause button and the game-over restart button.

import { CUSTOMER_SLOTS, PAUSE_BTN, PLATES, STATIONS, TRAYS } from './config.js';

function inside(mx, my, x, y, w, h) {
  return mx >= x && mx <= x + w && my >= y && my <= y + h;
}

export function attachInput(canvas, state) {
  const mouse = { x: 640, y: 360 };
  let scale = 1;

  function toGame(e) {
    const rect = canvas.getBoundingClientRect();
    scale = canvas.width / rect.width;
    return {
      x: (e.clientX - rect.left) * scale,
      y: (e.clientY - rect.top) * scale,
    };
  }

  canvas.addEventListener('mousemove', (e) => {
    const p = toGame(e);
    mouse.x = p.x;
    mouse.y = p.y;
  });

  canvas.addEventListener('click', (e) => {
    const p = toGame(e);
    mouse.x = p.x;
    mouse.y = p.y;
    handleClick(state, p.x, p.y);
  });

  window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    const k = e.key.toLowerCase();
    if (k === 'p') state.togglePause();
    else if (k === 'm') state.toggleMute();
    else if (k === 'r') state.reset();
    else if (k === '1') state.useStationType('blender');
    else if (k === '2') state.useStationType('board');
    else if (k === '3') state.useStationType('pan');
    else if (k === '4' || k === ' ') { e.preventDefault(); state.plateFirstFree(); }
  });

  return mouse;
}

export function handleClick(state, mx, my) {
  // Game over: restart button.
  if (state.over) {
    if (inside(mx, my, 520, 400, 240, 64)) state.reset();
    return;
  }
  // Pause button (top-right of the HUD).
  if (inside(mx, my, PAUSE_BTN.x, PAUSE_BTN.y, PAUSE_BTN.w, PAUSE_BTN.h)) {
    state.togglePause();
    return;
  }
  if (state.paused) return;

  // Customers (ticket + body): serve.
  for (let i = 0; i < CUSTOMER_SLOTS.length; i++) {
    const cx = CUSTOMER_SLOTS[i];
    if (inside(mx, my, cx - 95, 62, 190, 298)) {
      state.serveCustomer(i);
      return;
    }
  }
  // Plates on the teal counter.
  for (let i = 0; i < PLATES.length; i++) {
    const p = PLATES[i];
    if (Math.hypot(mx - p.x, my - p.y) < 34) {
      state.plateDish(i);
      return;
    }
  }
  // Cooking stations.
  for (const s of STATIONS) {
    if (inside(mx, my, s.x - 6, s.y - 8, s.w + 12, s.h + 20)) {
      state.useStation(s.id);
      return;
    }
  }
  // Ingredient trays.
  for (const tray of TRAYS) {
    if (inside(mx, my, tray.x, tray.y, tray.w, tray.h)) {
      state.grabIngredient(tray.id);
      return;
    }
  }
}
