Absolutely. What you need is a **Project Constitution / Development Specification**: a single source of truth that a development agent can follow without drifting into a generic document-encryption, blockchain, or watermarking project.

Below is the version I would use as the **master project definition**.

# Cryptographic Document Leak Attribution System

### Project Purpose & Development Constitution

> **This document defines what the system is, why it exists, how it must behave, and the exact workflow it must implement. Any future development decision must remain consistent with this specification.**

---

# 1. Project Purpose

The purpose of this project is to build an **offline, air-gapped cryptographic document distribution and forensic attribution system** capable of identifying which authorized recipient's decryption session produced a leaked copy of a confidential document.

The fundamental problem is:

> When the same confidential document is distributed to multiple authorized recipients, every recipient may possess an identical plaintext copy. If that document subsequently leaks, conventional access logs and identical watermarks cannot reliably determine which recipient's copy was leaked.

The system solves this by creating a **unique, invisible, cryptographically authenticated forensic fingerprint for every decryption session**.

The system must establish a chain:

```text
Recipient Identity
       ↓
Authorized Decryption
       ↓
Unique Decryption Session
       ↓
Unique Forensic Event ID
       ↓
Invisible Watermark
       ↓
Recipient's PQ Digital Signature
       ↓
Immutable Offline Ledger
       ↓
Leaked Document
       ↓
Watermark Extraction
       ↓
Ledger Verification
       ↓
Cryptographically Verifiable Attribution
```

The project is therefore **not merely a document encryption system**.

It is primarily a:

> **Cryptographic document leak attribution and forensic evidence system.**

Encryption protects the document **before unauthorized access**.

Watermarking identifies the **source of a leaked plaintext copy**.

Digital signatures establish **cryptographic authorization of the decryption event**.

The distributed ledger preserves **tamper-evident historical evidence**.

---

# 2. The Core Problem Statement

The system exists to solve this exact problem:

```text
One document
      ↓
Distributed to
      ↓
Recipient A
Recipient B
Recipient C
Recipient D
      ↓
All decrypt the same document
      ↓
One copy leaks
      ↓
Who leaked it?
```

Traditional systems often know:

```text
A accessed document
B accessed document
C accessed document
D accessed document
```

but cannot determine:

```text
Which decrypted copy became the leaked copy?
```

Our system must make every decrypted copy **forensically distinguishable**, while keeping the document **visually identical to the recipient**.

---

# 3. What the Project Is NOT

This section is extremely important for preventing development-agent hallucination.

The project is **NOT**:

* a generic cloud document-storage platform
* a normal file-sharing application
* a password manager
* a public blockchain application
* a cryptocurrency system
* a cloud KMS
* a generic DRM system
* a conventional watermarking application
* a server-side access logging system
* a public blockchain solution
* a surveillance system
* a system that determines human intent
* a system that claims absolute proof that a person intentionally leaked a document

The system provides:

> **Cryptographically verifiable evidence linking a leaked document to a specific authorized decryption event.**

It does **not** prove the user's psychological intent.

---

# 4. Primary Security Objective

The system must answer this question:

> **"Which authorized decryption event produced this leaked document?"**

The answer must be supported by independently verifiable evidence.

A valid attribution should establish:

```text
✓ Watermark exists
✓ Watermark is authentic
✓ Watermark corresponds to an event
✓ Event belongs to the correct document
✓ Event corresponds to a recipient
✓ Recipient's PQ signature is valid
✓ Signature was valid for that event
✓ Ledger record is intact
✓ Ledger history has not been altered
```

Only then should the system produce:

```text
CRYPTOGRAPHICALLY VERIFIED ATTRIBUTION
```

---

# 5. Core Design Principles

Every development decision must follow these principles.

## Principle 1 — Offline First

The entire system must operate inside an:

> **air-gapped environment**

No Internet connection may be required during normal operation.

There must be no dependency on:

* AWS
* Azure
* Google Cloud
* Cloud KMS
* external authentication services
* public blockchain networks
* external APIs
* Internet-based timestamp services

---

## Principle 2 — Post-Quantum Cryptography

The production cryptographic architecture must use NIST-standardized post-quantum algorithms for:

### Key establishment

**ML-KEM-768**

### Digital signatures

**ML-DSA-65**

Classical algorithms such as X25519 and Ed25519 may be retained only as an explicitly separated **legacy/benchmark mode**, if needed for comparison.

They must not be presented as satisfying the project's PQC requirement.

---

# 6. Cryptographic Architecture

The system has four major cryptographic layers.

```text
                CRYPTOGRAPHIC ARCHITECTURE

                   Document
                       │
                       ▼
               Document Hash
                       │
                       ▼
                AES-256-GCM
                       │
                       ▼
              Encrypted Document
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
          ML-KEM              ML-DSA
       Key Establishment      Signatures
             │                   │
             ▼                   ▼
       Key Protection       Event Evidence
```

### Symmetric encryption

Use:

**AES-256-GCM**

for document confidentiality and integrity.

### Key derivation

Use a cryptographically secure KDF such as:

**HKDF-SHA-256**

or an equivalent approved construction.

### Hashing

Use:

**SHA-3-256**

for document hashes, event identifiers, and ledger structures.

### Watermark authentication

Use a keyed authentication mechanism such as:

**HMAC-SHA-256**

where appropriate.

---

# 7. Identity Model

Every recipient has a cryptographic identity.

Conceptually:

```text
Recipient
   │
   ├── Identity ID
   │
   ├── ML-KEM key pair
   │
   └── ML-DSA key pair
```

The private keys must remain under the recipient's control.

The system must never transmit private keys to the sender.

The sender only needs the recipient's public cryptographic information.

---

# 8. Document Encryption Workflow

The sender begins with:

```text
Plaintext Document
```

The system generates a document identifier and canonical document hash.

```text
Document
   ↓
Canonicalization
   ↓
SHA3-256
   ↓
Document Hash
```

A random symmetric content key is generated:

```text
K_document
```

The document is encrypted using:

```text
AES-256-GCM
```

Each recipient receives a protected copy of the content key using:

```text
ML-KEM
   ↓
Shared Secret
   ↓
KDF
   ↓
Key Encryption Key
   ↓
Encrypted Content Key
```

The important rule is:

> **Recipients must not be able to use another recipient's encrypted package to decrypt the document.**

---

# 9. Per-Recipient / Per-Session Watermark

This is one of the most important components of the system.

The system must not generate merely:

```text
Document + Recipient
```

as the watermark.

It must generate:

```text
Document
+
Recipient
+
Decryption Session
+
Random Nonce
+
Event Identifier
```

Conceptually:

```text
Random Nonce
      +
Document Hash
      +
Recipient ID
      +
Session ID
      +
Event Counter
      ↓
SHA3-256
      ↓
Event ID
```

Example:

```text
EVT-83A92F...
```

Every decryption session must generate a different event identifier.

Therefore:

```text
Alice → Document A → Session 1 → EVT001
Alice → Document A → Session 2 → EVT002
Bob   → Document A → Session 1 → EVT003
```

---

# 10. Watermark Design

The watermark must be:

### Invisible

The normal recipient should not visually notice it.

### Unique

Every decryption event must receive a different watermark.

### Document-bound

A watermark created for Document A must not be valid for Document B.

### Recipient/session-bound

The watermark must correspond to a specific decryption event.

### Authenticated

An attacker must not be able to trivially fabricate a valid watermark.

### Recoverable

The system must be capable of extracting it from a leaked copy.

---

# 11. Hybrid Watermark Strategy

The system should not depend exclusively on zero-width Unicode characters.

The preferred architecture is:

```text
                Watermark Payload
                       │
                       ▼
              Error Correction
                       │
                       ▼
            Redundant Bitstream
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
      Zero-width     DWT/DCT     Structural
       channel       channel     redundancy
          │            │            │
          └────────────┼────────────┘
                       ▼
                Watermarked Copy
```

### Channel 1 — Zero-width encoding

Useful for text-preserving transformations.

### Channel 2 — Frequency-domain watermark

Use techniques such as:

* DCT
* DWT
* spread-spectrum embedding

for rendered document content.

### Channel 3 — Redundancy

Distribute watermark information across multiple pages or document regions.

---

# 12. Error Correction

Before embedding the watermark:

```text
Event ID
   ↓
ECC Encoder
   ↓
Redundant Payload
   ↓
Watermark Embedding
```

Possible mechanisms include:

* Reed-Solomon
* BCH
* another suitable error-correcting code

The purpose is to allow recovery when:

* pages are damaged
* some watermark bits are lost
* compression occurs
* portions of the document are modified

---

# 13. Decryption Workflow

When an authorized recipient opens the encrypted package:

```text
Encrypted Package
       ↓
Authenticate Recipient
       ↓
Check Authorization
       ↓
ML-KEM Decapsulation
       ↓
Recover Content Key
       ↓
AES-256-GCM Decryption
       ↓
Create Decryption Session
       ↓
Generate Event ID
       ↓
Generate Watermark
       ↓
Embed Watermark
       ↓
Generate Decryption Attestation
       ↓
ML-DSA Sign Attestation
       ↓
Commit Event to Offline DLT
       ↓
Release Plaintext
```

### Critical security rule

The plaintext must not be released before the decryption event has been successfully recorded according to the system's evidence policy.

---

# 14. Decryption Attestation

Every successful decryption generates a signed record.

Conceptually:

```json
{
  "event_id": "...",
  "document_id": "...",
  "document_hash": "...",
  "recipient_id": "...",
  "session_id": "...",
  "watermark_id": "...",
  "timestamp": "...",
  "device_id": "...",
  "key_id": "..."
}
```

The recipient's private **ML-DSA** key signs this record.

Conceptually:

```text
Attestation
     ↓
ML-DSA.Sign()
     ↓
Digital Signature
```

The signature proves that the event was authorized by the cryptographic identity associated with that recipient.

---

# 15. Ledger Architecture

The ledger must be **offline and permissioned**.

It must not depend on:

* Bitcoin
* Ethereum
* public blockchain networks
* Internet-based validators

Instead:

```text
             AIR-GAPPED NETWORK

              ┌────────────┐
              │ Ledger A   │
              └─────┬──────┘
                    │
              ┌─────▼──────┐
              │ Ledger B   │
              └─────┬──────┘
                    │
              ┌─────▼──────┐
              │ Ledger C   │
              └─────┬──────┘
                    │
              ┌─────▼──────┐
              │ Ledger D   │
              └────────────┘
```

No single administrator should be able to silently rewrite history.

---

# 16. Ledger Record

A ledger event should contain evidence such as:

```text
Event ID
Document ID
Document Hash
Recipient ID
Session ID
Watermark ID
Key ID
Timestamp
Device ID
ML-DSA Signature
Previous Event Hash
```

The actual document must **not** be stored on the blockchain/DLT.

The ledger stores evidence about the document.

---

# 17. Hash Chain

Each record is cryptographically linked:

```text
Entry 1
   ↓
SHA3-256
   ↓
Entry 2
   ↓
SHA3-256
   ↓
Entry 3
   ↓
...
```

This provides tamper evidence.

However:

> **A hash chain alone must not be described as sufficient protection against a malicious administrator who can rewrite the entire log.**

Therefore the project uses distributed ledger replication and quorum-based finalization.

---

# 18. Merkle Tree

Ledger entries are periodically organized into a Merkle tree.

```text
              Merkle Root
             /            \
           H12             H34
          /  \            /  \
        H1   H2          H3   H4
```

The root provides a compact commitment to the ledger state.

A particular event can then be proven to belong to the ledger using a Merkle inclusion proof.

---

# 19. Offline Quorum

The project must use multiple ledger nodes.

For example:

```text
5 nodes

A
B
C
D
E
```

A ledger state becomes final only after the required quorum agrees.

Example:

```text
3 / 5 nodes
```

This prevents:

```text
Administrator A
       ↓
Modify event
       ↓
Other nodes reject modification
```

This is a critical component of the **"no single administrator can rewrite history"** requirement.

---

# 20. Key Lifecycle

The system must support:

```text
KEY CREATED
     ↓
ACTIVE
     ↓
ROTATED
     ↓
REVOKED
```

Historical signatures must remain verifiable.

Therefore every key should have:

```text
Key ID
Key Version
Public Key
Valid From
Valid Until
Status
```

During forensic verification:

```text
Signature valid?
       ↓
Was key valid at event time?
       ↓
Was key revoked before event?
       ↓
Final result
```

---

# 21. Forensic Attribution Workflow

This is the second major operational mode of the application.

Investigator supplies:

```text
Leaked Document
```

The forensic engine performs:

```text
Leaked Document
      ↓
Document Preprocessing
      ↓
Watermark Detection
      ↓
Zero-width Extraction
      ↓
DWT/DCT Extraction
      ↓
ECC Reconstruction
      ↓
Watermark Validation
      ↓
Event ID
      ↓
Ledger Lookup
      ↓
Retrieve Event
      ↓
Verify Document Hash
      ↓
Verify Watermark
      ↓
Verify ML-DSA Signature
      ↓
Verify Ledger/Merkle Proof
      ↓
Verify Key Status
      ↓
Generate Attribution Result
```

---

# 22. Forensic Result

The system must not simply return:

```text
Alice
```

It must return an evidence-backed result.

Example:

```text
════════════════════════════════════
     FORENSIC ATTRIBUTION RESULT
════════════════════════════════════

Document:
CONFIDENTIAL_DOCUMENT.pdf

Document Hash:
SHA3-256: 9F2A....

Watermark:
VALID

Event ID:
EVT-83A92F....

Recipient:
USER-104

Session:
SES-00291

Timestamp:
2026-09-26 14:32:18

ML-DSA Signature:
VALID

Ledger Record:
VALID

Merkle Inclusion:
VALID

Document Binding:
VALID

Key Status:
VALID

════════════════════════════════════

ATTRIBUTION STATUS:
CRYPTOGRAPHICALLY VERIFIED

════════════════════════════════════
```

The system should explicitly distinguish:

> **cryptographic attribution**

from:

> **intentional leaking**

---

# 23. Confidence Model

Forensic extraction should produce a confidence score rather than blindly trusting noisy extraction.

Example:

```text
Watermark confidence       98.7%
ECC reconstruction         VALID
HMAC                       VALID
Document binding           VALID
Ledger match               VALID
ML-DSA signature           VALID
Key validity               VALID
```

Final status:

```text
CRYPTOGRAPHICALLY VERIFIED
```

If evidence is incomplete:

```text
INCONCLUSIVE
```

The system must **never fabricate an attribution when evidence cannot be verified**.

---

# 24. Complete System Workflow

This is the master workflow that the development agent should implement.

```text
                    ┌──────────────────┐
                    │  DOCUMENT OWNER  │
                    └────────┬─────────┘
                             │
                             ▼
                       Upload Document
                             │
                             ▼
                    Canonicalize Document
                             │
                             ▼
                       SHA3-256 Hash
                             │
                             ▼
                    Generate Content Key
                             │
                             ▼
                     AES-256-GCM Encrypt
                             │
                             ▼
                   Recipient Authorization
                             │
                             ▼
                        ML-KEM Wrap
                             │
                             ▼
                   Recipient Package
                             │
                             ▼
                  ┌──────────────────────┐
                  │      RECIPIENT       │
                  └──────────┬───────────┘
                             │
                             ▼
                       Authenticate
                             │
                             ▼
                     Check Authorization
                             │
                             ▼
                       ML-KEM Unwrap
                             │
                             ▼
                    AES-GCM Decryption
                             │
                             ▼
                    Create Session ID
                             │
                             ▼
                    Generate Event ID
                             │
                             ▼
                     Generate Watermark
                             │
                             ▼
                       ECC Encoding
                             │
                             ▼
                   Embed Invisible Mark
                             │
                             ▼
                    Create Attestation
                             │
                             ▼
                    ML-DSA Signature
                             │
                             ▼
                       Offline DLT
                             │
                             ▼
                       Quorum Finalize
                             │
                             ▼
                      Release Document
                             │
                             │
                             │
                         LEAK OCCURS
                             │
                             ▼
                    ┌──────────────────┐
                    │ FORENSIC ANALYST │
                    └────────┬─────────┘
                             │
                             ▼
                      Upload Leaked Copy
                             │
                             ▼
                    Detect Watermark
                             │
                             ▼
                    Extract Watermark
                             │
                             ▼
                      ECC Recovery
                             │
                             ▼
                       Event ID
                             │
                             ▼
                       Ledger Lookup
                             │
                             ▼
                   Document Hash Check
                             │
                             ▼
                   ML-DSA Verification
                             │
                             ▼
                    Ledger Verification
                             │
                             ▼
                     Key Status Check
                             │
                             ▼
                  Cryptographic Attribution
                             │
                             ▼
                     Evidence Report
```

---

# 25. Development Boundaries

Every implementation decision should be evaluated against these questions:

### Question 1

**Does this feature help identify the source of a leaked document?**

If no → it is probably outside the core scope.

### Question 2

**Does it preserve offline/air-gapped operation?**

If no → reject it.

### Question 3

**Does it preserve cryptographic verifiability?**

If no → reject or redesign it.

### Question 4

**Does it preserve per-session uniqueness?**

If no → redesign it.

### Question 5

**Does it introduce a single point of trust?**

If yes → investigate whether it violates the DLT security objective.

---

# 26. Non-Negotiable Requirements

The development agent must **never remove or silently replace** these requirements.

### Cryptography

* ML-KEM for PQ key establishment
* ML-DSA for PQ signatures
* AES-256-GCM for document encryption
* SHA-3 for cryptographic hashing
* authenticated watermark payload
* secure random number generation

### Watermark

* invisible
* per-recipient
* per-session
* document-bound
* authenticated
* extractable
* error-correctable
* visually imperceptible

### Ledger

* offline
* permissioned
* distributed
* tamper-evident
* quorum controlled
* Merkle-verifiable
* no public blockchain dependency

### Deployment

* air-gapped
* no cloud KMS
* no Internet dependency
* no public blockchain
* no external API required

### Forensics

* watermark extraction
* watermark validation
* ledger lookup
* signature verification
* document hash verification
* key-status verification
* evidence report

---

# 27. Things the Development Agent Must NOT Do

The agent must not:

❌ Replace ML-KEM with X25519 merely because it is easier.

❌ Replace ML-DSA with Ed25519 merely because a library is easier.

❌ Make the system dependent on a public blockchain.

❌ Store documents directly on the blockchain.

❌ Store private keys on the server.

❌ Use only a normal visible watermark.

❌ Generate one static watermark per recipient.

❌ Release plaintext before the required decryption event is recorded.

❌ Trust the database without cryptographic verification.

❌ Treat a hash chain alone as an immutable distributed ledger.

❌ Put raw recipient identity unnecessarily inside the watermark.

❌ Claim that the system proves malicious intent.

❌ Invent attribution when watermark extraction or cryptographic verification fails.

❌ Introduce cloud services into the core architecture.

---

# 28. Recommended Technology Architecture

For implementation:

```text
┌──────────────────────────────────────────────┐
│                 Tauri UI                     │
├──────────────────────────────────────────────┤
│                Rust Backend                  │
├──────────────┬──────────────┬────────────────┤
│ Crypto       │ Watermark    │ Forensics      │
│              │              │                │
│ ML-KEM       │ Zero-width   │ Extractor      │
│ ML-DSA       │ DWT/DCT      │ ECC            │
│ AES-GCM      │ ECC          │ Verification   │
│ SHA-3        │ HMAC         │ Attribution    │
├──────────────┴──────────────┴────────────────┤
│               Evidence Layer                 │
│                                              │
│       Permissioned Offline DLT               │
│       Merkle Tree + Hash Chain               │
├──────────────────────────────────────────────┤
│              Local Storage                   │
│                 SQLite                       │
└──────────────────────────────────────────────┘
```

---

# 29. The One-Sentence Definition

If the development agent ever loses context, give it this sentence:

> **Build an air-gapped, post-quantum secure document distribution system that creates a unique invisible forensic fingerprint for every authorized decryption session, cryptographically binds that event to the recipient through an ML-DSA signature, records the evidence in a quorum-controlled offline ledger, and later identifies the corresponding decryption event from a leaked document through independently verifiable forensic evidence.**

---

# 30. The Core Mental Model

The entire project can ultimately be remembered as:

```text
             PROTECT
                │
                ▼
          ENCRYPT DOCUMENT
                │
                ▼
             CONTROL
                │
                ▼
        AUTHORIZE DECRYPTION
                │
                ▼
             IDENTIFY
                │
                ▼
       CREATE UNIQUE EVENT
                │
                ▼
            FINGERPRINT
                │
                ▼
       INVISIBLE WATERMARK
                │
                ▼
             PROVE
                │
                ▼
          ML-DSA SIGNATURE
                │
                ▼
            PRESERVE
                │
                ▼
        OFFLINE QUORUM DLT
                │
                ▼
             INVESTIGATE
                │
                ▼
         EXTRACT WATERMARK
                │
                ▼
             VERIFY
                │
                ▼
          CRYPTOGRAPHIC
            ATTRIBUTION
```

### **The project's fundamental proposition**

**Encryption answers:**

> *"Who is allowed to read this document?"*

**Watermarking answers:**

> *"Which decrypted copy is this?"*

**Digital signatures answer:**

> *"Which recipient's cryptographic identity authorized this decryption event?"*

**The ledger answers:**

> *"Can we prove that this event existed and has not been retroactively altered?"*

**Forensic verification answers:**

> *"Does this leaked document correspond to that specific decryption event?"*

That separation of responsibilities should remain the **central architectural principle throughout development**.
