Yes. For this project, I would **not** treat the dashboard as a generic admin panel. It should be designed as a **government-grade security operations and document-forensics console**, with the visual language grounded in **UX4G + GIGW 3.0**, while keeping the application fully air-gapped.

GIGW 3.0 explicitly emphasizes usability, user-centricity, universal accessibility, cybersecurity, lifecycle management, monitoring dashboards, and WCAG 2.1 AA. ([Guidelines India][1]) The Government of India's UX4G Design System 3.0 provides the more appropriate foundation for the actual UI system: tokens, components, patterns, spacing, typography, accessibility, and theming. ([UX4G][2])

Below is the **master PRD I recommend giving to the coding/development agent**.

---

# MASTER PRODUCT REQUIREMENTS DOCUMENT

## Project: Air-Gapped Cryptographic Document Leak Attribution Platform

**Target environment:** Government of India / secure government infrastructure
**Deployment model:** Offline / air-gapped / sovereign infrastructure
**Primary objective:** Cryptographic attribution of leaked confidential documents
**Design foundation:** Government of India UX4G + GIGW 3.0
**Security model:** Post-quantum cryptography + forensic watermarking + permissioned offline DLT
**Primary users:** Government administrators, document owners, authorized recipients, security officers, forensic investigators, auditors

---

# 1. PRODUCT VISION

Build a secure, government-grade platform that allows authorized government organizations to:

1. Register trusted users and cryptographic identities.
2. Encrypt and distribute sensitive documents.
3. Authorize specific recipients to decrypt those documents.
4. Generate a unique forensic fingerprint for every decryption session.
5. Cryptographically bind each decryption event to the recipient's post-quantum identity.
6. Preserve the event in an offline, tamper-evident distributed ledger.
7. Analyze a leaked document.
8. Extract its forensic fingerprint.
9. Locate the corresponding decryption event.
10. Cryptographically verify the evidence.
11. Produce a formal forensic attribution report.

The platform must operate completely inside an air-gapped environment.

---

# 2. FUNDAMENTAL PRODUCT PROPOSITION

The system must maintain the following chain:

```text
AUTHORIZED USER
      ↓
AUTHORIZED DECRYPTION
      ↓
DECRYPTION SESSION
      ↓
UNIQUE EVENT ID
      ↓
INVISIBLE FORENSIC WATERMARK
      ↓
POST-QUANTUM DIGITAL SIGNATURE
      ↓
OFFLINE DISTRIBUTED LEDGER
      ↓
LEAKED DOCUMENT
      ↓
WATERMARK EXTRACTION
      ↓
LEDGER LOOKUP
      ↓
CRYPTOGRAPHIC VERIFICATION
      ↓
FORENSIC ATTRIBUTION
```

The platform is not simply:

* document encryption software
* blockchain software
* watermarking software
* an audit-log system

It is an integrated **cryptographic document provenance and leak-attribution platform**.

---

# 3. GOVERNMENT DESIGN AND COMPLIANCE FOUNDATION

The UI must follow the Government of India's UX4G Design System and the relevant GIGW 3.0 principles.

GIGW 3.0 applies to government websites and applications and is designed around usability, user-centricity, universal accessibility, security and lifecycle management. It also identifies specific responsibilities for government organizations, developers and evaluators.

UX4G 3.0 provides:

* design tokens
* typography
* color
* spacing
* elevation
* iconography
* components
* patterns
* WCAG 2.1 AA accessibility baseline
* government-specific implementation guidance.

The implementation should use UX4G tokens/components rather than inventing a separate design language.

### Official design references

* [GIGW 3.0 — Government of India](https://guidelines.india.gov.in/?utm_source=chatgpt.com)
* [UX4G Design System 3.0](https://www.ux4g.gov.in/?utm_source=chatgpt.com)
* [UX4G Developer Documentation](https://www.ux4g.gov.in/get-started/for-developers?utm_source=chatgpt.com)
* [UX4G Foundations](https://www.ux4g.gov.in/foundations?utm_source=chatgpt.com)

---

# 4. VISUAL DESIGN REQUIREMENTS

## 4.1 Overall aesthetic

The interface must feel:

* official
* secure
* restrained
* institutional
* trustworthy
* information-dense but readable
* modern without looking like a consumer SaaS product

Avoid:

* excessive gradients
* glassmorphism
* neon colors
* excessive animation
* decorative illustrations that compete with security information
* cryptocurrency-style visual language
* excessive rounded cards
* gaming-style dashboards

The application should resemble a **national-security / government enterprise console**, not a startup analytics dashboard.

---

# 5. COLOR SYSTEM

Do not arbitrarily create an "Indian government color palette."

Use UX4G design tokens as the source of truth.

UX4G provides primary, secondary, tertiary, semantic and neutral color systems and supports department-specific themes through Theme Craft.

For this project, use an institutional theme approximately based around:

```text
Primary:
Deep Government Navy / Blue

Secondary:
Saffron / Orange

Tertiary:
Green

Neutral:
White / Cool Gray / Slate
```

The exact production values must come from the approved UX4G theme/token implementation rather than hard-coded arbitrary colors.

UX4G's token system should be consumed through CSS variables/design tokens.

Example conceptual tokens:

```css
--gov-primary
--gov-primary-hover
--gov-primary-active

--gov-secondary
--gov-tertiary

--gov-success
--gov-warning
--gov-danger
--gov-info

--gov-bg
--gov-surface
--gov-border
--gov-text
--gov-text-muted
```

Do not scatter hex codes throughout the codebase.

---

# 6. ACCESSIBILITY

Accessibility is mandatory.

GIGW 3.0 incorporates WCAG 2.1 Level AA requirements.

The platform must support:

* keyboard navigation
* visible focus indicators
* screen readers
* semantic HTML
* accessible forms
* accessible tables
* accessible dialogs
* accessible charts
* text alternatives
* sufficient color contrast
* scalable text
* responsive layouts
* reduced-motion preference

GIGW specifically requires that color not be the sole mechanism for conveying meaning and specifies contrast requirements.

Therefore:

```text
FAILED
```

must not be represented only by red.

Instead:

```text
✕ FAILED
```

and use:

* icon
* text
* color

together.

---

# 7. LANGUAGE AND LOCALIZATION

The architecture must be localization-ready.

Minimum initial language:

* English
* Hindi

The application must use Unicode throughout.

Future languages must be addable without modifying business logic.

Architecture:

```text
UI
 ↓
i18n layer
 ↓
Translation resources
 ↓
Rendered language
```

Never hard-code user-facing strings inside business logic.

---

# 8. PRIMARY USER ROLES

The system must implement RBAC.

## 8.1 Super Administrator

Can:

* manage system configuration
* manage organizations
* manage nodes
* manage policies
* manage cryptographic infrastructure
* view system health
* manage roles

Must NOT automatically have unrestricted access to decrypted document content.

---

## 8.2 Security Administrator

Can:

* manage security policies
* monitor cryptographic events
* manage key lifecycle
* investigate alerts
* review security events

---

## 8.3 Document Administrator / Owner

Can:

* upload documents
* classify documents
* encrypt documents
* create distribution packages
* authorize recipients
* revoke access
* view document activity

---

## 8.4 Recipient

Can:

* authenticate
* view authorized documents
* decrypt authorized documents
* generate signed decryption events

Cannot:

* modify ledger history
* modify forensic evidence
* access other recipients' documents

---

## 8.5 Forensic Investigator

Can:

* import leaked documents
* run watermark extraction
* search forensic evidence
* verify signatures
* verify ledger proofs
* generate forensic reports

Cannot:

* alter forensic evidence
* modify ledger records

---

## 8.6 Auditor

Read-only access to:

* audit logs
* ledger records
* system events
* cryptographic verification
* compliance reports

---

# 9. APPLICATION INFORMATION ARCHITECTURE

Primary navigation:

```text
Dashboard
│
├── Documents
│   ├── All Documents
│   ├── Classified
│   ├── Distribution
│   ├── Decryption Events
│   └── Access Policies
│
├── Recipients
│   ├── Users
│   ├── Organizations
│   ├── Roles
│   └── Cryptographic Identities
│
├── Forensics
│   ├── New Investigation
│   ├── Investigations
│   ├── Watermark Analysis
│   ├── Attribution Results
│   └── Reports
│
├── Ledger
│   ├── Events
│   ├── Blocks
│   ├── Merkle Roots
│   ├── Nodes
│   └── Integrity Verification
│
├── Cryptography
│   ├── ML-KEM Keys
│   ├── ML-DSA Keys
│   ├── Key Rotation
│   ├── Revocation
│   └── Cryptographic Policies
│
├── Security
│   ├── Security Events
│   ├── Alerts
│   ├── Sessions
│   └── Threat Events
│
├── Audit
│   ├── Audit Log
│   ├── Administrative Actions
│   ├── Verification History
│   └── Export
│
├── System
│   ├── Nodes
│   ├── Services
│   ├── Storage
│   ├── Backups
│   └── Health
│
└── Settings
    ├── Organization
    ├── Policies
    ├── Appearance
    ├── Localization
    └── System Configuration
```

---

# 10. MASTER DASHBOARD

The dashboard is the central command center.

It must answer:

> "What is happening in the secure document environment right now?"

---

## 10.1 Header

Header should contain:

```text
Government / Organization Identity
Platform Name

System Status: SECURE / DEGRADED / CRITICAL

Air-Gapped: ACTIVE

Current User
Role
Session Security
Logout
```

Example:

```text
┌─────────────────────────────────────────────────────────────┐
│ GOV OF INDIA | CRYPTOGRAPHIC DOCUMENT SECURITY PLATFORM     │
│                                                             │
│ ● AIR-GAPPED     ● LEDGER HEALTHY     ● PQC ACTIVE          │
│                                      Security Officer ▾     │
└─────────────────────────────────────────────────────────────┘
```

The exact government emblem/logo must only be used when authorized by the deploying organization. GIGW requires appropriate government visual identity and emblem/logo usage.

---

# 11. DASHBOARD KPI CARDS

Primary cards:

### Protected Documents

```text
1,284
+18 this week
```

### Active Recipients

```text
426
```

### Decryption Events

```text
18,492
```

### Verified Ledger Events

```text
18,492
100% integrity
```

### Active Investigations

```text
12
3 require attention
```

### Verified Attributions

```text
47
```

### Ledger Nodes

```text
5 / 5 ONLINE
```

### PQC Status

```text
ML-KEM: ACTIVE
ML-DSA: ACTIVE
```

---

# 12. DASHBOARD SECURITY OVERVIEW

Display:

```text
SYSTEM SECURITY
────────────────────────────

PQC
✓ ML-KEM active
✓ ML-DSA active

Ledger
✓ All nodes synchronized
✓ Latest Merkle root verified

Watermark Engine
✓ Operational
✓ Extraction service operational

Identity
✓ Key registry healthy
✓ No critical revocations

Air-Gap
✓ External connectivity disabled
```

---

# 13. LIVE SECURITY EVENTS

Show the most recent events:

```text
Time       Event                    Severity

14:42      Document decrypted       INFO
14:39      New recipient added       INFO
14:32      Watermark verified       SUCCESS
14:20      Investigation started    INFO
14:17      Key rotation completed   SUCCESS
14:02      Failed authentication    WARNING
```

---

# 14. DOCUMENT MANAGEMENT

Document list must contain:

```text
Document ID
Document Name
Classification
Owner
Recipients
Created
Last Decryption
Status
Integrity
```

Example:

| Document         | Classification | Recipients | Integrity | Status  |
| ---------------- | -------------- | ---------: | --------- | ------- |
| Project Alpha    | CONFIDENTIAL   |         12 | Verified  | Active  |
| Strategic Report | SECRET         |          8 | Verified  | Active  |
| Tender Document  | RESTRICTED     |         24 | Verified  | Revoked |

---

# 15. DOCUMENT DETAIL PAGE

Sections:

```text
Overview
Security
Recipients
Distribution
Decryption Events
Watermarks
Ledger Evidence
Audit History
```

Security section:

```text
Encryption:
AES-256-GCM

Key Encapsulation:
ML-KEM-768

Document Hash:
SHA3-256

Watermark:
Enabled

Document Integrity:
VERIFIED
```

---

# 16. RECIPIENT MANAGEMENT

Recipient profile:

```text
Identity ID
Name
Department
Organization
Role
Status
ML-KEM Key
ML-DSA Key
Key Version
Key Status
Last Authentication
Last Decryption
```

Key status:

```text
ACTIVE
ROTATING
REVOKED
COMPROMISED
EXPIRED
```

---

# 17. DOCUMENT DISTRIBUTION

Distribution workflow:

```text
Select Document
      ↓
Select Classification
      ↓
Select Recipients
      ↓
Review Permissions
      ↓
Generate Encryption Package
      ↓
Confirm
      ↓
Distribution Complete
```

Before final confirmation:

```text
Document:
Project Alpha

Recipients:
12

Encryption:
AES-256-GCM

Key Encapsulation:
ML-KEM-768

Watermark:
Per-session

Ledger:
Enabled
```

---

# 18. RECIPIENT DECRYPTION EXPERIENCE

Recipient interface must be intentionally simple.

```text
Authorized Documents

┌──────────────────────────────┐
│ Project Alpha                │
│ Classification: Confidential │
│ Authorized: Yes              │
│                              │
│ [ Open Securely ]            │
└──────────────────────────────┘
```

On decryption:

```text
Authenticating...
       ✓

Authorization verified
       ✓

PQC key verified
       ✓

Document decrypted
       ✓

Forensic watermark generated
       ✓

Decryption event signed
       ✓

Ledger evidence committed
       ✓

Document ready
```

Only after successful completion should the plaintext become available.

---

# 19. FORENSIC INVESTIGATION MODULE

This is a flagship module.

Landing page:

```text
FORENSIC INVESTIGATIONS

[ + NEW INVESTIGATION ]

Active Investigations
Completed Investigations
Failed Analyses
Verified Attributions
```

---

# 20. NEW INVESTIGATION FLOW

```text
Upload Leaked Document
        ↓
Select Investigation Type
        ↓
Calculate Document Hash
        ↓
Scan Watermark Channels
        ↓
Recover ECC Payload
        ↓
Validate Watermark
        ↓
Resolve Event ID
        ↓
Query Offline Ledger
        ↓
Verify Signature
        ↓
Verify Document Binding
        ↓
Verify Key Status
        ↓
Verify Merkle Proof
        ↓
Generate Evidence
```

---

# 21. FORENSIC RESULTS UI

The result must clearly distinguish:

```text
IDENTIFICATION
VERIFICATION
ATTRIBUTION
CONFIDENCE
```

Example:

```text
FORENSIC RESULT

Watermark:
✓ DETECTED

Watermark Authenticity:
✓ VERIFIED

Event ID:
EVT-83A92F

Document Binding:
✓ MATCH

Ledger:
✓ VERIFIED

ML-DSA Signature:
✓ VALID

Recipient:
USER-104

Key Status:
✓ VALID AT EVENT TIME

Attribution Confidence:
98.7%

FINAL STATUS:

CRYPTOGRAPHICALLY VERIFIED
```

---

# 22. FORENSIC REPORT

Generate a signed/exportable report containing:

```text
Investigation ID
Investigator
Date
Document Hash
Watermark ID
Event ID
Recipient ID
Session ID
Device ID
Timestamp
Key ID
Signature
Ledger Block
Merkle Root
Merkle Proof
Verification Results
Confidence
Limitations
```

The report must state:

> "The evidence establishes cryptographic association with the specified decryption event. It does not independently establish human intent or motive."

---

# 23. LEDGER EXPLORER

Provide an explorer similar to a secure transparency log.

```text
Block #18291

Previous Hash
Current Hash
Merkle Root
Timestamp
Validator Nodes
Events
```

Event detail:

```text
Event ID
Document Hash
Recipient
Session
Timestamp
Signature
Signature Status
Previous Event Hash
Merkle Proof
```

Provide:

```text
[ Verify Event ]
```

which performs independent verification.

---

# 24. LEDGER NODE MONITORING

Dashboard:

```text
NODE      STATUS       HEIGHT       LATENCY

NODE-A    ONLINE       18291        2ms
NODE-B    ONLINE       18291        3ms
NODE-C    ONLINE       18291        4ms
NODE-D    ONLINE       18291        3ms
NODE-E    ONLINE       18290        5ms
```

Alert if:

```text
node offline
ledger divergence
unexpected height
invalid block
invalid signature
consensus failure
```

---

# 25. SYSTEM HEALTH

System health page:

```text
Crypto Service          HEALTHY
Watermark Engine        HEALTHY
Ledger                  HEALTHY
Identity Service        HEALTHY
Database                HEALTHY
Storage                 72%
Backup                  HEALTHY
Network Isolation       ACTIVE
```

---

# 26. SECURITY MODEL

Threat model must explicitly cover:

### External attacker

Attempts to access encrypted documents.

### Malicious recipient

Attempts to:

* remove watermark
* forge watermark
* impersonate another recipient
* reuse another package
* manipulate event records

### Malicious administrator

Attempts to:

* delete audit entries
* rewrite ledger
* alter recipient identity
* suppress an event
* modify forensic evidence

### Compromised key

Attempts to:

* generate fraudulent attestations
* impersonate a recipient

### Document manipulation

Attempts to:

* remove watermark
* modify content
* transplant watermark
* create false attribution

---

# 27. CRYPTOGRAPHIC REQUIREMENTS

Production mode:

```text
Key Establishment:
ML-KEM-768

Digital Signature:
ML-DSA-65

Symmetric Encryption:
AES-256-GCM

Hash:
SHA3-256

KDF:
HKDF-SHA-256 or approved equivalent

Authentication:
HMAC-SHA-256 where applicable
```

Do not silently substitute X25519 or Ed25519 for production PQC.

---

# 28. WATERMARK ENGINE

Watermark payload:

```text
Version
Document ID
Document Hash
Event ID
Watermark ID
Integrity Tag
```

Before embedding:

```text
Payload
 ↓
ECC
 ↓
Encryption/encoding if required
 ↓
Embedding
```

Watermark must be:

* invisible
* redundant
* error-corrected
* document-bound
* session-specific
* cryptographically authenticated

---

# 29. WATERMARK EXTRACTION ENGINE

Extraction must support multiple channels:

```text
Zero-width
DWT/DCT
Structural
```

Output:

```text
Payload recovered
ECC status
HMAC status
Document binding
Confidence
```

Never return a recipient attribution solely because an unverified watermark-like pattern was found.

---

# 30. IDENTITY ARCHITECTURE

Use an internal identity authority.

```text
Organization
    ↓
Identity Registry
    ↓
User
    ↓
Cryptographic Identity
    ├── ML-KEM public key
    └── ML-DSA public key
```

Private keys remain protected.

The platform must support:

* enrollment
* activation
* rotation
* revocation
* compromise
* recovery
* archival

---

# 31. KEY MANAGEMENT

No cloud KMS.

Implement a local cryptographic key-management abstraction.

```text
Key Manager
├── generate
├── import
├── export-policy
├── rotate
├── revoke
├── archive
└── verify
```

For a prototype:

* encrypted local keystore

For production:

* integration abstraction for government-approved HSM/secure hardware

The application architecture must not be coupled to one vendor.

---

# 32. AIR-GAP ARCHITECTURE

The entire platform must function with:

```text
Internet = DISCONNECTED
```

Internal network:

```text
Secure LAN
    │
    ├── Application Server
    ├── Identity Server
    ├── Ledger Node A
    ├── Ledger Node B
    ├── Ledger Node C
    ├── Ledger Node D
    ├── Ledger Node E
    └── Forensic Workstation
```

External network calls must be disabled in production.

---

# 33. OFFLINE PACKAGE MANAGEMENT

All dependencies must be vendored or available in an approved offline package repository.

Build process:

```text
Internet-connected development environment
              ↓
Dependency verification
              ↓
Signed artifact bundle
              ↓
Security scanning
              ↓
Offline transfer
              ↓
Air-gapped environment
              ↓
Installation
```

The production application must not attempt:

```text
npm download
pip install
CDN request
Google Fonts
analytics
telemetry
external API
```

at runtime.

---

# 34. RECOMMENDED TECHNOLOGY STACK

## Frontend

Preferred:

```text
Nextjs
TypeScript
UX4G
CSS Modules / Tailwind only where compatible with UX4G tokens
```

Alternative desktop shell:

```text
Tauri
```

Use Tauri rather than Electron if the deployment target permits it, primarily to reduce runtime footprint and improve control over the native boundary.

---

# 35. Backend

Recommended:

```text
Rust
```

Reasons:

* memory safety
* strong type system
* good cryptographic ecosystem
* deterministic services
* low runtime footprint
* excellent suitability for air-gapped systems
* native desktop integration
* strong concurrency model

---

# 36. Cryptographic Layer

Use audited/maintained implementations of:

```text
ML-KEM
ML-DSA
AES-GCM
SHA-3
HKDF
HMAC
```

Do not implement cryptographic primitives from mathematical formulas manually.

The project should consume established cryptographic libraries and isolate them behind an internal cryptographic abstraction.

---

# 37. Database

Use:

```text
PostgreSQL
```

for the scalable deployment.

Use:

```text
SQLite
```

for:

* development
* single-node demo
* offline forensic workstation

Do not use the relational database as the authoritative immutable ledger.

Database:

> operational state

DLT:

> evidence state

---

# 38. DLT

Use a permissioned, offline-capable DLT architecture.

The implementation should abstract the ledger behind:

```text
LedgerService
├── appendEvent()
├── getEvent()
├── verifyEvent()
├── getBlock()
├── getMerkleProof()
├── getRoot()
└── verifyLedger()
```

This prevents the rest of the application from being coupled directly to a particular DLT implementation.

For the prototype, a controlled permissioned ledger implementation can be used.

For production evaluation, assess a mature permissioned DLT such as Hyperledger Fabric against the deployment environment.

---

# 39. API ARCHITECTURE

Use REST for administrative/application APIs.

Use gRPC for internal high-trust service communication where appropriate.

Example:

```text
/api/v1/auth
/api/v1/users
/api/v1/documents
/api/v1/distributions
/api/v1/decryptions
/api/v1/watermarks
/api/v1/investigations
/api/v1/ledger
/api/v1/keys
/api/v1/audit
/api/v1/system
```

All APIs must have:

* authentication
* authorization
* input validation
* audit logging
* rate limiting where applicable
* structured error handling
* request IDs

---

# 40. EVENT MODEL

Every security-sensitive action must have an event ID.

Example:

```text
AUTH-...
DOC-...
DEC-...
WM-...
SIG-...
LEDGER-...
FORENSIC-...
ADMIN-...
```

Use globally unique identifiers.

---

# 41. AUDIT MODEL

Audit logs are separate from forensic ledger records.

### Application audit log

Tracks:

```text
who performed what action
when
from which device
result
```

### Forensic ledger

Tracks:

```text
cryptographic decryption evidence
```

Do not merge these concepts.

---

# 42. OBSERVABILITY

Because the environment is air-gapped, observability must be local.

Implement:

```text
Structured logs
Metrics
Health checks
Security events
Audit events
Ledger telemetry
```

No external telemetry.

No Google Analytics.

No external monitoring SaaS.

---

# 43. SECURITY LOGGING

Never log:

* private keys
* plaintext documents
* decrypted sensitive content
* passwords
* authentication secrets
* raw cryptographic secrets

Log:

```text
Event ID
User ID
Operation
Timestamp
Result
Correlation ID
```

---

# 44. ERROR HANDLING

Never hide security failures.

Examples:

```text
WATERMARK_VERIFICATION_FAILED
SIGNATURE_VERIFICATION_FAILED
LEDGER_INTEGRITY_FAILED
KEY_REVOKED
DOCUMENT_HASH_MISMATCH
UNAUTHORIZED_DECRYPTION
CONSENSUS_FAILURE
NODE_DIVERGENCE
```

Errors must be machine-readable and human-readable.

---

# 45. ZERO TRUST PRINCIPLE

Never trust:

```text
admin
database
client
ledger query
watermark
network
```

without verification.

Every sensitive operation must independently validate:

```text
Identity
Authorization
Integrity
Cryptographic evidence
```

---

# 46. DEVELOPMENT ARCHITECTURE

Recommended repository:

```text
cryptographic-document-attribution/
│
├── apps/
│   ├── web-console/
│   ├── recipient-client/
│   └── forensic-client/
│
├── services/
│   ├── identity-service/
│   ├── document-service/
│   ├── crypto-service/
│   ├── watermark-service/
│   ├── ledger-service/
│   ├── forensic-service/
│   └── audit-service/
│
├── packages/
│   ├── crypto-core/
│   ├── watermark-core/
│   ├── ledger-core/
│   ├── identity-core/
│   ├── shared-types/
│   └── ui-components/
│
├── infrastructure/
│   ├── docker/
│   ├── offline/
│   ├── deployment/
│   └── security/
│
├── docs/
│   ├── architecture/
│   ├── threat-model/
│   ├── api/
│   ├── compliance/
│   └── operations/
│
└── tests/
    ├── unit/
    ├── integration/
    ├── security/
    ├── forensic/
    ├── performance/
    └── adversarial/
```

---

# 47. DEVELOPMENT PHASES

## Phase 0 — Architecture and Governance

Deliver:

* PRD
* architecture specification
* threat model
* data model
* cryptographic specification
* UI design system
* API specification
* security requirements
* deployment model

No production coding until these are frozen.

---

# 48. Phase 1 — UX4G Design System

Build:

* tokens
* typography
* colors
* spacing
* icons
* buttons
* inputs
* tables
* cards
* alerts
* dialogs
* navigation
* status badges
* charts
* accessibility states

Then create Figma screens:

```text
Login
Dashboard
Documents
Document Detail
Recipients
Recipient Detail
Forensics
Investigation
Attribution Result
Ledger Explorer
System Health
Audit
Settings
```

---

# 49. Phase 2 — Identity

Implement:

* user registration
* roles
* RBAC
* cryptographic identity
* ML-KEM keys
* ML-DSA keys
* key status
* rotation
* revocation

Acceptance:

```text
User can be cryptographically identified.
Private keys never leave protected storage.
```

---

# 50. Phase 3 — Document Encryption

Implement:

```text
upload
classification
hash
content key
AES-GCM
ML-KEM wrapping
recipient package
```

Acceptance:

```text
Recipient A cannot decrypt Recipient B's package.
Modified ciphertext fails authentication.
```

---

# 51. Phase 4 — Watermark Engine

Implement:

```text
Event ID
Watermark ID
ECC
Zero-width channel
DWT/DCT channel
Authentication
Extraction
```

Acceptance:

```text
Two decryption sessions produce different watermarks.
Visual content remains effectively identical.
Watermark can be recovered.
Forgery is rejected.
```

---

# 52. Phase 5 — Decryption Attestation

Implement:

```text
session creation
event generation
attestation
ML-DSA signature
```

Acceptance:

```text
Every successful decryption generates a signed event.
Modified event fails signature verification.
```

---

# 53. Phase 6 — Offline Ledger

Implement:

```text
ledger node
event append
hash chain
Merkle tree
quorum
checkpoint
verification
```

Acceptance:

```text
Single node cannot rewrite finalized history.
Invalid records are rejected.
Merkle proofs verify.
```

---

# 54. Phase 7 — Forensics

Implement:

```text
document upload
watermark scanner
ECC recovery
event lookup
signature verification
document hash verification
ledger verification
confidence
report generation
```

Acceptance:

```text
Known leaked copy resolves to correct event.
Modified/fake watermark is rejected.
Unregistered document produces no false attribution.
```

---

# 55. Phase 8 — Dashboard

Integrate:

```text
Documents
Users
Keys
Ledger
Security
Forensics
Audit
System Health
```

Dashboard must use real backend data rather than static mock values before final integration.

---

# 56. Phase 9 — Security Hardening

Perform:

* dependency scanning
* SAST
* DAST
* secret scanning
* cryptographic review
* RBAC testing
* authorization testing
* input fuzzing
* API security testing
* ledger tamper testing
* watermark adversarial testing
* offline dependency testing

---

# 57. Phase 10 — Performance

Benchmark:

```text
document encryption time
decryption time
watermark embedding time
watermark extraction time
ledger commit latency
ledger verification time
forensic investigation time
concurrent users
concurrent decryptions
```

---

# 58. Phase 11 — Adversarial Testing

Test:

```text
watermark deletion
watermark copying
watermark transplantation
document modification
PDF conversion
screenshot
print/scan
OCR
compression
page removal
page reordering
ledger modification
database modification
node compromise
key compromise
signature forgery
replay attack
```

---

# 59. Phase 12 — Government Deployment Package

Produce:

```text
Offline installer
Container images
Configuration package
Database migration
Cryptographic policy
Deployment guide
Administrator manual
Forensic investigator manual
Security architecture
Threat model
API documentation
Test report
Compliance checklist
SBOM
```

---

# 60. TESTING STRATEGY

Testing must occur at multiple levels.

### Unit

Every cryptographic wrapper and business rule.

### Integration

Service-to-service communication.

### End-to-end

```text
encrypt
→ distribute
→ decrypt
→ watermark
→ sign
→ ledger
→ leak
→ extract
→ verify
→ attribute
```

### Security

Threat-driven testing.

### Forensic

Watermark robustness.

### Accessibility

WCAG 2.1 AA.

### Offline

Disable Internet completely and run the complete system.

---

# 61. DEFINITION OF DONE

A feature is not complete unless:

```text
✓ Code implemented
✓ Unit tests pass
✓ Integration tests pass
✓ Security implications reviewed
✓ Audit events implemented
✓ Authorization implemented
✓ Error states implemented
✓ Accessibility implemented
✓ Offline operation verified
✓ Documentation updated
```

---

# 62. DEVELOPMENT AGENT RULES

The coding agent must treat this PRD as the source of truth.

Before implementing any feature, it must answer:

```text
1. Which requirement does this satisfy?
2. Which security property does it protect?
3. Which user role needs it?
4. Does it violate the air-gap constraint?
5. Does it introduce a new trust dependency?
6. Does it preserve PQC requirements?
7. Does it preserve forensic attribution?
8. Does it require an audit event?
9. Does it require authorization?
10. Does it need a UI accessibility state?
```

If the answer to these questions is unclear, the agent must stop and clarify rather than inventing architecture.

---

# 63. ANTI-HALLUCINATION DEVELOPMENT RULES

The development agent must never invent:

* cryptographic algorithms
* security guarantees
* government certifications
* government APIs
* official logos
* official colors
* compliance claims
* ledger guarantees
* forensic certainty

If an external standard is required, verify it against its authoritative documentation.

If an implementation decision is uncertain:

```text
UNKNOWN
```

is preferable to fabricated certainty.

---

# 64. REQUIRED AGENT SKILLS

The development workflow should use specialized agent capabilities.

## A. Architecture Agent

Responsibilities:

* system architecture
* threat modeling
* service boundaries
* scalability
* dependency analysis

---

## B. Cryptography Security Agent

Responsibilities:

* ML-KEM
* ML-DSA
* AES-GCM
* SHA-3
* key lifecycle
* signature verification
* cryptographic misuse detection

This agent must never implement cryptographic primitives from scratch.

---

## C. Forensic/Watermarking Agent

Responsibilities:

* watermark algorithms
* ECC
* DWT/DCT
* robustness testing
* extraction confidence
* adversarial transformations

---

## D. DLT/Ledger Agent

Responsibilities:

* permissioned ledger
* consensus
* Merkle structures
* hash chains
* checkpoints
* node synchronization
* ledger verification

---

## E. Security Engineering Agent

Responsibilities:

* threat model
* STRIDE analysis
* RBAC
* zero trust
* secure storage
* secrets management
* attack simulation
* security testing

---

## F. Frontend / UX4G Agent

Responsibilities:

* UX4G implementation
* dashboard
* government design system
* accessibility
* responsive design
* component library
* localization

The UX4G system provides official design tokens and components and specifically supports developers implementing government services.

---

## G. Figma Design Agent

Use the Figma workflow to create and maintain:

* design system
* dashboard
* components
* user flows
* forensic investigation screens
* responsive layouts

For composed screens, the Figma `figma-generate-design` workflow should be used together with `figma-use`; the workflow is designed around reusing design-system components and tokens rather than drawing screens from arbitrary hardcoded primitives.

---

## H. Accessibility Agent

Responsibilities:

* WCAG 2.1 AA
* keyboard navigation
* screen reader
* contrast
* focus
* semantic markup
* accessible charts
* accessible forms

---

## I. QA Agent

Responsibilities:

* unit testing
* integration testing
* E2E
* regression
* performance
* offline testing

---

## J. Red-Team Agent

Responsibilities:

Attempt to:

```text
forge watermark
remove watermark
copy watermark
transplant watermark
forge signature
replay event
modify ledger
compromise node
abuse admin
bypass authorization
extract secrets
```

The red-team agent must continuously attempt to break the system.

---

# 65. AGENT EXECUTION ORDER

The development agents should operate in this sequence:

```text
                    MASTER PRD
                        │
                        ▼
                ARCHITECTURE AGENT
                        │
                        ▼
               SECURITY / THREAT MODEL
                        │
                        ▼
                 UX4G / FIGMA AGENT
                        │
                        ▼
                 CRYPTOGRAPHY AGENT
                        │
                        ▼
                  IDENTITY AGENT
                        │
                        ▼
                DOCUMENT AGENT
                        │
                        ▼
               WATERMARK AGENT
                        │
                        ▼
                 LEDGER AGENT
                        │
                        ▼
                FORENSIC AGENT
                        │
                        ▼
                DASHBOARD AGENT
                        │
                        ▼
                    QA AGENT
                        │
                        ▼
                 RED TEAM AGENT
                        │
                        ▼
              SECURITY HARDENING
                        │
                        ▼
                 DEPLOYMENT
```

Agents must not randomly develop modules in parallel before the relevant interfaces are defined.

---

# 66. SCALABILITY PRINCIPLES

The system must be designed so that:

```text
10 users
```

can scale to:

```text
10,000 users
```

and eventually:

```text
100,000+ users
```

without redesigning the core domain model.

Use:

* stateless application services
* horizontal scaling
* database indexing
* asynchronous processing
* job queues
* event-driven internal architecture
* object/file storage abstraction
* ledger abstraction
* cryptographic service abstraction

---

# 67. PERFORMANCE ARCHITECTURE

Heavy operations should be asynchronous.

For example:

```text
Upload document
      ↓
Create job
      ↓
Worker
      ↓
Hash
      ↓
Watermark
      ↓
Encrypt
      ↓
Ledger
      ↓
Complete
```

UI should display:

```text
Queued
Processing
Completed
Failed
```

instead of blocking the interface.

---

# 68. DATA CLASSIFICATION

Every document must have a classification.

Example:

```text
PUBLIC
INTERNAL
CONFIDENTIAL
RESTRICTED
SECRET
TOP SECRET
```

The exact classification taxonomy must be configurable by the deploying organization.

Do not hard-code a classification scheme without authorization.

---

# 69. SECURITY BOUNDARIES

Separate:

```text
Plaintext
Encrypted document
Metadata
Cryptographic keys
Forensic evidence
Audit records
Ledger records
```

Never allow one component to have unnecessary access to all categories.

---

# 70. CORE DATA FLOW

The system's most important data flow is:

```text
Document
 ↓
Hash
 ↓
Encrypt
 ↓
Recipient Package
 ↓
Decrypt
 ↓
Session
 ↓
Event ID
 ↓
Watermark
 ↓
Attestation
 ↓
ML-DSA Signature
 ↓
Ledger
```

Forensics:

```text
Leaked Document
 ↓
Watermark
 ↓
Event ID
 ↓
Ledger
 ↓
Signature
 ↓
Recipient
```

---

# 71. ABSOLUTE SYSTEM INVARIANTS

These must always remain true.

### Invariant 1

Every successful decryption has a unique event ID.

### Invariant 2

Every event is bound to a document.

### Invariant 3

Every event is bound to a recipient identity.

### Invariant 4

Every event is cryptographically signed.

### Invariant 5

The forensic watermark corresponds to the event.

### Invariant 6

The event is committed to the offline evidence layer.

### Invariant 7

A leaked document must not automatically be attributed without cryptographic verification.

### Invariant 8

No single administrator can rewrite finalized evidence.

### Invariant 9

The system works without Internet connectivity.

### Invariant 10

Production cryptographic identity uses NIST-standardized PQC.

---

# 72. FINAL PRODUCT DEFINITION

The finished platform should allow a government organization to perform the following complete scenario:

```text
Government Officer
      │
      ▼
Uploads confidential document
      │
      ▼
Selects authorized recipients
      │
      ▼
System encrypts document
      │
      ▼
Each recipient receives protected package
      │
      ▼
Recipient decrypts
      │
      ▼
System creates unique session
      │
      ▼
System generates unique forensic fingerprint
      │
      ▼
Fingerprint is invisibly embedded
      │
      ▼
Recipient's ML-DSA key signs event
      │
      ▼
Event enters offline DLT
      │
      ▼
Recipient views document
      │
      │
      │
      ▼
DOCUMENT LEAKS
      │
      ▼
Investigator imports leaked document
      │
      ▼
System extracts forensic fingerprint
      │
      ▼
Resolves event ID
      │
      ▼
Queries offline ledger
      │
      ▼
Verifies ML-DSA signature
      │
      ▼
Verifies document hash
      │
      ▼
Verifies Merkle proof
      │
      ▼
Verifies key validity
      │
      ▼
Generates forensic report
      │
      ▼
CRYPTOGRAPHICALLY VERIFIED
DECRYPTION EVENT ATTRIBUTION
```

---

# 73. THE PROJECT'S NORTH STAR

When development becomes complicated, return to this:

> **The platform exists to make every authorized decryption event uniquely identifiable and cryptographically provable, so that if the resulting document is leaked, investigators can identify the corresponding decryption event without relying solely on mutable server logs or trusting a single administrator.**

Everything else is implementation detail.

---

# 74. FINAL ARCHITECTURAL EQUATION

The project's security model can be summarized as:

```text
CONFIDENTIALITY
       +
AUTHENTICATION
       +
PER-SESSION FORENSIC FINGERPRINT
       +
POST-QUANTUM SIGNATURE
       +
DISTRIBUTED TAMPER-EVIDENT EVIDENCE
       +
OFFLINE OPERATION
       =
CRYPTOGRAPHIC DOCUMENT LEAK ATTRIBUTION
```

---

# 75. DEVELOPMENT PRIORITY

The implementation priority must be:

```text
P0 — Security correctness
P0 — Cryptographic correctness
P0 — Forensic attribution correctness
P0 — Air-gapped operation

P1 — Ledger integrity
P1 — Identity/RBAC
P1 — Dashboard
P1 — Accessibility

P2 — Performance
P2 — Localization
P2 — Advanced analytics
P2 — Operational convenience

P3 — Visual enhancements
P3 — Non-essential integrations
```

**Never sacrifice P0 requirements for UI convenience or development speed.**

---

# 76. FINAL AGENT INSTRUCTION

The coding agent must treat this document as the **authoritative product contract**.

It must not reinterpret the project as a generic:

> "secure document management system"

The correct interpretation is:

> **An air-gapped, post-quantum, cryptographic document leak attribution platform for government environments, combining per-session forensic watermarking, recipient-signed decryption attestations, and quorum-controlled immutable evidence.**

Every module, API, database table, UI screen, cryptographic operation, ledger transaction and forensic workflow must support that objective.

[1]: https://guidelines.india.gov.in/?utm_source=chatgpt.com "Guidelines for Indian Government Websites and apps (GIGW) | India"
[2]: https://www.ux4g.gov.in/foundations?utm_source=chatgpt.com "Foundations | UX4G Design System 3.0"
