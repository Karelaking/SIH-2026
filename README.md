# SIH-2026: Cryptographic Document Leak Attribution System

## Overview
This system is an **offline, air-gapped cryptographic document distribution and forensic attribution system**. 
It is designed to solve a fundamental problem in information security: when multiple authorized users receive a decrypted copy of a confidential document, identifying the exact source of a leak is historically impossible because all copies are identical. 

Our system solves this by introducing a **Unique Decryption Session** for every authorized access.

## How it works

1. **Document Encryption (AES-GCM)**: The document is stored as ciphertext.
2. **Post-Quantum Key Wrap (ML-KEM-768)**: Every authorized recipient gets a copy of the content key, wrapped using their specific ML-KEM public key.
3. **The Decryption Event**: When a recipient views the document, the system generates a unique **Event ID**.
4. **Zero-width ECC Watermark**: The system embeds the Event ID invisibly into the text using zero-width characters and a Reed-Solomon Error Correcting Code (ECC) to ensure resilience against partial deletion.
5. **Decryption Attestation (ML-DSA-65)**: The recipient cryptographically signs an attestation confirming they decrypted this exact document at this exact time, generating this exact Event ID watermark.
6. **Offline Ledger (HashChain / Merkle)**: The attestation is appended to an offline, tamper-evident distributed ledger for historical evidence.

If the plaintext ever leaks, the **Forensics Engine** extracts the invisible watermark, looks up the Event ID in the Offline Ledger, and produces a Cryptographically Verified Attribution report!

## Architecture
- **Desktop Environment**: Built on **Tauri** to run as a native desktop application in an air-gapped environment.
- **Frontend Dashboard**: Built with **Next.js** and the **UX4G** UI standard.
- **Core Cryptography**: Native **Rust** backend services.

## Packages
The system is built as a Cargo Workspace containing multiple decoupled services:
- `apps/web-console`: The Next.js and Tauri app shell.
- `packages/crypto-core`: Core primitives for AES-GCM and SHA-3.
- `packages/identity-core`: Post-Quantum cryptographic identity generation.
- `packages/watermark-core`: Zero-width Reed-Solomon Error Correction encoding.
- `packages/ledger-core`: The base HashChain and Merkle verification structures.
- `packages/system-tests`: The full adversarial security test and performance benchmarking suite.
- `services/*`: Microservices tying the primitives to domain logic.
