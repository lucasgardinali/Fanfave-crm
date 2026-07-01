import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FanFaveLogo, StatusPill, CanalPill, Btn, StatCard, Toast, Modal, InputField, SelectField, StatusSelector } from '../components/ui';
import { getLeads, createLead, updateLead, deleteLead, getNotifs, saveNotifs, pushNotif, fmtDate, timeAgo } from '../lib/storage';
import { COLORS, STATUS_ORDER, STATUS_LABEL, STATUS_COLOR, NEXT_STATUS, CANAL_LABEL, SEGMENTS, CHART_COLORS } from '../lib/constants';
import type { Lead, LeadStatus, LeadCanal, AddLeadFormData, Notificacao } from '../types';

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function fmtDateTime(d?: string) {
  if (!d) return '—';
  return new Date(d).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function getAlertLevel(lead: Lead): 'none' | 'warning' | 'danger' {
  const now = Date.now();
  const updated = new Date(lead.atualizado ?? lead.data).getTime();
  const diffH = (now - updated) / 3600000;

  if (lead.status === 'fechado' || lead.status === 'arquivado') return 'none';

  // Novos e em contato: alerta em 24h
  if (lead.status === 'novo' || lead.status === 'contato') {
    if (diffH >= 24) return 'danger';
    if (diffH >= 16) return 'warning';
    return 'none';
  }

  // Demo e negociação: verifica próxima ação
  if (lead.status === 'demo' || lead.status === 'negociacao') {
    if (lead.proxima_acao) {
      const acaoDate = new Date(lead.proxima_acao).getTime();
      if (now > acaoDate) return 'danger';   // ação vencida
      if (now > acaoDate - 3600000) return 'warning'; // menos de 1h
      return 'none';
    }
    // Sem próxima ação cadastrada: alerta em 48h
    if (diffH >= 48) return 'danger';
    if (diffH >= 36) return 'warning';
    return 'none';
  }

  return 'none';
}

function AlertBadge({ level }: { level: 'warning' | 'danger' }) {
  const cfg = {
    warning: { bg: '#FEF3C7', color: '#92400E', label: '⚠ Atenção' },
    danger:  { bg: '#FEE2E2', color: '#991B1B', label: '🔴 Urgente' },
  }[level];
  return (
    <span style={{ fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 8, background: cfg.bg, color: cfg.color, whiteSpace: 'nowrap' }}>
      {cfg.label}
    </span>
  );
}

// ─── REPORTS ──────────────────────────────────────────────────────────────────
function Reports({ leads }: { leads: Lead[] }) {
  const active = leads.filter(l => l.status !== 'arquivado');
  const total    = active.length;
  const fechados = active.filter(l => l.status === 'fechado').length;
  const conv     = total > 0 ? Math.round((fechados / total) * 100) : 0;
  const weekAgo  = new Date(Date.now() - 7 * 86400000);
  const semana   = active.filter(l => new Date(l.data) >= weekAgo).length;
  const canalCounts = active.reduce<Record<string,number>>((a,l) => { const c = l.origem??'manual'; a[c]=(a[c]??0)+1; return a; }, {});
  const melhorCanal = Object.keys(canalCounts).reduce((a,b) => (canalCounts[a]??0)>(canalCounts[b]??0)?a:b,'—');
  const funnelData = STATUS_ORDER.filter(s=>s!=='arquivado').map(s => ({ name: STATUS_LABEL[s], value: active.filter(l=>l.status===s).length, color: STATUS_COLOR[s].text }));
  const tipoData = Object.entries(active.reduce<Record<string,number>>((a,l) => { a[l.tipo]=(a[l.tipo]??0)+1; return a; }, {})).map(([name,value])=>({name,value}));
  const channelColors: Record<string,string> = { instagram:'#E1306C', landing:COLORS.blue, whatsapp:'#25D366', indicacao:COLORS.amber, manual:'#9CA3AF' };
  const days = Array.from({length:14},(_,i) => {
    const d = new Date(Date.now()-(13-i)*86400000);
    const label = d.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'});
    const start=new Date(d); start.setHours(0,0,0,0);
    const end=new Date(d); end.setHours(23,59,59,999);
    return { name:label, value:active.filter(l=>{const dt=new Date(l.data);return dt>=start&&dt<=end;}).length };
  });

  return (
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>
        <StatCard val={total} lbl="Leads ativos" />
        <StatCard val={`${conv}%`} lbl="Taxa de conversão" />
        <StatCard val={semana} lbl="Leads esta semana" />
        <StatCard val={CANAL_LABEL[melhorCanal]??melhorCanal} lbl="Canal principal" />
      </div>
      <div style={{background:COLORS.white,border:`1px solid ${COLORS.grayBorder}`,borderRadius:12,padding:18}}>
        <div style={{fontSize:13,fontWeight:600,marginBottom:14}}>Evolução — últimos 14 dias</div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={days} margin={{top:0,right:0,left:-20,bottom:0}}>
            <XAxis dataKey="name" tick={{fontSize:10}} tickLine={false} axisLine={false} interval={2}/>
            <YAxis tick={{fontSize:10}} tickLine={false} axisLine={false} allowDecimals={false}/>
            <Tooltip contentStyle={{fontSize:12,borderRadius:8}}/>
            <Bar dataKey="value" fill={COLORS.blue} radius={[4,4,0,0]} name="Leads"/>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        <div style={{background:COLORS.white,border:`1px solid ${COLORS.grayBorder}`,borderRadius:12,padding:18}}>
          <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>Por segmento</div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart><Pie data={tipoData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={55} innerRadius={30}>{tipoData.map((_,i)=><Cell key={i} fill={CHART_COLORS[i%CHART_COLORS.length]}/>)}</Pie><Tooltip contentStyle={{fontSize:11,borderRadius:8}}/></PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{background:COLORS.white,border:`1px solid ${COLORS.grayBorder}`,borderRadius:12,padding:18}}>
          <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>Por canal</div>
          {Object.entries(canalCounts).map(([c,n])=>{
            const pct=Math.round((n/Math.max(total,1))*100);
            return <div key={c} style={{marginBottom:8}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:11,marginBottom:3}}><span style={{fontWeight:500}}>{CANAL_LABEL[c]??c}</span><span style={{color:COLORS.grayText}}>{n}</span></div>
              <div style={{height:8,background:COLORS.grayBg,borderRadius:4,overflow:'hidden'}}><div style={{height:'100%',width:`${pct}%`,background:channelColors[c]??'#9CA3AF',borderRadius:4}}/></div>
            </div>;
          })}
        </div>
      </div>
      <div style={{background:COLORS.white,border:`1px solid ${COLORS.grayBorder}`,borderRadius:12,padding:18}}>
        <div style={{fontSize:13,fontWeight:600,marginBottom:14}}>Funil de conversão</div>
        {funnelData.map(f=>{
          const max=Math.max(...funnelData.map(x=>x.value),1);
          const pct=Math.round((f.value/max)*100);
          return <div key={f.name} style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
            <span style={{fontSize:12,fontWeight:500,width:90,flexShrink:0}}>{f.name}</span>
            <div style={{flex:1,height:28,background:COLORS.grayBg,borderRadius:6,overflow:'hidden'}}>
              <div style={{height:'100%',width:`${pct}%`,background:f.color,borderRadius:6,display:'flex',alignItems:'center',paddingLeft:8,minWidth:24}}><span style={{fontSize:11,fontWeight:600,color:'#fff'}}>{f.value}</span></div>
            </div>
            <span style={{fontSize:11,fontWeight:600,width:20,textAlign:'right'}}>{f.value}</span>
          </div>;
        })}
      </div>
    </div>
  );
}

// ─── AÇÕES DO DIA ─────────────────────────────────────────────────────────────
function AcoesHoje({ leads, onOpen }: { leads: Lead[]; onOpen: (l: Lead) => void }) {
  const now = Date.now();
  const today = new Date(); today.setHours(23,59,59,999);
  const active = leads.filter(l => l.status !== 'arquivado' && l.status !== 'fechado');

  const reunioesHoje = active.filter(l => {
    if (!l.proxima_acao) return false;
    const d = new Date(l.proxima_acao);
    return d <= today && d.toDateString() === new Date().toDateString();
  });

  const atrasados = active.filter(l => {
    if (!l.proxima_acao) return false;
    return new Date(l.proxima_acao) < new Date() && new Date(l.proxima_acao).toDateString() !== new Date().toDateString();
  });

  const urgentes = active.filter(l => getAlertLevel(l) === 'danger' && !reunioesHoje.find(r => r.id === l.id));
  const atencao  = active.filter(l => getAlertLevel(l) === 'warning' && !reunioesHoje.find(r => r.id === l.id));

  const Section = ({ title, icon, items, emptyMsg }: { title: string; icon: string; items: Lead[]; emptyMsg: string }) => (
    <div style={{background:COLORS.white,border:`1px solid ${COLORS.grayBorder}`,borderRadius:12,padding:16,marginBottom:12}}>
      <div style={{fontSize:13,fontWeight:600,marginBottom:12,display:'flex',alignItems:'center',gap:6}}>
        <span>{icon}</span>{title}
        <span style={{marginLeft:'auto',fontSize:11,fontWeight:600,padding:'2px 8px',borderRadius:10,background:items.length>0?COLORS.blueLight:COLORS.grayBg,color:items.length>0?COLORS.blue:COLORS.grayText}}>{items.length}</span>
      </div>
      {items.length === 0
        ? <div style={{fontSize:12,color:COLORS.grayText,textAlign:'center',padding:'8px 0'}}>{emptyMsg}</div>
        : items.map(l => (
          <div key={l.id as number} onClick={() => onOpen(l)} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:`1px solid ${COLORS.grayBorder}`,cursor:'pointer'}}>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:600}}>{l.nome}</div>
              <div style={{fontSize:11,color:COLORS.grayText}}>{l.estabelecimento}</div>
              {l.proxima_acao && <div style={{fontSize:11,color:COLORS.blue,marginTop:2}}>📅 {fmtDateTime(l.proxima_acao)}{l.proxima_acao_desc ? ` — ${l.proxima_acao_desc}` : ''}</div>}
            </div>
            <StatusPill status={l.status}/>
          </div>
        ))
      }
    </div>
  );

  return (
    <div style={{display:'flex',flexDirection:'column',gap:0}}>
      <div style={{fontFamily:'Sora,sans-serif',fontSize:16,fontWeight:700,marginBottom:16,color:COLORS.text}}>
        📋 Ações do dia — {new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'})}
      </div>
      <Section title="Reuniões e apresentações hoje" icon="📅" items={reunioesHoje} emptyMsg="Nenhuma reunião agendada para hoje ✓" />
      <Section title="Ações atrasadas" icon="⏰" items={atrasados} emptyMsg="Nenhuma ação atrasada ✓" />
      <Section title="Urgente — sem contato" icon="🔴" items={urgentes} emptyMsg="Nenhum lead urgente ✓" />
      <Section title="Atenção — verificar" icon="⚠️" items={atencao} emptyMsg="Tudo em dia ✓" />
    </div>
  );
}

// ─── KANBAN ───────────────────────────────────────────────────────────────────
function KanbanView({ leads, onOpen, onAdvance, onArchive }: { leads: Lead[]; onOpen: (l: Lead) => void; onAdvance: (id: number) => void; onArchive: (id: number) => void }) {
  const pipeline = leads.filter(l => l.status !== 'arquivado');
  return (
    <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:8,alignItems:'start'}}>
      {STATUS_ORDER.filter(s => s !== 'arquivado').map(s => {
        const items = pipeline.filter(l => l.status === s);
        const c = STATUS_COLOR[s];
        return (
          <div key={s} style={{background:COLORS.grayBg,border:`1px solid ${COLORS.grayBorder}`,borderRadius:12,padding:10}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10,paddingBottom:8,borderBottom:`1px solid ${COLORS.grayBorder}`}}>
              <span style={{fontSize:11,fontWeight:600}}>{STATUS_LABEL[s]}</span>
              <span style={{fontSize:10,fontWeight:700,padding:'1px 6px',borderRadius:8,background:c.bg,color:c.text}}>{items.length}</span>
            </div>
            {items.length === 0 && <div style={{fontSize:11,color:COLORS.grayText,textAlign:'center',padding:'16px 0'}}>Sem leads</div>}
            {items.map(l => {
              const alert = getAlertLevel(l);
              const borderColor = alert === 'danger' ? '#EF4444' : alert === 'warning' ? '#F59E0B' : COLORS.grayBorder;
              const bgColor = alert === 'danger' ? '#FFF5F5' : alert === 'warning' ? '#FFFBEB' : COLORS.white;
              return (
                <div key={l.id as number} onClick={() => onOpen(l)} style={{background:bgColor,border:`1px solid ${borderColor}`,borderRadius:8,padding:10,marginBottom:7,cursor:'pointer'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:4,marginBottom:5}}>
                    <div>
                      <div style={{fontSize:12,fontWeight:600}}>{l.nome}</div>
                      <div style={{fontSize:11,color:COLORS.grayText,marginTop:1}}>{l.estabelecimento}</div>
                    </div>
                    <span style={{fontSize:9,padding:'2px 5px',borderRadius:6,background:COLORS.grayBg,color:COLORS.grayText,border:`1px solid ${COLORS.grayBorder}`,flexShrink:0,whiteSpace:'nowrap',alignSelf:'flex-start'}}>{l.tipo}</span>
                  </div>
                  {alert !== 'none' && <div style={{marginBottom:5}}><AlertBadge level={alert}/></div>}
                  <div style={{marginBottom:5}}><CanalPill canal={l.origem}/></div>
                  {l.proxima_acao && (
                    <div style={{fontSize:10,color:COLORS.blue,marginBottom:5}}>📅 {fmtDateTime(l.proxima_acao)}</div>
                  )}
                  <div style={{fontSize:10,color:COLORS.grayText,marginBottom:7}}>{fmtDate(l.data)}</div>
                  <div style={{display:'flex',gap:4}}>
                    <button onClick={e=>{e.stopPropagation();onOpen(l);}} style={{flex:1,height:24,border:`1px solid ${COLORS.grayBorder}`,borderRadius:6,background:COLORS.white,fontSize:10,cursor:'pointer',color:COLORS.grayText}}>Detalhes</button>
                    {NEXT_STATUS[s] && <button onClick={e=>{e.stopPropagation();onAdvance(l.id as number);}} style={{flex:1,height:24,border:`1px solid ${COLORS.blue}`,borderRadius:6,background:COLORS.blue,fontSize:10,cursor:'pointer',color:'#fff',fontWeight:500}}>→ {STATUS_LABEL[NEXT_STATUS[s]]}</button>}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ─── LIST VIEW ────────────────────────────────────────────────────────────────
function ListView({ leads, onOpen }: { leads: Lead[]; onOpen: (l: Lead) => void }) {
  const pipeline = leads.filter(l => l.status !== 'arquivado');
  return (
    <div style={{background:COLORS.white,border:`1px solid ${COLORS.grayBorder}`,borderRadius:12,overflow:'hidden'}}>
      <table style={{width:'100%',borderCollapse:'collapse',tableLayout:'fixed'}}>
        <thead><tr style={{background:COLORS.grayBg,borderBottom:`1px solid ${COLORS.grayBorder}`}}>
          {['Nome','Estabelecimento','Canal','Status','Próx. ação','Data',''].map((h,i)=>(
            <th key={i} style={{fontSize:10,fontWeight:600,color:COLORS.grayText,textTransform:'uppercase',letterSpacing:'0.05em',padding:'9px 12px',textAlign:'left',width:i===6?50:undefined}}>{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {pipeline.length===0&&<tr><td colSpan={7} style={{textAlign:'center',color:COLORS.grayText,padding:24,fontSize:13}}>Nenhum lead</td></tr>}
          {pipeline.map(l=>{
            const alert = getAlertLevel(l);
            const rowBg = alert==='danger'?'#FFF5F5':alert==='warning'?'#FFFBEB':undefined;
            return <tr key={l.id as number} onClick={()=>onOpen(l)} style={{cursor:'pointer',borderBottom:`1px solid ${COLORS.grayBorder}`,background:rowBg}}>
              <td style={{padding:'10px 12px',fontSize:13,fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                {alert!=='none'&&<AlertBadge level={alert}/>} {l.nome}
              </td>
              <td style={{padding:'10px 12px',fontSize:13,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{l.estabelecimento}</td>
              <td style={{padding:'10px 12px'}}><CanalPill canal={l.origem}/></td>
              <td style={{padding:'10px 12px'}}><StatusPill status={l.status}/></td>
              <td style={{padding:'10px 12px',fontSize:11,color:l.proxima_acao&&new Date(l.proxima_acao)<new Date()?'#EF4444':COLORS.blue}}>{l.proxima_acao?fmtDateTime(l.proxima_acao):'—'}</td>
              <td style={{padding:'10px 12px',fontSize:12,color:COLORS.grayText}}>{fmtDate(l.data)}</td>
              <td style={{padding:'10px 12px'}}><button onClick={e=>{e.stopPropagation();onOpen(l);}} style={{height:24,padding:'0 8px',border:`1px solid ${COLORS.grayBorder}`,borderRadius:6,background:COLORS.white,fontSize:10,cursor:'pointer',color:COLORS.grayText}}>Abrir</button></td>
            </tr>;
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── ARQUIVO ──────────────────────────────────────────────────────────────────
function Arquivo({ leads, onRestore, onOpen }: { leads: Lead[]; onRestore: (id: number) => void; onOpen: (l: Lead) => void }) {
  const archived = leads.filter(l => l.status === 'arquivado');
  return (
    <div>
      <div style={{fontFamily:'Sora,sans-serif',fontSize:16,fontWeight:700,marginBottom:16,color:COLORS.text}}>📦 Arquivo — {archived.length} lead{archived.length!==1?'s':''}</div>
      {archived.length === 0
        ? <div style={{background:COLORS.white,border:`1px solid ${COLORS.grayBorder}`,borderRadius:12,padding:32,textAlign:'center',color:COLORS.grayText,fontSize:13}}>Nenhum lead arquivado</div>
        : (
          <div style={{background:COLORS.white,border:`1px solid ${COLORS.grayBorder}`,borderRadius:12,overflow:'hidden'}}>
            {archived.map((l,i) => (
              <div key={l.id as number} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',borderBottom:i<archived.length-1?`1px solid ${COLORS.grayBorder}`:'none'}}>
                <div style={{flex:1,cursor:'pointer'}} onClick={()=>onOpen(l)}>
                  <div style={{fontSize:13,fontWeight:600}}>{l.nome}</div>
                  <div style={{fontSize:11,color:COLORS.grayText}}>{l.estabelecimento} · {l.tipo}</div>
                  <div style={{fontSize:11,color:COLORS.grayText,marginTop:2}}>Arquivado em {fmtDate(l.atualizado??l.data)}</div>
                </div>
                <CanalPill canal={l.origem}/>
                <button onClick={()=>onRestore(l.id as number)} style={{height:30,padding:'0 12px',border:`1px solid ${COLORS.blue}`,borderRadius:7,background:COLORS.blueLight,fontSize:12,cursor:'pointer',color:COLORS.blue,fontWeight:500,whiteSpace:'nowrap'}}>
                  ↩ Resgatar
                </button>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}

// ─── CRM PAGE ─────────────────────────────────────────────────────────────────
const EMPTY_ADD: AddLeadFormData = { nome:'',whats:'',email:'',estab:'',tipo:'Restaurante',cidade:'',status:'novo',canal:'manual',notas:'',proxima_acao:'',proxima_acao_desc:'' };

export default function CRM() {
  const [authed,setAuthed]             = useState(false);
  const [loginUser,setLoginUser]       = useState('');
  const [loginPass,setLoginPass]       = useState('');
  const [loginErr,setLoginErr]         = useState(false);
  const [leads,setLeads]               = useState<Lead[]>([]);
  const [loading,setLoading]           = useState(false);
  const [notifs,setNotifs]             = useState<Notificacao[]>([]);
  const [page,setPage]                 = useState<'pipeline'|'acoes'|'relatorios'|'arquivo'>('pipeline');
  const [view,setView]                 = useState<'kanban'|'list'>('kanban');
  const [filterStatus,setFilterStatus] = useState('');
  const [filterCanal,setFilterCanal]   = useState('');
  const [filterTipo,setFilterTipo]     = useState('');
  const [search,setSearch]             = useState('');
  const [notifOpen,setNotifOpen]       = useState(false);
  const [toast,setToast]               = useState('');
  const [detailLead,setDetailLead]     = useState<Lead|null>(null);
  const [editStatus,setEditStatus]     = useState('');
  const [editNotes,setEditNotes]       = useState('');
  const [editProxAcao,setEditProxAcao] = useState('');
  const [editProxDesc,setEditProxDesc] = useState('');
  const [addOpen,setAddOpen]           = useState(false);
  const [addForm,setAddForm]           = useState<AddLeadFormData>(EMPTY_ADD);

  const refresh = useCallback(async () => {
    setLoading(true);
    try { const data = await getLeads(); setLeads(data); }
    catch { showToast('Erro ao carregar leads'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { if (authed) { refresh(); setNotifs(getNotifs()); } }, [authed,refresh]);
  useEffect(() => { if (!toast) return; const t = setTimeout(()=>setToast(''),2600); return ()=>clearTimeout(t); }, [toast]);

  function login() {
    const validUser = (import.meta as {env?:{VITE_CRM_USER?:string}}).env?.VITE_CRM_USER ?? 'lucas';
    const validPass = (import.meta as {env?:{VITE_CRM_PASS?:string}}).env?.VITE_CRM_PASS ?? '';
    if (loginUser===validUser && loginPass===validPass) setAuthed(true); else setLoginErr(true);
  }
  function showToast(msg:string){setToast(msg);}
  function addNotifFn(msg:string){pushNotif(msg);setNotifs(getNotifs());}

  const unread = notifs.filter(n=>!n.read).length;
  const novos  = leads.filter(l=>l.status==='novo').length;
  const alertCount = leads.filter(l=>getAlertLevel(l)!=='none').length;

  const filtered = leads.filter(l => {
    const q = search.toLowerCase();
    return (!q||l.nome.toLowerCase().includes(q)||l.estabelecimento.toLowerCase().includes(q))
      && (!filterStatus||l.status===filterStatus)
      && (!filterCanal||l.origem===filterCanal)
      && (!filterTipo||l.tipo===filterTipo);
  });

  function openDetail(l:Lead){setDetailLead(l);setEditStatus(l.status);setEditNotes(l.notas??'');setEditProxAcao(l.proxima_acao??'');setEditProxDesc(l.proxima_acao_desc??'');}

  async function saveLeadDetail(){
    if(!detailLead)return;
    try {
      const updated = await updateLead(detailLead.id as number,{status:editStatus as LeadStatus,notas:editNotes,proxima_acao:editProxAcao||undefined,proxima_acao_desc:editProxDesc||undefined});
      if(editStatus!==detailLead.status) addNotifFn(`${detailLead.nome} movido para "${STATUS_LABEL[editStatus]}"`);
      setLeads(prev=>prev.map(l=>l.id===updated.id?updated:l));
      setDetailLead(null);showToast('Lead salvo');
    } catch {showToast('Erro ao salvar');}
  }

  async function archiveLead(){
    if(!detailLead||!confirm('Arquivar este lead? Ele ficará disponível para resgate depois.'))return;
    try {
      const updated = await updateLead(detailLead.id as number,{status:'arquivado' as LeadStatus});
      setLeads(prev=>prev.map(l=>l.id===detailLead.id?updated:l));
      setDetailLead(null);showToast('Lead arquivado');addNotifFn(`${detailLead.nome} foi arquivado`);
    } catch {showToast('Erro ao arquivar');}
  }

  async function deleteLeadPermanent(){
    if(!detailLead||!confirm(`Excluir "${detailLead.nome}" permanentemente? Esta ação não pode ser desfeita.`))return;
    try {
      await deleteLead(detailLead.id as number);
      setLeads(prev=>prev.filter(l=>l.id!==detailLead.id));
      setDetailLead(null);showToast('Lead excluído');
    } catch {showToast('Erro ao excluir');}
  }

  async function restoreLead(id:number){
    const l = leads.find(x=>x.id===id);
    if(!l)return;
    try {
      const updated = await updateLead(id,{status:'novo' as LeadStatus});
      setLeads(prev=>prev.map(x=>x.id===id?updated:x));
      showToast(`${l.nome} resgatado para Novos`);addNotifFn(`${l.nome} foi resgatado do arquivo`);
    } catch {showToast('Erro ao resgatar');}
  }

  async function advance(id:number){
    const l=leads.find(x=>x.id===id);
    if(!l||!NEXT_STATUS[l.status])return;
    const next=NEXT_STATUS[l.status] as LeadStatus;
    try {
      const updated=await updateLead(id,{status:next});
      setLeads(prev=>prev.map(x=>x.id===id?updated:x));
      addNotifFn(`${l.nome} → "${STATUS_LABEL[next]}"`);showToast(`→ ${STATUS_LABEL[next]}`);
    } catch {showToast('Erro ao avançar');}
  }

  async function addLead(){
    const {nome,whats,estab,tipo,canal,cidade,email,notas,status,proxima_acao,proxima_acao_desc}=addForm;
    if(!nome||!whats||!estab){showToast('Preencha nome, WhatsApp e estabelecimento');return;}
    try {
      const lead=await createLead({nome,whatsapp:whats,email,estabelecimento:estab,tipo,cidade,notas,status:status as LeadStatus,origem:canal as LeadCanal,proxima_acao:proxima_acao||undefined,proxima_acao_desc:proxima_acao_desc||undefined} as Omit<Lead,'id'|'data'>);
      setLeads(prev=>[lead,...prev]);
      addNotifFn(`Novo lead: ${nome} via ${CANAL_LABEL[canal]}`);
      setAddOpen(false);setAddForm(EMPTY_ADD);showToast('Lead adicionado!');
    } catch(err){showToast(err instanceof Error?err.message:'Erro ao adicionar');}
  }

  function exportCSV(){
    const hdr=['Nome','WhatsApp','Email','Estabelecimento','Tipo','Cidade','Canal','Status','Data','Próx. Ação'];
    const rows=leads.map(l=>[l.nome,l.whatsapp,l.email??'',l.estabelecimento,l.tipo,l.cidade??'',CANAL_LABEL[l.origem]??l.origem,STATUS_LABEL[l.status]??l.status,fmtDate(l.data),l.proxima_acao?fmtDateTime(l.proxima_acao):''].map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(','));
    const a=document.createElement('a');
    a.href='data:text/csv;charset=utf-8,\uFEFF'+encodeURIComponent(hdr.join(',')+'\n'+rows.join('\n'));
    a.download=`fanfave_leads_${new Date().toISOString().slice(0,10)}.csv`;a.click();
  }

  const af=(k:keyof AddLeadFormData)=>(v:string)=>setAddForm(f=>({...f,[k]:v}));

  // ── Login ──
  if(!authed) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:COLORS.blue}}>
      <div style={{background:COLORS.white,borderRadius:16,padding:36,width:320,boxShadow:'0 20px 60px rgba(0,0,0,0.2)'}}>
        <div style={{display:'flex',justifyContent:'center',marginBottom:24}}><FanFaveLogo size={32} dark showCrm/></div>
        <h2 style={{fontFamily:'Sora,sans-serif',fontSize:20,fontWeight:700,textAlign:'center',marginBottom:4}}>Bem-vindo de volta</h2>
        <p style={{fontSize:13,color:COLORS.grayText,textAlign:'center',marginBottom:20}}>Acesse o painel de leads</p>
        {loginErr&&<div style={{background:'#FEE2E2',color:'#DC2626',fontSize:12,padding:'9px 12px',borderRadius:8,marginBottom:12}}>Usuário ou senha incorretos.</div>}
        <InputField label="Usuário" value={loginUser} onChange={setLoginUser} placeholder="Usuário"/>
        <div style={{marginBottom:12}}>
          <label style={{display:'block',fontSize:12,fontWeight:500,color:COLORS.grayText,marginBottom:4}}>Senha</label>
          <input type="password" value={loginPass} onChange={e=>setLoginPass(e.target.value)} placeholder="••••••" onKeyDown={e=>e.key==='Enter'&&login()} style={{width:'100%',height:40,padding:'0 12px',border:`1.5px solid ${COLORS.grayBorder}`,borderRadius:8,fontSize:14,fontFamily:'Inter,sans-serif',outline:'none',boxSizing:'border-box'}}/>
        </div>
        <button onClick={login} style={{width:'100%',height:44,background:COLORS.blue,color:'#fff',border:'none',borderRadius:8,fontSize:15,fontWeight:600,fontFamily:'Sora,sans-serif',cursor:'pointer',marginTop:4}}>Entrar →</button>
      </div>
    </div>
  );

  return (
    <div style={{fontFamily:'Inter,sans-serif',color:COLORS.text,background:COLORS.grayBg,minHeight:'100vh',display:'flex',flexDirection:'column'}}>

      {/* TOPBAR */}
      <div style={{height:52,background:COLORS.white,borderBottom:`1px solid ${COLORS.grayBorder}`,display:'flex',alignItems:'center',padding:'0 16px',gap:10,flexShrink:0,position:'sticky',top:0,zIndex:100}}>
        <FanFaveLogo size={24} dark showCrm/>
        <div style={{width:1,height:20,background:COLORS.grayBorder,margin:'0 2px'}}/>
        <span style={{fontSize:13,fontWeight:600,flex:1}}>{page==='pipeline'?'Pipeline':page==='acoes'?'Ações do dia':page==='relatorios'?'Relatórios':'Arquivo'}</span>
        {loading&&<span style={{fontSize:12,color:COLORS.grayText}}>Atualizando...</span>}
        <button onClick={refresh} style={{height:30,padding:'0 12px',border:`1px solid ${COLORS.grayBorder}`,borderRadius:7,background:COLORS.white,fontSize:12,cursor:'pointer'}}>↻</button>
        <button onClick={exportCSV} style={{height:30,padding:'0 12px',border:`1px solid ${COLORS.grayBorder}`,borderRadius:7,background:COLORS.white,fontSize:12,cursor:'pointer'}}>⬇ Exportar</button>
        <div style={{position:'relative'}}>
          <button onClick={()=>{setNotifOpen(o=>!o);const n=getNotifs().map(x=>({...x,read:true}));saveNotifs(n);setNotifs(n);}} style={{width:32,height:32,border:`1px solid ${COLORS.grayBorder}`,borderRadius:7,background:COLORS.white,cursor:'pointer',fontSize:15,display:'flex',alignItems:'center',justifyContent:'center'}}>🔔</button>
          {unread>0&&<div style={{position:'absolute',top:-2,right:-2,width:8,height:8,background:'#EF4444',borderRadius:'50%',border:`2px solid ${COLORS.white}`}}/>}
          {notifOpen&&(
            <div style={{position:'absolute',top:38,right:0,width:280,background:COLORS.white,border:`1px solid ${COLORS.grayBorder}`,borderRadius:12,boxShadow:'0 8px 32px rgba(0,0,0,0.12)',zIndex:200}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 14px',borderBottom:`1px solid ${COLORS.grayBorder}`}}>
                <span style={{fontSize:12,fontWeight:600}}>Notificações</span>
                <button onClick={()=>setNotifOpen(false)} style={{border:'none',background:'none',cursor:'pointer',fontSize:13}}>✕</button>
              </div>
              <div style={{maxHeight:240,overflowY:'auto'}}>
                {notifs.length===0&&<div style={{padding:16,fontSize:12,color:COLORS.grayText,textAlign:'center'}}>Nenhuma notificação</div>}
                {notifs.slice(0,10).map(n=>(
                  <div key={n.id} style={{padding:'10px 14px',borderBottom:`1px solid ${COLORS.grayBorder}`,display:'flex',gap:8}}>
                    <div style={{width:7,height:7,borderRadius:'50%',background:n.read?'transparent':COLORS.blue,border:`1px solid ${n.read?COLORS.grayBorder:COLORS.blue}`,marginTop:4,flexShrink:0}}/>
                    <div><div style={{fontSize:12,lineHeight:1.5}}>{n.msg}</div><div style={{fontSize:10,color:COLORS.grayText,marginTop:2}}>{timeAgo(n.time)}</div></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div style={{width:28,height:28,borderRadius:'50%',background:COLORS.blue,color:'#fff',fontSize:11,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center'}}>L</div>
        <button onClick={()=>setAuthed(false)} style={{height:30,padding:'0 12px',border:'1px solid #FCA5A5',borderRadius:7,background:COLORS.white,fontSize:12,cursor:'pointer',color:'#DC2626'}}>Sair</button>
      </div>

      <div style={{display:'flex',flex:1,overflow:'hidden'}}>
        {/* SIDEBAR */}
        <div style={{width:190,background:COLORS.white,borderRight:`1px solid ${COLORS.grayBorder}`,padding:'10px 8px',overflowY:'auto',flexShrink:0}}>
          {([['📋','Pipeline','pipeline'],['📅','Ações do dia','acoes'],['📊','Relatórios','relatorios'],['📦','Arquivo','arquivo']] as [string,string,string][]).map(([ico,lbl,pg])=>(
            <div key={pg} onClick={()=>setPage(pg as typeof page)} style={{display:'flex',alignItems:'center',gap:8,padding:'7px 10px',borderRadius:7,cursor:'pointer',fontSize:13,marginBottom:1,background:page===pg?COLORS.blueLight:COLORS.white,color:page===pg?COLORS.blue:COLORS.grayText,fontWeight:page===pg?500:400}}>
              <span style={{fontSize:14,width:16}}>{ico}</span>{lbl}
              {pg==='acoes'&&alertCount>0&&<span style={{marginLeft:'auto',background:'#EF4444',color:'#fff',fontSize:9,fontWeight:700,padding:'1px 5px',borderRadius:10}}>{alertCount}</span>}
              {pg==='arquivo'&&leads.filter(l=>l.status==='arquivado').length>0&&<span style={{marginLeft:'auto',background:COLORS.grayBg,color:COLORS.grayText,fontSize:9,fontWeight:600,padding:'1px 5px',borderRadius:10}}>{leads.filter(l=>l.status==='arquivado').length}</span>}
            </div>
          ))}

          {page==='pipeline'&&<>
            <div style={{fontSize:10,fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',color:COLORS.grayText,padding:'12px 10px 4px',marginTop:4}}>Por status</div>
            {([['🔵','Todos',''],['🆕','Novos','novo'],['📞','Em contato','contato'],['📱','Demo','demo'],['🤝','Negociação','negociacao'],['✅','Fechados','fechado']] as [string,string,string][]).map(([ico,lbl,s])=>(
              <div key={s} onClick={()=>{setFilterStatus(s);setFilterCanal('');}} style={{display:'flex',alignItems:'center',gap:8,padding:'7px 10px',borderRadius:7,cursor:'pointer',fontSize:12,marginBottom:1,background:filterStatus===s&&!filterCanal?COLORS.blueLight:COLORS.white,color:filterStatus===s&&!filterCanal?COLORS.blue:COLORS.grayText}}>
                <span style={{width:16}}>{ico}</span>{lbl}
                {s==='novo'&&novos>0&&<span style={{marginLeft:'auto',background:'#EF4444',color:'#fff',fontSize:9,fontWeight:700,padding:'1px 5px',borderRadius:10}}>{novos}</span>}
              </div>
            ))}
            <div style={{fontSize:10,fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',color:COLORS.grayText,padding:'12px 10px 4px'}}>Por canal</div>
            {([['📡','Todos',''],['📸','Instagram','instagram'],['🌐','Landing','landing'],['💬','WhatsApp','whatsapp'],['⭐','Indicação','indicacao'],['✏️','Manual','manual']] as [string,string,string][]).map(([ico,lbl,c])=>(
              <div key={c} onClick={()=>{setFilterCanal(c);setFilterStatus('');}} style={{display:'flex',alignItems:'center',gap:8,padding:'7px 10px',borderRadius:7,cursor:'pointer',fontSize:12,marginBottom:1,background:filterCanal===c&&!filterStatus?COLORS.blueLight:COLORS.white,color:filterCanal===c&&!filterStatus?COLORS.blue:COLORS.grayText}}>
                <span style={{width:16}}>{ico}</span>{lbl}
              </div>
            ))}
          </>}
        </div>

        {/* MAIN */}
        <div style={{flex:1,overflowY:'auto',padding:16,display:'flex',flexDirection:'column',gap:14}}>

          {page==='pipeline'&&<>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>
              <StatCard val={leads.filter(l=>l.status!=='arquivado').length} lbl="Total de leads"/>
              <StatCard val={novos} lbl="Novos" delta={novos>0?`${novos} aguardando`:''}/>
              <StatCard val={leads.filter(l=>l.status==='demo').length} lbl="Demos"/>
              <StatCard val={leads.filter(l=>l.status==='fechado').length} lbl="Fechados" delta={leads.filter(l=>l.status!=='arquivado').length>0?`${Math.round(leads.filter(l=>l.status==='fechado').length/leads.filter(l=>l.status!=='arquivado').length*100)}% conversão`:''}/>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{position:'relative',flex:1,maxWidth:280}}>
                <span style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:COLORS.grayText,fontSize:14,pointerEvents:'none'}}>🔍</span>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..." style={{width:'100%',height:34,padding:'0 12px 0 32px',border:`1px solid ${COLORS.grayBorder}`,borderRadius:7,fontSize:13,fontFamily:'Inter,sans-serif',outline:'none',boxSizing:'border-box'}}/>
              </div>
              <select value={filterTipo} onChange={e=>setFilterTipo(e.target.value)} style={{height:34,padding:'0 10px',border:`1px solid ${COLORS.grayBorder}`,borderRadius:7,fontSize:12,fontFamily:'Inter,sans-serif',outline:'none',background:COLORS.white,cursor:'pointer'}}>
                <option value="">Todos os tipos</option>{SEGMENTS.map(s=><option key={s}>{s}</option>)}
              </select>
              <div style={{display:'flex',border:`1px solid ${COLORS.grayBorder}`,borderRadius:7,overflow:'hidden',marginLeft:'auto'}}>
                {(['kanban','list'] as const).map(v=><button key={v} onClick={()=>setView(v)} style={{padding:'5px 12px',fontSize:12,fontWeight:500,cursor:'pointer',border:'none',background:view===v?COLORS.blueLight:COLORS.white,color:view===v?COLORS.blue:COLORS.grayText}}>{v==='kanban'?'Kanban':'Lista'}</button>)}
              </div>
              <button onClick={()=>setAddOpen(true)} style={{height:34,padding:'0 14px',background:COLORS.blue,color:'#fff',border:'none',borderRadius:7,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'Inter,sans-serif',whiteSpace:'nowrap'}}>+ Novo lead</button>
            </div>
            {view==='kanban'?<KanbanView leads={filtered} onOpen={openDetail} onAdvance={advance} onArchive={id=>{ const l=leads.find(x=>x.id===id); if(l){setDetailLead(l);} }} />:<ListView leads={filtered} onOpen={openDetail}/>}
          </>}

          {page==='acoes'&&<AcoesHoje leads={leads} onOpen={openDetail}/>}
          {page==='relatorios'&&<Reports leads={leads}/>}
          {page==='arquivo'&&<Arquivo leads={leads} onRestore={restoreLead} onOpen={openDetail}/>}
        </div>
      </div>

      {/* DETAIL MODAL */}
      <Modal open={!!detailLead} onClose={()=>setDetailLead(null)} title={detailLead?.nome??''}
        footer={<>
          <Btn variant="ghost" onClick={()=>setDetailLead(null)}>Cancelar</Btn>
          <Btn variant="danger" onClick={deleteLeadPermanent}>Excluir</Btn>
          <Btn variant="ghost" onClick={archiveLead} style={{borderColor:'#F59E0B',color:'#92400E'}}>📦 Arquivar</Btn>
          <Btn variant="primary" onClick={saveLeadDetail}>Salvar</Btn>
        </>}>
        {detailLead&&(
          <div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              {([['Estabelecimento',detailLead.estabelecimento],['Tipo',detailLead.tipo],['WhatsApp',detailLead.whatsapp],['E-mail',detailLead.email],['Cidade',detailLead.cidade],['Data',fmtDate(detailLead.data)]] as [string,string|undefined][]).map(([lbl,val])=>(
                <div key={lbl} style={{marginBottom:12}}><div style={{fontSize:11,fontWeight:600,letterSpacing:'0.05em',textTransform:'uppercase',color:COLORS.grayText,marginBottom:4}}>{lbl}</div><div style={{fontSize:13}}>{val??'—'}</div></div>
              ))}
              <div style={{marginBottom:12}}><div style={{fontSize:11,fontWeight:600,letterSpacing:'0.05em',textTransform:'uppercase',color:COLORS.grayText,marginBottom:4}}>Canal</div><CanalPill canal={detailLead.origem}/></div>
            </div>
            <div style={{height:1,background:COLORS.grayBorder,margin:'12px 0'}}/>
            <div style={{fontSize:11,fontWeight:600,letterSpacing:'0.05em',textTransform:'uppercase',color:COLORS.grayText,marginBottom:6}}>Status</div>
            <StatusSelector current={editStatus} onChange={setEditStatus}/>

            {/* PRÓXIMA AÇÃO */}
            <div style={{height:1,background:COLORS.grayBorder,margin:'14px 0'}}/>
            <div style={{fontSize:11,fontWeight:600,letterSpacing:'0.05em',textTransform:'uppercase',color:COLORS.blue,marginBottom:10}}>📅 Próxima ação</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
              <div>
                <label style={{display:'block',fontSize:12,fontWeight:500,color:COLORS.grayText,marginBottom:4}}>Data e hora</label>
                <input type="datetime-local" value={editProxAcao} onChange={e=>setEditProxAcao(e.target.value)} style={{width:'100%',height:38,padding:'0 10px',border:`1.5px solid ${COLORS.grayBorder}`,borderRadius:8,fontSize:13,fontFamily:'Inter,sans-serif',outline:'none',boxSizing:'border-box'}}/>
              </div>
              <div>
                <label style={{display:'block',fontSize:12,fontWeight:500,color:COLORS.grayText,marginBottom:4}}>Descrição</label>
                <input value={editProxDesc} onChange={e=>setEditProxDesc(e.target.value)} placeholder="Ex: Apresentação do sistema" style={{width:'100%',height:38,padding:'0 10px',border:`1.5px solid ${COLORS.grayBorder}`,borderRadius:8,fontSize:13,fontFamily:'Inter,sans-serif',outline:'none',boxSizing:'border-box'}}/>
              </div>
            </div>
            {editProxAcao&&<button onClick={()=>{setEditProxAcao('');setEditProxDesc('');}} style={{fontSize:11,color:'#EF4444',background:'none',border:'none',cursor:'pointer',marginBottom:10,padding:0}}>✕ Remover próxima ação</button>}

            <div style={{height:1,background:COLORS.grayBorder,margin:'4px 0 14px'}}/>
            <div style={{marginBottom:10}}>
              <div style={{fontSize:11,fontWeight:600,letterSpacing:'0.05em',textTransform:'uppercase',color:COLORS.grayText,marginBottom:6}}>Anotações</div>
              <textarea value={editNotes} onChange={e=>setEditNotes(e.target.value)} placeholder="Próximos passos, observações..." style={{width:'100%',minHeight:80,padding:'9px 12px',border:`1.5px solid ${COLORS.grayBorder}`,borderRadius:8,fontSize:13,fontFamily:'Inter,sans-serif',resize:'vertical',outline:'none',lineHeight:1.55,boxSizing:'border-box'}}/>
            </div>
            <a href={`https://wa.me/55${(detailLead.whatsapp??'').replace(/\D/g,'')}`} target="_blank" rel="noreferrer" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:7,padding:9,background:'#25D366',color:'#fff',borderRadius:8,fontSize:13,fontWeight:600,textDecoration:'none'}}>💬 Abrir no WhatsApp</a>
          </div>
        )}
      </Modal>

      {/* ADD MODAL */}
      <Modal open={addOpen} onClose={()=>setAddOpen(false)} title="Novo lead"
        footer={<><Btn variant="ghost" onClick={()=>setAddOpen(false)}>Cancelar</Btn><Btn variant="primary" onClick={addLead}>Adicionar lead</Btn></>}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 12px'}}>
          <InputField label="Nome *" value={addForm.nome} onChange={af('nome')} placeholder="Nome do contato"/>
          <InputField label="WhatsApp *" value={addForm.whats} onChange={af('whats')} placeholder="(44) 99999-9999" type="tel" inputMode="tel"/>
          <InputField label="E-mail" value={addForm.email} onChange={af('email')} placeholder="email@exemplo.com"/>
          <InputField label="Estabelecimento *" value={addForm.estab} onChange={af('estab')} placeholder="Nome do negócio"/>
          <SelectField label="Tipo" value={addForm.tipo} onChange={af('tipo')} options={[...SEGMENTS]}/>
          <InputField label="Cidade" value={addForm.cidade} onChange={af('cidade')} placeholder="Cidade"/>
        </div>
        <div style={{fontSize:11,fontWeight:600,letterSpacing:'0.05em',textTransform:'uppercase',color:COLORS.grayText,marginBottom:6,marginTop:4}}>Status inicial</div>
        <StatusSelector current={addForm.status} onChange={v=>setAddForm(f=>({...f,status:v as LeadStatus}))}/>
        <SelectField label="Canal de origem" value={addForm.canal} onChange={v=>setAddForm(f=>({...f,canal:v as LeadCanal}))} options={[{v:'manual',l:'Manual'},{v:'instagram',l:'Instagram Ads'},{v:'whatsapp',l:'WhatsApp'},{v:'indicacao',l:'Indicação'},{v:'landing',l:'Landing page'}]}/>

        <div style={{fontSize:11,fontWeight:600,letterSpacing:'0.05em',textTransform:'uppercase',color:COLORS.blue,marginBottom:8,marginTop:12}}>📅 Próxima ação</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 12px'}}>
          <div style={{marginBottom:12}}>
            <label style={{display:'block',fontSize:12,fontWeight:500,color:COLORS.grayText,marginBottom:4}}>Data e hora</label>
            <input type="datetime-local" value={addForm.proxima_acao} onChange={e=>setAddForm(f=>({...f,proxima_acao:e.target.value}))} style={{width:'100%',height:40,padding:'0 10px',border:`1.5px solid ${COLORS.grayBorder}`,borderRadius:8,fontSize:13,fontFamily:'Inter,sans-serif',outline:'none',boxSizing:'border-box'}}/>
          </div>
          <InputField label="Descrição" value={addForm.proxima_acao_desc} onChange={af('proxima_acao_desc')} placeholder="Ex: Demonstração"/>
        </div>
        <div style={{marginTop:4}}>
          <label style={{display:'block',fontSize:12,fontWeight:500,color:COLORS.grayText,marginBottom:4}}>Anotações</label>
          <textarea value={addForm.notas} onChange={e=>setAddForm(f=>({...f,notas:e.target.value}))} placeholder="Contexto, próximos passos..." style={{width:'100%',minHeight:70,padding:'9px 12px',border:`1.5px solid ${COLORS.grayBorder}`,borderRadius:8,fontSize:13,fontFamily:'Inter,sans-serif',resize:'vertical',outline:'none',boxSizing:'border-box'}}/>
        </div>
      </Modal>

      <Toast msg={toast}/>
    </div>
  );
}
