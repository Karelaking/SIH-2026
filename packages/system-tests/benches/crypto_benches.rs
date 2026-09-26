use criterion::{black_box, criterion_group, criterion_main, Criterion};
use crypto_core::{encrypt_document_aes256gcm, hash_document_sha3_256};
use forensics_service::ForensicsManager;
use ledger_core::HashChain;

fn bench_aes_encryption(c: &mut Criterion) {
    let key = [42u8; 32];
    let data = vec![0u8; 1024 * 1024]; // 1MB document

    c.bench_function("AES-256-GCM Encrypt 1MB", |b| {
        b.iter(|| encrypt_document_aes256gcm(black_box(&key), black_box(&data)).unwrap())
    });
}

fn bench_sha3_hashing(c: &mut Criterion) {
    let data = vec![0u8; 1024 * 1024]; // 1MB document

    c.bench_function("SHA3-256 Hash 1MB", |b| {
        b.iter(|| hash_document_sha3_256(black_box(&data)))
    });
}

fn bench_watermark_embedding(c: &mut Criterion) {
    let event_id = "EVT-12345678-ABCD";
    let text = "This is a sample document text that will be watermarked.";

    c.bench_function("Zero-width ECC Watermark Embed", |b| {
        b.iter(|| {
            ForensicsManager::embed_event_watermark(black_box(event_id), black_box(text)).unwrap()
        })
    });
}

fn bench_ledger_append(c: &mut Criterion) {
    let mut chain = HashChain::new();
    let payload = b"SAMPLE_ATTESTATION_PAYLOAD_DATA";

    c.bench_function("HashChain Append", |b| {
        b.iter(|| chain.append(black_box(payload)).unwrap())
    });
}

criterion_group!(
    benches,
    bench_aes_encryption,
    bench_sha3_hashing,
    bench_watermark_embedding,
    bench_ledger_append
);
criterion_main!(benches);
