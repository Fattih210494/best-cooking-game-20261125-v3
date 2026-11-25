// Dapur Ceria v4 — all drawing. 2D cartoon, thick outlines, saturated colours,
// glossy food. Layout mirrors the reference: orange HUD bar, customers + white ticket
// cards on top, central teal counter, stations left & right, ingredient trays bottom,
// terrace garden with fountain & pink pillars behind.

import { COUNTER, CUSTOMER_SLOTS, DISHES, H, HUD, PAUSE_BTN, PLATES, SCORE_TARGET, STATIONS, TICKET, TRAYS, W, dishByIngredient } from './config.js';

const INK = '#4a2c14'; // dark brown outline

function rr(ctx, x, y, w, h, r) {
  const q = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + q, y);
  ctx.arcTo(x + w, y, x + w, y + h, q);
  ctx.arcTo(x + w, y + h, x, y + h, q);
  ctx.arcTo(x, y + h, x, y, q);
  ctx.arcTo(x, y, x + w, y, q);
  ctx.closePath();
}

function circle(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); }

function text(ctx, str, x, y, size, color, align = 'center', weight = 'bold') {
  ctx.font = `${weight} ${size}px Arial, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.lineWidth = Math.max(2, size / 6);
  ctx.strokeStyle = 'rgba(74,44,20,0.85)';
  ctx.strokeText(str, x, y);
  ctx.fillStyle = color;
  ctx.fillText(str, x, y);
}

function gloss(ctx, x, y, w, h) {
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.beginPath();
  ctx.ellipse(x, y, w, h, -0.5, 0, Math.PI * 2);
  ctx.fill();
}

// --- Dish & ingredient icons (drawn on a white plate) ---
function plate(ctx, x, y, r) {
  circle(ctx, x, y, r);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#8a6a45';
  ctx.stroke();
  circle(ctx, x, y, r * 0.62);
  ctx.strokeStyle = '#d8c8a8';
  ctx.lineWidth = 2;
  ctx.stroke();
}

export function drawDishIcon(ctx, dishId, x, y, s) {
  const r = s * 0.52;
  // Soft drop shadow under the plate.
  ctx.beginPath();
  ctx.ellipse(x, y + r * 0.85, r * 0.95, r * 0.28, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fill();
  plate(ctx, x, y, r);
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = INK;
  if (dishId === 'dumpling') {
    // Three plump dumplings with pleat lines + green garnish, glossy sheen.
    for (let i = -1; i <= 1; i++) {
      const dx = x + i * r * 0.58;
      const dy = y + r * 0.12;
      ctx.beginPath();
      ctx.arc(dx, dy, r * 0.36, Math.PI, 0);
      ctx.closePath();
      ctx.fillStyle = '#f6d9a0';
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(dx, dy, r * 0.3, Math.PI * 1.15, Math.PI * 1.85);
      ctx.strokeStyle = '#d89a4d';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.5;
      for (let k = -1; k <= 1; k++) {
        ctx.beginPath();
        ctx.moveTo(dx + k * r * 0.14, dy - r * 0.3);
        ctx.lineTo(dx + k * r * 0.14, dy - r * 0.1);
        ctx.strokeStyle = '#d89a4d';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2.5;
      circle(ctx, dx, dy - r * 0.02, r * 0.1);
      ctx.fillStyle = '#e8a34d';
      ctx.fill();
    }
    circle(ctx, x - r * 0.45, y - r * 0.42, r * 0.09);
    ctx.fillStyle = '#58c94d';
    ctx.fill();
    circle(ctx, x + r * 0.42, y - r * 0.4, r * 0.09);
    ctx.fillStyle = '#7ec850';
    ctx.fill();
  } else if (dishId === 'sushi') {
    // Three salmon rolls: dark nori, white rice grains, pink salmon centre.
    for (let i = -1; i <= 1; i++) {
      const px = x + i * r * 0.56;
      rr(ctx, px - r * 0.27, y - r * 0.44, r * 0.54, r * 0.88, 5);
      ctx.fillStyle = '#2f6b2f';
      ctx.fill();
      ctx.stroke();
      rr(ctx, px - r * 0.18, y - r * 0.32, r * 0.36, r * 0.64, 4);
      ctx.fillStyle = '#fff8e6';
      ctx.fill();
      ctx.fillStyle = '#ffb08a';
      ctx.beginPath();
      ctx.ellipse(px, y, r * 0.13, r * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f28bb0';
      circle(ctx, px, y - r * 0.12, r * 0.07);
      ctx.fill();
      ctx.fillStyle = '#fffdf5';
      for (let g = 0; g < 3; g++) {
        circle(ctx, px - r * 0.1 + g * r * 0.1, y + r * 0.22, r * 0.035);
        ctx.fill();
      }
    }
    circle(ctx, x + r * 0.48, y + r * 0.42, r * 0.1);
    ctx.fillStyle = '#7ec850';
    ctx.fill();
    ctx.stroke();
  } else if (dishId === 'ricebowl') {
    // Blue-rimmed bowl, glossy rice mound with grains, glazed chicken pieces.
    ctx.beginPath();
    ctx.arc(x, y + r * 0.28, r * 0.58, 0, Math.PI);
    ctx.closePath();
    ctx.fillStyle = '#3f7ec9';
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(x, y - r * 0.05, r * 0.52, r * 0.34, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#fff8e6';
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fffdf5';
    for (let g = 0; g < 7; g++) {
      const gx = x - r * 0.36 + (g % 4) * r * 0.24;
      const gy = y - r * 0.22 + Math.floor(g / 4) * r * 0.2;
      circle(ctx, gx, gy, r * 0.05);
      ctx.fill();
    }
    for (let i = -1; i <= 1; i++) {
      circle(ctx, x + i * r * 0.3, y - r * 0.08 + (i === 0 ? r * 0.1 : 0), r * 0.19);
      ctx.fillStyle = '#d98a4d';
      ctx.fill();
      ctx.stroke();
      circle(ctx, x + i * r * 0.3, y - r * 0.14 + (i === 0 ? r * 0.1 : 0), r * 0.07);
      ctx.fillStyle = '#b06a2e';
      ctx.fill();
    }
    circle(ctx, x - r * 0.42, y - r * 0.3, r * 0.08);
    ctx.fillStyle = '#58c94d';
    ctx.fill();
    circle(ctx, x + r * 0.4, y - r * 0.34, r * 0.08);
    ctx.fillStyle = '#7ec850';
    ctx.fill();
  } else if (dishId === 'drink') {
    // Tall glossy glass, pink strawberry drink, ice cubes, straw, cherry.
    ctx.beginPath();
    ctx.moveTo(x - r * 0.36, y - r * 0.55);
    ctx.lineTo(x + r * 0.36, y - r * 0.55);
    ctx.lineTo(x + r * 0.22, y + r * 0.55);
    ctx.lineTo(x - r * 0.22, y + r * 0.55);
    ctx.closePath();
    const pg = ctx.createLinearGradient(x, y - r * 0.5, x, y + r * 0.5);
    pg.addColorStop(0, '#ff9ec4');
    pg.addColorStop(1, '#f24a8a');
    ctx.fillStyle = pg;
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + r * 0.12, y - r * 0.55);
    ctx.lineTo(x + r * 0.46, y - r * 1.05);
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#ffd94d';
    ctx.stroke();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.5;
    circle(ctx, x + r * 0.46, y - r * 1.05, r * 0.09);
    ctx.fillStyle = '#e84a3d';
    ctx.fill();
    ctx.stroke();
    ctx.save();
    ctx.translate(x - r * 0.05, y - r * 0.05);
    ctx.rotate(0.6);
    rr(ctx, -r * 0.16, -r * 0.16, r * 0.32, r * 0.32, 3);
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.fillRect(x - r * 0.28, y - r * 0.4, r * 0.1, r * 0.7);
  } else if (dishId === 'salad') {
    // Tomato + cucumber slices on lettuce, glossy dressing dots.
    ctx.fillStyle = '#7ec850';
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      ctx.beginPath();
      ctx.ellipse(x + Math.cos(a) * r * 0.34, y + Math.sin(a) * r * 0.34, r * 0.24, r * 0.14, a, 0, Math.PI * 2);
      ctx.fill();
    }
    for (let i = -1; i <= 1; i++) {
      const px = x + i * r * 0.42;
      const py = y + (i === 0 ? r * 0.14 : -r * 0.12);
      circle(ctx, px, py, r * 0.27);
      ctx.fillStyle = '#e84a3d';
      ctx.fill();
      ctx.stroke();
      circle(ctx, px, py, r * 0.17);
      ctx.fillStyle = '#f28a7a';
      ctx.fill();
      circle(ctx, px, py, r * 0.06);
      ctx.fillStyle = '#fff3d6';
      ctx.fill();
    }
    circle(ctx, x + r * 0.1, y + r * 0.4, r * 0.16);
    ctx.fillStyle = '#a8d94d';
    ctx.fill();
    ctx.stroke();
    circle(ctx, x + r * 0.1, y + r * 0.4, r * 0.09);
    ctx.fillStyle = '#e8f7c8';
    ctx.fill();
  } else if (dishId === 'burger') {
    // Glossy sesame bun, wavy lettuce, cheese drip, juicy patty.
    rr(ctx, x - r * 0.52, y - r * 0.46, r * 1.04, r * 0.38, r * 0.18);
    const bg = ctx.createLinearGradient(x, y - r * 0.46, x, y - r * 0.08);
    bg.addColorStop(0, '#f7c46a');
    bg.addColorStop(1, '#e89a3d');
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fff3d6';
    for (const [sx, sy] of [[-0.3, -0.34], [0, -0.26], [0.3, -0.34], [-0.12, -0.18], [0.18, -0.16]]) {
      ctx.beginPath();
      ctx.ellipse(x + sx * r, y + sy * r, r * 0.06, r * 0.04, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.moveTo(x - r * 0.54, y - r * 0.06);
    for (let i = 0; i <= 6; i++) {
      ctx.lineTo(x - r * 0.54 + i * r * 0.18, y - r * 0.06 + (i % 2 ? r * 0.1 : 0));
    }
    ctx.lineTo(x + r * 0.54, y + r * 0.06);
    ctx.lineTo(x - r * 0.54, y + r * 0.06);
    ctx.closePath();
    ctx.fillStyle = '#7ec850';
    ctx.fill();
    ctx.stroke();
    rr(ctx, x - r * 0.5, y + r * 0.06, r, r * 0.16, 3);
    ctx.fillStyle = '#ffd94d';
    ctx.fill();
    ctx.stroke();
    rr(ctx, x - r * 0.52, y + r * 0.2, r * 1.04, r * 0.24, 5);
    ctx.fillStyle = '#8a5a2e';
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#a86a3a';
    for (let i = 0; i < 4; i++) {
      circle(ctx, x - r * 0.3 + i * r * 0.2, y + r * 0.32, r * 0.05);
      ctx.fill();
    }
    rr(ctx, x - r * 0.5, y + r * 0.42, r, r * 0.18, r * 0.09);
    ctx.fillStyle = '#f2b25c';
    ctx.fill();
    ctx.stroke();
  }
  gloss(ctx, x - r * 0.34, y - r * 0.36, r * 0.24, r * 0.11);
}

export function drawIngredientIcon(ctx, ingId, x, y, s) {
  const r = s * 0.5;
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = INK;
  if (ingId === 'dumpling') {
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.arc(x + i * r * 0.6, y + r * 0.15, r * 0.36, Math.PI, 0);
      ctx.closePath();
      ctx.fillStyle = '#f6d9a0';
      ctx.fill();
      ctx.stroke();
    }
  } else if (ingId === 'rice') {
    ctx.beginPath();
    ctx.ellipse(x, y + r * 0.2, r * 0.85, r * 0.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#fff8e6';
    ctx.fill();
    ctx.stroke();
    for (let i = 0; i < 5; i++) {
      circle(ctx, x - r * 0.5 + i * r * 0.25, y - r * 0.25 + (i % 2) * r * 0.2, r * 0.08);
      ctx.fillStyle = '#fffdf5';
      ctx.fill();
    }
  } else if (ingId === 'chicken') {
    ctx.beginPath();
    ctx.ellipse(x, y, r * 0.8, r * 0.5, -0.3, 0, Math.PI * 2);
    ctx.fillStyle = '#f2b8a0';
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + r * 0.5, y - r * 0.2);
    ctx.lineTo(x + r * 0.95, y - r * 0.55);
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#fff3e0';
    ctx.stroke();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2.5;
  } else if (ingId === 'strawberry') {
    ctx.beginPath();
    ctx.moveTo(x, y + r * 0.7);
    ctx.quadraticCurveTo(x - r * 0.7, y - r * 0.1, x - r * 0.35, y - r * 0.45);
    ctx.quadraticCurveTo(x, y - r * 0.7, x + r * 0.35, y - r * 0.45);
    ctx.quadraticCurveTo(x + r * 0.7, y - r * 0.1, x, y + r * 0.7);
    ctx.fillStyle = '#f24a6a';
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#7ec850';
    ctx.beginPath();
    ctx.ellipse(x, y - r * 0.5, r * 0.4, r * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (ingId === 'tomato') {
    circle(ctx, x - r * 0.3, y + r * 0.05, r * 0.42);
    ctx.fillStyle = '#e84a3d';
    ctx.fill();
    ctx.stroke();
    circle(ctx, x + r * 0.35, y - r * 0.05, r * 0.38);
    ctx.fillStyle = '#f25a4a';
    ctx.fill();
    ctx.stroke();
    gloss(ctx, x - r * 0.45, y - r * 0.15, r * 0.18, r * 0.1);
  } else if (ingId === 'patty') {
    ctx.beginPath();
    ctx.ellipse(x, y, r * 0.85, r * 0.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#c98a5a';
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(x, y + r * 0.05, r * 0.6, r * 0.32, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#a86a3a';
    ctx.fill();
  }
}

// --- Background: terrace garden, two-tier fountain, pink pillars ---
function drawBackground(ctx) {
  // Sky
  const sky = ctx.createLinearGradient(0, 0, 0, 320);
  sky.addColorStop(0, '#8ed4f2');
  sky.addColorStop(1, '#e8f7ff');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, 330);
  // Clouds
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  for (const [cx, cy, s] of [[300, 92, 1], [880, 74, 0.8], [1080, 110, 0.6]]) {
    ctx.beginPath();
    ctx.ellipse(cx, cy, 46 * s, 16 * s, 0, 0, Math.PI * 2);
    ctx.ellipse(cx - 26 * s, cy + 6 * s, 28 * s, 12 * s, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + 28 * s, cy + 6 * s, 30 * s, 13 * s, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // Garden: back hedge, front hedge with flowers, trees.
  ctx.fillStyle = '#6fbf45';
  ctx.fillRect(0, 150, W, 170);
  ctx.fillStyle = '#4e9a33';
  for (let x = -20; x < W + 40; x += 58) {
    circle(ctx, x, 176, 40);
    ctx.fill();
  }
  ctx.fillStyle = '#7ec850';
  for (let x = 8; x < W + 40; x += 72) {
    circle(ctx, x, 226, 36);
    ctx.fill();
  }
  ctx.fillStyle = '#8fd45f';
  for (let x = 30; x < W + 40; x += 96) {
    circle(ctx, x, 272, 30);
    ctx.fill();
  }
  // Flowers sprinkled on the hedges.
  const flowerColors = ['#ff8bb0', '#ffd94d', '#ffffff', '#ff9ec4'];
  for (let i = 0; i < 26; i++) {
    const fx = 20 + ((i * 97) % 1240);
    const fy = 190 + ((i * 53) % 110);
    circle(ctx, fx, fy, 4);
    ctx.fillStyle = flowerColors[i % 4];
    ctx.fill();
  }
  // Trees with trunks + layered canopies.
  for (const [tx, s] of [[170, 1], [1120, 1], [445, 0.72]]) {
    ctx.fillStyle = '#7e4517';
    ctx.fillRect(tx - 7 * s, 170, 14 * s, 90);
    ctx.fillStyle = '#3f8a2e';
    circle(ctx, tx, 148, 52 * s); ctx.fill();
    circle(ctx, tx - 36 * s, 168, 36 * s); ctx.fill();
    circle(ctx, tx + 36 * s, 168, 36 * s); ctx.fill();
    ctx.fillStyle = '#5da93e';
    circle(ctx, tx - 14 * s, 132, 34 * s); ctx.fill();
    circle(ctx, tx + 16 * s, 140, 28 * s); ctx.fill();
    ctx.fillStyle = '#8fd45f';
    circle(ctx, tx - 8 * s, 122, 20 * s); ctx.fill();
  }
  // Two-tier fountain in the gap between the middle & right customers (x 832).
  const fx = 832;
  ctx.fillStyle = '#c9c2b4';
  ctx.beginPath();
  ctx.ellipse(fx, 306, 82, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = INK;
  ctx.stroke();
  ctx.fillStyle = '#7ec8e8';
  ctx.beginPath();
  ctx.ellipse(fx, 302, 68, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#a8dcf2';
  ctx.beginPath();
  ctx.ellipse(fx - 18, 300, 22, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#c9c2b4';
  ctx.fillRect(fx - 8, 218, 16, 88);
  ctx.beginPath();
  ctx.ellipse(fx, 222, 48, 13, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = '#7ec8e8';
  ctx.beginPath();
  ctx.ellipse(fx, 219, 38, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#c9c2b4';
  ctx.fillRect(fx - 5, 176, 10, 42);
  ctx.beginPath();
  ctx.ellipse(fx, 178, 28, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = '#a8dcf2';
  ctx.beginPath();
  ctx.ellipse(fx, 175, 20, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  // Water jets + droplets.
  ctx.strokeStyle = '#a8dcf2';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(fx - 34, 246, 24, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(fx + 34, 246, 24, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(fx - 20, 196, 16, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(fx + 20, 196, 16, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
  ctx.fillStyle = '#d8f3ff';
  for (const [dx, dy] of [[-52, 232], [52, 232], [-30, 186], [30, 186], [0, 158]]) {
    circle(ctx, fx + dx, dy, 3);
    ctx.fill();
  }

  // Terrace floor tiles (customers stand here).
  ctx.fillStyle = '#e8d9b8';
  ctx.fillRect(0, 310, W, 46);
  ctx.strokeStyle = '#c9b48a';
  ctx.lineWidth = 2;
  for (let x = 0; x <= W; x += 80) {
    ctx.beginPath(); ctx.moveTo(x, 310); ctx.lineTo(x, 356); ctx.stroke();
  }
  ctx.beginPath(); ctx.moveTo(0, 333); ctx.lineTo(W, 333); ctx.stroke();

  // Pink pillars with gold trim (far left & right), taller now.
  for (const px of [28, 1188]) {
    rr(ctx, px, 56, 64, 300, 10);
    const pg = ctx.createLinearGradient(px, 56, px + 64, 56);
    pg.addColorStop(0, '#e05ba0');
    pg.addColorStop(0.5, '#f078b8');
    pg.addColorStop(1, '#d94f9e');
    ctx.fillStyle = pg;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = INK;
    ctx.stroke();
    ctx.fillStyle = '#f4c542';
    ctx.fillRect(px - 6, 72, 76, 16);
    ctx.fillRect(px - 6, 316, 76, 16);
    ctx.fillStyle = '#ffd94d';
    ctx.fillRect(px - 6, 76, 76, 4);
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillRect(px + 10, 100, 10, 200);
  }
  // Potted plants at the corners, on the terrace floor.
  for (const px of [130, 1150]) {
    ctx.fillStyle = '#4e9a33';
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.ellipse(px + i * 15, 306 - Math.abs(i) * 5, 12, 30 - Math.abs(i) * 4, i * 0.28, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#ff8bb0';
    circle(ctx, px - 18, 292, 4);
    ctx.fill();
    circle(ctx, px + 20, 300, 4);
    ctx.fill();
    ctx.fillStyle = '#c96a3a';
    ctx.beginPath();
    ctx.moveTo(px - 28, 330); ctx.lineTo(px + 28, 330); ctx.lineTo(px + 19, 356); ctx.lineTo(px - 19, 356);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  // Wooden counter front (under stations) + bottom shelf.
  ctx.fillStyle = '#a8662c';
  ctx.fillRect(0, 356, W, 190);
  ctx.fillStyle = '#8a4a1a';
  for (let y = 394; y < 546; y += 42) ctx.fillRect(0, y, W, 3);
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  for (let y = 362; y < 546; y += 42) ctx.fillRect(0, y, W, 2);
  ctx.fillStyle = '#7e4517';
  ctx.fillRect(0, 546, W, 174);
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(0, 546, W, 8);
  // Big leaves at bottom corners.
  ctx.fillStyle = '#3f8a2e';
  for (const [lx, flip] of [[-10, 1], [1290, -1]]) {
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.ellipse(lx + flip * (20 + i * 12), 700 - i * 8, 26, 12, flip * (0.6 - i * 0.25), 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// --- HUD: orange bar, coins + hearts, served + progress, timer, pause ---
function drawHeart(ctx, x, y, s, filled) {
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.35);
  ctx.bezierCurveTo(x - s * 0.6, y - s * 0.25, x - s * 0.3, y - s * 0.7, x, y - s * 0.2);
  ctx.bezierCurveTo(x + s * 0.3, y - s * 0.7, x + s * 0.6, y - s * 0.25, x, y + s * 0.35);
  ctx.closePath();
  ctx.fillStyle = filled ? '#ff4d4d' : 'rgba(0,0,0,0.25)';
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = INK;
  ctx.stroke();
}

function drawHUD(ctx, st) {
  const g = ctx.createLinearGradient(0, 0, 0, HUD.h);
  g.addColorStop(0, '#f08c2e');
  g.addColorStop(1, '#d96a12');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, HUD.h);
  ctx.fillStyle = '#9a4d0d';
  ctx.fillRect(0, HUD.h - 5, W, 5);

  // Coins
  circle(ctx, 34, 26, 17);
  ctx.fillStyle = '#ffd94d';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = INK;
  ctx.stroke();
  circle(ctx, 34, 26, 10);
  ctx.strokeStyle = '#c98a1b';
  ctx.lineWidth = 2;
  ctx.stroke();
  text(ctx, String(st.coins), 60, 27, 24, '#ffffff', 'left');

  // Hearts
  for (let i = 0; i < 3; i++) drawHeart(ctx, 150 + i * 30, 26, 20, i < st.hearts);

  // Served count (person icon) + progress bar (centre)
  circle(ctx, 500, 20, 9);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(500, 40, 13, Math.PI, 0);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.stroke();
  text(ctx, String(st.served), 540, 27, 24, '#ffffff', 'left');
  rr(ctx, 590, 16, 260, 20, 10);
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fill();
  const prog = Math.min(1, st.score / SCORE_TARGET);
  if (prog > 0) {
    rr(ctx, 592, 18, 256 * prog, 16, 8);
    ctx.fillStyle = '#ffd94d';
    ctx.fill();
  }
  text(ctx, `${st.score}/${SCORE_TARGET}`, 720, 27, 16, '#ffffff');
  if (st.streak >= 1) text(ctx, `Combo x${st.comboMult}`, 720, 48, 15, '#ffd94d');

  // Timer
  const mm = Math.floor(st.timeLeft / 60);
  const ss = String(Math.floor(st.timeLeft % 60)).padStart(2, '0');
  rr(ctx, 1080, 10, 96, 36, 10);
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fill();
  text(ctx, `${mm}:${ss}`, 1128, 29, 22, '#ffffff');

  // Pause button
  rr(ctx, PAUSE_BTN.x, PAUSE_BTN.y, PAUSE_BTN.w, PAUSE_BTN.h, 10);
  ctx.fillStyle = '#ff8c2e';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = INK;
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(PAUSE_BTN.x + 20, PAUSE_BTN.y + 10, 7, 20);
  ctx.fillRect(PAUSE_BTN.x + 33, PAUSE_BTN.y + 10, 7, 20);
}

// --- Customers: big detailed cartoon characters, like the reference ---
// Head r 34 at cy 278, torso down to the counter top (356).
function drawCustomer(ctx, slot, c, t) {
  const x = slot.x;
  const bob = Math.sin(t * 2 + slot.x) * 2;
  const wig = c.wiggle > 0 ? Math.sin(t * 28) * 3 : 0;
  const cx = x + wig;
  const look = c.look;
  const headY = 278 + bob;

  // Raised arm + thumb (like the reference's cheerful wave).
  ctx.strokeStyle = look.skin;
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx + 52, 336);
  ctx.quadraticCurveTo(cx + 82, 312, cx + 76, 272);
  ctx.stroke();
  circle(ctx, cx + 76, 264, 10);
  ctx.fillStyle = look.skin;
  ctx.fill();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;
  ctx.stroke();
  // Thumb.
  ctx.beginPath();
  ctx.moveTo(cx + 76, 256);
  ctx.lineTo(cx + 76, 246);
  ctx.lineWidth = 6;
  ctx.strokeStyle = look.skin;
  ctx.stroke();

  // Torso: shirt with collar, buttons / trim per character.
  ctx.beginPath();
  ctx.moveTo(cx - 62, 360);
  ctx.quadraticCurveTo(cx - 66, 312, cx - 38, 300);
  ctx.lineTo(cx + 38, 300);
  ctx.quadraticCurveTo(cx + 66, 312, cx + 62, 360);
  ctx.closePath();
  ctx.fillStyle = look.shirt;
  ctx.fill();
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = INK;
  ctx.stroke();
  if (look.style === 'afro') {
    // Green dress with gold neckline trim.
    ctx.beginPath();
    ctx.moveTo(cx - 30, 302);
    ctx.quadraticCurveTo(cx, 322, cx + 30, 302);
    ctx.lineWidth = 5;
    ctx.strokeStyle = look.shirt2;
    ctx.stroke();
    ctx.fillStyle = look.shirt2;
    circle(ctx, cx - 14, 312, 3.5);
    ctx.fill();
    circle(ctx, cx + 14, 312, 3.5);
    ctx.fill();
  } else if (look.style === 'glasses') {
    // Brown shirt: subtle plaid lines + pocket.
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 56, 326); ctx.lineTo(cx + 56, 326);
    ctx.moveTo(cx - 58, 346); ctx.lineTo(cx + 58, 346);
    ctx.stroke();
    rr(ctx, cx - 42, 318, 22, 18, 3);
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fill();
  } else {
    // Polo collar + buttons.
    ctx.beginPath();
    ctx.moveTo(cx - 16, 300);
    ctx.lineTo(cx, 316);
    ctx.lineTo(cx + 16, 300);
    ctx.lineWidth = 3;
    ctx.strokeStyle = look.shirt2;
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    circle(ctx, cx, 330, 3);
    ctx.fill();
    circle(ctx, cx, 344, 3);
    ctx.fill();
  }

  // Neck.
  ctx.fillStyle = look.skin;
  ctx.fillRect(cx - 12, 292, 24, 16);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx - 12, 292); ctx.lineTo(cx - 12, 306);
  ctx.moveTo(cx + 12, 292); ctx.lineTo(cx + 12, 306);
  ctx.stroke();

  // Head.
  circle(ctx, cx, headY, 34);
  ctx.fillStyle = look.skin;
  ctx.fill();
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = INK;
  ctx.stroke();
  // Ears.
  circle(ctx, cx - 33, headY + 2, 6);
  ctx.fillStyle = look.skin;
  ctx.fill();
  ctx.stroke();
  circle(ctx, cx + 33, headY + 2, 6);
  ctx.fill();
  ctx.stroke();

  // Hair per character.
  ctx.fillStyle = look.hair;
  if (look.style === 'afro') {
    // Big curly afro: cluster of puffs around the head.
    const puffs = [[-28, -14, 16], [-12, -28, 18], [8, -30, 18], [26, -16, 16], [-30, 4, 12], [30, 2, 12], [0, -22, 16], [-18, -22, 14], [18, -24, 14]];
    for (const [hx, hy, hr] of puffs) {
      circle(ctx, cx + hx, headY + hy, hr);
      ctx.fill();
    }
    // Gold earrings.
    circle(ctx, cx - 33, headY + 12, 4);
    ctx.fillStyle = '#f2c14e';
    ctx.fill();
    circle(ctx, cx + 33, headY + 12, 4);
    ctx.fill();
  } else if (look.style === 'bun') {
    ctx.beginPath();
    ctx.arc(cx, headY - 4, 34, Math.PI, 0);
    ctx.fill();
    circle(ctx, cx, headY - 38, 13);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, headY - 4, 34, Math.PI * 1.05, Math.PI * 1.95);
    ctx.fillStyle = look.hair;
    ctx.fill();
  } else if (look.style === 'spiky') {
    ctx.beginPath();
    ctx.moveTo(cx - 33, headY + 2);
    for (let i = 0; i <= 6; i++) {
      const px = cx - 33 + i * 11;
      ctx.lineTo(px, headY - 26 - (i % 2) * 10);
      ctx.lineTo(px + 5.5, headY - 8);
    }
    ctx.lineTo(cx + 33, headY + 2);
    ctx.closePath();
    ctx.fill();
  } else if (look.style === 'sidepart') {
    // Brown side-part swoosh.
    ctx.beginPath();
    ctx.arc(cx, headY - 6, 34, Math.PI * 1.02, Math.PI * 1.98);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 14, headY - 30, 20, 10, 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx - 18, headY - 26, 14, 8, -0.3, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Glasses man: short black hair, neat side sweep.
    ctx.beginPath();
    ctx.arc(cx, headY - 6, 34, Math.PI * 1.02, Math.PI * 1.98);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 8, headY - 28, 18, 9, 0.25, 0, Math.PI * 2);
    ctx.fill();
  }

  // Face: eyes with shine, eyebrows, blush, smile.
  ctx.fillStyle = 'rgba(255,120,120,0.35)';
  circle(ctx, cx - 20, headY + 10, 5);
  ctx.fill();
  circle(ctx, cx + 20, headY + 10, 5);
  ctx.fill();
  ctx.fillStyle = INK;
  if (c.happy > 0) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = INK;
    ctx.beginPath(); ctx.arc(cx - 12, headY + 2, 5, Math.PI, 0); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx + 12, headY + 2, 5, Math.PI, 0); ctx.stroke();
  } else {
    circle(ctx, cx - 12, headY + 2, 4);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    circle(ctx, cx - 11, headY + 1, 1.4);
    ctx.fill();
    ctx.fillStyle = INK;
    circle(ctx, cx + 12, headY + 2, 4);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    circle(ctx, cx + 13, headY + 1, 1.4);
    ctx.fill();
  }
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx - 18, headY - 8);
  ctx.quadraticCurveTo(cx - 12, headY - 11, cx - 6, headY - 8);
  ctx.moveTo(cx + 6, headY - 8);
  ctx.quadraticCurveTo(cx + 12, headY - 11, cx + 18, headY - 8);
  ctx.stroke();
  ctx.lineWidth = 3;
  ctx.beginPath();
  if (c.angry > 0) ctx.arc(cx, headY + 26, 9, Math.PI * 1.15, Math.PI * 1.85);
  else ctx.arc(cx, headY + 12, 10, Math.PI * 0.15, Math.PI * 0.85);
  ctx.stroke();
  if (look.style === 'glasses') {
    ctx.lineWidth = 3;
    circle(ctx, cx - 12, headY + 2, 11);
    ctx.stroke();
    circle(ctx, cx + 12, headY + 2, 11);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 1, headY + 2);
    ctx.lineTo(cx + 1, headY + 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 23, headY + 0);
    ctx.lineTo(cx - 33, headY - 2);
    ctx.moveTo(cx + 23, headY + 0);
    ctx.lineTo(cx + 33, headY - 2);
    ctx.stroke();
  }
  if (c.happy > 0) {
    ctx.fillStyle = '#ffd94d';
    for (const [sx, sy] of [[-26, -46], [24, -50], [0, -56]]) {
      drawStar(ctx, cx + sx, headY + sy, 6);
    }
  }
}

function drawStar(ctx, x, y, r) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const rr2 = i % 2 ? r * 0.45 : r;
    const px = x + Math.cos(a) * rr2;
    const py = y + Math.sin(a) * rr2;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function drawTicket(ctx, slot, c, t) {
  const x = slot.x - TICKET.w / 2;
  const y = TICKET.y;
  const wig = c.wiggle > 0 ? Math.sin(t * 28) * 3 : 0;
  // Soft shadow, then the big white card.
  rr(ctx, x + wig + 4, y + 5, TICKET.w, TICKET.h, 14);
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fill();
  rr(ctx, x + wig, y, TICKET.w, TICKET.h, 14);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = INK;
  ctx.stroke();
  const dish = DISHES[c.dish];
  // Large detailed dish — the hero of the card, like the reference.
  drawDishIcon(ctx, c.dish, slot.x + wig, y + 66, 108);
  text(ctx, dish.name, slot.x + wig, y + 136, 16, '#4a2c14');
  // Patience bar.
  const frac = Math.max(0, c.patience / c.patienceMax);
  rr(ctx, x + wig + 18, y + 152, TICKET.w - 36, 12, 6);
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fill();
  if (frac > 0) {
    rr(ctx, x + wig + 19, y + 153, (TICKET.w - 38) * frac, 10, 5);
    ctx.fillStyle = frac > 0.5 ? '#58c94d' : frac > 0.25 ? '#f2c14e' : '#ff5a4d';
    ctx.fill();
  }
}

// --- Central teal counter + plates ---
function drawCounter(ctx, st) {
  rr(ctx, COUNTER.x, COUNTER.y, COUNTER.w, COUNTER.h, 14);
  const g = ctx.createLinearGradient(0, COUNTER.y, 0, COUNTER.y + COUNTER.h);
  g.addColorStop(0, '#1fc4b8');
  g.addColorStop(1, '#0e7c75');
  ctx.fillStyle = g;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#095c56';
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.fillRect(COUNTER.x + 8, COUNTER.y + 6, COUNTER.w - 16, 8);
  text(ctx, 'MEJA SAJI', COUNTER.x + COUNTER.w / 2, COUNTER.y + 26, 13, 'rgba(255,255,255,0.85)');
  for (let i = 0; i < st.plates.length; i++) {
    const p = st.plates[i];
    if (p.dish) drawDishIcon(ctx, p.dish, p.x, p.y, 56);
    else {
      plate(ctx, p.x, p.y, 26);
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      circle(ctx, p.x, p.y, 26);
      ctx.fill();
    }
  }
}

// --- Cooking stations ---
function drawTimerRing(ctx, x, y, frac, secondsLeft) {
  circle(ctx, x, y, 16);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#58c94d';
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, 12, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac);
  ctx.strokeStyle = '#2fae4e';
  ctx.lineWidth = 5;
  ctx.stroke();
  text(ctx, String(Math.ceil(secondsLeft)), x, y + 1, 13, '#2b7a3a');
}

function drawStation(ctx, stn, t) {
  const { x, y, w, h } = stn;
  // Base mat
  rr(ctx, x - 6, y - 6, w + 12, h + 12, 12);
  ctx.fillStyle = stn.type === 'pan' ? '#7a4a8a' : stn.type === 'pot' ? '#8a5a9a' : '#5a7a9a';
  ctx.globalAlpha = 0.55;
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.lineWidth = 3;
  ctx.strokeStyle = INK;

  if (stn.type === 'blender') {
    rr(ctx, x + 18, y + 34, 56, 46, 8);
    ctx.fillStyle = '#f2f2f2';
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#d94f3d';
    ctx.fillRect(x + 18, y + 66, 56, 14);
    ctx.beginPath();
    ctx.moveTo(x + 30, y + 34);
    ctx.lineTo(x + 82, y + 34);
    ctx.lineTo(x + 74, y - 6);
    ctx.lineTo(x + 38, y - 6);
    ctx.closePath();
    ctx.fillStyle = 'rgba(180,225,245,0.85)';
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 34, y + 30);
    ctx.lineTo(x + 78, y + 30);
    ctx.lineTo(x + 72, y + 2);
    ctx.lineTo(x + 40, y + 2);
    ctx.closePath();
    ctx.fillStyle = stn.state === 'idle' ? '#f2a0c0' : '#f27bb0';
    ctx.fill();
    if (stn.state === 'cooking') {
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      circle(ctx, x + 56, y + 12, 5 + Math.sin(t * 10) * 2);
      ctx.fill();
    }
  } else if (stn.type === 'board') {
    rr(ctx, x + 6, y + 14, w - 12, h - 28, 10);
    ctx.fillStyle = '#e8c88a';
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#c9a05e';
    ctx.fillRect(x + 14, y + 22, w - 28, 3);
    // Knife
    ctx.save();
    ctx.translate(x + w - 34, y + 40);
    ctx.rotate(0.5);
    rr(ctx, 0, 0, 44, 10, 3);
    ctx.fillStyle = '#d8d8d8';
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    if (stn.state !== 'idle') {
      const dish = stn.dish;
      if (dish === 'sushi') drawIngredientIcon(ctx, 'rice', x + w / 2 - 20, y + 44, 44);
      if (dish === 'salad') {
        circle(ctx, x + w / 2 - 14, y + 44, 12);
        ctx.fillStyle = '#e84a3d';
        ctx.fill();
        ctx.stroke();
        circle(ctx, x + w / 2 + 16, y + 44, 12);
        ctx.fillStyle = '#7ec850';
        ctx.fill();
        ctx.stroke();
      }
    }
  } else if (stn.type === 'pan') {
    ctx.beginPath();
    ctx.moveTo(x + w - 8, y + h / 2);
    ctx.lineTo(x + w + 26, y + h / 2 - 6);
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#3a3a3a';
    ctx.stroke();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
    circle(ctx, x + w / 2 - 4, y + h / 2, 40);
    ctx.fillStyle = '#3f3f46';
    ctx.fill();
    ctx.stroke();
    circle(ctx, x + w / 2 - 4, y + h / 2, 32);
    ctx.fillStyle = '#55555e';
    ctx.fill();
    if (stn.state !== 'idle' && stn.dish) {
      if (stn.dish === 'dumpling') {
        for (let i = -1; i <= 1; i++) {
          ctx.beginPath();
          ctx.arc(x + w / 2 - 4 + i * 18, y + h / 2 + 4, 11, Math.PI, 0);
          ctx.closePath();
          ctx.fillStyle = '#f6d9a0';
          ctx.fill();
          ctx.stroke();
        }
      } else if (stn.dish === 'burger') {
        ctx.beginPath();
        ctx.ellipse(x + w / 2 - 4, y + h / 2, 26, 14, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#8a5a2e';
        ctx.fill();
        ctx.stroke();
      }
    }
    if (stn.state === 'cooking') {
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 3;
      for (let i = 0; i < 2; i++) {
        const sx = x + w / 2 - 14 + i * 22;
        ctx.beginPath();
        ctx.moveTo(sx, y + 16);
        ctx.quadraticCurveTo(sx + 6, y + 2, sx, y - 8);
        ctx.stroke();
      }
    }
  } else if (stn.type === 'pot') {
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h / 2 + 6, 52, 34, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#4a4a55';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = INK;
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h / 2 - 2, 46, 22, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#fff8e6';
    ctx.fill();
    ctx.stroke();
    if (stn.state !== 'idle') {
      for (let i = -1; i <= 1; i++) {
        circle(ctx, x + w / 2 + i * 16, y + h / 2 - 4, 7);
        ctx.fillStyle = '#d98a4d';
        ctx.fill();
      }
    }
    if (stn.state === 'cooking') {
      ctx.strokeStyle = 'rgba(255,255,255,0.7)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + w / 2 - 10, y - 2);
      ctx.quadraticCurveTo(x + w / 2 - 4, y - 14, x + w / 2 - 10, y - 24);
      ctx.stroke();
    }
  }

  // Timer ring while cooking / done badge when ready.
  if (stn.state === 'cooking') {
    const frac = stn.dur ? stn.t / stn.dur : 0;
    drawTimerRing(ctx, x + w - 4, y - 2, frac, (stn.dur - stn.t) / 1000);
  } else if (stn.state === 'done') {
    const bx = x + w - 4;
    const by = y - 2;
    circle(ctx, bx, by, 16);
    ctx.fillStyle = '#58c94d';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = INK;
    ctx.stroke();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(bx - 7, by);
    ctx.lineTo(bx - 1, by + 6);
    ctx.lineTo(bx + 8, by - 6);
    ctx.stroke();
  }
  // No text labels on stations — the reference has none; shapes speak.
}

// --- Ingredient trays ---
function drawTray(ctx, tray, st, t) {
  const locked = tray.lockedUntil && !st.unlockedBurger;
  rr(ctx, tray.x, tray.y, tray.w, tray.h, 12);
  ctx.fillStyle = locked ? '#8a8a8a' : '#e8c88a';
  ctx.fill();
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = INK;
  ctx.stroke();
  rr(ctx, tray.x + 8, tray.y + 8, tray.w - 16, tray.h - 40, 8);
  ctx.fillStyle = locked ? '#6a6a6a' : '#fff3d6';
  ctx.fill();
  ctx.stroke();
  if (!locked) {
    drawIngredientIcon(ctx, tray.id, tray.x + tray.w / 2, tray.y + 42, 64);
  } else {
    // Padlock
    rr(ctx, tray.x + tray.w / 2 - 16, tray.y + 30, 32, 26, 5);
    ctx.fillStyle = '#ffd94d';
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(tray.x + tray.w / 2, tray.y + 28, 11, Math.PI, 0);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ffd94d';
    ctx.stroke();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 3;
  }
  const label = locked
    ? `Patty • ${Math.ceil(tray.lockedUntil - st.elapsed)} dtk`
    : (dishByIngredient(tray.id)?.trayLabel ?? tray.id);
  text(ctx, label, tray.x + tray.w / 2, tray.y + tray.h - 16, 15, '#ffffff');
  if (st.hand && st.hand.kind === 'ing' && st.hand.id === tray.id) {
    rr(ctx, tray.x - 4, tray.y - 4, tray.w + 8, tray.h + 8, 14);
    ctx.strokeStyle = '#ffd94d';
    ctx.lineWidth = 4;
    ctx.stroke();
  }
}

// --- Hand (held item follows the mouse) ---
function drawHand(ctx, st, mouse) {
  if (!st.hand || !mouse) return;
  const x = mouse.x;
  const y = mouse.y - 34;
  circle(ctx, x, y, 30);
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = INK;
  ctx.stroke();
  if (st.hand.kind === 'ing') drawIngredientIcon(ctx, st.hand.id, x, y, 44);
  else drawDishIcon(ctx, st.hand.id, x, y, 48);
  text(ctx, st.hand.kind === 'ing' ? 'Bahan' : DISHES[st.hand.id].name, x, y + 44, 13, '#ffffff');
}

// --- Floaters, overlays ---
function drawFloaters(ctx, st) {
  for (const f of st.floaters) {
    const a = 1 - f.t / 1.6;
    ctx.globalAlpha = a;
    text(ctx, f.text, f.x, f.y - f.t * 34, 20, f.color);
    ctx.globalAlpha = 1;
  }
}

function drawOverlays(ctx, st, t) {
  if (st.paused && !st.over) {
    ctx.fillStyle = 'rgba(30,20,10,0.55)';
    ctx.fillRect(0, 0, W, H);
    rr(ctx, 440, 280, 400, 160, 18);
    ctx.fillStyle = '#fff8e6';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = INK;
    ctx.stroke();
    text(ctx, 'JEDA', 640, 330, 40, '#d96a12');
    text(ctx, 'Tekan P untuk lanjut', 640, 386, 18, '#4a2c14');
  }
  if (st.over) {
    ctx.fillStyle = 'rgba(30,20,10,0.62)';
    ctx.fillRect(0, 0, W, H);
    rr(ctx, 380, 180, 520, 360, 20);
    ctx.fillStyle = '#fff8e6';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = INK;
    ctx.stroke();
    text(ctx, st.overReason, 640, 240, 40, '#d96a12');
    text(ctx, `Skor: ${st.score}  •  Tersaji: ${st.served}  •  Koin: ${st.coins}`, 640, 306, 22, '#4a2c14');
    const target = st.score >= SCORE_TARGET ? 'Target 1210 TERCAPAI!' : `Target 1210 — kurang ${SCORE_TARGET - st.score}`;
    text(ctx, target, 640, 348, 20, st.score >= SCORE_TARGET ? '#2fae4e' : '#8a6a45');
    rr(ctx, 520, 400, 240, 64, 14);
    ctx.fillStyle = '#58c94d';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = INK;
    ctx.stroke();
    text(ctx, 'MAIN LAGI (R)', 640, 433, 24, '#ffffff');
    text(ctx, 'Klik tombol / tekan R untuk restart', 640, 498, 16, '#8a6a45');
  }
  if (st.elapsed >= 60 && st.elapsed < 63) {
    rr(ctx, 440, 90, 400, 52, 12);
    ctx.fillStyle = 'rgba(255,217,77,0.95)';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = INK;
    ctx.stroke();
    text(ctx, 'Burger Ceria dibuka! Patty siap dimasak', 640, 117, 18, '#4a2c14');
  }
}

export function render(ctx, st, mouse, t) {
  drawBackground(ctx);
  drawHUD(ctx, st);
  // Stations sit on the wooden counter front.
  for (const s of st.stations) drawStation(ctx, s, t);
  // Trays along the bottom.
  for (const tray of TRAYS) drawTray(ctx, tray, st, t);
  // Customers behind the counter, tickets above them.
  for (const slot of st.slots) {
    if (slot.customer) drawCustomer(ctx, slot, slot.customer, t);
  }
  for (const slot of st.slots) {
    if (slot.customer) drawTicket(ctx, slot, slot.customer, t);
  }
  drawCounter(ctx, st);
  drawFloaters(ctx, st);
  drawHand(ctx, st, mouse);
  drawOverlays(ctx, st, t);
}
