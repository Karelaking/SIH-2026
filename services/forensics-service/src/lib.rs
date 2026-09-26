use chrono::{DateTime, Utc};
use crypto_core::hash_document_sha3_256;
use identity_core::DsaSecretKey;
use pqcrypto_dilithium::dilithium3;
use pqcrypto_traits::sign::{DetachedSignature, SecretKey};
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
}
