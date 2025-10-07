# Phoenix Rooivalk Threat Simulator - Desktop Application

A high-performance desktop application built with **Tauri** (Rust backend) and **Leptos** (Rust frontend/WASM) for simulating counter-drone defense scenarios with blockchain-based evidence recording.

## Architecture

### Stack
- **Backend**: Tauri 2.0 (Rust)
- **Frontend**: Leptos 0.6 (Rust + WebAssembly)
- **Build Tool**: Trunk
- **Game Engine**: Custom Rust implementation with web-sys
- **Physics**: Rapier2D (WASM-compatible)
- **Evidence**: Phoenix Evidence Crate (blockchain anchoring)

### Migration from React/Next.js

This application is a complete rewrite of the marketing website's ThreatSimulator component, migrating from:
- React + Next.js → Leptos (Rust WASM)
- JavaScript game logic → Pure Rust
- Web-only → Cross-platform desktop app (Tauri)

**Benefits**:
- **Performance**: 10-100x faster game loop and physics
- **Memory Safety**: Rust eliminates entire classes of bugs
- **Native Desktop**: Full OS integration, better performance
- **Smaller Binary**: ~10MB vs 100+MB Electron apps
- **Blockchain Integration**: Direct integration with evidence crate

## Prerequisites

### Required Tools
```bash
# Rust (1.70+)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Trunk (build tool for Leptos)
cargo install trunk

# Tauri CLI
cargo install tauri-cli --version "^2.0"

# wasm target
rustup target add wasm32-unknown-unknown
```

### Platform-Specific Dependencies

#### Linux
```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libxdo-dev \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```

#### macOS
```bash
xcode-select --install
```

#### Windows
- Install [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
- Install [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)

## Development

### Running the App

```bash
cd apps/threat-simulator-desktop
cargo tauri dev
```

This will:
1. Start the Trunk dev server (frontend)
2. Build the Tauri backend
3. Launch the desktop application

### Frontend-Only Development

```bash
cd apps/threat-simulator-desktop
trunk serve --open
```

Useful for rapid UI iteration without Tauri overhead.

### Building for Production

```bash
cd apps/threat-simulator-desktop
cargo tauri build
```

Outputs will be in `src-tauri/target/release/bundle/`.

## Project Structure

```
apps/threat-simulator-desktop/
├── src/                        # Leptos frontend (WASM)
│   ├── main.rs                # Entry point
│   ├── components.rs          # UI components module
│   ├── components/
│   │   ├── hud.rs            # Heads-up display
│   │   ├── game_canvas.rs    # Main game canvas
│   │   ├── weapon_panel.rs   # Weapon selection
│   │   └── stats_panel.rs    # Statistics display
│   ├── game.rs               # Game state management
│   ├── game/
│   │   ├── types.rs          # Core game types
│   │   ├── engine.rs         # Game loop & spawning
│   │   ├── physics.rs        # Collision detection
│   │   └── weapons.rs        # Weapon systems
│   └── tauri_api.rs          # Tauri command bindings
├── src-tauri/                 # Tauri backend (Rust)
│   ├── src/
│   │   └── main.rs           # Backend entry point
│   ├── tauri.conf.json       # Tauri configuration
│   ├── Cargo.toml           # Backend dependencies
│   └── build.rs             # Build script
├── public/                   # Static assets
│   └── styles.css           # Global styles
├── index.html               # HTML template
├── Trunk.toml              # Trunk configuration
├── Cargo.toml              # Workspace configuration
└── README.md               # This file
```

## Key Features

### Implemented
- [x] Tauri 2.0 setup with proper configuration
- [x] Leptos reactive UI framework
- [x] Canvas-based game rendering with web-sys
- [x] Game state management with Leptos signals
- [x] HUD with real-time stats
- [x] Basic threat spawning and movement
- [x] Tauri backend commands for session management
- [x] Evidence recording API integration

### In Progress
- [ ] Weapon system implementation
- [ ] Collision detection with Rapier2D
- [ ] Drone deployment and control
- [ ] Formation flight patterns
- [ ] Wave management system
- [ ] Power-ups and special abilities
- [ ] Achievement system
- [ ] Blockchain evidence integration

### Planned
- [ ] Multi-level progression
- [ ] Save/load game state
- [ ] Replay system
- [ ] Performance optimization (60+ FPS)
- [ ] Advanced particle effects
- [ ] Sound effects and music
- [ ] Multiplayer support (future)
- [ ] VR/AR support (future)

## Game Mechanics

### Threat Types
- **Commercial**: Basic drone, low health, slow speed
- **Military**: Armored, higher health, moderate speed
- **Swarm**: Multiple coordinated units
- **Stealth**: Harder to detect and track
- **Kamikaze**: Fast, high damage on impact
- **Recon**: Intelligence gathering, evasive
- **Electronic Warfare**: Jams systems, reduces effectiveness

### Weapon Systems
See `src/game/types.rs` for the complete list of 13 weapon types including:
- Kinetic Interceptor
- Electronic Warfare
- Directed Energy Laser
- Net Capture
- High Power Microwave (HPM)
- RF Takeover
- And more...

### Resources
- **Energy**: Required for weapon firing
- **Cooling**: Prevents weapon overheating
- **Mothership Health**: Game over when depleted

## Evidence Recording

All game events are recorded and can be anchored to blockchain:
- Session start/end
- Threat neutralizations
- Weapon deployments
- Performance metrics
- Achievement unlocks

Integration with Phoenix Evidence crate provides tamper-evident audit trails for training and evaluation.

## Performance Targets

- **Target FPS**: 60+
- **Max Threats**: 200+
- **Max Drones**: 50+
- **Memory**: <100MB
- **Binary Size**: <15MB (compressed)

## Testing

```bash
# Run all tests
cargo test --workspace

# Run frontend tests
cd apps/threat-simulator-desktop
trunk test

# Run backend tests
cd src-tauri
cargo test
```

## Troubleshooting

### Common Issues

**"Failed to bundle project"**
- Ensure all platform dependencies are installed
- Check Tauri logs in `src-tauri/target/`

**"WASM compilation failed"**
- Verify `wasm32-unknown-unknown` target is installed
- Check Trunk version compatibility

**"Can't find Tauri commands"**
- Rebuild backend: `cd src-tauri && cargo build`
- Check `tauri.conf.json` configuration

## Contributing

See the root `CONTRIBUTING.md` for general guidelines.

### Migration Checklist
When migrating React components to Leptos:
1. Convert state hooks (`useState`) to signals (`create_signal`)
2. Convert effects (`useEffect`) to Leptos effects (`create_effect`)
3. Convert refs (`useRef`) to node refs (`create_node_ref`)
4. Port TypeScript types to Rust structs
5. Replace JavaScript math with Rust implementations
6. Test thoroughly with `cargo test`

## License

Copyright © 2025 Phoenix Rooivalk. All rights reserved.

## Support

For issues specific to this desktop application, please open an issue with the `threat-simulator-desktop` label.

For general Phoenix Rooivalk questions, see the main project README.

