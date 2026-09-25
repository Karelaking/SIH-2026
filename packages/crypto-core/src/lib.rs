use aes_gcm::{
    aead::{Aead, AeadCore, KeyInit, OsRng},
    Aes256Gcm, Key, Nonce,
};
use sha3::{Digest, Sha3_256};

#[derive(Debug)]
pub enum CryptoError {
    EncryptionFailed,
    DecryptionFailed,
}

/// Generates a SHA3-256 hash of the input data
pub fn hash_document_sha3_256(data: &[u8]) -> Vec<u8> {
    let mut hasher = Sha3_256::new();
    hasher.update(data);
    hasher.finalize().to_vec()
}

/// Encrypts data using AES-256-GCM.
/// Returns (ciphertext, nonce)
pub fn encrypt_document_aes256gcm(
    key: &[u8; 32],
    data: &[u8],
) -> Result<(Vec<u8>, Vec<u8>), CryptoError> {
    let cipher = Aes256Gcm::new(Key::<Aes256Gcm>::from_slice(key));
    let nonce = Aes256Gcm::generate_nonce(&mut OsRng); // 96-bits; unique per message

    let ciphertext = cipher
        .encrypt(&nonce, data)
        .map_err(|_| CryptoError::EncryptionFailed)?;

    Ok((ciphertext, nonce.to_vec()))
}

/// Decrypts data using AES-256-GCM.
pub fn decrypt_document_aes256gcm(
    key: &[u8; 32],
    nonce: &[u8],
    ciphertext: &[u8],
) -> Result<Vec<u8>, CryptoError> {
    let cipher = Aes256Gcm::new(Key::<Aes256Gcm>::from_slice(key));
    let nonce = Nonce::from_slice(nonce);

    let plaintext = cipher
        .decrypt(nonce, ciphertext)
        .map_err(|_| CryptoError::DecryptionFailed)?;

    Ok(plaintext)
}
