# Build & Deployment Guide

This document outlines how to compile the SIH-2026 Cryptographic Document Leak Attribution System.

## Architecture Prerequisites
This system uses **Tauri** to build a native desktop application. 
Because the application is designed to be air-gapped, it does not rely on a central cloud backend. The Rust cryptography and ledger network run completely locally within the desktop process.

### Dependencies
1. **Node.js** (v18+) for the Next.js UI.
2. **Rust & Cargo** (v1.75+) for the backend.
3. OS-specific build dependencies for Tauri.

---

## 1. Local Native Compilation (Windows, macOS, Linux)

If you have Rust and Node natively installed on your host machine, you can build the native GUI application directly:

### Step 1: Install OS Dependencies
- **Windows**: Install the Microsoft C++ Build Tools and WebView2 SDK.
- **macOS**: Install Xcode Command Line Tools (`xcode-select --install`).
- **Linux**: Install WebKit2GTK (`sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev`).

### Step 2: Install UI Dependencies
Navigate to the Next.js frontend directory:
```bash
cd apps/web-console
npm install
```

### Step 3: Run in Development Mode
To launch the desktop application with Hot Module Reloading for both React and Rust:
```bash
npm run tauri dev
```

### Step 4: Build for Production
To compile the highly optimized, finalized application installer (`.msi` for Windows, `.dmg` for macOS, or `.deb`/`.AppImage` for Linux):
```bash
npm run tauri build
```
The output binaries will be located in `apps/web-console/src-tauri/target/release/bundle/`.

---

## 2. Docker Dev Container Compilation

If you do not have Rust installed natively (or are on Windows without MSVC tools), you can use the provided Docker container to compile and test the Linux versions of the system.

### Build and Run Tests
Run the cryptographic test and benchmark suite completely inside Docker:
```bash
# Assuming the image is built as `tauri-rust-test`
docker run --rm -v ".:/workspace" -w /workspace tauri-rust-test cargo test
docker run --rm -v ".:/workspace" -w /workspace tauri-rust-test cargo bench
```

### Build Linux Web UI 
```bash
docker run --rm -v ".:/workspace" -w /workspace/apps/web-console node:18 npm run build
```

---

## 3. Cryptographic Validation
If you are evaluating the security invariants of the offline ledger and post-quantum algorithms without running the GUI, you can easily run the core validation suite:

```bash
cargo test -p system-tests
cargo bench -p system-tests
```
This will run the adversarial watermark scrambling tests and output execution timings for `ML-KEM-768`, `ML-DSA-65`, `AES-256-GCM`, and the custom `HashChain` algorithms.
