export type LeadStatus = 'novo' | 'contato' | 'demo' | 'negociacao' | 'fechado' | 'arquivado';

export type LeadCanal =
  | 'instagram'
  | 'landing'
  | 'whatsapp'
  | 'indicacao'
  | 'manual';

export type LeadSegmento =
  | 'Restaurante'
  | 'Pizzaria'
  | 'Lanchonete'
  | 'Cafeteria'
  | 'Padaria / Confeitaria'
  | 'Bar / Boteco'
  | 'Food truck'
  | 'Delivery'
  | 'Outro';

export interface Lead {
  id: string | number;
  nome: string;
  whatsapp: string;
  email?: string;
  estabelecimento: string;
  tipo: LeadSegmento | string;
  cidade?: string;
  status: LeadStatus;
  origem: LeadCanal;
  notas?: string;
  data: string;
  atualizado?: string;
  proxima_acao?: string;      // ISO string — data/hora da próxima ação agendada
  proxima_acao_desc?: string; // descrição da próxima ação
}

export interface Notificacao {
  id: string;
  msg: string;
  time: string; // ISO string
  read: boolean;
}

export interface LeadFormData {
  nome: string;
  estab: string;
  whats: string;
  seg: string;
}

export interface AddLeadFormData {
  nome: string;
  whats: string;
  email: string;
  estab: string;
  tipo: string;
  cidade: string;
  status: LeadStatus;
  canal: LeadCanal;
  notas: string;
  proxima_acao: string;
  proxima_acao_desc: string;
}
