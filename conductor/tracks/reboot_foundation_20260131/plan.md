# Implementation Plan: Project Reboot & Theme Foundation

## Phase 1: Theme Engine & Global Styles
- [ ] Task: Define Theme Schema and Constants
    - [ ] Create `lib/themes.ts` with color palettes and style configurations.
- [ ] Task: Implement Theme Provider
    - [ ] Wrap the application in a context provider that manages the active theme.
- [ ] Task: Update Global CSS
    - [ ] Refactor `app/globals.css` to use CSS variables driven by the theme.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Theme Engine & Global Styles' (Protocol in workflow.md)

## Phase 2: Core Component Refactor
- [ ] Task: Refactor Layout & Navigation
    - [ ] Update `components/BottomNav.tsx` to support retro styling.
- [ ] Task: Implement Base "Retro" Components
    - [ ] Create reusable components for "Cartridge-style" cards and "CRT-effect" containers.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Core Component Refactor' (Protocol in workflow.md)

## Phase 3: Cleanup & Verification
- [ ] Task: Remove Legacy UI Dependencies
    - [ ] Audit and remove unused CSS or components that clash with the new aesthetic.
- [ ] Task: Final Theme Verification
    - [ ] Ensure the theme can be toggled and renders correctly across all current pages.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Cleanup & Verification' (Protocol in workflow.md)
