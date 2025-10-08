# 🚀 Quick Start Guide

## Running the Threat Simulator

### Option 1: From Root Directory (Recommended)

```bash
# From the project root (PhoenixRooivalk/)

# Frontend only (fastest, hot-reload)
pnpm sim:dev

# Full desktop app with Tauri backend
pnpm sim:dev:tauri

# Run tests
pnpm sim:test

# Lint code
pnpm sim:lint

# Build production
pnpm sim:build:tauri
```

### Option 2: From App Directory

```bash
# Navigate to the app
cd apps/threat-simulator-desktop

# Frontend only
pnpm dev

# Full desktop app
pnpm dev:tauri

# Run tests
pnpm test

# Lint
pnpm lint

# Build
pnpm build:tauri
```

---

## 🎮 First Time Setup

### 1. Install Prerequisites

**Rust:**

```bash
# Install Rust (if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add WASM target
rustup target add wasm32-unknown-unknown
```

**Trunk (WASM bundler):**

```bash
cargo install trunk
```

**Tauri CLI:**

```bash
cargo install tauri-cli --version "^2.0"
```

### 2. Clone and Build

```bash
# From project root
cd PhoenixRooivalk

# Install Node dependencies (if needed)
pnpm install

# Run the simulator
pnpm sim:dev
```

---

## 🎯 What Each Command Does

### Development Commands

| Command              | What It Does                                     | Use When                |
| -------------------- | ------------------------------------------------ | ----------------------- |
| `pnpm sim:dev`       | Starts Trunk dev server on http://localhost:8080 | Fast frontend iteration |
| `pnpm sim:dev:tauri` | Starts full Tauri desktop app                    | Testing native features |
| `pnpm sim:test`      | Runs all 47 tests                                | Verifying changes       |
| `pnpm sim:lint`      | Runs clippy (strict mode)                        | Code quality checks     |

### Build Commands

| Command                | Output                 | Use When           |
| ---------------------- | ---------------------- | ------------------ |
| `pnpm sim:build`       | WASM bundle in `dist/` | Web deployment     |
| `pnpm sim:build:tauri` | Desktop installers     | Production release |

**Build outputs:**

- Windows: `src-tauri/target/release/bundle/msi/*.msi` (~12MB)
- macOS: `src-tauri/target/release/bundle/dmg/*.dmg` (~15MB)
- Linux: `src-tauri/target/release/bundle/deb/*.deb` (~14MB)

---

## 🎮 Gameplay Controls

### Essential

- **Space**: Pause/Resume
- **Click**: Fire at threats
- **1-9,0**: Select weapons
- **R**: Reset game

### Panels

- **H**: Help
- **S**: Stats
- **E**: Energy
- **D**: Drones
- **L**: Event log
- **T**: Token store
- **F**: Research
- **G**: Synergies

**Full list: 22 keyboard shortcuts**

---

## 🐛 Troubleshooting

### "pnpm: command not found"

**Solution**: Install pnpm first

```bash
npm install -g pnpm
# or use corepack
corepack enable
```

### "trunk: command not found"

**Solution**: Install trunk

```bash
cargo install trunk
```

### "Failed to load WASM"

**Solution**: Rebuild for WASM target

```bash
cd apps/threat-simulator-desktop
trunk clean
trunk build
```

### "Tauri build fails"

**Solution**: Install platform-specific dependencies

**Windows:**

- Install
  [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)

**macOS:**

- Xcode Command Line Tools: `xcode-select --install`

**Linux (Ubuntu/Debian):**

```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```

### "Port 8080 already in use"

**Solution**: Change Trunk port

```bash
trunk serve --port 8081 --open
```

---

## 📊 Verification

### Quick Test Run

```bash
# From project root
pnpm sim:test

# Expected output:
# running 47 tests
# ...............................................
# test result: ok. 47 passed; 0 failed
```

### Quick Lint Check

```bash
pnpm sim:lint

# Expected output:
# Finished `dev` profile
# (no warnings)
```

---

## 🏃 Quick Demo

1. **Start the app:**

   ```bash
   pnpm sim:dev
   ```

2. **Wait for browser to open** (http://localhost:8080)

3. **Press Space** to start the game

4. **Click on threats** to fire

5. **Press H** for help, **S** for stats

6. **Explore panels** with E, D, L, T, F, G keys

---

## 📝 Next Steps After Setup

1. ✅ Verify app runs: `pnpm sim:dev`
2. ✅ Run tests: `pnpm sim:test`
3. ✅ Try Tauri: `pnpm sim:dev:tauri`
4. ✅ Read docs: See `README.md`, `MIGRATION.md`, `FRONTEND.md`
5. ✅ Build installer: `pnpm sim:build:tauri`

---

## 🎯 Common Workflows

### Daily Development

```bash
# Terminal 1: Run dev server
pnpm sim:dev

# Terminal 2: Watch tests
cd apps/threat-simulator-desktop
cargo watch -x "test --lib"

# Edit code, see changes instantly
# Tests auto-run on save
```

### Pre-Commit

```bash
# Format and lint
pnpm sim:lint
cargo fmt -p threat-simulator-desktop

# Run tests
pnpm sim:test

# Commit
git add .
git commit -m "feat: your changes"
```

### Production Build

```bash
# Build desktop installer
pnpm sim:build:tauri

# Find output:
# apps/threat-simulator-desktop/src-tauri/target/release/bundle/
```

---

**Ready to play? Run `pnpm sim:dev` from the project root!** 🚀
