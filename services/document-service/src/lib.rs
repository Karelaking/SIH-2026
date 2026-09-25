use crypto_core::{encrypt_document_aes256gcm, hash_document_sha3_256};
use identity_core::CryptographicIdentityPublic;
use pqcrypto_kyber::kyber768;
use pqcrypto_traits::kem::{PublicKey, SharedSecret};
use rand::RngCore;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Classification {
    Public,
    Internal,
    Confidential,
    Restricted,
    Secret,
    TopSecret,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DocumentMetadata {
    pub document_id: String,
    pub document_hash: String,
    pub classification: Classification,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RecipientPackage {
    pub recipient_identity_id: String,
    pub ml_kem_ciphertext: Vec<u8>,
    pub encrypted_content_key: Vec<u8>,
    pub wrapped_nonce: Vec<u8>,
}

pub enum DocumentError {
    CryptoError(String),
}

/// Distributes a document to a list of recipients.
/// Returns the metadata, the AES-GCM encrypted document, and the recipient packages.
pub fn distribute_document(
    document_data: &[u8],
    classification: Classification,
    recipients: &[CryptographicIdentityPublic],
) -> Result<(DocumentMetadata, Vec<u8>, Vec<u8>, Vec<RecipientPackage>), DocumentError> {
    // 1. Hash Document
    let hash_bytes = hash_document_sha3_256(document_data);
    let document_hash = hex::encode(hash_bytes);

    // 2. Generate Content Key
    let mut content_key = [0u8; 32];
    rand::thread_rng().fill_bytes(&mut content_key);

    // 3. Encrypt Document
    let (encrypted_document, doc_nonce) = encrypt_document_aes256gcm(&content_key, document_data)
        .map_err(|_| DocumentError::CryptoError("Document encryption failed".to_string()))?;

    // 4. Generate Metadata
    let metadata = DocumentMetadata {
        document_id: format!("DOC-{}", Uuid::new_v4()),
        document_hash,
        classification,
    };

    // 5. Wrap keys for recipients
    let mut packages = Vec::new();
    for recipient in recipients {
        let recipient_pk = kyber768::PublicKey::from_bytes(&recipient.kem_public_key)
            .map_err(|_| DocumentError::CryptoError("Invalid Kem public key".to_string()))?;

        // Encapsulate a shared secret for this recipient
        let (ss, ciphertext) = kyber768::encapsulate(&recipient_pk);

        // Derive KEK (Key Encryption Key) from the ML-KEM shared secret
        let kek_bytes = hash_document_sha3_256(ss.as_bytes());
        let mut kek = [0u8; 32];
        kek.copy_from_slice(&kek_bytes[0..32]);

        // Encrypt the `content_key` with the KEK
        let (encrypted_content_key, wrapped_nonce) = encrypt_document_aes256gcm(&kek, &content_key)
            .map_err(|_| DocumentError::CryptoError("Content key encryption failed".to_string()))?;

        packages.push(RecipientPackage {
            recipient_identity_id: recipient.identity_id.clone(),
            ml_kem_ciphertext: ciphertext.as_bytes().to_vec(),
            encrypted_content_key,
            wrapped_nonce,
        });
    }

    Ok((metadata, encrypted_document, doc_nonce, packages))
}
