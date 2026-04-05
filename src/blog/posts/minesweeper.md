---
title: "Minesweeper"
description: "Reveal squares on a grid without hitting hidden mines. Logic required."
date: 2026-04-03
---

Minesweeper is a logic puzzle played on a grid of hidden squares. Some squares contain mines. Your job is to reveal every safe square without detonating a mine.

## How it works

Click a square to reveal it. If it's a mine, the game ends. If it's safe, it shows a number indicating how many of its eight neighboring squares contain mines. A blank square (zero neighbors with mines) automatically reveals all adjacent safe squares. Use the numbers to deduce which squares are safe and which are mines.

## Controls

- **Left click:** Reveal a square
- **Right click:** Flag a square as a suspected mine
- **Mobile:** Tap to reveal, long press to flag

## Strategy

Start by clicking near the center — edges and corners give less information. When a number matches the count of adjacent flagged squares, all remaining neighbors are safe. Look for patterns: a "1" next to a single unrevealed square means that square is the mine.

[Play Minesweeper](/games/minesweeper/)
