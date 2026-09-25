use chrono::{DateTime, Utc};
use identity_core::{generate_ml_dsa_keypair, generate_ml_kem_keypair, CryptographicIdentityPublic, KeyStatus, KemSecretKey, DsaSecretKey};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum Role {
    SuperAdministrator,
    SecurityAdministrator,
    DocumentOwner,
    Recipient,
    ForensicInvestigator,
    Auditor,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub user_id: String,
    pub name: String,
    pub department: String,
    pub organization: String,
    pub role: Role,
    pub cryptographic_identity: Option<CryptographicIdentityPublic>,
    pub last_authentication: Option<DateTime<Utc>>,
}

/// Represents the protected private keys (Never leaves protected storage)
pub struct ProtectedKeystore {
    pub kem_secret: KemSecretKey,
    pub dsa_secret: DsaSecretKey,
}

pub struct IdentityManager {
    // In a real system, this would be a secure database
    users: std::collections::HashMap<String, User>,
}

impl IdentityManager {
    pub fn new() -> Self {
        Self {
            users: std::collections::HashMap::new(),
        }
    }

    /// Registers a new user without cryptographic identity
    pub fn register_user(&mut self, name: String, department: String, organization: String, role: Role) -> User {
        let user_id = Uuid::new_v4().to_string();
        let user = User {
            user_id: user_id.clone(),
            name,
            department,
            organization,
            role,
            cryptographic_identity: None,
            last_authentication: None,
        };
        self.users.insert(user_id, user.clone());
        user
    }

    /// Enrolls a user with new PQC keys.
    /// Returns the updated user and the protected keystore (to be stored in HSM or secure enclave).
    pub fn enroll_cryptographic_identity(&mut self, user_id: &str) -> Result<(User, ProtectedKeystore), String> {
        let user = self.users.get_mut(user_id).ok_or("User not found")?;

        let (kem_pk, kem_sk) = generate_ml_kem_keypair();
        let (dsa_pk, dsa_sk) = generate_ml_dsa_keypair();

        let identity_id = format!("ID-{}", Uuid::new_v4());
        let public_identity = CryptographicIdentityPublic::new(identity_id, &kem_pk, &dsa_pk);

        user.cryptographic_identity = Some(public_identity);

        let keystore = ProtectedKeystore {
            kem_secret: kem_sk,
            dsa_secret: dsa_sk,
        };

        Ok((user.clone(), keystore))
    }

    pub fn revoke_identity(&mut self, user_id: &str) -> Result<(), String> {
        let user = self.users.get_mut(user_id).ok_or("User not found")?;
        if let Some(ref mut identity) = user.cryptographic_identity {
            identity.status = KeyStatus::Revoked;
        }
        Ok(())
    }
}
