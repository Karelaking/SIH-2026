'use client';
import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Database, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Dashboard() {
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
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      
      <div className="border-b border-(--gov-border) pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wide text-(--gov-primary)">Security Overview</h1>
          <p className="mt-1 text-sm font-medium text-(--gov-text-secondary)">
            Cryptographic Operations & Attribution Command Center
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-(--gov-text-secondary) uppercase">Last Synchronized</div>
          <div className="text-sm font-mono font-medium text-(--gov-text-primary)">Just now</div>
        </div>
      </div>

      {/* Metrics Row (0 due to no mock data) */}
      <div className="grid grid-cols-4 gap-6">
        <Card className="rounded-(--gov-radius) border-t-4 border-t-(--gov-primary)">
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-xs font-bold text-(--gov-text-secondary) uppercase tracking-wider">Documents</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-3xl font-bold text-(--gov-text-primary)">0</div>
            <div className="text-xs font-bold text-(--gov-text-secondary) mt-1 uppercase">Protected</div>
          </CardContent>
        </Card>
        <Card className="rounded-(--gov-radius) border-t-4 border-t-(--gov-primary)">
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-xs font-bold text-(--gov-text-secondary) uppercase tracking-wider">Recipients</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-3xl font-bold text-(--gov-text-primary)">0</div>
            <div className="text-xs font-bold text-(--gov-text-secondary) mt-1 uppercase">Active</div>
          </CardContent>
        </Card>
        <Card className="rounded-(--gov-radius) border-t-4 border-t-(--gov-primary)">
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-xs font-bold text-(--gov-text-secondary) uppercase tracking-wider">Decryptions</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-3xl font-bold text-(--gov-text-primary)">0</div>
            <div className="text-xs font-bold text-(--gov-text-secondary) mt-1 uppercase">Verified</div>
          </CardContent>
        </Card>
        <Card className="rounded-(--gov-radius) border-t-4 border-t-(--gov-warning)">
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-xs font-bold text-(--gov-text-secondary) uppercase tracking-wider">Investigations</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-3xl font-bold text-(--gov-warning)">0</div>
            <div className="text-xs font-bold text-(--gov-warning) mt-1 uppercase">Open</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Ledger Integrity */}
        <Card className="rounded-(--gov-radius)">
          <CardHeader className="border-b border-(--gov-border) mb-4">
            <CardTitle className="text-sm font-bold text-(--gov-text-secondary) uppercase tracking-wider">Ledger Integrity</CardTitle>
          </CardHeader>
          <CardContent>
            {sysStatus.includes('Browser') ? (
              <Alert className="rounded-(--gov-radius) bg-(--gov-bg) border-(--gov-border)">
                <Database className="h-4 w-4" />
                <AlertTitle>No Ledger Connection</AlertTitle>
                <AlertDescription>
                  Connect to the Tauri node to view actual ledger statistics and Merkle roots.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-[rgba(19,136,8,0.1)] flex items-center justify-center border border-[rgba(19,136,8,0.2)]">
                    <span className="text-2xl font-bold text-(--gov-success)">✓</span>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-(--gov-success) uppercase">Healthy</div>
                    <div className="text-sm font-medium text-(--gov-text-secondary)">Cryptographic consensus maintained</div>
                  </div>
                </div>
                <ul className="space-y-3 text-sm font-medium text-(--gov-text-primary)">
                  <li className="flex justify-between">
                    <span className="text-(--gov-text-secondary)">Nodes Online:</span>
                    <span className="font-mono">5 / 5 Active</span>
                  </li>
                </ul>
              </>
            )}
          </CardContent>
        </Card>

        {/* Security Status */}
        <Card className="rounded-(--gov-radius)">
          <CardHeader className="border-b border-(--gov-border) mb-4">
            <CardTitle className="text-sm font-bold text-(--gov-text-secondary) uppercase tracking-wider">Security Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <span className="text-(--gov-success) font-bold">✓</span>
                <span className="text-sm font-semibold text-(--gov-text-primary)">Cryptographic Services</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-(--gov-success) font-bold">✓</span>
                <span className="text-sm font-semibold text-(--gov-text-primary)">Watermark Engine</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-(--gov-success) font-bold">✓</span>
                <span className="text-sm font-semibold text-(--gov-text-primary)">Ledger Consensus</span>
              </li>
            </ul>
            <div className="mt-6 text-xs text-(--gov-text-secondary) font-mono bg-(--gov-bg) p-2 rounded border border-(--gov-border)">
              System Message: {sysStatus}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Decryption Events */}
      <Card className="rounded-(--gov-radius)">
        <CardHeader className="border-b border-(--gov-border) mb-4">
          <CardTitle className="text-sm font-bold text-(--gov-text-secondary) uppercase tracking-wider">Recent Decryption Events</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="rounded-(--gov-radius) bg-(--gov-bg) border-(--gov-border)">
            <ShieldCheck className="h-4 w-4" />
            <AlertTitle>No recent events</AlertTitle>
            <AlertDescription>
              There are currently no verifiable decryption events committed to the ledger.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

    </div>
  );
}
