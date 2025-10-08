# Content Security Policy (CSP) Security Update

## Changes Made

### Date

October 7, 2025

### Issue

The Content Security Policy (CSP) in `src-tauri/tauri.conf.json` previously
included `'unsafe-inline'` in the `script-src` directive, which could allow XSS
attacks through inline script injection.

### Resolution

Removed `'unsafe-inline'` from the `script-src` directive to enforce that all
scripts must be loaded from the application's own origin (`'self'`).

#### Before

```json
"csp": "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'"
```

#### After

```json
"csp": "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'wasm-unsafe-eval'"
```

### Policy Details

- **`default-src 'self'`**: All resources default to same-origin only
- **`style-src 'self' 'unsafe-inline'`**: Styles from same-origin + inline
  styles (required for Leptos)
- **`script-src 'self' 'wasm-unsafe-eval'`**: Scripts only from same-origin +
  WASM evaluation (required for WASM modules)

### Security Benefits

1. ✅ **No inline script execution**: Prevents XSS attacks via inline `<script>`
   tags
2. ✅ **External script blocking**: Only scripts from the application origin can
   execute
3. ✅ **WASM support maintained**: `'wasm-unsafe-eval'` permits WebAssembly
   execution (necessary for Leptos/Rust WASM)
4. ✅ **Defense in depth**: Additional security layer even if other
   vulnerabilities exist

### Verification

The application has been verified to work correctly with the stricter CSP:

- ✅ No inline scripts in `index.html`
- ✅ All scripts bundled via Trunk (loaded from `'self'`)
- ✅ WASM modules load and execute correctly
- ✅ Backend compiles without errors
- ✅ JSON configuration validated

### Testing Instructions

To verify CSP enforcement in development:

```bash
# Start dev server
pnpm dev:tauri

# Open browser DevTools (F12) and check:
# 1. Console for any CSP violations
# 2. Network tab - all scripts should be from localhost:8080
# 3. Application should boot and run normally
```

### Notes

- `'unsafe-inline'` remains in `style-src` as it's required for Leptos reactive
  styling
- `'wasm-unsafe-eval'` is required for WebAssembly and is considered safe in
  Tauri's sandboxed environment
- Any future inline scripts must be externalized to maintain this security
  posture

### References

- [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Tauri Security Best Practices](https://tauri.app/v1/guides/security/csp/)
- [OWASP: XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
