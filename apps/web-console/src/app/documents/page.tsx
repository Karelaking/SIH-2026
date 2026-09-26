'use client';
import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText, Upload } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface DocumentRecord {
  id: string;
  title: string;
  hash: string;
  encrypted_at: string;
  size_bytes: number;
}

export default function Documents() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
        const result = await invoke<DocumentRecord[]>('get_documents');
        setDocuments(result);
        setLoading(false);
      } else {
        setTimeout(() => {
          setDocuments([]);
          setLoading(false);
        }, 0);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDocuments();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <div className="flex justify-between items-end border-b border-(--gov-border) pb-4">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wide text-(--gov-primary)">Secure Document Vault</h1>
          <p className="mt-1 text-sm font-medium text-(--gov-text-secondary)">
            Upload and manage classified encrypted payloads
          </p>
        </div>
        <Button className="bg-(--gov-primary) text-(--gov-bg) hover:bg-(--gov-bg) hover:text-(--gov-primary) border border-(--gov-primary) rounded-(--gov-radius) transition-colors">
          <Upload className="w-4 h-4 mr-2" />
          UPLOAD & ENCRYPT
        </Button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-(--gov-text-secondary)">Scanning encrypted volume...</div>
      ) : documents.length === 0 ? (
        <Alert className="bg-(--gov-bg) border-(--gov-border) rounded-(--gov-radius)">
          <FileText className="h-4 w-4 text-(--gov-text-secondary)" />
          <AlertTitle className="text-(--gov-text-primary) font-bold tracking-wide uppercase">No Documents Found</AlertTitle>
          <AlertDescription className="text-(--gov-text-secondary)">
            The secure vault is currently empty. Upload a payload to begin classification and encryption.
          </AlertDescription>
        </Alert>
      ) : (
        <Card className="rounded-(--gov-radius) border-(--gov-border) overflow-hidden bg-(--gov-surface)">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-(--gov-border) hover:bg-transparent">
                <TableHead className="text-(--gov-text-secondary) font-bold uppercase tracking-wider text-xs">Document ID</TableHead>
                <TableHead className="text-(--gov-text-secondary) font-bold uppercase tracking-wider text-xs">Title</TableHead>
                <TableHead className="text-(--gov-text-secondary) font-bold uppercase tracking-wider text-xs">Integrity Hash</TableHead>
                <TableHead className="text-(--gov-text-secondary) font-bold uppercase tracking-wider text-xs">Size</TableHead>
                <TableHead className="text-(--gov-text-secondary) font-bold uppercase tracking-wider text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id} className="border-b border-(--gov-border) hover:bg-(--gov-bg)">
                  <TableCell className="font-mono text-xs text-(--gov-text-secondary)">{doc.id}</TableCell>
                  <TableCell className="font-medium text-(--gov-text-primary)">{doc.title}</TableCell>
                  <TableCell className="font-mono text-xs text-(--gov-text-secondary)">{doc.hash.substring(0, 16)}...</TableCell>
                  <TableCell className="text-(--gov-text-secondary) text-sm">{(doc.size_bytes / 1024).toFixed(2)} KB</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" className="rounded-(--gov-radius) border-(--gov-border) text-(--gov-text-primary) hover:bg-(--gov-primary) hover:text-white">
                      Distribute
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
