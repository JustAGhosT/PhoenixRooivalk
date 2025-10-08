#!/usr/bin/env node

/**
 * sync-wasm.js
 *
 * Syncs WASM artifacts from the threat-simulator-desktop dist folder
 * to the marketing site's public/wasm folder.
 *
 * This script runs automatically before building the marketing site
 * to ensure the latest WASM build is included.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const sourceDir = path.join(__dirname, "../../threat-simulator-desktop/dist");
const targetDir = path.join(__dirname, "../public/wasm");

console.log("🔄 Syncing WASM artifacts...");
console.log(`   Source: ${sourceDir}`);
console.log(`   Target: ${targetDir}`);

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  console.log("   Creating target directory...");
  fs.mkdirSync(targetDir, { recursive: true });
}

// Check if source directory exists
if (!fs.existsSync(sourceDir)) {
  console.warn(
    "⚠️  Warning: Source directory does not exist. Skipping WASM sync.",
  );
  console.warn("   The threat simulator has not been built yet.");
  console.warn("   To include WASM simulator:");
  console.warn("     cd apps/threat-simulator-desktop");
  console.warn("     pnpm build");
  console.warn("     cd ../marketing");
  console.warn("     pnpm sync:wasm");
  process.exit(0);
}

// Read source directory
const files = fs.readdirSync(sourceDir);

// Filter for WASM-related files
const wasmFiles = files.filter(
  (file) =>
    file.endsWith(".wasm") ||
    file.endsWith(".js") ||
    (file.endsWith(".css") && file.startsWith("styles-")),
);

if (wasmFiles.length === 0) {
  console.warn("⚠️  Warning: No WASM artifacts found. Skipping WASM sync.");
  console.warn("   The threat simulator has not been built yet.");
  console.warn("   To include WASM simulator:");
  console.warn("     cd apps/threat-simulator-desktop");
  console.warn("     pnpm build");
  console.warn("     cd ../marketing");
  console.warn("     pnpm sync:wasm");
  process.exit(0);
}

// Copy files
let copiedCount = 0;
let skippedCount = 0;

for (const file of wasmFiles) {
  const sourcePath = path.join(sourceDir, file);
  const targetPath = path.join(targetDir, file);

  try {
    // Check if file needs updating
    let needsCopy = true;
    if (fs.existsSync(targetPath)) {
      const sourceStats = fs.statSync(sourcePath);
      const targetStats = fs.statSync(targetPath);

      // Compare modification times and sizes
      if (
        sourceStats.mtime <= targetStats.mtime &&
        sourceStats.size === targetStats.size
      ) {
        needsCopy = false;
        skippedCount++;
      }
    }

    if (needsCopy) {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`   ✅ Copied: ${file}`);
      copiedCount++;
    } else {
      console.log(`   ⏭️  Skipped: ${file} (up to date)`);
    }
  } catch (error) {
    console.error(`   ❌ Error copying ${file}:`, error.message);
    process.exit(1);
  }
}

console.log("\n✨ Sync complete!");
console.log(`   ${copiedCount} file(s) copied`);
console.log(`   ${skippedCount} file(s) skipped (up to date)`);

// Create a manifest file for reference
const manifest = {
  syncedAt: new Date().toISOString(),
  files: wasmFiles,
  sourceDir: sourceDir,
  targetDir: targetDir,
};

fs.writeFileSync(
  path.join(targetDir, "manifest.json"),
  JSON.stringify(manifest, null, 2),
);

console.log("\n📝 Manifest written to public/wasm/manifest.json");
