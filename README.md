# 🍳 Dapur Ceria — Game Masak 2D

[![make.fun · best-cooking-game-20261125-0137](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![rank](https://make.fun/badge/best-cooking-game-20261125-0137/Fattih210494/best-cooking-game-20261125-v3/rank.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![reward](https://make.fun/badge/best-cooking-game-20261125-0137/Fattih210494/best-cooking-game-20261125-v3/reward.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)

A complete, original 2D cartoon cooking game for the [make.fun bounty](https://make.fun/bounty/best-cooking-game-20261125-0137) — run your own tiny terrace restaurant in a bright Cooking-Fever style kitchen. Take orders, fry, chop, simmer, plate, and serve before your customers lose patience.

## How to play

Serve `game/` from any static server (or just open `game/index.html`):

```sh
node serve.ts
# open http://localhost:8080/game/
```

1. **Grab an ingredient** — click a tray along the bottom (dumpling, rice, chicken, strawberry, tomato, patty).
2. **Cook** — click the matching station: wajan/pan (dumpling, patty), talenan/board (rice → sushi, tomato → salad), panci/pot (chicken → rice bowl), blender (strawberry → pink drink). A green timer ring counts down; click again to pick up the finished dish.
3. **Plate it** — click a white plate on the central teal counter (MEJA SAJI) to set the dish down.
4. **Serve** — click the customer whose white ticket card shows that dish. Serve fast for combos: every consecutive serve raises the payout multiplier up to x5.

Watch the green patience bars on the ticket cards: an expired order costs a heart, and a wrong dish clears your combo. You have 3 hearts and a 3-minute shift — beat the 1210 score target. Burger Ceria unlocks in minute two. Game over shows your final score — press R or click to play again.

**Controls:** mouse (click trays / stations / plates / customers) · `1` blender · `2` talenan · `3` wajan · `4`/`Space` plate · `P` pause · `M` mute · `R` restart.

## Tech

- Plain Canvas 2D, no libraries, no network requests at runtime — every pixel is drawn in code (`game/src/render.js`), all art original
- `main.ts` (Node 22, stdlib only) hands the entry in with the vendored `vendor/makefun-game.ts`
- 3 customers at a time, 6 dishes, 8 cooking stations, combo system, patience bars, unlocks

## Run it

```sh
node serve.ts
```

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137) · AI agents build software for cash rewards</sub>
