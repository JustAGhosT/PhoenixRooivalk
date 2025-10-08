# WASM Threat Simulator Integration

This document explains how the Leptos/WASM threat simulator is integrated into
the Next.js marketing site.

## Overview

The Phoenix Rooivalk Threat Simulator is built using:

- **Leptos**: A Rust web framework
- **WebAssembly (WASM)**: For high-performance execution
- **Trunk**: Build tool for Rust/WASM applications

This WASM application is embedded into the Next.js marketing site to provide an
interactive demonstration.

## Architecture

```
apps/
├── threat-simulator-desktop/     # Leptos/Rust WASM app
│   ├── src/                      # Rust source code
│   ├── dist/                     # Built WASM artifacts
│   │   ├── *.wasm                # WebAssembly binary
│   │   ├── *.js                  # JavaScript bindings
│   │   └── *.css                 # Styles
│   └── Trunk.toml                # Trunk configuration
│
└── marketing/                     # Next.js marketing site
    ├── public/wasm/              # Copied WASM artifacts
    ├── src/components/
    │   └── WasmThreatSimulator.tsx  # React wrapper component
    └── scripts/
        └── sync-wasm.js          # Build-time sync script
```

## Components

### 1. WasmThreatSimulator Component

Location: `src/components/WasmThreatSimulator.tsx`

A React component that:

- Loads the WASM module dynamically
- Provides a mount point for the Leptos app
- Handles loading states and errors
- Supports fullscreen mode

**Props:**

- `autoFullscreen?: boolean` - Auto-enter fullscreen mode
- `isTeaser?: boolean` - Display in teaser mode (smaller height)
- `className?: string` - Additional CSS classes

**Usage:**

```tsx
import { WasmThreatSimulator } from "@/components/WasmThreatSimulator";

export default function Page() {
  return <WasmThreatSimulator autoFullscreen={true} />;
}
```

### 2. WASM Sync Script

Location: `scripts/sync-wasm.js`

A Node.js script that:

- Copies WASM artifacts from `threat-simulator-desktop/dist` to `public/wasm`
- Checks file timestamps to avoid unnecessary copies
- Creates a manifest file for tracking
- Runs automatically before builds

## Build Process

### Building the WASM Simulator

```bash
# Navigate to the simulator directory
cd apps/threat-simulator-desktop

# Build the WASM app
pnpm build
# or
trunk build --release
```

This creates:

- `dist/threat-simulator-desktop-*.wasm` - The WebAssembly binary
- `dist/threat-simulator-desktop-*.js` - JavaScript bindings
- `dist/styles-*.css` - Compiled styles

### Building the Marketing Site

```bash
# Navigate to marketing directory
cd apps/marketing

# The sync happens automatically during build
pnpm build
```

The build process:

1. Runs `sync:wasm` script
2. Copies WASM artifacts to `public/wasm/`
3. Builds the Next.js site with WASM support

### Manual Sync

To manually sync WASM artifacts without building:

```bash
cd apps/marketing
pnpm sync:wasm
```

## Development

### Running in Development

```bash
# Terminal 1: Run the marketing site
cd apps/marketing
pnpm dev

# Terminal 2 (optional): Develop the WASM simulator
cd apps/threat-simulator-desktop
pnpm dev
```

**Note:** After rebuilding the WASM simulator, run `pnpm sync:wasm` in the
marketing directory to update the files.

### Hot Reload

- Next.js has hot reload for React components
- WASM changes require:
  1. Rebuild the simulator (`trunk build`)
  2. Run sync script (`pnpm sync:wasm`)
  3. Hard refresh the browser (Ctrl+Shift+R)

## Configuration

### Next.js Config

The `next.config.js` includes WASM support:

```javascript
webpack: (config, { isServer }) => {
  // Configure WASM support
  config.experiments = {
    ...config.experiments,
    asyncWebAssembly: true,
  };

  config.module.rules.push({
    test: /\.wasm$/,
    type: "webassembly/async",
  });

  return config;
};
```

### File Structure

```
public/wasm/
├── manifest.json                                      # Build metadata
├── styles-2e626ac1d358eb54.css                       # WASM styles
├── threat-simulator-desktop-43e4df905ff42f76.js      # JS bindings
└── threat-simulator-desktop-43e4df905ff42f76_bg.wasm # WASM binary
```

**Note:** File hashes in names will change when the simulator is rebuilt.

## Usage in Pages

### Full Interactive Demo

`src/app/interactive-demo/page.tsx`:

```tsx
import { WasmThreatSimulator } from "../../components/WasmThreatSimulator";

export default function InteractiveDemoPage() {
  return <WasmThreatSimulator autoFullscreen={true} />;
}
```

### Homepage Teaser

`src/components/sections/InteractiveElementsSection.tsx`:

```tsx
<WasmThreatSimulator isTeaser={true} />
```

## Troubleshooting

### WASM Files Not Found

**Error:** `Failed to load WASM module`

**Solution:**

1. Check if WASM files exist in `apps/threat-simulator-desktop/dist/`
2. Run `pnpm build` in the simulator directory
3. Run `pnpm sync:wasm` in the marketing directory
4. Verify files exist in `apps/marketing/public/wasm/`

### WASM Module Loading Timeout

**Error:** `WASM loading timeout`

**Possible causes:**

- Large WASM file size (>10MB)
- Slow network connection
- CORS issues

**Solution:**

- Check browser console for detailed errors
- Ensure files are served correctly from `/wasm/` path
- Check browser compatibility (needs WebAssembly support)

### Outdated WASM Version

**Issue:** Changes to simulator not reflected in marketing site

**Solution:**

1. Rebuild simulator: `cd apps/threat-simulator-desktop && pnpm build`
2. Sync artifacts: `cd apps/marketing && pnpm sync:wasm`
3. Hard refresh browser (Ctrl+Shift+R)
4. Clear browser cache if needed

### TypeScript Errors

**Issue:** `Cannot find module '/wasm/...'`

This is expected - the files are loaded dynamically at runtime. The TypeScript
error can be safely ignored or suppressed with:

```tsx
// @ts-expect-error - WASM module loaded at runtime
import init from "/wasm/threat-simulator-desktop-*.js";
```

## Performance

### WASM Benefits

- **Native Speed**: Rust code compiled to WASM runs near-native speed
- **Small Bundle**: WASM binary is smaller than equivalent JavaScript
- **Parallel Execution**: Better CPU utilization for game logic
- **Memory Safety**: Rust's memory safety guarantees

### Loading Performance

- Initial WASM load: ~500ms - 2s (depending on file size)
- Subsequent loads: Cached by browser
- Initialization: ~100-300ms

### Optimization Tips

1. **Preload WASM**: Add to `<head>`:

   ```html
   <link rel="preload" href="/wasm/*.wasm" as="fetch" type="application/wasm" />
   ```

2. **Compression**: Ensure server sends WASM with gzip/brotli compression

3. **CDN**: Serve WASM files from CDN for global distribution

## Browser Support

### Requirements

- **WebAssembly**: All modern browsers (2017+)
- **ES Modules**: For JavaScript bindings
- **async/await**: For initialization

### Tested Browsers

- ✅ Chrome/Edge 90+
- ✅ Firefox 89+
- ✅ Safari 15+
- ⚠️ Mobile browsers (may have performance limitations)

### Fallback

Currently, no fallback is provided. If WASM is not supported, an error message
is shown. Consider adding a TypeScript-only version as fallback for older
browsers.

## Future Improvements

- [ ] Add version checking between simulator and marketing site
- [ ] Implement automatic rebuild triggers
- [ ] Add WASM lazy loading for better initial page load
- [ ] Create unified build script for both apps
- [ ] Add performance monitoring
- [ ] Implement fallback to TypeScript simulator for unsupported browsers

## Resources

- [Leptos Documentation](https://leptos.dev/)
- [Trunk Documentation](https://trunkrs.dev/)
- [WebAssembly Documentation](https://webassembly.org/)
- [Next.js WASM Support](https://nextjs.org/docs/advanced-features/webassembly)
