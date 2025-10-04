# Threat Simulator Game Improvements TODO

This document outlines prioritized improvements for the Threat Simulator based on UI analysis and user feedback.

## 🔴 **P0 — Functional & Credibility Blockers**

### **Critical Gameplay Issues**
- [ ] **Fix Drone Path Animation** 
  - **Problem**: Drone paths are currently "jumping" and unrealistic
  - **Impact**: Breaks immersion and credibility of simulation
  - **Fix**: Implement smooth interpolation between waypoints, realistic physics-based movement
  - **Code**: Add `dronePathInterpolation.ts` with Bezier curves and easing functions

- [ ] **Fix Drone Collision/Impact System**
  - **Problem**: Drones don't "crash" where they are supposed to
  - **Impact**: Unrealistic behavior undermines simulation accuracy
  - **Fix**: Implement proper collision detection and impact physics
  - **Code**: Add `collisionSystem.ts` with proper hit detection and debris effects

- [ ] **Implement Gradual Drone Spawning & Level Progression**
  - **Problem**: No progressive difficulty or gradual introduction of mechanics
  - **Impact**: Poor learning curve and engagement
  - **Fix**: Add wave-based spawning with increasing complexity
  - **Code**: Add `waveManager.ts` with configurable spawn patterns and level progression

### **UI/UX Critical Issues**
- [ ] **HUD Numbers Unlabeled/Outside Cards**
  - **Problem**: Four counters (Score, Threats, Neutralized, Level) are disconnected from simulator
  - **Fix**: Move labeled 4-tile HUD inside simulator card header
  ```html
  <header class="threatsim__hud" role="group" aria-label="Simulator status">
    <div class="hud-stat"><span class="hud-label">Score</span><span class="hud-value">0</span></div>
    <div class="hud-stat"><span class="hud-label">Threats</span><span class="hud-value">1</span></div>
    <div class="hud-stat"><span class="hud-label">Neutralized</span><span class="hud-value">0</span></div>
    <div class="hud-stat"><span class="hud-label">Level</span><span class="hud-value">1</span></div>
  </header>
  ```

- [ ] **Controls Lack ARIA + Keyboard Semantics**
  - **Problem**: Weapon Systems visually single-select but coded like buttons
  - **Fix**: Implement proper radiogroup with keyboard navigation
  ```html
  <nav aria-label="Weapon Systems" role="radiogroup" class="weapons">
    <button role="radio" aria-checked="true" class="weapon is-on">
      <span>Kinetic</span><span class="ammo">50/50</span>
    </button>
  </nav>
  ```

- [ ] **Color-Blind Resilience on Radar**
  - **Problem**: Hostiles rely on red fill only
  - **Fix**: Shape-code with color as secondary cue
  ```css
  .blip-hostile{fill:#ff5d5d; shape:circle}
  .blip-unknown{fill:none;stroke:#ffd166;stroke-width:2; shape:ring}
  .blip-friendly{fill:#4ade80; shape:triangle}
  ```

- [ ] **Reduced-Motion Not Enforced for Sweep**
  - **Problem**: Sweep line animates despite user preferences
  - **Fix**: Add prefers-reduced-motion media query
  ```css
  @media (prefers-reduced-motion: no-preference){
    .sweep{animation:sweep 2s linear infinite}
  }
  ```

- [ ] **Ambiguous Environment Toggles**
  - **Problem**: "Clear, Military Base, Hybrid" are unclear
  - **Fix**: Split into labeled groups
  ```
  Weather: Clear / Fog / Rain / Night
  Terrain: Military Base / Urban / Open Field  
  Rules: Conservative / Hybrid / Aggressive
  ```

- [ ] **Energy System Unclear**
  - **Problem**: Shows cost but not budget or remaining energy
  - **Fix**: Add budget bar with remaining energy display
  ```html
  <div class="budget">
    <span>Energy</span>
    <strong id="budget">25 / 100</strong>
  </div>
  ```

## 🟠 **P1 — Usability & Flow Issues**

### **Enhanced Gameplay Features**
- [ ] **Dynamic Threat Scaling**
  - **Problem**: Static threat patterns don't scale with player skill
  - **Fix**: Implement adaptive difficulty based on performance metrics
  - **Code**: Add `difficultyManager.ts` with ML-based threat adjustment

- [ ] **Multi-Wave Defense Scenarios**
  - **Problem**: Single-threat scenarios lack depth
  - **Fix**: Add complex multi-wave scenarios with different threat types
  - **Code**: Add `scenarioEngine.ts` with predefined and procedural scenarios

- [ ] **Weapon Effectiveness Matrix**
  - **Problem**: All weapons feel the same against all threats
  - **Fix**: Implement rock-paper-scissors mechanics with weapon effectiveness
  - **Code**: Add `weaponEffectiveness.ts` with damage multipliers per threat type

### **UI/UX Improvements**
- [ ] **Event Feed Enhancement**
  - **Problem**: Single "System initialized" line with no detail
  - **Fix**: Rich event feed with timestamps, severity, and details
  ```
  12:01:23  Neutralized hostile (ID 7) @ 2.1 km  | kinetic
  12:02:05  Jam detected — fallback to optical-only
  ```

- [ ] **Button Priority & Placement**
  - **Problem**: Reset sits among other actions with accidental click risk
  - **Fix**: Keep Spawn Swarm as only orange; move Reset far right with confirmation

- [ ] **Toggle Ambiguity Fix**
  - **Problem**: "Show Zones/Show Stats" look like buttons
  - **Fix**: Use switches with visible state indication
  ```html
  <button role="switch" aria-checked="true" class="switch">Show Stats</button>
  ```

- [ ] **Target-Size & Spacing**
  - **Problem**: Controls <44px touch target; inconsistent padding
  - **Fix**: Minimum 44×44px clickable area; consistent 12-14px internal padding

- [ ] **Radar Scale & Labels**
  - **Problem**: Range labels faint; no distance legend
  - **Fix**: Label 2 rings (400m / 800m) with muted blue and 1px halo
  ```css
  .range-label{fill:#8fb3e1; paint-order:stroke; stroke:#0b0d10; stroke-width:1}
  ```

## 🟡 **P2 — Visual Polish & Consistency**

### **Visual Improvements**
- [ ] **Selected Weapon Outline Too Neon**
  - **Fix**: Border #ff3b00 at 70% + 1px inset
  ```css
  .weapon.is-on{
    border-color:#ff3b00; 
    box-shadow:inset 0 0 0 1px rgba(255,59,0,.25)
  }
  ```

- [ ] **Sidebars Symmetry**
  - **Fix**: Enforce equal widths and matching paddings

- [ ] **Pointer Affordances**
  - **Fix**: cursor: pointer for interactive; cursor: not-allowed for disabled

- [ ] **Legend/Help Overlay**
  - **Fix**: ? key toggles lightweight overlay with shapes/colors/shortcuts

### **Advanced Features**
- [ ] **Threat Intelligence System**
  - **Problem**: No learning from previous engagements
  - **Fix**: Add threat pattern recognition and predictive targeting
  - **Code**: Add `threatIntelligence.ts` with pattern analysis

- [ ] **Environmental Effects**
  - **Problem**: Weather/terrain don't affect gameplay
  - **Fix**: Implement weather-based visibility and weapon effectiveness
  - **Code**: Add `environmentalEffects.ts` with weather modifiers

- [ ] **Swarm Coordination AI**
  - **Problem**: Drones don't coordinate intelligently
  - **Fix**: Add emergent swarm behavior with leader-follower patterns
  - **Code**: Add `swarmAI.ts` with boid algorithms

## 🟢 **P3 — Advanced Features & Polish**

### **Performance & Engineering**
- [ ] **RequestAnimationFrame Gating**
  - **Fix**: Pause updates when document.hidden or offscreen
  - **Code**: Add `IntersectionObserver` and `document.hidden` checks

- [ ] **Node Pooling**
  - **Fix**: Reuse SVG blip nodes instead of create/destroy
  - **Code**: Add `blipPool.ts` with object pooling

- [ ] **Hit Areas Optimization**
  - **Fix**: Restrict pointer events to interactive layers
  - **Code**: Add `pointer-events:none` on rings/labels

- [ ] **State Management**
  - **Fix**: Single source of truth with running|paused|jammed states
  - **Code**: Add `gameStateManager.ts` with Redux-like pattern

- [ ] **Local Storage Persistence**
  - **Fix**: Persist dismissed banner, level, toggles
  - **Code**: Add `localStorage` integration for user preferences

### **Advanced Gameplay**
- [ ] **Mission Objectives System**
  - **Problem**: No clear goals or objectives
  - **Fix**: Add mission types with specific objectives
  - **Code**: Add `missionManager.ts` with objective tracking

- [ ] **Resource Management**
  - **Problem**: Unlimited resources reduce strategic depth
  - **Fix**: Add ammunition limits, fuel consumption, maintenance cycles
  - **Code**: Add `resourceManager.ts` with consumption tracking

- [ ] **Multiplayer Support**
  - **Problem**: Single-player only
  - **Fix**: Add cooperative multiplayer with shared threat board
  - **Code**: Add `multiplayerManager.ts` with WebSocket integration

- [ ] **Scenario Editor**
  - **Problem**: No way to create custom scenarios
  - **Fix**: Add drag-and-drop scenario editor
  - **Code**: Add `scenarioEditor.ts` with visual scripting

## 📋 **Implementation Priority Matrix**

| Priority | Category | Effort | Impact | Timeline |
|----------|----------|--------|--------|----------|
| P0 | Drone Path Fix | High | Critical | Week 1-2 |
| P0 | Collision System | High | Critical | Week 2-3 |
| P0 | Gradual Spawning | Medium | High | Week 3-4 |
| P0 | HUD Integration | Low | High | Week 1 |
| P1 | Event Feed | Medium | Medium | Week 4-5 |
| P1 | Dynamic Scaling | High | Medium | Week 5-6 |
| P2 | Visual Polish | Low | Low | Week 6-7 |
| P3 | Advanced Features | Very High | Low | Week 8+ |

## 🛠️ **Technical Architecture**

### **New Components Needed**
```
src/components/
├── game/
│   ├── DronePathRenderer.tsx
│   ├── CollisionSystem.tsx
│   ├── WaveManager.tsx
│   ├── DifficultyManager.tsx
│   └── ScenarioEngine.tsx
├── ui/
│   ├── HUD.tsx
│   ├── EventFeed.tsx
│   ├── HelpOverlay.tsx
│   └── Legend.tsx
└── systems/
    ├── gameStateManager.ts
    ├── resourceManager.ts
    └── multiplayerManager.ts
```

### **Performance Targets**
- **60 FPS** during intense combat scenarios
- **<100ms** input lag for weapon switching
- **<50ms** lag for drone deployment
- **<1s** load time for scenario initialization

## 🎯 **Success Metrics**

### **User Experience**
- **Engagement**: Average session time > 5 minutes
- **Completion**: >80% users complete tutorial scenarios
- **Accessibility**: WCAG 2.1 AA compliance

### **Technical Performance**
- **Frame Rate**: Consistent 60 FPS
- **Memory**: <100MB heap usage
- **Load Time**: <3s initial load

### **Gameplay Balance**
- **Difficulty Curve**: Smooth progression through levels
- **Weapon Balance**: All weapons viable in different scenarios
- **Replayability**: >10 unique scenarios with procedural elements

---

*Last Updated: $(date)*
*Maintained by: Phoenix Rooivalk Development Team*
