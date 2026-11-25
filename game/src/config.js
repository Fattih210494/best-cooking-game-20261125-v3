// Dapur Ceria v4 — layout & recipes. Canvas logical size 1280x720, matching the
// reference: orange HUD bar on top, customers + white ticket cards along the top edge,
// central teal counter with plates, cooking stations left & right, ingredient trays
// along the bottom, terrace garden with fountain & pink pillars behind.

export const W = 1280;
export const H = 720;

export const SHIFT_SECONDS = 180;
export const SCORE_TARGET = 1210;
export const MAX_HEARTS = 3;
export const BURGER_UNLOCK_AT = 60; // seconds elapsed

// Dishes: one ingredient + one station type each.
export const DISHES = {
  dumpling: {
    id: 'dumpling', name: 'Pangsit Goreng', ingredient: 'dumpling', station: 'pan',
    cookMs: 4000, price: 60, trayLabel: 'Pangsit',
  },
  sushi: {
    id: 'sushi', name: 'Sushi Roll', ingredient: 'rice', station: 'board',
    cookMs: 3000, price: 70, trayLabel: 'Nasi',
  },
  ricebowl: {
    id: 'ricebowl', name: 'Nasi Ayam', ingredient: 'chicken', station: 'pot',
    cookMs: 6000, price: 80, trayLabel: 'Ayam',
  },
  drink: {
    id: 'drink', name: 'Es Stroberi', ingredient: 'strawberry', station: 'blender',
    cookMs: 3000, price: 50, trayLabel: 'Stroberi',
  },
  salad: {
    id: 'salad', name: 'Salad Tomat', ingredient: 'tomato', station: 'board',
    cookMs: 2000, price: 40, trayLabel: 'Tomat',
  },
  burger: {
    id: 'burger', name: 'Burger Ceria', ingredient: 'patty', station: 'pan',
    cookMs: 6000, price: 120, trayLabel: 'Patty', unlockAt: BURGER_UNLOCK_AT,
  },
};

// Ingredient trays along the bottom (6 trays, like the reference).
export const TRAYS = [
  { id: 'dumpling', x: 36, y: 566, w: 184, h: 118 },
  { id: 'rice', x: 242, y: 566, w: 184, h: 118 },
  { id: 'chicken', x: 448, y: 566, w: 184, h: 118 },
  { id: 'strawberry', x: 654, y: 566, w: 184, h: 118 },
  { id: 'tomato', x: 860, y: 566, w: 184, h: 118 },
  { id: 'patty', x: 1066, y: 566, w: 178, h: 118, lockedUntil: BURGER_UNLOCK_AT },
];

// Cooking stations. Left: blender + board + 2 pans. Right: 2 pots + 2 pans.
// Kitchen sits lower (y 360+) so customers + big ticket cards fit above it,
// like the reference.
export const STATIONS = [
  { id: 'blender', type: 'blender', label: 'Blender', x: 60, y: 360, w: 118, h: 92 },
  { id: 'board', type: 'board', label: 'Talenan', x: 200, y: 360, w: 168, h: 86 },
  { id: 'panA', type: 'pan', label: 'Wajan', x: 60, y: 466, w: 140, h: 82 },
  { id: 'panB', type: 'pan', label: 'Wajan', x: 222, y: 466, w: 140, h: 82 },
  { id: 'potA', type: 'pot', label: 'Panci Nasi', x: 918, y: 360, w: 142, h: 92 },
  { id: 'potB', type: 'pot', label: 'Panci Sup', x: 1082, y: 360, w: 142, h: 92 },
  { id: 'panC', type: 'pan', label: 'Wajan', x: 918, y: 466, w: 140, h: 82 },
  { id: 'panD', type: 'pan', label: 'Wajan', x: 1082, y: 466, w: 140, h: 82 },
];

// Central teal counter with 6 plate slots (2 cols x 3 rows).
export const COUNTER = { x: 400, y: 356, w: 480, h: 184 };
export const PLATES = [
  { x: 500, y: 400 }, { x: 770, y: 400 },
  { x: 500, y: 450 }, { x: 770, y: 450 },
  { x: 500, y: 500 }, { x: 770, y: 500 },
];

// Customer slots along the top edge (behind the counter).
export const CUSTOMER_SLOTS = [255, 640, 1025];
export const TICKET = { w: 190, h: 174, y: 66 };

// HUD bar.
export const HUD = { h: 56 };
export const PAUSE_BTN = { x: 1208, y: 8, w: 60, h: 40 };

// Customer looks — the first three are the reference trio (in order):
// glasses man in a brown shirt, brown-haired man in a blue shirt,
// curly-haired woman in a green dress. The rest rotate in afterwards.
export const LOOKS = [
  { skin: '#f2c79b', hair: '#2b2b2b', style: 'glasses', shirt: '#a8542e', shirt2: '#c96a3a', name: 'Budi' },
  { skin: '#f2c79b', hair: '#7a4a21', style: 'sidepart', shirt: '#2e6fd8', shirt2: '#4a86e8', name: 'Andi' },
  { skin: '#8a5a3b', hair: '#1c1410', style: 'afro', shirt: '#2e9e5b', shirt2: '#f2c14e', name: 'Sari' },
  { skin: '#e8b48a', hair: '#3a2a1a', style: 'bun', shirt: '#e88bb0', shirt2: '#f2a0c0', name: 'Maya' },
  { skin: '#c98d5f', hair: '#111111', style: 'spiky', shirt: '#f2a71b', shirt2: '#f7c04a', name: 'Riko' },
];

export function dishByIngredient(ingredient) {
  return Object.values(DISHES).find((d) => d.ingredient === ingredient) ?? null;
}

export function dishForStation(ingredient, stationType) {
  const d = dishByIngredient(ingredient);
  return d && d.station === stationType ? d : null;
}
