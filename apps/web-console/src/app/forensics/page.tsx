'use client';
import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

export default function Forensics() {
  const [leakedText, setLeakedText] = useState('');
  const [expectedHash, setExpectedHash] = useState('');
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const result = await invoke('verify_leak', {
        leakedText,
        expectedHash: expectedHash || "unknown_hash"
      });
      setReport(result);
    } catch (e) {
      console.error(e);
      alert('Error verifying document: ' + e);
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Forensic Investigation</h1>
      <p className="text-gray-400">
        Paste a leaked document here. The engine will extract the zero-width watermark, reconstruct the Event ID using Reed-Solomon ECC, and query the Offline Ledger to cryptographically attribute the leak.
      </p>

      <div className="space-y-4 bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
        <div>
          <label className="block text-sm font-medium text-gray-300">Leaked Document Text</label>
          <textarea 
            rows={8}
            className="mt-1 block w-full rounded-md bg-gray-900 border-gray-700 text-white shadow-sm focus:border-red-500 focus:ring-red-500 font-mono text-sm"
            value={leakedText}
            onChange={(e) => setLeakedText(e.target.value)}
            placeholder="Paste the leaked text containing the invisible watermark..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Expected Original Document Hash (Optional)</label>
          <input 
            type="text" 
            className="mt-1 block w-full rounded-md bg-gray-900 border-gray-700 text-white shadow-sm focus:border-red-500 focus:ring-red-500 font-mono text-sm"
            value={expectedHash}
            onChange={(e) => setExpectedHash(e.target.value)}
            placeholder="e.g. a3f8... (To verify the leak matches a specific document)"
          />
        </div>
        <button
          onClick={handleVerify}
          disabled={loading || !leakedText}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md font-medium disabled:opacity-50"
        >
          {loading ? 'Analyzing Watermark...' : 'Run Forensic Attribution'}
        </button>
      </div>

      {report && (
        <div className="mt-8 space-y-4 bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold text-white">Forensic Attribution Report</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900 p-4 rounded border border-gray-700">
              <div className="text-xs text-gray-500 uppercase">Confidence Score</div>
              <div className={`text-lg font-bold ${report.confidence_score.includes('100%') ? 'text-green-500' : 'text-red-500'}`}>
                {report.confidence_score}
              </div>
            </div>
            
            <div className="bg-gray-900 p-4 rounded border border-gray-700">
              <div className="text-xs text-gray-500 uppercase">Leaker Identity ID</div>
              <div className="text-lg font-bold font-mono text-white">{report.recipient_id}</div>
            </div>

            <div className="bg-gray-900 p-4 rounded border border-gray-700">
              <div className="text-xs text-gray-500 uppercase">Decryption Event ID</div>
              <div className="text-sm font-mono text-gray-300 truncate" title={report.event_id}>{report.event_id}</div>
            </div>

            <div className="bg-gray-900 p-4 rounded border border-gray-700">
              <div className="text-xs text-gray-500 uppercase">Ledger Merkle Chain Valid?</div>
              <div className={`text-sm font-bold ${report.ledger_valid ? 'text-green-500' : 'text-red-500'}`}>
                {report.ledger_valid ? 'YES - Cryptographically Verified' : 'NO - Tampering Detected'}
              </div>
            </div>
            
            <div className="bg-gray-900 p-4 rounded border border-gray-700">
              <div className="text-xs text-gray-500 uppercase">ML-DSA Signature Valid?</div>
              <div className={`text-sm font-bold ${report.signature_valid ? 'text-green-500' : 'text-red-500'}`}>
                {report.signature_valid ? 'YES - Non-Repudiable' : 'NO - Forgery Detected'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
