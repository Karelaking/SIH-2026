'use client';
import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Database } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Ledger() {
  const [sysStatus, setSysStatus] = useState<string>('Initializing...');
  
  useEffect(() => {
    if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
      invoke<string>('get_system_status')
        .then(res => setSysStatus(res))
        .catch(() => setSysStatus('Error connecting to core'));
    } else {
      setTimeout(() => setSysStatus('Browser Mode (Tauri Core Disconnected)'), 0);
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      
      <div className="border-b border-(--gov-border) pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wide" style={{ color: 'var(--gov-primary)' }}>Cryptographic Evidence Ledger</h1>
          <p className="mt-1 text-sm font-medium" style={{ color: 'var(--gov-text-secondary)' }}>
            Immutable, decentralized record of document decryption and attribution events.
          </p>
        </div>
      </div>

      <Card className="rounded-(--gov-radius) overflow-hidden">
        <CardContent className="p-6">
          <Alert className="rounded-(--gov-radius) bg-(--gov-bg) border-(--gov-border) flex flex-col items-center justify-center p-8 text-center">
            <Database className="h-8 w-8 mb-4 text-(--gov-text-secondary)" />
            <AlertTitle className="text-lg font-bold">No Ledger Records</AlertTitle>
            <AlertDescription className="mb-2 max-w-md">
              {sysStatus.includes('Browser') ? "Connect to the native Tauri node to access the offline ledger." : "The cryptographic ledger is currently empty. No documents have been distributed yet."}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

    </div>
  );
}
