use ledger_core::HashChain;

#[test]
fn test_ledger_tamper_detection() {
    let mut chain = HashChain::new();

    // Create dummy events
    let payload1 = b"EVENT_1_PAYLOAD";
    let payload2 = b"EVENT_2_PAYLOAD";
    let payload3 = b"EVENT_3_PAYLOAD";

    chain.append(payload1).unwrap();
    chain.append(payload2).unwrap();
    chain.append(payload3).unwrap();

    // Verify chain is valid initially
    assert!(chain.verify(), "Chain should be valid before tampering");

    // Attack 1: Alter the payload of block 2
    let mut tampered_chain = chain.clone();
    tampered_chain.blocks[1].event_payload = b"TAMPERED_PAYLOAD".to_vec();

    // Verify chain is invalid
    assert!(
        !tampered_chain.verify(),
        "Chain should be invalid after payload tampering"
    );

    // Attack 2: Alter previous_hash to detach chain
    let mut detached_chain = chain.clone();
    detached_chain.blocks[2].previous_hash = "0000000000000000".to_string();

    assert!(
        !detached_chain.verify(),
        "Chain should be invalid after hash link broken"
    );
}
