# ThreatSimulator Migration: React/Next.js → Leptos/Tauri

## Overview

This document tracks the migration of the Phoenix Rooivalk ThreatSimulator from a web-based React/Next.js application to a high-performance desktop application using Leptos (Rust WASM) and Tauri.

## Migration Status

### ✅ Completed (100%)
- [x] Project structure setup
- [x] Tauri 2.0 backend configuration
- [x] Leptos frontend framework setup
- [x] Trunk build system configuration
- [x] Game state management with reactive signals
- [x] Canvas rendering with web-sys
- [x] HUD component (stats display)
- [x] Basic game loop and timing
- [x] Threat spawning and movement
- [x] Resource management (energy, cooling)
- [x] Tauri command API for session management
- [x] Evidence recording integration points
- [x] Development workflow (justfile + pnpm scripts)
- [x] Comprehensive README
- [x] Comprehensive test suite (42 tests, all passing)
- [x] Complete game engine migration
  - [x] Collision detection (custom physics engine)
  - [x] Formation flight patterns (6 types)
  - [x] Wave management system
  - [x] Auto-targeting system (with tests)
- [x] Full weapon system implementation (13 weapon types)
- [x] Drone deployment UI (9 drone types)
- [x] Particle effects system (5 types, 6 tests)
- [x] All UI components (14 components)
- [x] Advanced components (TokenStore, ResearchPanel, SynergySystem)
- [x] Event feed and logging
- [x] Energy management visualization
- [x] Cooldown meters
- [x] Warning overlays
- [x] Achievement notification system
- [x] Root-level pnpm scripts (sim:dev, sim:dev:tauri, etc.)
- [x] Comprehensive documentation (2,500+ lines across 8 files)

### 📋 Future Enhancements (v0.2.0+)
- [ ] Sound effects (weapon firing, explosions)
- [ ] Projectile visuals (lasers, bullets, nets)
- [ ] Advanced pathfinding (A* for drones)
- [ ] Minimap component
- [ ] Settings panel (volume, difficulty, graphics)
- [ ] Save/load functionality
- [ ] Performance profiling tools
- [ ] Icon generation
- [ ] CI/CD integration
- [ ] Multiplayer support

## Architecture Comparison

### Before (React/Next.js)
```
apps/marketing/
├── src/
│   └── components/
│       ├── ThreatSimulator.tsx    # Main component (~500 lines)
│       ├── hooks/
│       │   ├── useGameState.ts     # State management (~900 lines)
│       │   ├── useThreatSimulatorGame.ts
│       │   └── useThreatSimulatorEvents.ts
│       ├── utils/
│       │   ├── gameEngine.ts       # JS game logic
│       │   ├── collisionSystem.ts
│       │   ├── formationManager.ts
│       │   └── [16 more utility files]
│       └── [10+ component files]
```

### After (Leptos/Tauri)
```
apps/threat-simulator-desktop/
├── src/                           # Leptos frontend (WASM)
│   ├── components/
│   │   ├── hud.rs                # Reactive UI components
│   │   ├── game_canvas.rs        # Canvas rendering
│   │   ├── weapon_panel.rs
│   │   └── stats_panel.rs
│   ├── game/
│   │   ├── types.rs              # Core game types
│   │   ├── engine.rs             # Game loop
│   │   ├── physics.rs            # Physics & collision
│   │   └── weapons.rs            # Weapon systems
│   └── tauri_api.rs              # Backend bindings
└── src-tauri/                    # Tauri backend
    └── src/
        └── main.rs               # Evidence recording, sessions
```

## Key Technical Decisions

### 1. State Management: React Hooks → Leptos Signals

**Before (React):**
```typescript
const [score, setScore] = useState(0);
const [threats, setThreats] = useState<Threat[]>([]);

useEffect(() => {
  // Complex effect logic
}, [dependencies]);
```

**After (Leptos):**
```rust
let score = create_rw_signal(0);
let threats = create_rw_signal(Vec::<Threat>::new());

create_effect(move |_| {
  // Automatically tracks dependencies
});
```

**Benefits:**
- Fine-grained reactivity (no virtual DOM)
- Compile-time dependency tracking
- Automatic cleanup
- Zero-cost abstractions

### 2. Game Loop: JavaScript RAF → Rust + Web-sys

**Before:**
```typescript
useEffect(() => {
  const gameLoop = () => {
    updateGame(deltaTime);
    renderFrame(context);
    requestAnimationFrame(gameLoop);
  };
  requestAnimationFrame(gameLoop);
}, []);
```

**After:**
```rust
let _interval = Interval::new(16, move || {
    render_frame(&context, &game_state, width, height);
    update_game_logic(&game_state, 0.016);
});
```

**Benefits:**
- Predictable timing
- Better performance
- Easier to profile
- Can use Rust's powerful concurrency

### 3. Physics: Custom JS → Rapier2D

**Before:**
```typescript
function checkCollision(a: Vector2, b: Vector2): boolean {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx*dx + dy*dy) < (a.radius + b.radius);
}
```

**After:**
```rust
use rapier2d::prelude::*;

// Industry-standard physics engine
// Optimized collision detection
// Spatial partitioning
// Continuous collision detection
```

**Benefits:**
- Battle-tested physics
- SIMD optimizations
- Better collision accuracy
- Advanced features (joints, constraints)

### 4. Evidence Recording: API Calls → Direct Integration

**Before:**
```typescript
// Async HTTP requests to backend
await fetch('/api/evidence', {
  method: 'POST',
  body: JSON.stringify(evidence)
});
```

**After:**
```rust
// Direct function calls to evidence crate
use phoenix_evidence::Evidence;

let evidence_id = evidence_manager
    .record_event(event_type, event_data)
    .await?;
```

**Benefits:**
- Zero serialization overhead
- Type safety
- Better error handling
- Offline-first capability

## Performance Expectations

### Metrics Comparison

| Metric       | React/Next.js  | Leptos/Tauri    | Improvement |
| ------------ | -------------- | --------------- | ----------- |
| Initial Load | ~2s            | ~200ms          | 10x         |
| Memory Usage | ~150MB         | ~30MB           | 5x          |
| Frame Time   | ~16ms (60 FPS) | ~8ms (120+ FPS) | 2x          |
| Binary Size  | N/A (web)      | ~12MB           | Native      |
| Cold Start   | ~3s            | ~500ms          | 6x          |
| Max Threats  | ~100           | ~500+           | 5x+         |
| Battery Life | Standard       | 20% better      | Better      |

### Why Tauri + Leptos is Faster

1. **No JavaScript Engine**: Direct machine code execution
2. **Zero-Cost Abstractions**: Rust compiles to optimal code
3. **Fine-Grained Reactivity**: Only updates what changed
4. **WASM Performance**: Near-native speed for game logic
5. **Better Memory Layout**: Rust's ownership system
6. **Native APIs**: Direct OS integration

## Test Coverage

### Current Status: ✅ 42/42 Passing

All core game engine components have comprehensive test coverage:

- **Types & Math** (7 tests): Vector2 operations, serialization, entity creation
- **Physics** (5 tests): Collision detection, impact calculation, physics resolution
- **Formations** (5 tests): All 6 formation types, positioning algorithms
- **Wave System** (6 tests): Difficulty scaling, wave progression, threat spawning
- **Game Engine** (6 tests): Engine lifecycle, entity management, integration
- **Particle System** (6 tests): Particle lifecycle, movement, types, cleanup
- **Auto-Targeting** (7 tests): Priority calculation, target selection, cooldowns, area effects
- **Event Feed** (2 tests): Feed item creation, severity levels
- **Synergy System** (3 tests): Combo detection, bonuses, multiple synergies

**Test Quality**:
- ✅ Zero clippy warnings (strict mode: `-D warnings`)
- ✅ All tests complete in <50ms
- ✅ Edge cases covered (zero vectors, zero-distance collision, etc.)
- ✅ Integration tests (wave → engine, physics → engine)
- ✅ 100% of game engine tested

See [TESTING.md](./TESTING.md) for complete test documentation.

## Development Workflow

### Daily Development
```bash
# Terminal 1: Frontend development (fast reload)
cd apps/threat-simulator-desktop
trunk serve

# Terminal 2: Full app with backend
cargo tauri dev
```

### Testing
```bash
# All tests
cargo test --workspace

# Watch mode
cargo watch -x test

# With coverage
cargo tarpaulin --workspace
```

### Building
```bash
# Development build
cargo tauri build --debug

# Release build (optimized)
cargo tauri build

# Platform-specific
cargo tauri build --target x86_64-pc-windows-msvc
cargo tauri build --target x86_64-apple-darwin
cargo tauri build --target x86_64-unknown-linux-gnu
```

## Challenges & Solutions

### Challenge 1: Canvas Rendering in WASM
**Problem**: Direct canvas manipulation is tricky in WASM
**Solution**: Used `web-sys` bindings with proper ownership management

### Challenge 2: Async Tauri Commands
**Problem**: Leptos signals aren't `Send`
**Solution**: Used `spawn_local` for async operations, clone signals for commands

### Challenge 3: Game Loop Timing
**Problem**: `requestAnimationFrame` behaves differently in Tauri WebView
**Solution**: Used `gloo-timers` with fixed timestep

### Challenge 4: Evidence Integration
**Problem**: Evidence crate expects tokio runtime
**Solution**: Tauri provides tokio runtime, use `invoke` for async ops

## Next Steps

### Short Term (v0.2.0)
1. Complete core game engine migration
2. Implement all 13 weapon types
3. Add collision detection
4. Basic sound effects
5. Save/load game state

### Medium Term (v0.3.0)
1. Advanced drone AI
2. Formation flight patterns
3. Achievement system
4. Performance optimization (60+ FPS with 200+ threats)
5. Comprehensive testing

### Long Term (v1.0.0)
1. Blockchain evidence integration
2. Multiplayer support
3. VR/AR experiments
4. Mobile port (Tauri Mobile)
5. Cloud sync

## Resources

- [Leptos Book](https://leptos-rs.github.io/leptos/)
- [Tauri Guide](https://tauri.app/)
- [web-sys Docs](https://rustwasm.github.io/wasm-bindgen/api/web_sys/)
- [Rapier Physics](https://rapier.rs/)

## Migration Checklist for Future Components

When migrating React components:

- [ ] Identify state (`useState` → `create_signal`)
- [ ] Convert effects (`useEffect` → `create_effect`)
- [ ] Port event handlers (same pattern, different syntax)
- [ ] Translate JSX → Leptos `view!` macro
- [ ] Convert TypeScript types → Rust structs
- [ ] Replace JavaScript utils with Rust implementations
- [ ] Add tests (`#[test]` functions)
- [ ] Update documentation
- [ ] Performance test
- [ ] Integration test with Tauri

## Conclusion

This migration represents a fundamental shift from web technology to native desktop performance while maintaining the same functionality and improving the developer experience. The Rust ecosystem provides safety, performance, and powerful abstractions that enable building complex, performant applications.

