use reed_solomon_erasure::galois_8::ReedSolomon;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum WatermarkError {
    #[error("Reed-Solomon encoding failed")]
    EccEncodeError,
    #[error("Reed-Solomon decoding failed")]
    EccDecodeError,
    #[error("Invalid zero-width characters")]
    InvalidEncoding,
}

const ZW_ZERO: char = '\u{200B}'; // Zero-Width Space
const ZW_ONE: char = '\u{200C}';  // Zero-Width Non-Joiner

/// Encodes binary data into a string of zero-width characters
pub fn encode_zero_width(data: &[u8]) -> String {
    let mut result = String::with_capacity(data.len() * 8);
    for &byte in data {
        for i in (0..8).rev() {
            if (byte >> i) & 1 == 1 {
                result.push(ZW_ONE);
            } else {
                result.push(ZW_ZERO);
            }
        }
    }
    result
}

/// Decodes a string of zero-width characters back into binary data
pub fn decode_zero_width(text: &str) -> Result<Vec<u8>, WatermarkError> {
    let zw_chars: Vec<char> = text
        .chars()
        .filter(|&c| c == ZW_ZERO || c == ZW_ONE)
        .collect();

    if zw_chars.len() % 8 != 0 {
        return Err(WatermarkError::InvalidEncoding);
    }

    let mut data = Vec::with_capacity(zw_chars.len() / 8);
    for chunk in zw_chars.chunks(8) {
        let mut byte = 0u8;
        for (i, &c) in chunk.iter().enumerate() {
            if c == ZW_ONE {
                byte |= 1 << (7 - i);
            }
        }
        data.push(byte);
    }

    Ok(data)
}

/// Adds Reed-Solomon ECC to the payload and encodes it into zero-width characters.
pub fn embed_watermark_with_ecc(payload: &[u8], data_shards: usize, parity_shards: usize) -> Result<String, WatermarkError> {
    let rs = ReedSolomon::new(data_shards, parity_shards).map_err(|_| WatermarkError::EccEncodeError)?;
    
    // We expect payload to perfectly fit data_shards, for simplicity we pad it if it doesn't.
    // Real implementation would chunk and pad properly.
    let mut shards: Vec<Vec<u8>> = vec![vec![0u8; 1]; data_shards + parity_shards];
    for (i, &byte) in payload.iter().enumerate() {
        if i < data_shards {
            shards[i][0] = byte;
        }
    }

    rs.encode(&mut shards).map_err(|_| WatermarkError::EccEncodeError)?;

    // Flatten shards to bytes
    let ecc_payload: Vec<u8> = shards.into_iter().flatten().collect();

    Ok(encode_zero_width(&ecc_payload))
}
