'use client';
import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

export default function Home() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [watermarkedText, setWatermarkedText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDistribute = async () => {
    setLoading(true);
    try {
      // Calls the Rust backend which simulates encryption, attestation, and watermark embedding.
      const result = await invoke<string>('distribute', {
        title,
        content,
        recipientRole: 'User'
      });
      setWatermarkedText(result);
    } catch (e) {
      console.error(e);
      alert('Error distributing document: ' + e);
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Document Encryption & Distribution</h1>
      <p className="text-gray-400">
        Upload a document to encrypt it using AES-GCM, wrap the keys using ML-KEM, and securely distribute it to authorized roles.
      </p>

      <div className="space-y-4 bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
        <div>
          <label className="block text-sm font-medium text-gray-300">Document Title</label>
          <input 
            type="text" 
            className="mt-1 block w-full rounded-md bg-gray-900 border-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Q3 Financial Projections"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Document Plaintext</label>
          <textarea 
            rows={5}
            className="mt-1 block w-full rounded-md bg-gray-900 border-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter the classified document contents here..."
          />
        </div>
        <button
          onClick={handleDistribute}
          disabled={loading || !title || !content}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-medium disabled:opacity-50"
        >
          {loading ? 'Encrypting & Distributing...' : 'Distribute Document'}
        </button>
      </div>

      {watermarkedText && (
        <div className="mt-8 space-y-4 bg-green-900/20 p-6 rounded-lg border border-green-800">
          <h2 className="text-xl font-semibold text-green-400">Distribution Successful!</h2>
          <p className="text-sm text-gray-300">
            The document was encrypted, keys wrapped, and a unique <strong>Decryption Attestation</strong> was signed using the recipient's ML-DSA key and committed to the <strong>Offline Ledger</strong>.
          </p>
          <div className="bg-gray-950 p-4 rounded text-sm text-gray-400 font-mono break-all whitespace-pre-wrap">
            <div className="mb-2 text-xs text-gray-500 uppercase">Simulated Decrypted View (With Invisible Zero-Width Watermark):</div>
            {watermarkedText}
          </div>
          <p className="text-xs text-yellow-500">
            Copy the text above and head to the Forensics page to simulate a leak investigation!
          </p>
        </div>
      )}
    </div>
  );
}
