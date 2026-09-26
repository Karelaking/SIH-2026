use pqcrypto_dilithium::dilithium3;
pub use pqcrypto_dilithium::dilithium3::{PublicKey as DsaPublicKey, SecretKey as DsaSecretKey};
use pqcrypto_kyber::kyber768;
pub use pqcrypto_kyber::kyber768::{PublicKey as KemPublicKey, SecretKey as KemSecretKey};
use pqcrypto_traits::kem::PublicKey as KemTraitPublicKey;
use pqcrypto_traits::sign::PublicKey as SignTraitPublicKey;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum KeyStatus {
    Active,
    Rotating,
    Revoked,
    Compromised,
    Expired,
}

/// Represents the public cryptographic identity of a user
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CryptographicIdentityPublic {
    pub identity_id: String,
    pub kem_public_key: Vec<u8>,
    pub dsa_public_key: Vec<u8>,
    pub status: KeyStatus,
}

/// Generates a new ML-KEM (Kyber768) keypair
pub fn generate_ml_kem_keypair() -> (kyber768::PublicKey, kyber768::SecretKey) {
    kyber768::keypair()
}

/// Generates a new ML-DSA (Dilithium3) keypair
pub fn generate_ml_dsa_keypair() -> (dilithium3::PublicKey, dilithium3::SecretKey) {
    dilithium3::keypair()
}

impl CryptographicIdentityPublic {
    pub fn new(
        identity_id: String,
        kem_pk: &kyber768::PublicKey,
        dsa_pk: &dilithium3::PublicKey,
    ) -> Self {
        Self {
            identity_id,
            kem_public_key: kem_pk.as_bytes().to_vec(),
            dsa_public_key: dsa_pk.as_bytes().to_vec(),
            status: KeyStatus::Active,
        }
    }
}
