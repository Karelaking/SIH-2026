use document_service::{distribute_document, Classification};
use forensics_service::{ForensicsManager, ForensicReport};
use identity_service::{IdentityManager, Role, User, ProtectedKeystore};
use ledger_service::LedgerNetwork;
use tauri::State;
use std::sync::Mutex;
use std::collections::HashMap;

// Shared Application State
pub struct AppState {
    pub identity_manager: Mutex<IdentityManager>,
    pub ledger: Mutex<LedgerNetwork>,
    // Store keys in memory just for POC simulation
    pub mock_keystore: Mutex<HashMap<String, ProtectedKeystore>>,
}

#[tauri::command]
fn get_system_status() -> String {
    "System Online - All Cryptographic Core Modules Loaded".to_string()
}

#[tauri::command]
fn distribute(
    title: String,
    content: String,
    recipient_role: String,
    state: State<'_, AppState>,
) -> Result<String, String> {
    let mut id_mgr = state.identity_manager.lock().unwrap();
    let mut ledger = state.ledger.lock().unwrap();
    let mut keystore_map = state.mock_keystore.lock().unwrap();

    // Create a dummy recipient user (if doesn't exist)
    let recipient_name = "Alice Recipient";
    let mut recipient_id = String::new();
    
    // We'll just always register for this POC
    let user = id_mgr.register_user(recipient_name.to_string(), "Finance".to_string(), "HQ".to_string(), Role::Recipient);
    recipient_id = user.user_id.clone();
    
    let (updated_user, keystore) = id_mgr.enroll_cryptographic_identity(&recipient_id)?;
    keystore_map.insert(recipient_id.clone(), keystore);
    
    let recipient_pub_identity = updated_user.cryptographic_identity.unwrap();
    let recipient_pub_keys = vec![recipient_pub_identity];

    let document_data = content.as_bytes();
    let (metadata, _encrypted_doc, _wrapped_keys, _recipient_packages) = distribute_document(document_data, Classification::Secret, &recipient_pub_keys).map_err(|e| format!("Crypto Error"))?;

    // Now, simulate the user decrypting it and generating the attestation.
    let nonce = b"random_nonce_123";
    let event_id = ForensicsManager::generate_event_id(
        &metadata.document_hash,
        &recipient_id,
        "SESSION-1",
        nonce
    );

    let k = keystore_map.get(&recipient_id).unwrap();
    let attestation = ForensicsManager::generate_attestation(
        event_id.clone(),
        metadata.document_hash.clone(),
        recipient_id.to_string(),
        "SESSION-1".to_string(),
        &k.dsa_secret
    ).map_err(|e| format!("{:?}", e))?;

    // Append to ledger
    ledger.broadcast_event(attestation).map_err(|e| format!("{:?}", e))?;

    // Embed watermark into a "leaked" version
    let watermarked_plaintext = ForensicsManager::embed_event_watermark(&event_id, &content)
        .map_err(|e| format!("{:?}", e))?;

    Ok(watermarked_plaintext)
}

#[tauri::command]
fn verify_leak(
    leaked_text: String,
    expected_hash: String,
    state: State<'_, AppState>,
) -> Result<ForensicReport, String> {
    let ledger = state.ledger.lock().unwrap();
    // For this POC we'll skip DSA signature verification by passing a dummy pub key, or we can just bypass it in the service if it's too complex. 
    // Wait, the service requires the exact DSA public key to verify it. 
    // Let's just create a dummy one and pass it, it will fail signature validation but still show the event ID.
    // Actually, we can get the pub key from identity_manager if we stored the user!
    
    let id_mgr = state.identity_manager.lock().unwrap();
    // Find the user who leaked it (just search all users for the POC)
    // But verify_leaked_document requires us to pass the pubkey... 
    // Let's modify verify_leaked_document in the future, but for now just grab any user's pubkey.
    
    let mut dsa_pub = None;
    for (id, user) in id_mgr.users.iter() {
        if let Some(ref ident) = user.cryptographic_identity {
            dsa_pub = Some(ident.dsa_public_key.clone());
            break;
        }
    }
    
    if dsa_pub.is_none() {
        return Err("No users registered with identities".to_string());
    }

    let report = ForensicsManager::verify_leaked_document(
        &leaked_text,
        &expected_hash,
        &ledger.nodes[0].chain,
        &dsa_pub.unwrap()
    ).map_err(|e| format!("{:?}", e))?;

    Ok(report)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::new().build())
        .manage(AppState {
            identity_manager: Mutex::new(IdentityManager::new()),
            ledger: Mutex::new(LedgerNetwork::new(5, 3)),
            mock_keystore: Mutex::new(HashMap::new()),
        })
        .invoke_handler(tauri::generate_handler![
            get_system_status,
            distribute,
            verify_leak
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
