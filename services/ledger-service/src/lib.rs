use forensics_service::DecryptionAttestation;
use ledger_core::{HashChain, LedgerBlock, LedgerError};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum QuorumError {
    #[error("Quorum not reached")]
    QuorumFailed,
    #[error("Ledger operation failed")]
    LedgerFailed(#[from] LedgerError),
    #[error("Serialization failed")]
    SerializationError,
}

pub struct LedgerNode {
    pub node_id: String,
    pub chain: HashChain,
}

impl LedgerNode {
    pub fn new(node_id: &str) -> Self {
        Self {
            node_id: node_id.to_string(),
            chain: HashChain::new(),
        }
    }

    pub fn receive_event(
        &mut self,
        attestation: &DecryptionAttestation,
    ) -> Result<LedgerBlock, QuorumError> {
        let payload =
            bincode::serialize(attestation).map_err(|_| QuorumError::SerializationError)?;
        let block = self.chain.append(&payload)?;
        Ok(block)
    }
}

pub struct LedgerNetwork {
    pub nodes: Vec<LedgerNode>,
    pub required_quorum: usize,
}

impl LedgerNetwork {
    pub fn new(node_count: usize, required_quorum: usize) -> Self {
        let mut nodes = Vec::new();
        for i in 0..node_count {
            nodes.push(LedgerNode::new(&format!("NODE-{}", i)));
        }
        Self {
            nodes,
            required_quorum,
        }
    }

    /// Broadcasts an event to all nodes and checks if quorum is reached
    pub fn broadcast_event(
        &mut self,
        attestation: DecryptionAttestation,
    ) -> Result<String, QuorumError> {
        let mut successful_appends = 0;
        let mut last_hash = String::new();

        for node in &mut self.nodes {
            if let Ok(block) = node.receive_event(&attestation) {
                successful_appends += 1;
                last_hash = block.current_hash;
            }
        }

        if successful_appends >= self.required_quorum {
            Ok(last_hash)
        } else {
            Err(QuorumError::QuorumFailed)
        }
    }
}
