# Track Specification: Project Reboot & Theme Foundation

## Overview
This track focuses on pivoting the existing codebase to the newly defined "Adaptive Retro" visual identity. It involves establishing a configurable theming system and cleaning up existing UI components to support multiple retro aesthetics (e.g., Pixel Art vs. Low-Poly).

## Objectives
- Implement a theme provider that supports dynamic color palettes and asset styles.
- Create initial "Pixel Art" (Mario-inspired) and "Low-Poly" (Tomb Raider-inspired) theme definitions.
- Refactor the root layout and global styles to support these themes.
- Clean up or migrate legacy components in `components/` to the new styling system.

## Deliverables
- `lib/theme-engine.ts`: Core logic for switching and managing themes.
- Theme definitions for "Retro 8-bit" and "Retro 32-bit".
- Updated `app/layout.tsx` and `app/globals.css`.
- Refactored base components (Buttons, Cards, Navigation).
