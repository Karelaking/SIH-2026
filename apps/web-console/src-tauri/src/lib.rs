use document_service::{distribute_document, Classification};
use forensics_service::{ForensicReport, ForensicsManager};
use identity_service::{IdentityManager, ProtectedKeystore, Role};
use ledger_service::LedgerNetwork;
use std::collections::HashMap;
use std::sync::Mutex;
use tauri::State;

// Shared Application State
pub struct AppState {
    pub identity_manager: Mutex<IdentityManager>,
    pub ledger: Mutex<LedgerNetwork>,
    pub mock_keystore: Mutex<HashMap<String, ProtectedKeystore>>,
}

#[tauri::command]
fn get_system_status() -> String {
    "System Online - All Cryptographic Core Modules Loaded".to_string()
}

// User representation for frontend
#[derive(serde::Serialize)]
pub struct UserResponse {
    pub id: String,
    pub name: String,
    pub department: String,
    pub clearance: String,
    pub role: String,
}

#[tauri::command]
fn get_users(state: State<'_, AppState>) -> Result<Vec<UserResponse>, String> {
    let id_mgr = state.identity_manager.lock().unwrap();
    let users = id_mgr
        .users
        .values()
        .map(|u| UserResponse {
            id: u.user_id.clone(),
            name: u.name.clone(),
            department: u.department.clone(),
            clearance: u.clearance_level.clone(),
            role: match u.role {
                Role::SuperAdmin => "SuperAdmin".to_string(),
                Role::SecurityAdmin => "SecurityAdmin".to_string(),
                Role::DocumentOfficer => "DocumentOfficer".to_string(),
                Role::Recipient => "Recipient".to_string(),
                Role::ForensicInvestigator => "ForensicInvestigator".to_string(),
            },
        })
        .collect();
    Ok(users)
}

#[tauri::command]
fn register_user(
    name: String,
    department: String,
    clearance: String,
    role_str: String,
    state: State<'_, AppState>,
) -> Result<UserResponse, String> {
    let mut id_mgr = state.identity_manager.lock().unwrap();
    let mut keystore_map = state.mock_keystore.lock().unwrap();

    let role = match role_str.as_str() {
        "SuperAdmin" => Role::SuperAdmin,
        "SecurityAdmin" => Role::SecurityAdmin,
        "DocumentOfficer" => Role::DocumentOfficer,
        "Recipient" => Role::Recipient,
        "ForensicInvestigator" => Role::ForensicInvestigator,
        _ => Role::Recipient,
    };

    let user = id_mgr.register_user(name.clone(), department.clone(), clearance.clone(), role);
    let recipient_id = user.user_id.clone();

    // Enroll cryptographic identity for the user right away (in real world, this is separate)
    let (updated_user, keystore) = id_mgr
        .enroll_cryptographic_identity(&recipient_id)
        .map_err(|e| format!("Enrollment failed: {}", e))?;
        
    keystore_map.insert(recipient_id.clone(), keystore);

    Ok(UserResponse {
        id: updated_user.user_id.clone(),
        name: updated_user.name.clone(),
        department: updated_user.department.clone(),
        clearance: updated_user.clearance_level.clone(),
        role: role_str,
    })
}

#[tauri::command]
fn distribute(
    title: String,
    content: String,
    recipient_ids: Vec<String>, // We take a list of recipient IDs now
    state: State<'_, AppState>,
) -> Result<String, String> {
    let id_mgr = state.identity_manager.lock().unwrap();
    let mut ledger = state.ledger.lock().unwrap();
    let keystore_map = state.mock_keystore.lock().unwrap();

    if recipient_ids.is_empty() {
        return Err("No recipients selected".to_string());
    }

    let mut recipient_pub_keys = Vec::new();
    for rid in &recipient_ids {
        if let Some(user) = id_mgr.users.get(rid) {
            if let Some(ref pub_id) = user.cryptographic_identity {
                recipient_pub_keys.push(pub_id.clone());
            } else {
                return Err(format!("User {} has no cryptographic identity", rid));
            }
        } else {
            return Err(format!("User {} not found", rid));
        }
    }

    let document_data = content.as_bytes();
    let (metadata, _encrypted_doc, _wrapped_keys, _recipient_packages) =
        distribute_document(document_data, Classification::Secret, &recipient_pub_keys)
            .map_err(|_e| format!("Crypto Error"))?;

    // Simulate the first user decrypting it and generating the attestation (for demo)
    let recipient_id = &recipient_ids[0];
    let nonce = b"random_nonce_123";
    let event_id = ForensicsManager::generate_event_id(
        &metadata.document_hash,
        recipient_id,
        "SESSION-1",
        nonce,
    );

    let k = keystore_map.get(recipient_id).unwrap();
    let attestation = ForensicsManager::generate_attestation(
        event_id.clone(),
        metadata.document_hash.clone(),
        recipient_id.to_string(),
        "SESSION-1".to_string(),
        &k.dsa_secret,
    )
    .map_err(|e| format!("{:?}", e))?;

    // Append to ledger
    ledger
        .broadcast_event(attestation)
        .map_err(|e| format!("{:?}", e))?;

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
    let id_mgr = state.identity_manager.lock().unwrap();

    let mut dsa_pub = None;
    for (_id, user) in id_mgr.users.iter() {
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
        &dsa_pub.unwrap(),
    )
    .map_err(|e| format!("{:?}", e))?;

    Ok(report)
}

#[derive(serde::Serialize)]
pub struct DocumentRecordResponse {
    pub id: String,
    pub title: String,
    pub hash: String,
    pub encrypted_at: String,
    pub size_bytes: u64,
}

#[tauri::command]
fn get_documents() -> Result<Vec<DocumentRecordResponse>, String> {
    // Return empty list initially to show the Shadcn empty state
    Ok(vec![])
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
            get_users,
            register_user,
            get_documents,
            distribute,
            verify_leak
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
