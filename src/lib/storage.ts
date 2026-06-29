
import type { Lead, Notificacao } from '../types';

// ─── CONFIG ──────────────────────────────────────────────────────────────────
// Em produção, defina VITE_API_URL no Vercel apontando para o Railway
// Ex: https://sofia-sdr-production-df9f.up.railway.app
const API_URL = import.meta.env.VITE_API_URL || 'https://sofia-sdr-production-df9f.up.railway.app';

// ─── NOTIFICAÇÕES (localStorage — são locais por design) ─────────────────────
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

// ─── LEADS — API Railway ──────────────────────────────────────────────────────

export async function getLeads(filters?: {
  status?: string;
  origem?: string;
  search?: string;
}): Promise<Lead[]> {
  const params = new URLSearchParams();
  if (filters?.status) params.set('status', filters.status);
  if (filters?.origem) params.set('origem', filters.origem);
  if (filters?.search) params.set('search', filters.search);

  const res = await fetch(`${API_URL}/api/leads?${params.toString()}`);
  if (!res.ok) throw new Error(`Erro ao buscar leads: ${res.status}`);
  const data = await res.json();
  return data.leads as Lead[];
}

export async function getLead(id: string | number): Promise<Lead> {
  const res = await fetch(`${API_URL}/api/leads/${id}`);
  if (!res.ok) throw new Error(`Lead não encontrado: ${id}`);
  const data = await res.json();
  return data.lead as Lead;
}

export async function createLead(lead: Omit<Lead, 'id' | 'data'>): Promise<Lead> {
  const res = await fetch(`${API_URL}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lead),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Erro ao criar lead');
  }
  const data = await res.json();
  return data.lead as Lead;
}

export async function updateLead(
  id: string | number,
  patch: Partial<Lead>
): Promise<Lead> {
  const res = await fetch(`${API_URL}/api/leads/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Erro ao atualizar lead');
  }
  const data = await res.json();
  return data.lead as Lead;
}

export async function deleteLead(id: string | number): Promise<void> {
  const res = await fetch(`${API_URL}/api/leads/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Erro ao excluir lead: ${res.status}`);
}

export async function getStats(): Promise<{
  total: number;
  semana: number;
  porStatus: { status: string; count: string }[];
  porOrigem: { origem: string; count: string }[];
}> {
  const res = await fetch(`${API_URL}/api/stats`);
  if (!res.ok) throw new Error('Erro ao buscar stats');
  const data = await res.json();
  return data;
}

// ─── LANDING — salvar lead via API ───────────────────────────────────────────
export async function saveLandingLead(lead: {
  nome: string;
  estabelecimento: string;
  whatsapp: string;
  tipo: string;
}): Promise<void> {
  await createLead({
    ...lead,
    status: 'novo',
    origem: 'instagram',
  } as Omit<Lead, 'id' | 'data'>);
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
export function fmtDate(d?: string): string {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: '2-digit',
  });
}

export function timeAgo(d: string): string {
  const s = (Date.now() - new Date(d).getTime()) / 1000;
  if (s < 60) return 'agora';
  if (s < 3600) return `${Math.floor(s / 60)}min`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}
