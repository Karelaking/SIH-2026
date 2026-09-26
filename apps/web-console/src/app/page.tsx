'use client';
import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

export default function Home() {
  const [title, setTitle] = useState('');
  const [inputType, setInputType] = useState<'text' | 'file'>('file');
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [watermarkedText, setWatermarkedText] = useState('');
  const [loading, setLoading] = useState(false);

  const availableRecipients = [
    { id: 'usr_1', name: 'Dr. A. Sharma (Chief Scientist)', role: 'Admin' },
    { id: 'usr_2', name: 'R. Kumar (Sec. of Defence)', role: 'Director' },
    { id: 'usr_3', name: 'S. Singh (Field Operative)', role: 'Recipient' },
  ];

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

      // Calls the Rust backend which simulates encryption, attestation, and watermark embedding.
      const result = await invoke<string>('distribute', {
        title,
        content: finalContent,
        recipientRole: selectedRecipients.join(','),
      });
      setWatermarkedText(result);
    } catch (e) {
      console.error(e);
      alert('Error distributing document: ' + e);
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 pb-20">
      
      <div className="border-b border-gray-300 dark:border-gray-700 pb-4">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--gov-primary)' }}>Secure Document Distribution</h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--gov-text-muted)' }}>
          Upload a classified document or text to encrypt using AES-GCM, wrap keys with Post-Quantum ML-KEM, and distribute to authorized personnel.
        </p>
      </div>

      <div className="surface-gov space-y-6">
        
        <div>
          <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--gov-text)' }}>Classification Title</label>
          <input 
            type="text" 
            className="input-gov"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Operation Trident - Q3 Strategic Review"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--gov-text)' }}>Content Type</label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" checked={inputType === 'file'} onChange={() => setInputType('file')} className="text-blue-600" />
              <span className="text-sm">Document / PDF Upload</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" checked={inputType === 'text'} onChange={() => setInputType('text')} className="text-blue-600" />
              <span className="text-sm">Direct Text Input</span>
            </label>
          </div>
        </div>

        {inputType === 'text' ? (
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--gov-text)' }}>Classified Plaintext</label>
            <textarea 
              rows={5}
              className="input-gov"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter the classified document contents here..."
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--gov-text)' }}>Select File (PDF, DOCX, ZIP)</label>
            <div className="border-2 border-dashed border-gray-400 p-8 text-center rounded bg-gray-50 dark:bg-gray-800">
               <input 
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                  className="mx-auto block text-sm"
               />
               {!selectedFile && <p className="text-xs text-gray-500 mt-2">Maximum file size: 50MB</p>}
            </div>
          </div>
        )}

        <div>
           <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--gov-text)' }}>Authorized Recipients</label>
           <div className="space-y-2 border border-gray-300 dark:border-gray-700 p-3 rounded" style={{ backgroundColor: 'var(--gov-bg)' }}>
              {availableRecipients.map(recipient => (
                <label key={recipient.id} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                   <input 
                      type="checkbox" 
                      checked={selectedRecipients.includes(recipient.id)}
                      onChange={() => handleToggleRecipient(recipient.id)}
                      className="w-4 h-4 rounded text-blue-600"
                   />
                   <span className="text-sm font-medium">{recipient.name}</span>
                   <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">{recipient.role}</span>
                </label>
              ))}
           </div>
        </div>

        <div className="pt-4 border-t border-gray-300 dark:border-gray-700 flex justify-end">
          <button
            onClick={handleDistribute}
            disabled={loading || !title || (inputType === 'text' ? !content : !selectedFile) || selectedRecipients.length === 0}
            className="btn-gov w-full sm:w-auto"
          >
            {loading ? 'Processing Cryptography...' : 'Encrypt & Distribute'}
          </button>
        </div>
      </div>

      {watermarkedText && (
        <div className="space-y-4 p-6 rounded" style={{ backgroundColor: 'var(--gov-surface)', borderLeft: '4px solid var(--gov-success)', borderRight: '1px solid var(--gov-border)', borderTop: '1px solid var(--gov-border)', borderBottom: '1px solid var(--gov-border)' }}>
          <h2 className="text-xl font-bold" style={{ color: 'var(--gov-success)' }}>Distribution Successful</h2>
          <p className="text-sm" style={{ color: 'var(--gov-text)' }}>
            The document was encrypted, Post-Quantum keys were wrapped, and a unique <strong>Decryption Attestation</strong> was signed using the recipient&apos;s ML-DSA key and committed to the Offline Ledger.
          </p>
          <div className="p-4 rounded text-sm font-mono break-all whitespace-pre-wrap mt-4" style={{ backgroundColor: 'var(--gov-bg)', color: 'var(--gov-text)', border: '1px solid var(--gov-border)' }}>
            <div className="mb-2 text-xs uppercase" style={{ color: 'var(--gov-text-muted)' }}>Simulated Decrypted View (With Invisible Zero-Width Watermark):</div>
            {watermarkedText}
          </div>
          <p className="text-xs font-semibold" style={{ color: 'var(--gov-secondary)' }}>
            Note: Copy the text above and paste it into the Forensics page to simulate a leak investigation.
          </p>
        </div>
      )}
    </div>
  );
}
