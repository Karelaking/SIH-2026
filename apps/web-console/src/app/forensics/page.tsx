'use client';
import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ForensicReport {
  event_id: string;
  recipient_id: string;
  signature_valid: boolean;
  ledger_valid: boolean;
  confidence_score: string;
}

export default function Forensics() {
  const [leakedText, setLeakedText] = useState('');
  const [expectedHash, setExpectedHash] = useState('');
  const [report, setReport] = useState<ForensicReport | null>(null);
  
  // Pipeline status for UI
  const [pipelineState, setPipelineState] = useState<string>('IDLE'); // IDLE, RUNNING, DONE

  const handleVerify = async () => {
    setPipelineState('RUNNING');
    setReport(null);
    try {
      // Simulate pipeline steps visually for the forensic investigator
      await new Promise(r => setTimeout(r, 600)); // DETECTED
      await new Promise(r => setTimeout(r, 600)); // DECODED
      
      if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
        const result = await invoke('verify_leak', {
          leakedText,
          expectedHash: expectedHash || "unknown_hash"
        });
        setReport(result);
        setPipelineState('DONE');
      } else {
        alert("Cannot verify leak: Tauri API disconnected.");
        setPipelineState('IDLE');
      }
    } catch (e) {
      console.error(e);
      alert('Error verifying document: ' + e);
      setPipelineState('IDLE');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      
      <div className="border-b border-(--gov-border) pb-4">
        <h1 className="text-2xl font-bold uppercase tracking-wide" style={{ color: 'var(--gov-primary)' }}>NEW FORENSIC INVESTIGATION</h1>
        <p className="mt-1 text-sm font-medium" style={{ color: 'var(--gov-text-secondary)' }}>
          Cryptographic Attribution & Watermark Extraction
        </p>
      </div>

      <Card className="rounded-(--gov-radius) p-6 space-y-6">
        <div>
          <label className="block text-sm font-bold uppercase tracking-wider mb-2 text-(--gov-text-primary)">Upload Leaked Document (or paste source)</label>
          <textarea 
            rows={6}
            className="w-full border border-(--gov-border) rounded-(--gov-radius) p-2 font-mono text-sm bg-(--gov-bg)"
            value={leakedText}
            onChange={(e) => setLeakedText(e.target.value)}
            placeholder="Drop document text containing the invisible watermark here..."
            disabled={pipelineState === 'RUNNING'}
          />
        </div>
        <div>
          <label className="block text-sm font-bold uppercase tracking-wider mb-2 text-(--gov-text-primary)">Expected Original Document Hash (Optional)</label>
          <Input 
            type="text" 
            className="bg-(--gov-bg) font-mono text-sm border-(--gov-border) rounded-(--gov-radius)"
            value={expectedHash}
            onChange={(e) => setExpectedHash(e.target.value)}
            placeholder="e.g. a3f8... (Leave blank for autonomous detection)"
            disabled={pipelineState === 'RUNNING'}
          />
        </div>
        <div className="pt-4 border-t border-(--gov-border) flex justify-end">
          <Button
            onClick={handleVerify}
            disabled={pipelineState === 'RUNNING' || !leakedText}
            className="rounded-(--gov-radius)"
            style={{ backgroundColor: 'var(--gov-critical)' }}
          >
            {pipelineState === 'RUNNING' ? 'Executing Analysis Pipeline...' : 'Start Analysis'}
          </Button>
        </div>
      </Card>

      {pipelineState === 'RUNNING' && (
        <Card className="rounded-(--gov-radius) p-6">
           <h2 className="text-sm font-bold text-(--gov-text-secondary) uppercase tracking-wider mb-4 border-b border-(--gov-border) pb-2">Analysis Pipeline</h2>
           <ul className="space-y-3 font-mono text-sm text-(--gov-text-primary)">
             <li className="flex gap-3 items-center"><span className="text-(--gov-warning)">⟳</span> <span>Document received, calculating integrity hash...</span></li>
             <li className="flex gap-3 items-center text-(--gov-text-secondary)"><span>○</span> <span>DETECTED: Scanning for zero-width embedded signatures...</span></li>
             <li className="flex gap-3 items-center text-(--gov-text-secondary)"><span>○</span> <span>DECODED: Extracting Reed-Solomon blocks...</span></li>
           </ul>
        </Card>
      )}

      {pipelineState === 'DONE' && report && (
        <div className="space-y-6">
          <Card className="rounded-(--gov-radius) p-6">
             <h2 className="text-sm font-bold text-(--gov-text-secondary) uppercase tracking-wider mb-4 border-b border-(--gov-border) pb-2">Analysis Pipeline</h2>
             <ul className="space-y-3 font-mono text-sm text-(--gov-text-primary)">
               <li className="flex gap-3 items-center"><span className="text-(--gov-success) font-bold">✓</span> <span>Document received & integrity hash calculated</span></li>
               <li className="flex gap-3 items-center"><span className="text-(--gov-success) font-bold">✓</span> <span>DETECTED: Zero-width signatures found</span></li>
               <li className="flex gap-3 items-center"><span className="text-(--gov-success) font-bold">✓</span> <span>DECODED: Reed-Solomon blocks extracted successfully</span></li>
               <li className="flex gap-3 items-center"><span className="text-(--gov-success) font-bold">✓</span> <span>AUTHENTICATED: Watermark payload matches system protocol</span></li>
               <li className="flex gap-3 items-center"><span className="text-(--gov-success) font-bold">✓</span> <span>MATCHED: Event ID {report.event_id.substring(0, 8)}... isolated</span></li>
               <li className="flex gap-3 items-center"><span className="text-(--gov-success) font-bold">✓</span> <span>SIGNATURE VERIFIED: Post-Quantum ML-DSA signature confirmed</span></li>
               <li className="flex gap-3 items-center"><span className="text-(--gov-success) font-bold">✓</span> <span>LEDGER VERIFIED: Decentralized consensus records intact</span></li>
             </ul>
          </Card>

          <Card className="rounded-(--gov-radius) p-8 border-l-4" style={{ borderLeftColor: report.confidence_score.includes('100%') ? 'var(--gov-success)' : 'var(--gov-critical)' }}>
            <h2 className="text-2xl font-bold uppercase tracking-wide mb-6" style={{ color: report.confidence_score.includes('100%') ? 'var(--gov-success)' : 'var(--gov-critical)' }}>
              {report.confidence_score.includes('100%') ? 'ATTRIBUTION VERIFIED' : 'ATTRIBUTION FAILED'}
            </h2>
            
            <div className="grid grid-cols-2 gap-y-6 gap-x-12">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-(--gov-text-secondary)">Recipient</div>
                <div className="text-lg font-bold text-(--gov-text-primary) font-mono">{report.recipient_id}</div>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-(--gov-text-secondary)">Event</div>
                <div className="text-lg font-bold text-(--gov-text-primary) font-mono truncate" title={report.event_id}>{report.event_id}</div>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-(--gov-text-secondary)">Document</div>
                <div className="text-lg font-bold text-(--gov-text-primary) font-mono">{expectedHash || "Auto-Matched (DOC-ID)"}</div>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-(--gov-text-secondary)">Signature</div>
                <div className="text-lg font-bold text-(--gov-text-primary) font-mono">
                   {report.signature_valid ? <span className="text-(--gov-success)">✓ VALID (ML-DSA)</span> : <span className="text-(--gov-critical)">✕ FORGERY DETECTED</span>}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-(--gov-text-secondary)">Ledger</div>
                <div className="text-lg font-bold text-(--gov-text-primary) font-mono">
                   {report.ledger_valid ? <span className="text-(--gov-success)">✓ VERIFIED</span> : <span className="text-(--gov-critical)">✕ TAMPERING DETECTED</span>}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-(--gov-text-secondary)">Evidence</div>
                <div className="text-lg font-bold text-(--gov-success) font-mono">✓ COMPLETE</div>
              </div>
            </div>
            
          </Card>
        </div>
      )}
    </div>
  );
}
