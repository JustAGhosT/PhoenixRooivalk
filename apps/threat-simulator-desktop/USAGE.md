# 🎮 Threat Simulator Desktop - Usage Guide

## 🚀 Running the Application

### From Project Root (Recommended ✅)

You can now run the ThreatSimulator from the **PhoenixRooivalk root directory**
using `pnpm sim:*` commands:

```bash
# From: C:\Users\smitj\repos\PhoenixRooivalk

# Start frontend dev server (fastest, hot-reload)
pnpm sim:dev

# Start full Tauri desktop app
pnpm sim:dev:tauri

# Run all 35 tests
pnpm sim:test

# Lint and quality checks
pnpm sim:lint

# Build production WASM
pnpm sim:build

# Build desktop installers (.msi, .dmg, .deb)
pnpm sim:build:tauri
```

### From App Directory (Alternative)

```bash
# Navigate to app
cd apps/threat-simulator-desktop

# Use local scripts
pnpm dev              # Same as: trunk serve --open
pnpm dev:tauri        # Same as: cargo tauri dev
pnpm test             # Same as: cargo test --lib
pnpm lint             # Same as: cargo clippy --lib -- -D warnings
pnpm build            # Same as: trunk build --release
pnpm build:tauri      # Same as: cargo tauri build
```

---

## 🎯 Which Command Should I Use?

### For **Frontend Development** (Fast Iteration)

```bash
pnpm sim:dev
```

**Best for:**

- Quick UI changes
- Testing components
- Styling adjustments
- Hot-reload workflow

**Opens:** http://localhost:8080 in browser

### For **Full Desktop Testing** (Complete Experience)

```bash
pnpm sim:dev:tauri
```

**Best for:**

- Testing Tauri backend integration
- Native desktop features
- Performance profiling
- Pre-release testing

**Opens:** Native desktop window

### For **Testing Changes**

```bash
pnpm sim:test
```

**Runs:** All 35 tests in <50ms

### For **Production Build**

```bash
pnpm sim:build:tauri
```

**Outputs:**

- Windows: `.msi` installer (~12MB)
- macOS: `.dmg` bundle (~15MB)
- Linux: `.deb`, `.AppImage` (~14MB)

---

## 🎮 Playing the Game

### 1. Start the App

```bash
pnpm sim:dev
```

### 2. Wait for Browser

The app will automatically open at: http://localhost:8080

### 3. Basic Controls

- **Press Space**: Start the game
- **Click on threats**: Fire at them
- **Press 1-9**: Select different weapons
- **Press H**: View full controls

### 4. Explore Panels

- **E**: Energy management
- **D**: Deploy drones
- **L**: Event log
- **T**: Token store
- **F**: Research tree
- **S**: Detailed stats
- **G**: Active synergies

---

## 🛠️ Development Workflow

### Daily Development

```bash
# Terminal 1: Run dev server
pnpm sim:dev

# Terminal 2: Watch tests (optional)
cd apps/threat-simulator-desktop
cargo watch -x "test --lib"

# Edit code in src/
# Browser auto-reloads
# Tests auto-run
```

### Before Committing

```bash
# Format Rust code
cargo fmt -p threat-simulator-desktop

# Run tests
pnpm sim:test

# Lint check
pnpm sim:lint

# All passing? Commit!
git add .
git commit -m "your message"
```

### Building for Release

```bash
# Build optimized WASM + desktop
pnpm sim:build:tauri

# Find installers:
# apps/threat-simulator-desktop/src-tauri/target/release/bundle/
```

---

## 🐛 Troubleshooting

### Issue: "pnpm: command not found"

**Solution:**

```bash
npm install -g pnpm
# or
corepack enable
```

### Issue: "trunk: command not found"

**Solution:**

```bash
cargo install trunk
```

### Issue: "tauri: command not found"

**Solution:**

```bash
cargo install tauri-cli --version "^2.0"
```

### Issue: "Failed to compile WASM"

**Solution:**

```bash
rustup target add wasm32-unknown-unknown
cd apps/threat-simulator-desktop
trunk clean
pnpm dev
```

### Issue: "Port 8080 already in use"

**Solution:**

```bash
cd apps/threat-simulator-desktop
trunk serve --port 8081 --open
```

### Issue: "Tauri build fails on Linux"

**Solution:**

```bash
# Install webkit dependencies
sudo apt install libwebkit2gtk-4.1-dev \
  build-essential \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```

---

## 📊 Performance Tips

### For Best Development Experience

1. **Use `pnpm sim:dev`** (frontend only) - Fastest hot-reload
2. **Run tests in watch mode** - Instant feedback
3. **Use `cargo check`** before `cargo build` - Faster validation

### For Best Production Build

1. **Use `pnpm sim:build:tauri`** - Creates optimized installers
2. **Enable LTO** (Link Time Optimization) in Cargo.toml
3. **Use `--release`** flag - 10x+ faster than debug

### For Best Testing

1. **Use `cargo test --lib`** - Skips integration tests
2. **Use `-- --nocapture`** - See println! output
3. **Use `cargo watch`** - Auto-run tests on save

---

## 🎯 Common Tasks

### Adding a New Component

```bash
# 1. Create file
touch apps/threat-simulator-desktop/src/components/my_component.rs

# 2. Add module to components.rs
# mod my_component;
# pub use my_component::MyComponent;

# 3. Use in App
# <MyComponent />

# 4. Test changes
pnpm sim:dev
```

### Adding a New Weapon

```bash
# 1. Add to WeaponType enum in game/types.rs
# 2. Add case to weapons.rs fire_weapon()
# 3. Add to GameStateManager::init_weapons()
# 4. Add keyboard binding in components.rs
# 5. Test
pnpm sim:test
```

### Adding CSS Styles

```bash
# Edit: apps/threat-simulator-desktop/public/styles.css
# Changes auto-reload with pnpm sim:dev
```

---

## 📦 Build Outputs

### Development (`pnpm sim:dev`)

- Location: `http://localhost:8080`
- Output: None (in-memory)
- Hot-reload: Yes ✅
- Size: N/A

### WASM Build (`pnpm sim:build`)

- Location: `apps/threat-simulator-desktop/dist/`
- Output: WASM + JS + HTML
- Size: ~2MB (compressed)
- Optimized: Yes ✅

### Desktop Build (`pnpm sim:build:tauri`)

- Location: `apps/threat-simulator-desktop/src-tauri/target/release/bundle/`
- Outputs:
  - Windows: `msi/*.msi` (~12MB)
  - macOS: `dmg/*.dmg` (~15MB)
  - Linux: `deb/*.deb`, `appimage/*.AppImage` (~14MB)
- Optimized: Yes ✅
- Signed: No (requires certificates)

---

## 🎮 Gameplay Tips

### For Beginners

1. **Start with Kinetic weapon** (1 key) - Easy to use
2. **Watch the energy bar** - Don't drain it completely
3. **Deploy drones early** (D key) - They help defend
4. **Use synergies** (G key) - Check combo bonuses

### For Advanced Players

1. **Combo weapons** - Trigger synergies for bonuses
2. **Research upgrades** (F key) - Unlock better tech
3. **Manage power** (E key) - Optimize budget
4. **Track events** (L key) - Learn patterns
5. **Buy tactical drones** (T key) - Strategic purchases

---

## 🏆 Achievements (Automatic)

The game automatically tracks achievements:

- 🎯 First Kill (neutralize 1 threat)
- 🔥 Kill Streak (10 in a row)
- 🛡️ Perfect Defense (0 damage taken in wave)
- ⚡ Synergy Master (activate 3 synergies)
- 🚁 Drone Commander (deploy 20 drones)
- 🔬 Researcher (unlock 5 upgrades)

Achievements appear as golden pop-ups in the center of the screen!

---

## 📝 Summary

**To run the ThreatSimulator, simply:**

```bash
# From anywhere in the project
pnpm sim:dev
```

**That's it!** The browser will open and you can start playing.

For the **full desktop experience:**

```bash
pnpm sim:dev:tauri
```

**For production installers:**

```bash
pnpm sim:build:tauri
```

---

## 🔗 Related Documentation

- [README.md](./README.md) - Architecture and setup
- [QUICKSTART.md](./QUICKSTART.md) - Detailed setup guide
- [FRONTEND.md](./FRONTEND.md) - Component architecture
- [MIGRATION.md](./MIGRATION.md) - Migration details
- [TESTING.md](./TESTING.md) - Test coverage
- [COMPONENTS.md](./COMPONENTS.md) - Component inventory
- [COMPLETE.md](./COMPLETE.md) - Migration summary

---

**Ready to defend the mothership? Launch with `pnpm sim:dev`!** 🚀
