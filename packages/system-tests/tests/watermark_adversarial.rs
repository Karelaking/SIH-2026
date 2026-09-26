use forensics_service::ForensicsManager;

#[test]
fn test_watermark_scrubbing_resilience() {
    let event_id = "EVT-12345678-ABCD";
    let original_text = "This is a highly confidential document regarding project X.";

    // Embed
    let mut watermarked_text =
        ForensicsManager::embed_event_watermark(event_id, original_text).unwrap();

    // The watermarked text contains the original text + zero width chars.
    // Let's simulate an attacker deleting characters from the middle of the document.
    // They delete the word "confidential" along with its hidden watermarks.
    watermarked_text = watermarked_text.replace("confidential", "redacted");

    // Can we still recover the ID?
    // Reed-Solomon should handle up to 30% deletion/corruption.
    let recovered_id = ForensicsManager::extract_event_id_from_document(&watermarked_text);

    assert!(recovered_id.is_ok(), "Failed to recover ID after scrubbing");
    assert_eq!(
        recovered_id.unwrap(),
        event_id,
        "Recovered ID does not match original"
    );
}

#[test]
fn test_watermark_excessive_scrubbing_failure() {
    let event_id = "EVT-12345678-ABCD";
    let original_text = "Short text";

    let _watermarked_text =
        ForensicsManager::embed_event_watermark(event_id, original_text).unwrap();

    // Attack deletes almost everything
    let attacked_text = "Shor".to_string();

    let recovered_id = ForensicsManager::extract_event_id_from_document(&attacked_text);

    assert!(
        recovered_id.is_err(),
        "Should fail to recover ID if almost all watermarks are deleted"
    );
}
