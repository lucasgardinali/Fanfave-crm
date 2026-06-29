
export const COLORS = {
  blue:       '#1A3EE8',
  blueDark:   '#1230B8',
  blueLight:  '#EEF2FD',
  blueMid:    '#4D7EF0',
  amber:      '#F5A623',
  amberLight: '#FFF3DC',
  teal:       '#4DB8E8',
  text:       '#111318',
  muted:      '#5A6272',
  border:     '#E4E7EF',
  surface:    '#F7F8FC',
  grayBg:     '#F4F5F9',
  grayBorder: '#E4E7EF',
  grayText:   '#6B7280',
  white:      '#FFFFFF',
  green:      '#25D366',
} as const;

export const STATUS_ORDER = ['novo', 'contato', 'demo', 'negociacao', 'fechado'] as const;

export const STATUS_LABEL: Record<string, string> = {
  novo:       'Novo',
  contato:    'Em contato',
  demo:       'Demo',
  negociacao: 'Negociação',
  fechado:    'Fechado',
};

export const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  novo:       { bg: '#EEF2FD', text: '#1A3EE8' },
  contato:    { bg: '#FEF3C7', text: '#92400E' },
  demo:       { bg: '#EEEDFE', text: '#534AB7' },
  negociacao: { bg: '#FAECE7', text: '#993C1D' },
  fechado:    { bg: '#D1FAE5', text: '#065F46' },
};

export const NEXT_STATUS: Record<string, string> = {
  novo:       'contato',
  contato:    'demo',
  demo:       'negociacao',
  negociacao: 'fechado',
};

export const CANAL_LABEL: Record<string, string> = {
  instagram: 'Instagram Ads',
  landing:   'Landing page',
  whatsapp:  'WhatsApp',
  indicacao: 'Indicação',
  manual:    'Manual',
};

export const CANAL_COLOR: Record<string, { bg: string; text: string }> = {
  instagram: { bg: '#FDE8F6', text: '#9B1B6E' },
  landing:   { bg: '#EEF2FD', text: '#1A3EE8' },
  whatsapp:  { bg: '#D1FAE5', text: '#065F46' },
  indicacao: { bg: '#FFF3DC', text: '#7A4500' },
  manual:    { bg: '#F4F5F9', text: '#6B7280' },
};

export const SEGMENTS = [
  'Restaurante',
  'Pizzaria',
  'Lanchonete',
  'Cafeteria',
  'Padaria / Confeitaria',
  'Bar / Boteco',
  'Food truck',
  'Delivery',
  'Outro',
] as const;

export const CHART_COLORS = [
  '#1A3EE8', '#F5A623', '#8B5CF6',
  '#10B981', '#EF4444', '#4DB8E8',
  '#EC4899', '#F59E0B',
];

export const SEED_LEADS = [
  { id: 's1', nome: 'Ricardo Mendes',  whatsapp: '(38) 99812-3344', email: 'ricardo@pizzaria.com', estabelecimento: 'Pizzaria Central',  tipo: 'Pizzaria',             cidade: 'Montes Claros', status: 'demo',       notas: 'Demo quinta às 15h.',    data: '2026-06-10T10:00:00', origem: 'instagram'  },
  { id: 's2', nome: 'Tatiana Souza',   whatsapp: '(38) 98877-5566', email: 'tati@cafe.com',        estabelecimento: 'Grão Cafeteria',    tipo: 'Cafeteria',            cidade: 'Montes Claros', status: 'negociacao', notas: 'Proposta enviada.',      data: '2026-06-08T14:30:00', origem: 'landing'    },
  { id: 's3', nome: 'Fernando Lima',   whatsapp: '(38) 99123-7788', email: '',                     estabelecimento: 'Lanchonete Sabor',  tipo: 'Lanchonete',           cidade: 'Montes Claros', status: 'contato',    notas: '',                       data: '2026-06-12T09:15:00', origem: 'whatsapp'   },
  { id: 's4', nome: 'Márcia Barbosa',  whatsapp: '(38) 99456-1122', email: '',                     estabelecimento: 'Padaria Boa',       tipo: 'Padaria / Confeitaria',cidade: 'Montes Claros', status: 'novo',       notas: '',                       data: '2026-06-15T11:20:00', origem: 'instagram'  },
  { id: 's5', nome: 'Carlos Duarte',   whatsapp: '(38) 98765-9900', email: 'carlos@rest.com',      estabelecimento: 'Restaurante Duarte',tipo: 'Restaurante',          cidade: 'Montes Claros', status: 'fechado',    notas: 'Assinou plano mensal.',  data: '2026-06-05T16:00:00', origem: 'indicacao'  },
  { id: 's6', nome: 'Ana Pereira',     whatsapp: '(38) 99321-4455', email: '',                     estabelecimento: 'Sabor Natural',     tipo: 'Restaurante',          cidade: 'Montes Claros', status: 'novo',       notas: '',                       data: '2026-06-16T08:00:00', origem: 'landing'    },
] as const;
