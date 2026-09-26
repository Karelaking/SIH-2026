'use client';

import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface UserResponse {
  id: string;
  name: string;
  department: string;
  clearance: string;
  role: string;
}

export default function RecipientsPage() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [clearance, setClearance] = useState('Secret');
  const [role, setRole] = useState('Recipient');

  const fetchUsers = async () => {
    try {
      if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
        const result = await invoke<UserResponse[]>('get_users');
        setUsers(result);
        setLoading(false);
      } else {
        setTimeout(() => setLoading(false), 0);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, []);

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
        await invoke('register_user', { name, department, clearance, roleStr: role });
        setModalOpen(false);
        setName('');
        setDepartment('');
        fetchUsers();
      } else {
        alert("Cannot register: Tauri API disconnected.");
      }
    } catch (e) {
      console.error(e);
      alert('Error registering user: ' + e);
    }
    setIsRegistering(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      <header className="mb-6 border-b border-[var(--gov-border)] pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wide text-[var(--gov-primary)]">Recipient Management</h1>
          <p className="mt-1 text-sm font-medium text-[var(--gov-text-secondary)]">Manage cryptographic identities and PQC keys for secure distribution.</p>
        </div>
        
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger className="bg-[var(--gov-primary)] hover:bg-[var(--gov-primary-hover)] text-white rounded-[var(--gov-radius)] px-4 py-2 font-medium text-sm">
            + Register Recipient
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-[var(--gov-radius)] bg-[var(--gov-surface)] text-[var(--gov-text-primary)] border-[var(--gov-border)]">
            <DialogHeader>
              <DialogTitle>Register Cryptographic Identity</DialogTitle>
              <DialogDescription>
                Enroll a new user into the platform. A Post-Quantum (ML-DSA) keypair will be generated for them.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Full Name</label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Dr. A. Sharma" className="bg-[var(--gov-bg)] border-[var(--gov-border)]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Department</label>
                <Input value={department} onChange={e => setDepartment(e.target.value)} placeholder="e.g. Ministry of Defence" className="bg-[var(--gov-bg)] border-[var(--gov-border)]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Clearance Level</label>
                <select value={clearance} onChange={e => setClearance(e.target.value)} className="flex h-10 w-full rounded-md border border-[var(--gov-border)] bg-[var(--gov-bg)] px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="Confidential">Confidential</option>
                  <option value="Secret">Secret</option>
                  <option value="TopSecret">Top Secret</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Role</label>
                <select value={role} onChange={e => setRole(e.target.value)} className="flex h-10 w-full rounded-md border border-[var(--gov-border)] bg-[var(--gov-bg)] px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="Recipient">Authorized Recipient</option>
                  <option value="DocumentOfficer">Document Officer</option>
                  <option value="ForensicInvestigator">Forensic Investigator</option>
                  <option value="SecurityAdmin">Security Administrator</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button disabled={isRegistering || !name || !department} onClick={handleRegister} className="bg-[var(--gov-primary)] text-white hover:bg-[var(--gov-primary-hover)]">
                {isRegistering ? 'Generating Keys...' : 'Register Identity'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      <main>
        <Card className="rounded-[var(--gov-radius)] overflow-hidden">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-12 text-center text-[var(--gov-text-secondary)]">Loading identities...</div>
            ) : users.length === 0 ? (
              <Alert className="rounded-[var(--gov-radius)] bg-[var(--gov-bg)] border-[var(--gov-border)] flex flex-col items-center justify-center p-8 text-center m-6">
                <Users className="h-8 w-8 mb-4 text-[var(--gov-text-secondary)]" />
                <AlertTitle className="text-lg font-bold">No Recipients Found</AlertTitle>
                <AlertDescription className="mb-6">
                  There are currently no authorized cryptographic identities registered in the system.
                </AlertDescription>
                <Button onClick={() => setModalOpen(true)} variant="outline" className="text-[var(--gov-primary)] border-[var(--gov-primary)] rounded-[var(--gov-radius)] hover:bg-[var(--gov-bg)]">
                  Register First Recipient
                </Button>
              </Alert>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--gov-border)] text-[var(--gov-text-secondary)] text-xs uppercase tracking-wider bg-[var(--gov-bg)]">
                      <th className="px-6 py-4 font-bold">Identity ID</th>
                      <th className="px-6 py-4 font-bold">Name</th>
                      <th className="px-6 py-4 font-bold">Department</th>
                      <th className="px-6 py-4 font-bold">Clearance</th>
                      <th className="px-6 py-4 font-bold">Role</th>
                      <th className="px-6 py-4 font-bold text-right">Keys</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--gov-border)] text-sm">
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-[var(--gov-bg)] transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-[var(--gov-text-secondary)]">{user.id}</td>
                        <td className="px-6 py-4 font-bold text-[var(--gov-text-primary)]">{user.name}</td>
                        <td className="px-6 py-4 text-[var(--gov-text-secondary)]">{user.department}</td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="rounded-full bg-[var(--gov-bg)] text-[var(--gov-text-primary)] border-[var(--gov-border)]">
                            {user.clearance}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className="bg-[var(--gov-primary)] text-white hover:bg-[var(--gov-primary-hover)]">
                            {user.role}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-[var(--gov-success)] font-bold text-xs uppercase flex items-center justify-end gap-1">
                            ✓ ML-DSA Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
