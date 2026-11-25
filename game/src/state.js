// Dapur Ceria v4 — game state & rules. No rendering here, only logic.

import {
  BURGER_UNLOCK_AT, CUSTOMER_SLOTS, DISHES, LOOKS, MAX_HEARTS, PLATES,
  SCORE_TARGET, SHIFT_SECONDS, STATIONS, TRAYS, dishByIngredient, dishForStation,
} from './config.js';

function rand(min, max) { return min + Math.random() * (max - min); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export class GameState {
  constructor() {
    this.reset();
  }

  reset() {
    this.timeLeft = SHIFT_SECONDS;
    this.elapsed = 0;
    this.score = 0;
    this.coins = 0;
    this.served = 0;
    this.hearts = MAX_HEARTS;
    this.streak = 0;
    this.hand = null; // null | { kind: 'ing', id } | { kind: 'dish', id }
    this.paused = false;
    this.muted = false;
    this.over = false;
    this.overReason = '';
    this.burgerToastAt = -1;
    this.floaters = []; // { x, y, text, color, t }
    this.slots = CUSTOMER_SLOTS.map((x) => ({ x, customer: null, spawnIn: 0 }));
    this.stations = STATIONS.map((s) => ({ ...s, state: 'idle', dish: null, t: 0, dur: 0 }));
    this.plates = PLATES.map((p) => ({ ...p, dish: null }));
    // 3 customers waiting immediately — the reference trio, in order, each
    // ordering a DIFFERENT dish — so the start screen already shows full tickets.
    const deck = [...this.availableDishes()].sort(() => Math.random() - 0.5);
    this.slots.forEach((slot, i) => {
      slot.customer = this.makeCustomer(LOOKS[i % 3], deck[i % deck.length].id);
      slot.spawnIn = 0;
    });
    this.slots[0].customer.patience = 30;
    this.slots[1].customer.patience = 34;
    this.slots[2].customer.patience = 26;
  }

  get comboMult() { return Math.min(1 + this.streak, 5); }
  get unlockedBurger() { return this.elapsed >= BURGER_UNLOCK_AT; }

  availableDishes() {
    return Object.values(DISHES).filter((d) => !d.unlockAt || this.unlockedBurger);
  }

  makeCustomer(look, dishId) {
    const dish = dishId ? DISHES[dishId] : pick(this.availableDishes());
    const chosen = look ?? pick(LOOKS);
    return {
      dish: dish.id, look: chosen,
      patience: rand(26, 36), patienceMax: 36,
      wiggle: 0, happy: 0, angry: 0, servedFlash: 0,
    };
  }

  addFloater(x, y, text, color) {
    this.floaters.push({ x, y, text, color, t: 0 });
  }

  update(dt) {
    if (this.paused || this.over) return;
    this.elapsed += dt;
    this.timeLeft = Math.max(0, SHIFT_SECONDS - this.elapsed);
    if (this.elapsed >= BURGER_UNLOCK_AT && this.burgerToastAt < 0) {
      this.burgerToastAt = this.elapsed;
      this.addFloater(640, 250, 'Burger Ceria dibuka!', '#ffd94d');
    }
    if (this.timeLeft <= 0) { this.endGame('Waktu habis!'); return; }

    // Customers: patience drains, expired orders cost a heart.
    for (const slot of this.slots) {
      const c = slot.customer;
      if (c) {
        c.patience -= dt;
        if (c.wiggle > 0) c.wiggle -= dt;
        if (c.happy > 0) c.happy -= dt;
        if (c.angry > 0) c.angry -= dt;
        if (c.servedFlash > 0) c.servedFlash -= dt;
        if (c.patience <= 0) {
          c.angry = 1;
          this.hearts -= 1;
          this.streak = 0;
          this.addFloater(slot.x, 190, 'Pelanggan kabur!', '#ff5a4d');
          slot.customer = null;
          slot.spawnIn = rand(2.5, 5);
          if (this.hearts <= 0) { this.endGame('Pelanggan habis!'); return; }
        }
      } else {
        slot.spawnIn -= dt;
        if (slot.spawnIn <= 0) slot.customer = this.makeCustomer();
      }
    }

    // Cooking stations.
    for (const st of this.stations) {
      if (st.state === 'cooking') {
        st.t += dt * 1000;
        if (st.t >= st.dur) { st.state = 'done'; st.t = st.dur; }
      }
    }

    for (const f of this.floaters) f.t += dt;
    this.floaters = this.floaters.filter((f) => f.t < 1.6);
  }

  endGame(reason) {
    this.over = true;
    this.overReason = reason;
  }

  // --- Player actions (called by input) ---

  grabIngredient(id) {
    if (this.over || this.paused) return false;
    if (id === 'patty' && !this.unlockedBurger) return false;
    if (this.hand && this.hand.kind === 'dish') return false;
    this.hand = { kind: 'ing', id };
    return true;
  }

  useStation(stationId) {
    if (this.over || this.paused) return false;
    const st = this.stations.find((s) => s.id === stationId);
    if (!st) return false;
    if (st.state === 'cooking') return false;
    if (st.state === 'done') {
      if (this.hand) return false;
      this.hand = { kind: 'dish', id: st.dish };
      st.state = 'idle'; st.dish = null; st.t = 0;
      return true;
    }
    // idle: start cooking if the hand holds a matching ingredient.
    if (!this.hand || this.hand.kind !== 'ing') return false;
    const dish = dishForStation(this.hand.id, st.type);
    if (!dish) {
      this.addFloater(st.x + st.w / 2, st.y - 8, 'Bahan salah!', '#ff5a4d');
      return false;
    }
    if (dish.unlockAt && !this.unlockedBurger) return false;
    st.state = 'cooking';
    st.dish = dish.id;
    st.t = 0;
    st.dur = dish.cookMs;
    this.hand = null;
    return true;
  }

  plateDish(plateIndex) {
    if (this.over || this.paused) return false;
    const plate = this.plates[plateIndex];
    if (!plate) return false;
    if (this.hand && this.hand.kind === 'dish' && !plate.dish) {
      plate.dish = this.hand.id;
      this.hand = null;
      return true;
    }
    if (!this.hand && plate.dish) {
      this.hand = { kind: 'dish', id: plate.dish };
      plate.dish = null;
      return true;
    }
    return false;
  }

  plateFirstFree() {
    if (!this.hand || this.hand.kind !== 'dish') return false;
    const i = this.plates.findIndex((p) => !p.dish);
    return i >= 0 ? this.plateDish(i) : false;
  }

  serveCustomer(slotIndex) {
    if (this.over || this.paused) return false;
    const slot = this.slots[slotIndex];
    const c = slot?.customer;
    if (!c) return false;
    const dish = DISHES[c.dish];
    // Prefer a plated dish, else the dish in hand.
    const plateIdx = this.plates.findIndex((p) => p.dish === c.dish);
    if (plateIdx >= 0) {
      this.plates[plateIdx].dish = null;
    } else if (this.hand && this.hand.kind === 'dish' && this.hand.id === c.dish) {
      this.hand = null;
    } else {
      c.wiggle = 0.5;
      this.addFloater(slot.x, 190, `Butuh: ${dish.name}`, '#ff5a4d');
      return false;
    }
    const mult = this.comboMult;
    const earned = dish.price * mult;
    this.score += earned;
    this.coins += earned;
    this.served += 1;
    this.streak += 1;
    c.happy = 1;
    c.servedFlash = 1;
    this.addFloater(slot.x, 190, `+${earned}  x${mult}`, '#ffd94d');
    slot.customer = null;
    slot.spawnIn = rand(2, 4.5);
    return true;
  }

  // Keyboard shortcuts: 1 = blender, 2 = board, 3 = pan, 4/Space = plate.
  useStationType(type) {
    if (this.over || this.paused) return false;
    const free = this.stations.find((s) => s.type === type && s.state === 'idle');
    if (free) return this.useStation(free.id);
    const done = this.stations.find((s) => s.type === type && s.state === 'done');
    if (done) return this.useStation(done.id);
    return false;
  }

  togglePause() { if (!this.over) this.paused = !this.paused; }
  toggleMute() { this.muted = !this.muted; }

  status() {
    return {
      score: this.score, coins: this.coins, served: this.served,
      hearts: this.hearts, timeLeft: Math.ceil(this.timeLeft),
      combo: this.comboMult, over: this.over, paused: this.paused,
      hand: this.hand,
      customers: this.slots.map((s) => (s.customer ? s.customer.dish : null)),
      stations: this.stations.map((s) => ({ id: s.id, state: s.state, dish: s.dish, progress: s.dur ? s.t / s.dur : 0 })),
      plates: this.plates.map((p) => p.dish),
    };
  }
}

export { SCORE_TARGET, TRAYS, dishByIngredient };
