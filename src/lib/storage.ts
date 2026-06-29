import type { Lead, Notificacao } from '../types';

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const API_URL = (import.meta as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL
  ?? 'https://sofia-sdr-production-df9f.up.railway.app';

// ─── NOTIFICAÇÕES ─────────────────────────────────────────────────────────────
const NOTIFS_KEY = 'fanfave_notifs';

export function getNotifs(): Notificacao[] {
  return JSON.parse(localStorage.getItem(NOTIFS_KEY) || '[]');
}
export function saveNotifs(notifs: Notificacao[]): void {
  localStorage.setItem(NOTIFS_KEY, JSON.stringify(notifs));
}
export function pushNotif(msg: string): void {
  const notifs = getNotifs();
  notifs.unshift({ id: 'n' + Date.now(), msg, time: new Date().toISOString(), read: false });
  saveNotifs(notifs.slice(0, 50));
}

// ─── LEADS ───────────────────────────────────────────────────────────────────
export async function getLeads(filters?: { status?: string; origem?: string; search?: string }): Promise<Lead[]> {
  const params = new URLSearchParams();
  if (filters?.status) params.set('status', filters.status);
  if (filters?.origem) params.set('origem', filters.origem);
  if (filters?.search) params.set('search', filters.search);
  const res = await fetch(`${API_URL}/api/leads?${params.toString()}`);
  if (!res.ok) throw new Error(`Erro ao buscar leads: ${res.status}`);
  const data = await res.json();
  return data.leads as Lead[];
}

export async function createLead(lead: Omit<Lead, 'id' | 'data'>): Promise<Lead> {
  const res = await fetch(`${API_URL}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lead),
  });
  if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Erro ao criar lead'); }
  const data = await res.json();
  return data.lead as Lead;
}

export async function updateLead(id: number, patch: Partial<Lead>): Promise<Lead> {
  const res = await fetch(`${API_URL}/api/leads/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Erro ao atualizar lead'); }
  const data = await res.json();
  return data.lead as Lead;
}

export async function deleteLead(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/leads/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Erro ao excluir lead: ${res.status}`);
}

export async function saveLandingLead(lead: { nome: string; estabelecimento: string; whatsapp: string; tipo: string }): Promise<void> {
  await createLead({ ...lead, status: 'novo', origem: 'instagram' } as Omit<Lead, 'id' | 'data'>);
}

export function fmtDate(d?: string): string {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

export function timeAgo(d: string): string {
  const s = (Date.now() - new Date(d).getTime()) / 1000;
  if (s < 60) return 'agora';
  if (s < 3600) return `${Math.floor(s / 60)}min`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}
