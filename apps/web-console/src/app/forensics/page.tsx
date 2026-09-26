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
    <div className="p-8 max-w-4xl mx-auto space-y-8 pb-20">
      <div className="border-b border-gray-300 dark:border-gray-700 pb-4">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--gov-primary)' }}>Forensic Investigation</h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--gov-text-muted)' }}>
          Paste a leaked document here. The engine will extract the zero-width watermark, reconstruct the Event ID using Reed-Solomon ECC, and query the Offline Ledger to cryptographically attribute the leak.
        </p>
      </div>

      <div className="surface-gov space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--gov-text)' }}>Leaked Document Text / Source Code</label>
          <textarea 
            rows={8}
            className="input-gov font-mono text-sm"
            value={leakedText}
            onChange={(e) => setLeakedText(e.target.value)}
            placeholder="Paste the leaked text containing the invisible watermark..."
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--gov-text)' }}>Expected Original Document Hash (Optional)</label>
          <input 
            type="text" 
            className="input-gov font-mono text-sm"
            value={expectedHash}
            onChange={(e) => setExpectedHash(e.target.value)}
            placeholder="e.g. a3f8... (To verify the leak matches a specific document)"
          />
        </div>
        <div className="pt-4 border-t border-gray-300 dark:border-gray-700 flex justify-end">
          <button
            onClick={handleVerify}
            disabled={loading || !leakedText}
            className="btn-gov w-full sm:w-auto"
            style={{ backgroundColor: 'var(--gov-danger)', borderColor: 'var(--gov-danger)' }}
          >
            {loading ? 'Analyzing Watermark...' : 'Run Forensic Attribution'}
          </button>
        </div>
      </div>

      {report && (
        <div className="mt-8 space-y-4 p-6 rounded" style={{ backgroundColor: 'var(--gov-surface)', borderLeft: '4px solid var(--gov-info)', borderRight: '1px solid var(--gov-border)', borderTop: '1px solid var(--gov-border)', borderBottom: '1px solid var(--gov-border)' }}>
          <h2 className="text-xl font-bold" style={{ color: 'var(--gov-text)' }}>Forensic Attribution Report</h2>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-4 rounded border" style={{ backgroundColor: 'var(--gov-bg)', borderColor: 'var(--gov-border)' }}>
              <div className="text-xs uppercase font-semibold" style={{ color: 'var(--gov-text-muted)' }}>Confidence Score</div>
              <div className="text-lg font-bold" style={{ color: report.confidence_score.includes('100%') ? 'var(--gov-success)' : 'var(--gov-danger)' }}>
                {report.confidence_score}
              </div>
            </div>
            
            <div className="p-4 rounded border" style={{ backgroundColor: 'var(--gov-bg)', borderColor: 'var(--gov-border)' }}>
              <div className="text-xs uppercase font-semibold" style={{ color: 'var(--gov-text-muted)' }}>Leaker Identity ID</div>
              <div className="text-lg font-bold font-mono" style={{ color: 'var(--gov-text)' }}>{report.recipient_id}</div>
            </div>

            <div className="p-4 rounded border" style={{ backgroundColor: 'var(--gov-bg)', borderColor: 'var(--gov-border)' }}>
              <div className="text-xs uppercase font-semibold" style={{ color: 'var(--gov-text-muted)' }}>Decryption Event ID</div>
              <div className="text-sm font-mono truncate" style={{ color: 'var(--gov-text)' }} title={report.event_id}>{report.event_id}</div>
            </div>

            <div className="p-4 rounded border" style={{ backgroundColor: 'var(--gov-bg)', borderColor: 'var(--gov-border)' }}>
              <div className="text-xs uppercase font-semibold" style={{ color: 'var(--gov-text-muted)' }}>Ledger Merkle Chain Valid?</div>
              <div className="text-sm font-bold" style={{ color: report.ledger_valid ? 'var(--gov-success)' : 'var(--gov-danger)' }}>
                {report.ledger_valid ? 'YES - Cryptographically Verified' : 'NO - Tampering Detected'}
              </div>
            </div>
            
            <div className="col-span-2 p-4 rounded border" style={{ backgroundColor: 'var(--gov-bg)', borderColor: 'var(--gov-border)' }}>
              <div className="text-xs uppercase font-semibold" style={{ color: 'var(--gov-text-muted)' }}>ML-DSA Signature Valid?</div>
              <div className="text-sm font-bold" style={{ color: report.signature_valid ? 'var(--gov-success)' : 'var(--gov-danger)' }}>
                {report.signature_valid ? 'YES - Non-Repudiable' : 'NO - Forgery Detected'}
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--gov-text-muted)' }}>
                Post-Quantum Cryptography ensures this signature cannot be forged even by a quantum computer.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
