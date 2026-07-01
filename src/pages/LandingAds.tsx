import React, { useState, useRef, useEffect } from 'react';
import { saveLandingLead } from '../lib/storage';
import { COLORS, SEGMENTS } from '../lib/constants';
import type { LeadFormData } from '../types';

// ─── Logo original Fan Fave (SVG exato) ──────────────────────────────────────
function FanFaveLogoFull({ height = 22 }: { height?: number }) {
  return (
    <svg height={height} viewBox="0 0 123 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: 'auto' }}>
      <g clipPath="url(#lclip)">
        <path fillRule="evenodd" clipRule="evenodd" d="M9.27252 8.49635H5.94951V19.6367H2.11227V8.49635H0V6.6472L2.11227 5.61881V4.59043C2.11227 3.38362 2.31732 2.45904 2.70462 1.81671C3.11796 1.14842 3.68427 0.687753 4.42959 0.405514C5.1749 0.123276 6.07645 -0.0064888 7.08213 -0.0064888C7.82745 -0.0064888 8.52395 0.0454171 9.14233 0.171938C9.73468 0.301703 10.2229 0.428223 10.6102 0.583941L9.63053 3.38037C9.34737 3.30251 9.01215 3.2279 8.67692 3.15004C8.34169 3.07218 7.9316 3.02028 7.49222 3.02028C6.95195 3.02028 6.56464 3.17275 6.30753 3.50689C6.07644 3.84104 5.94626 4.2498 5.94626 4.73966V5.61233H9.26926V8.48662L9.27252 8.49635Z" fill="#0040D5"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M17.2302 5.33982C19.1113 5.33982 20.5532 5.75183 21.5556 6.57259C22.5613 7.3674 23.0755 8.62612 23.0755 10.2936V19.6367H20.3969L19.6516 17.7356H19.5475C19.1602 18.2222 18.7501 18.6342 18.3107 18.9684C17.8974 19.3025 17.4352 19.5328 16.8949 19.6626C16.3547 19.8151 15.6842 19.8929 14.8868 19.8929C14.0894 19.8929 13.3148 19.7405 12.6704 19.4063C11.9999 19.0981 11.4857 18.6115 11.0984 17.9692C10.7111 17.3009 10.5321 16.4542 10.5321 15.455C10.5321 13.9659 11.0463 12.8629 12.1041 12.1427C13.1586 11.4485 14.7306 11.0657 16.8168 10.9878L19.2643 10.91V10.2936C19.2643 9.55069 19.0593 9.00892 18.672 8.67478C18.2847 8.34063 17.7704 8.16221 17.0739 8.16221C16.3774 8.16221 15.7102 8.26602 15.0658 8.44445C14.4214 8.64882 13.7509 8.90511 13.1098 9.18735L11.847 6.5953C12.5923 6.20925 13.445 5.90105 14.3465 5.67072C15.2741 5.44039 16.2277 5.33658 17.2302 5.33658V5.33982ZM17.7704 13.1938C16.5337 13.2198 15.6842 13.4501 15.196 13.8621C14.7078 14.2741 14.4735 14.8127 14.4735 15.4809C14.4735 16.0714 14.6525 16.4834 14.9877 16.7137C15.3229 16.97 15.7851 17.0998 16.3254 17.0998C17.1488 17.0998 17.8453 16.8694 18.4116 16.3796C18.9779 15.8929 19.2611 15.1987 19.2611 14.3001V13.1452L17.7672 13.1971L17.7704 13.1938Z" fill="#0040D5"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M35.0006 5.36578C36.5205 5.36578 37.7312 5.77778 38.6328 6.59854C39.5343 7.39335 39.9965 8.70397 39.9965 10.5012V19.6399H36.1592V11.4517C36.1592 10.4493 35.9802 9.68046 35.619 9.19384C35.2577 8.68127 34.6914 8.42498 33.894 8.42498C32.7353 8.42498 31.9379 8.83698 31.4986 9.63179C31.0592 10.4266 30.8541 11.5556 30.8541 13.0446V19.6431H27.0169V5.62206H29.9526L30.4668 7.4193H30.6719C30.9811 6.93269 31.3684 6.54664 31.8045 6.2644C32.2439 5.95621 32.7581 5.72587 33.2984 5.59611C33.8387 5.44363 34.405 5.36578 34.9973 5.36578H35.0006Z" fill="#0040D5"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M78.4991 8.49635H75.1761V19.6367H71.3388V8.49635H69.2266V6.6472L71.3388 5.61881V4.59043C71.3388 3.38362 71.5439 2.45904 71.9312 1.81671C72.3445 1.14842 72.9108 0.687753 73.6561 0.405514C74.4015 0.123276 75.303 -0.0064888 76.3087 -0.0064888C77.054 -0.0064888 77.7505 0.0454171 78.3689 0.171938C78.9612 0.301703 79.4494 0.428223 79.8367 0.583941L78.8571 3.38037C78.5739 3.30251 78.2387 3.2279 77.9035 3.15004C77.5682 3.07218 77.1582 3.02028 76.7188 3.02028C76.1785 3.02028 75.7912 3.17275 75.5341 3.50689C75.303 3.84104 75.1728 4.2498 75.1728 4.73966V5.61233H78.4958V8.48662L78.4991 8.49635Z" fill="#0040D5"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M86.4567 5.33982C88.3379 5.33982 89.7797 5.75183 90.7821 6.57259C91.7878 7.3674 92.3021 8.62612 92.3021 10.2936V19.6367H89.6235L88.8782 17.7356H88.774C88.3867 18.2222 87.9766 18.6342 87.5372 18.9684C87.1239 19.3025 86.6617 19.5328 86.1215 19.6626C85.5812 19.8151 84.9107 19.8929 84.1134 19.8929C83.316 19.8929 82.5414 19.7405 81.8969 19.4063C81.2265 19.0981 80.7122 18.6115 80.3249 17.9692C79.9376 17.3009 79.7586 16.4542 79.7586 15.455C79.7586 13.9659 80.2729 12.8629 81.3306 12.1427C82.3851 11.4485 83.9571 11.0657 86.0434 10.9878L88.4909 10.91V10.2936C88.4909 9.55069 88.2858 9.00892 87.8985 8.67478C87.5112 8.34063 86.997 8.16221 86.3005 8.16221C85.604 8.16221 84.9368 8.26602 84.2924 8.44445C83.6479 8.64882 82.9775 8.90511 82.3363 9.18735L81.0735 6.5953C81.8188 6.20925 82.6715 5.90105 83.5731 5.67072C84.5007 5.44039 85.4543 5.33658 86.4567 5.33658V5.33982ZM86.997 13.1938C85.7602 13.2198 84.9107 13.4501 84.4226 13.8621C83.9344 14.2741 83.7 14.8127 83.7 15.4809C83.7 16.0714 83.879 16.4834 84.2142 16.7137C84.5495 16.97 85.0116 17.0998 85.5519 17.0998C86.3753 17.0998 87.0718 16.8694 87.6381 16.3796C88.2045 15.8929 88.4876 15.1987 88.4876 14.3001V13.1452L86.9937 13.1971L86.997 13.1938Z" fill="#0040D5"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M99.5892 19.6367L94.2321 5.62206H98.2483L100.953 13.6058C101.057 13.914 101.132 14.2482 101.21 14.5823C101.288 14.9165 101.363 15.2506 101.415 15.5848C101.441 15.9189 101.467 16.2011 101.493 16.4834H101.597C101.623 16.2011 101.649 15.8929 101.702 15.5588C101.754 15.2247 101.806 14.8905 101.881 14.5564C101.959 14.2222 102.06 13.914 102.164 13.6058L104.868 5.62206H108.885L103.527 19.6367H99.586H99.5892Z" fill="#0040D5"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M116.689 5.36578C118.004 5.36578 119.111 5.62206 120.038 6.10868C120.992 6.5953 121.711 7.31549 122.229 8.26602C122.743 9.21655 123 10.3715 123 11.7307V13.5799H113.936C113.962 14.6569 114.297 15.5036 114.889 16.12C115.508 16.7364 116.357 17.0446 117.438 17.0446C118.339 17.0446 119.163 16.9408 119.911 16.7624C120.657 16.5839 121.405 16.3244 122.203 15.9416V18.8938C121.506 19.2279 120.787 19.4842 120.012 19.6367C119.267 19.8151 118.339 19.8929 117.256 19.8929C115.84 19.8929 114.603 19.6367 113.522 19.0981C112.442 18.5856 111.592 17.7875 110.974 16.7364C110.356 15.6853 110.046 14.3487 110.046 12.7332C110.046 11.1176 110.33 9.72912 110.87 8.65207C111.436 7.54907 112.208 6.72831 113.213 6.18654C114.219 5.64801 115.378 5.36578 116.689 5.36578ZM116.715 8.08759C115.97 8.08759 115.352 8.31792 114.86 8.80779C114.369 9.29765 114.089 10.0406 114.011 11.0397H119.394C119.394 10.4753 119.29 9.96269 119.085 9.52474C118.906 9.08678 118.596 8.72993 118.209 8.47364C117.822 8.21736 117.308 8.08759 116.715 8.08759Z" fill="#0040D5"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M51.5049 7.82157L52.911 3.48094C52.9663 3.31225 53.0867 3.18897 53.2397 3.12733L48.5758 0.444444C48.2275 0.243309 47.8272 0.243309 47.4789 0.444444C47.1307 0.645579 46.9289 0.989456 46.9289 1.39173V8.20438L50.9647 8.21087C51.2153 8.21087 51.4268 8.05839 51.5017 7.82157H51.5049Z" fill="#0040D5"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M54.0143 3.57502L55.391 7.82157C55.4691 8.05839 55.6807 8.21087 55.928 8.21087L60.5041 8.20113C60.7547 8.20113 60.9662 8.35361 61.0411 8.59043C61.1192 8.82725 61.0378 9.0738 60.836 9.21979L57.129 11.8929C56.9272 12.0389 56.8458 12.2887 56.9239 12.5223L57.6204 14.6407L63.7913 11.0884C64.1395 10.8873 64.338 10.5434 64.338 10.1411C64.338 9.73885 64.1395 9.39497 63.7913 9.19383L56.1851 4.81752L54.0175 3.56853L54.0143 3.57502Z" fill="#55C7D9"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M53.116 14.8029L49.4187 17.4923C49.2169 17.6383 48.9566 17.6383 48.7548 17.4923C48.553 17.3463 48.4716 17.0965 48.5497 16.8629L49.972 12.5255C50.0501 12.2887 49.9687 12.0422 49.767 11.8962L46.9322 9.85239V18.9002C46.9322 19.3025 47.1307 19.6464 47.4822 19.8475C47.8304 20.0487 48.2308 20.0487 48.579 19.8475L55.3552 15.9481L53.78 14.8029C53.5782 14.6569 53.3145 14.6569 53.116 14.8029Z" fill="#FEBD03"/>
      </g>
      <defs>
        <clipPath id="lclip">
          <rect width="123" height="20" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({ label, error, children }: { label: string; error?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 11 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: error ? '#EF4444' : COLORS.muted, marginBottom: 4 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', height: 46, padding: '0 14px',
  border: `1.5px solid ${COLORS.border}`, borderRadius: 10,
  fontSize: 15, color: COLORS.text, fontFamily: 'Inter, sans-serif',
  background: COLORS.white, outline: 'none', WebkitAppearance: 'none', boxSizing: 'border-box',
};

// ─── Success ──────────────────────────────────────────────────────────────────
function SuccessView({ nome }: { nome: string }) {
  const first = nome.split(' ')[0];
  return (
    <div style={{ textAlign: 'center', padding: '12px 0 6px' }}>
      <div style={{ width: 52, height: 52, borderRadius: '50%', background: COLORS.blueLight, color: COLORS.blue, fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>✓</div>
      <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 19, fontWeight: 700, marginBottom: 7 }}>Recebemos, {first}!</div>
      <p style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.6, marginBottom: 16 }}>Nossa equipe entra em contato hoje pelo WhatsApp.</p>
      <div style={{ background: COLORS.blueLight, borderRadius: 10, padding: '12px 16px', textAlign: 'left', marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.blue, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>O que acontece agora</div>
        {([['Hoje', 'nossa equipe te chama no WhatsApp'], ['Em até 2 dias', 'seu programa de pontos está ativo'], ['A partir daí', 'seus clientes pontuam e voltam sempre']] as [string, string][]).map(([b, r], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: i < 2 ? 8 : 0 }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: COLORS.blue, color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
            <div style={{ fontSize: 12, lineHeight: 1.5 }}><strong style={{ fontWeight: 600 }}>{b}:</strong> {r}</div>
          </div>
        ))}
      </div>
      <a href={`https://wa.me/5538999999999?text=Oi%2C+sou+${encodeURIComponent(nome)}+e+acabei+de+preencher+o+formulário!`} target="_blank" rel="noreferrer"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '11px 20px', background: '#25D366', color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
        💬 Falar agora no WhatsApp
      </a>
    </div>
  );
}

// ─── Lead Form ────────────────────────────────────────────────────────────────
function LeadForm({ onSuccess }: { onSuccess: (nome: string) => void }) {
  const [form, setForm] = useState<LeadFormData>({ nome: '', estab: '', whats: '', seg: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, boolean>>>({});

  const set = (k: keyof LeadFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!form.nome) errs.nome = true;
    if (!form.estab) errs.estab = true;
    if (!form.whats) errs.whats = true;
    if (!form.seg) errs.seg = true;
    setErrors(errs);
    if (Object.keys(errs).length) return;
    try {
      await saveLandingLead({ nome: form.nome, estabelecimento: form.estab, whatsapp: form.whats, tipo: form.seg });
    } catch { /* continua mesmo se falhar */ }
    onSuccess(form.nome);
  };

  const border = (k: keyof LeadFormData) => errors[k] ? '#EF4444' : COLORS.border;

  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.blue, textAlign: 'center', marginBottom: 3, letterSpacing: '0.03em', textTransform: 'uppercase' }}>Fale com a gente</div>
      <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 17, fontWeight: 700, textAlign: 'center', marginBottom: 18, lineHeight: 1.3 }}>Ativamos seu programa em até 2 dias</div>
      <form onSubmit={submit}>
        <Field label="Seu nome" error={errors.nome}><input style={{ ...inputStyle, borderColor: border('nome') }} value={form.nome} onChange={set('nome')} placeholder="Como você se chama?" autoComplete="name" /></Field>
        <Field label="Estabelecimento" error={errors.estab}><input style={{ ...inputStyle, borderColor: border('estab') }} value={form.estab} onChange={set('estab')} placeholder="Nome do seu negócio" /></Field>
        <Field label="WhatsApp" error={errors.whats}><input style={{ ...inputStyle, borderColor: border('whats') }} value={form.whats} onChange={set('whats')} placeholder="(44) 99999-9999" type="tel" inputMode="tel" autoComplete="tel" /></Field>
        <Field label="Segmento" error={errors.seg}>
          <select style={{ ...inputStyle, cursor: 'pointer', borderColor: border('seg'), backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235A6272' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }} value={form.seg} onChange={set('seg')}>
            <option value="">Selecione...</option>
            {SEGMENTS.map(s => <option key={s}>{s}</option>)}
          </select>
        </Field>
        {Object.keys(errors).length > 0 && <p style={{ fontSize: 12, color: '#EF4444', margin: '4px 0 8px' }}>Preencha todos os campos.</p>}
        <button type="submit" style={{ width: '100%', height: 50, background: COLORS.blue, color: '#fff', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 700, fontFamily: 'Sora, sans-serif', cursor: 'pointer', marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, letterSpacing: '-0.01em' }}>
          Quero ver funcionando →
        </button>
      </form>
      <p style={{ fontSize: 11, color: COLORS.muted, textAlign: 'center', marginTop: 9, lineHeight: 1.5 }}>🔒 Sem spam. Retornamos em até 1 hora pelo WhatsApp.</p>
    </div>
  );
}

// ─── Steps ────────────────────────────────────────────────────────────────────
const STEPS = [
  { n: 1, title: 'Você cadastra o estabelecimento', desc: 'Nossa equipe configura tudo junto com você e treina o time do caixa. Em até 2 dias seu programa está pronto.', chip: null },
  { n: 2, title: 'O cliente pontua pelo número do celular', desc: 'No pagamento, o atendente digita o número do cliente no sistema. Pontos registrados na hora — sem QR code, sem app.', chip: '📱 Só o número do celular' },
  { n: 3, title: 'O cliente volta para resgatar', desc: 'Pontos acumulados viram recompensas que você define — desconto, produto grátis, brinde.', chip: null },
  { n: 4, title: 'Você tem tudo sob controle', desc: 'Painel completo com histórico de clientes, quem está sumindo, quais recompensas são mais resgatadas e muito mais.', chip: '📊 Dados em tempo real' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingAds() {
  const [successTop, setSuccessTop]       = useState(false);
  const [successBottom, setSuccessBottom] = useState(false);
  const [successName, setSuccessName]     = useState('');
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = document.getElementById('sticky-bar');
    if (!formRef.current || !bar) return;
    const obs = new IntersectionObserver(([e]) => {
      bar.style.opacity = e.isIntersecting ? '0' : '1';
      bar.style.pointerEvents = e.isIntersecting ? 'none' : 'auto';
    }, { threshold: 0.3 });
    obs.observe(formRef.current);
    return () => obs.disconnect();
  }, []);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => (document.querySelector('#hero-form input') as HTMLInputElement)?.focus(), 500);
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: COLORS.text, background: COLORS.white, minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: COLORS.white, borderBottom: `1px solid ${COLORS.border}`, padding: '0 20px', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <a href="#"><FanFaveLogoFull height={22} /></a>
      </nav>

      {/* HERO */}
      <section style={{ background: COLORS.blue, padding: '44px 20px 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,255,255,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.11)', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.88)', fontSize: 12, fontWeight: 500, padding: '5px 13px', borderRadius: 20, marginBottom: 18 }}>
          Food service · <span style={{ color: COLORS.amber, fontWeight: 600 }}>Demonstração gratuita</span>
        </div>

        <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(30px,8vw,46px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', color: '#fff', marginBottom: 14 }}>
          Fidelidade não é sorte.<br />
          <em style={{ fontStyle: 'normal', color: COLORS.amber }}>É sistema.</em>
        </h1>

        <p style={{ fontSize: 15, lineHeight: 1.65, color: 'rgba(255,255,255,0.7)', maxWidth: 440, margin: '0 auto 28px' }}>
          Programa de pontos digital para bares, restaurantes, cafeterias e todo setor alimentício. Seu cliente pontua pelo celular — sem app, sem QR code.
        </p>

        <div style={{ maxWidth: 400, margin: '0 auto', position: 'relative', zIndex: 2 }} ref={formRef}>
          <div id="hero-form" style={{ background: COLORS.white, borderRadius: '14px 14px 0 0', padding: '26px 22px 30px', boxShadow: '0 -6px 40px rgba(0,0,0,0.18)' }}>
            {successTop ? <SuccessView nome={successName} /> : <LeadForm onSuccess={n => { setSuccessName(n); setSuccessTop(true); }} />}
          </div>
        </div>
      </section>

      {/* NUMBERS */}
      <section style={{ padding: '32px 20px', background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ maxWidth: 400, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {([['5x', 'mais barato reter do que conquistar um cliente novo'], ['67%', 'mais gasto por visita de clientes fiéis vs novos'], ['3x', 'mais frequência de visita com programa de fidelidade']] as [string, string][]).map(([val, lbl]) => (
            <div key={lbl} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 24, fontWeight: 800, color: COLORS.blue, lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4, lineHeight: 1.4 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* STEPS */}
      <section style={{ padding: '40px 20px', background: COLORS.white }}>
        <div style={{ maxWidth: 400, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.blue, marginBottom: 7, textAlign: 'center' }}>Como funciona</div>
          <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 21, fontWeight: 700, textAlign: 'center', lineHeight: 1.25, marginBottom: 26, color: COLORS.text }}>
            Quatro passos.<br />Seu negócio fidelizando.
          </h2>
          {STEPS.map((s, i) => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '15px 0', borderBottom: i < 3 ? `1px solid ${COLORS.border}` : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: COLORS.blue, color: '#fff', fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.n}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.55 }}>{s.desc}</div>
                {s.chip && <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 10, background: COLORS.blueLight, color: COLORS.blue, marginTop: 5 }}>{s.chip}</div>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section style={{ padding: '36px 20px', background: COLORS.blue }}>
        <div style={{ maxWidth: 400, margin: '0 auto' }}>
          <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 14, padding: 22 }}>
            <div style={{ color: COLORS.amber, fontSize: 15, marginBottom: 11, letterSpacing: 3 }}>★★★★★</div>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.86)', fontStyle: 'italic', marginBottom: 16 }}>
              "Antes o cliente entrava, comia bem, pagava e sumia. Com o Fan Fave consigo ver quem está sumindo e o movimento melhorou muito nos dias mais fracos."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: COLORS.amber, color: '#7A4500', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>★</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Parceiro Fan Fave</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>Restaurante · Montes Claros</div>
              </div>
            </div>
            <div style={{ marginTop: 18, background: 'rgba(245,166,35,0.14)', border: '1px solid rgba(245,166,35,0.28)', borderRadius: 10, padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 24, fontWeight: 800, color: COLORS.amber, flexShrink: 0, lineHeight: 1 }}>+40%</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.72)', lineHeight: 1.5 }}>de retorno de clientes no primeiro mês usando o Fan Fave</div>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM FORM */}
      <section style={{ padding: '36px 20px 52px', background: COLORS.white }}>
        <div style={{ maxWidth: 400, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 20, fontWeight: 700, textAlign: 'center', marginBottom: 18, lineHeight: 1.3 }}>
            Ativa o <em style={{ fontStyle: 'normal', color: COLORS.blue }}>Fan Fave</em><br />no seu negócio.
          </h2>
          {successBottom
            ? <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>🎉</div>
                <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Recebemos!</div>
                <p style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.65 }}>Nossa equipe entra em contato hoje pelo WhatsApp.<br />Em até 2 dias seu programa já está ativo.</p>
              </div>
            : <LeadForm onSuccess={n => { setSuccessName(n); setSuccessBottom(true); }} />
          }
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: COLORS.text, padding: '18px 20px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
          © 2026 Fan Fave · <a href="https://www.fanfave.com.br" style={{ color: 'rgba(255,255,255,0.35)' }}>fanfave.com.br</a> · Plataforma de fidelização para food service
        </p>
      </footer>

      {/* STICKY BAR */}
      <div id="sticky-bar" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40, background: COLORS.white, borderTop: `1px solid ${COLORS.border}`, padding: '12px 20px', boxShadow: '0 -4px 20px rgba(0,0,0,0.08)', display: 'none' }}>
        <button onClick={scrollToForm} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', height: 46, background: COLORS.blue, color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, fontFamily: 'Sora, sans-serif', cursor: 'pointer' }}>
          Quero ver funcionando →
        </button>
      </div>

    </div>
  );
}
