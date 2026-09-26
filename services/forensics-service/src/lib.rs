use chrono::{DateTime, Utc};
use crypto_core::hash_document_sha3_256;
use identity_core::DsaSecretKey;
use pqcrypto_dilithium::dilithium3;
use pqcrypto_traits::sign::{DetachedSignature, PublicKey, SecretKey};
use serde::{Deserialize, Serialize};
use watermark_core::{embed_watermark_with_ecc, WatermarkError};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DecryptionAttestation {
    pub event_id: String,
    pub document_hash: String,
    pub recipient_id: String,
    pub session_id: String,
    pub timestamp: DateTime<Utc>,
    pub signature: Vec<u8>,
}

#[derive(Debug)]
pub enum ForensicsError {
    WatermarkError(WatermarkError),
    SigningError,
}

impl From<WatermarkError> for ForensicsError {
    fn from(err: WatermarkError) -> Self {
        ForensicsError::WatermarkError(err)
    }
}

pub struct ForensicsManager;

impl ForensicsManager {
    /// Generates a unique Event ID for a decryption session
    pub fn generate_event_id(
        document_hash: &str,
        recipient_id: &str,
        session_id: &str,
        nonce: &[u8],
    ) -> String {
        let mut data = Vec::new();
        data.extend_from_slice(document_hash.as_bytes());
        data.extend_from_slice(recipient_id.as_bytes());
        data.extend_from_slice(session_id.as_bytes());
        data.extend_from_slice(nonce);

        let hash = hash_document_sha3_256(&data);
        format!("EVT-{}", hex::encode(&hash[0..16])) // Use first 16 bytes for brevity
    }

    /// Embeds the watermark into the plaintext text string
    pub fn embed_event_watermark(
        event_id: &str,
        plaintext: &str,
    ) -> Result<String, ForensicsError> {
        let payload = event_id.as_bytes();
        
        // Simple ECC parameters: 16 data shards, 8 parity shards
        // (Assuming EVT string length fits)
        let zw_watermark = embed_watermark_with_ecc(payload, 24, 8)?;

        // Embed at the start of the plaintext (for simplicity)
        Ok(format!("{}{}", zw_watermark, plaintext))
    }

    /// Generates and signs the decryption attestation
    pub fn generate_attestation(
        event_id: String,
        document_hash: String,
        recipient_id: String,
        session_id: String,
        dsa_secret_key: &DsaSecretKey,
    ) -> Result<DecryptionAttestation, ForensicsError> {
        let timestamp = Utc::now();
        
        let mut attestation = DecryptionAttestation {
            event_id,
            document_hash,
            recipient_id,
            session_id,
            timestamp,
            signature: Vec::new(),
        };

        // Serialize the data to sign
        let data_to_sign = bincode::serialize(&attestation).unwrap_or_default();

        // Ensure we correctly type and sign using the dilithium3 trait
        let signature = dilithium3::detached_sign(&data_to_sign, dsa_secret_key);

        attestation.signature = signature.as_bytes().to_vec();

        Ok(attestation)
    }

    /// Extracts the Event ID from a zero-width watermarked plaintext
    pub fn extract_event_id_from_document(
        plaintext: &str,
    ) -> Result<String, ForensicsError> {
        // ECC parameters used during embedding: 24 data shards, 8 parity shards
        let recovered_payload = watermark_core::extract_watermark_with_ecc(plaintext, 24, 8)?;

        // Payload is the Event ID bytes. Clean up trailing nulls if padded.
        let event_id = String::from_utf8_lossy(&recovered_payload)
            .trim_end_matches('\0')
            .to_string();

        Ok(event_id)
    }

    /// Verifies a leaked document against the ledger to attribute the leak
    pub fn verify_leaked_document(
        plaintext: &str,
        expected_document_hash: &str,
        ledger_chain: &ledger_core::HashChain,
        dsa_public_key: &[u8],
    ) -> Result<ForensicReport, ForensicsError> {
        // 1. Extract Watermark (Event ID)
        let event_id = Self::extract_event_id_from_document(plaintext)?;

        // 2. Find Event in Ledger
        let mut target_attestation: Option<DecryptionAttestation> = None;
        let ledger_valid = ledger_chain.verify(); // Verify whole chain integrity

        for block in ledger_chain.get_blocks() {
            if let Ok(attestation) = bincode::deserialize::<DecryptionAttestation>(&block.event_payload) {
                if attestation.event_id == event_id {
                    target_attestation = Some(attestation);
                    break;
                }
            }
        }

        if let Some(attestation) = target_attestation {
            let mut is_match = true;
            if attestation.document_hash != expected_document_hash {
                is_match = false;
            }

            // Verify signature
            let mut attestation_copy = attestation.clone();
            attestation_copy.signature = Vec::new();
            let data_to_verify = bincode::serialize(&attestation_copy).unwrap_or_default();
            
            let sig_bytes = attestation.signature.as_slice();
            let signature = pqcrypto_traits::sign::DetachedSignature::from_bytes(sig_bytes)
                .map_err(|_| ForensicsError::SigningError)?;
                
            let pk = pqcrypto_dilithium::dilithium3::PublicKey::from_bytes(dsa_public_key)
                .map_err(|_| ForensicsError::SigningError)?;

            let signature_valid = dilithium3::verify_detached_signature(&signature, &data_to_verify, &pk).is_ok();

            Ok(ForensicReport {
                is_match,
                event_id,
                recipient_id: attestation.recipient_id,
                signature_valid,
                ledger_valid,
                confidence_score: if is_match && signature_valid && ledger_valid {
                    String::from("100% - Cryptographically Proven")
                } else {
                    String::from("Compromised/Invalid")
                },
            })
        } else {
            Ok(ForensicReport {
                is_match: false,
                event_id,
                recipient_id: String::from("NOT_FOUND_IN_LEDGER"),
                signature_valid: false,
                ledger_valid,
                confidence_score: String::from("0% - No Ledger Record"),
            })
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ForensicReport {
    pub is_match: bool,
    pub event_id: String,
    pub recipient_id: String,
    pub signature_valid: bool,
    pub ledger_valid: bool,
    pub confidence_score: String,
}
