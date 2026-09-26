'use client';
import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { ShieldAlert } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface UserResponse {
  id: string;
  name: string;
  department: string;
  clearance: string;
  role: string;
}

export default function Distribution() {
  const [title, setTitle] = useState('');
  const [inputType, setInputType] = useState<'text' | 'file'>('file');
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [watermarkedText, setWatermarkedText] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [availableRecipients, setAvailableRecipients] = useState<UserResponse[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
      invoke<UserResponse[]>('get_users')
        .then(users => setAvailableRecipients(users))
        .catch(console.error);
    }
  }, []);

  const handleToggleRecipient = (id: string) => {
    setSelectedRecipients(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handleDistribute = async () => {
    if (selectedRecipients.length === 0) {
      alert('Please select at least one recipient.');
      return;
    }
    
    setLoading(true);
    try {
      let finalContent = content;
      if (inputType === 'file' && selectedFile) {
        finalContent = `[CONFIDENTIAL FILE UPLOAD]\nFilename: ${selectedFile.name}\nSize: ${selectedFile.size} bytes\nType: ${selectedFile.type}\n--- END OF METADATA ---`;
      }

      if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
        const result = await invoke<string>('distribute', {
          title,
          content: finalContent,
          recipientIds: selectedRecipients, // Updated argument
        });
        setWatermarkedText(result);
      } else {
        alert("Cannot distribute: API disconnected.");
      }
    } catch (e) {
      console.error(e);
      alert('Error distributing document: ' + e);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      
      <div className="border-b border-[var(--gov-border)] pb-4">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--gov-primary)' }}>SECURE DOCUMENT DISTRIBUTION</h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--gov-text-secondary)' }}>
          Classify, encrypt, and securely distribute sensitive documents using Post-Quantum Cryptography (ML-KEM) and embedded cryptographic watermarks.
        </p>
      </div>

      <Card className="rounded-[var(--gov-radius)] p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-[var(--gov-text-primary)]">Classification Title</label>
          <Input 
            type="text" 
            className="bg-[var(--gov-surface)] text-[var(--gov-text-primary)] border-[var(--gov-border)] rounded-[var(--gov-radius)]"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Operation Trident - Q3 Strategic Review"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-[var(--gov-text-primary)]">Content Type</label>
          <div className="flex space-x-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" checked={inputType === 'file'} onChange={() => setInputType('file')} className="w-4 h-4 accent-[var(--gov-primary)]" />
              <span className="text-sm font-medium">Document / PDF Upload</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" checked={inputType === 'text'} onChange={() => setInputType('text')} className="w-4 h-4 accent-[var(--gov-primary)]" />
              <span className="text-sm font-medium">Direct Text Input</span>
            </label>
          </div>
        </div>

        {inputType === 'text' ? (
          <div>
            <label className="block text-sm font-semibold mb-2 text-[var(--gov-text-primary)]">Classified Plaintext</label>
            <textarea 
              rows={5}
              className="w-full bg-[var(--gov-surface)] text-[var(--gov-text-primary)] border border-[var(--gov-border)] rounded-[var(--gov-radius)] p-2 font-mono text-sm"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter the classified document contents here..."
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-semibold mb-2 text-[var(--gov-text-primary)]">Select File (PDF, DOCX, ZIP)</label>
            <div className="border-2 border-dashed border-[var(--gov-border)] p-12 text-center rounded bg-[var(--gov-bg)]">
               <Input 
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                  className="mx-auto block text-sm text-[var(--gov-text-secondary)] border-0"
               />
               {!selectedFile && <p className="text-xs text-[var(--gov-text-secondary)] mt-4">Maximum file size: 50MB. All uploads are end-to-end encrypted.</p>}
            </div>
          </div>
        )}

        <div>
           <label className="block text-sm font-semibold mb-2 text-[var(--gov-text-primary)]">Authorized Recipients</label>
           
           {availableRecipients.length === 0 ? (
             <Alert className="rounded-[var(--gov-radius)] bg-[var(--gov-bg)] border-[var(--gov-border)]">
               <ShieldAlert className="h-4 w-4" />
               <AlertTitle>No Recipients Available</AlertTitle>
               <AlertDescription>
                 You must register cryptographic identities in the Recipient Management console before you can distribute documents.
                 <div className="mt-4">
                   <a href="/recipients"><Button variant="outline" className="text-[var(--gov-primary)] border-[var(--gov-primary)] rounded-[var(--gov-radius)]">Go to Recipients</Button></a>
                 </div>
               </AlertDescription>
             </Alert>
           ) : (
             <div className="space-y-2 border border-[var(--gov-border)] p-4 rounded bg-[var(--gov-bg)]">
                {availableRecipients.map(recipient => (
                  <label key={recipient.id} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-[var(--gov-surface)] rounded transition-colors">
                     <input 
                        type="checkbox" 
                        checked={selectedRecipients.includes(recipient.id)}
                        onChange={() => handleToggleRecipient(recipient.id)}
                        className="w-4 h-4 rounded accent-[var(--gov-primary)]"
                     />
                     <span className="text-sm font-semibold">{recipient.name}</span>
                     <span className="text-xs text-[var(--gov-text-secondary)] ml-2">({recipient.department})</span>
                     <Badge variant="secondary">{recipient.role}</Badge>
                  </label>
                ))}
             </div>
           )}
        </div>

        <div className="pt-6 border-t border-[var(--gov-border)] flex justify-end">
          <Button
            onClick={handleDistribute}
            disabled={loading || !title || (inputType === 'text' ? !content : !selectedFile) || availableRecipients.length === 0 || selectedRecipients.length === 0}
            className="w-full sm:w-auto bg-[var(--gov-primary)] hover:bg-[var(--gov-primary-hover)] text-white rounded-[var(--gov-radius)]"
          >
            {loading ? 'Processing Cryptography...' : 'Encrypt & Distribute'}
          </Button>
        </div>
      </Card>

      {watermarkedText && (
        <Card className="rounded-[var(--gov-radius)] p-6 border-l-4" style={{ borderLeftColor: 'var(--gov-success)' }}>
          <h2 className="text-lg font-bold text-[var(--gov-success)] mb-2 flex items-center gap-2">
            ✓ DISTRIBUTION SUCCESSFUL
          </h2>
          <p className="text-sm text-[var(--gov-text-primary)] mb-4">
            The document was encrypted, Post-Quantum keys were wrapped, and a unique <strong>Decryption Attestation</strong> was signed using the recipient&apos;s ML-DSA key and committed to the Offline Ledger.
          </p>
          <div className="p-4 rounded text-sm font-mono break-all whitespace-pre-wrap bg-[var(--gov-bg)] border border-[var(--gov-border)] text-[var(--gov-text-primary)]">
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--gov-text-secondary)]">Simulated Decrypted View (With Invisible Zero-Width Watermark):</div>
            {watermarkedText}
          </div>
          <p className="text-xs font-bold mt-4 text-[var(--gov-saffron)]">
            WARNING: Copy the text above and paste it into the Forensics page to simulate a leak investigation.
          </p>
        </Card>
      )}
    </div>
  );
}
