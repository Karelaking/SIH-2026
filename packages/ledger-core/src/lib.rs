use rs_merkle::{Hasher, MerkleTree};
use serde::{Deserialize, Serialize};
use sha3::{Digest, Sha3_256};
use thiserror::Error;

#[derive(Clone)]
pub struct Sha3Algorithm;

impl Hasher for Sha3Algorithm {
    type Hash = [u8; 32];

    fn hash(data: &[u8]) -> [u8; 32] {
        let mut hasher = Sha3_256::new();
        hasher.update(data);
        let res = hasher.finalize();
        let mut out = [0u8; 32];
        out.copy_from_slice(&res);
        out
    }
}

#[derive(Error, Debug)]
pub enum LedgerError {
    #[error("Hash chain verification failed")]
    InvalidChain,
    #[error("Serialization failed")]
    SerializationError,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LedgerBlock {
    pub previous_hash: String,
    pub event_payload: Vec<u8>,
    pub current_hash: String,
}

#[derive(Clone)]
pub struct HashChain {
    pub blocks: Vec<LedgerBlock>,
}

impl HashChain {
    pub fn new() -> Self {
        Self { blocks: Vec::new() }
    }

    pub fn get_blocks(&self) -> &[LedgerBlock] {
        &self.blocks
    }

    pub fn append(&mut self, payload: &[u8]) -> Result<LedgerBlock, LedgerError> {
        let previous_hash = match self.blocks.last() {
            Some(block) => block.current_hash.clone(),
            None => {
                String::from("0000000000000000000000000000000000000000000000000000000000000000")
            } // Genesis block
        };

        let mut data = Vec::new();
        data.extend_from_slice(previous_hash.as_bytes());
        data.extend_from_slice(payload);

        let current_hash = hex::encode(Sha3Algorithm::hash(&data));

        let block = LedgerBlock {
            previous_hash,
            event_payload: payload.to_vec(),
            current_hash,
        };

        self.blocks.push(block.clone());
        Ok(block)
    }

    pub fn verify(&self) -> bool {
        for (i, block) in self.blocks.iter().enumerate() {
            if i > 0 {
                if block.previous_hash != self.blocks[i - 1].current_hash {
                    return false;
                }
            }

            let mut data = Vec::new();
            data.extend_from_slice(block.previous_hash.as_bytes());
            data.extend_from_slice(&block.event_payload);

            let calculated_hash = hex::encode(Sha3Algorithm::hash(&data));
            if calculated_hash != block.current_hash {
                return false;
            }
        }
        true
    }
}

pub struct LedgerMerkleTree {
    tree: MerkleTree<Sha3Algorithm>,
}

impl LedgerMerkleTree {
    pub fn new(leaves: &[[u8; 32]]) -> Self {
        Self {
            tree: MerkleTree::<Sha3Algorithm>::from_leaves(leaves),
        }
    }

    pub fn root(&self) -> Option<[u8; 32]> {
        self.tree.root()
    }
}
