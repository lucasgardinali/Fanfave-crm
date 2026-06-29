
import React, { useState, useRef, useEffect } from 'react';
import { FanFaveLogo } from '../components/ui';
import { saveLandingLead } from '../lib/storage';
import { COLORS, SEGMENTS } from '../lib/constants';
import type { LeadFormData } from '../types';

// ─── Sub-components ──────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: 46,
  padding: '0 14px',
  border: `1.5px solid ${COLORS.border}`,
  borderRadius: 10,
  fontSize: 15,
  color: COLORS.text,
  fontFamily: 'Inter, sans-serif',
  background: COLORS.white,
  outline: 'none',
  WebkitAppearance: 'none',
  boxSizing: 'border-box',
};

interface FieldProps {
  label: string;
  error?: boolean;
  children: React.ReactNode;
}

function Field({ label, error, children }: FieldProps) {
  return (
    <div style={{ marginBottom: 11 }}>
      <label
        style={{
          display: 'block',
          fontSize: 12,
          fontWeight: 500,
          color: error ? '#EF4444' : COLORS.muted,
          marginBottom: 4,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

interface SuccessViewProps {
  nome: string;
}

function SuccessView({ nome }: SuccessViewProps) {
  const firstName = nome.split(' ')[0];
  return (
    <div style={{ textAlign: 'center', padding: '12px 0 6px' }}>
      <div
        style={{
          width: 52, height: 52, borderRadius: '50%',
          background: COLORS.blueLight, color: COLORS.blue,
          fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 12px',
        }}
      >
        ✓
      </div>
      <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 19, fontWeight: 700, marginBottom: 7 }}>
        Recebemos, {firstName}!
      </div>
      <p style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.6, marginBottom: 16 }}>
        Nossa equipe entra em contato hoje pelo WhatsApp.
      </p>
      <div
        style={{
          background: COLORS.blueLight, borderRadius: 10,
          padding: '12px 16px', textAlign: 'left', marginBottom: 14,
        }}
      >
        <div
          style={{
            fontSize: 11, fontWeight: 600, color: COLORS.blue,
            textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8,
          }}
        >
          O que acontece agora
        </div>
        {([
          ['Hoje',         'nossa equipe te chama no WhatsApp'],
          ['Em até 2 dias','seu programa de pontos está ativo'],
          ['A partir daí', 'seus clientes pontuam e voltam sempre'],
        ] as [string, string][]).map(([bold, rest], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: i < 2 ? 8 : 0 }}>
            <div
              style={{
                width: 18, height: 18, borderRadius: '50%',
                background: COLORS.blue, color: '#fff',
                fontSize: 9, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginTop: 1,
              }}
            >
              {i + 1}
            </div>
            <div style={{ fontSize: 12, lineHeight: 1.5 }}>
              <strong style={{ fontWeight: 600 }}>{bold}:</strong> {rest}
            </div>
          </div>
        ))}
      </div>
      <a
        href={`https://wa.me/5538999999999?text=Oi%2C+sou+${encodeURIComponent(nome)}+e+acabei+de+preencher+o+formulário!`}
        target="_blank"
        rel="noreferrer"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          padding: '11px 20px', background: COLORS.green, color: '#fff',
          borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: 'none',
        }}
      >
        💬 Falar agora no WhatsApp
      </a>
    </div>
  );
}

// ─── Lead Form ───────────────────────────────────────────────────────────────

interface LeadFormProps {
  onSuccess: (nome: string) => void;
}

function LeadForm({ onSuccess }: LeadFormProps) {
  const [form, setForm] = useState<LeadFormData>({ nome: '', estab: '', whats: '', seg: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, boolean>>>({});

  const set = (k: keyof LeadFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!form.nome)  errs.nome  = true;
    if (!form.estab) errs.estab = true;
    if (!form.whats) errs.whats = true;
    if (!form.seg)   errs.seg   = true;
    setErrors(errs);
    if (Object.keys(errs).length) return;
    saveLandingLead({ nome: form.nome, estabelecimento: form.estab, whatsapp: form.whats, tipo: form.seg });
    onSuccess(form.nome);
  };

  const borderFor = (k: keyof LeadFormData) => (errors[k] ? '#EF4444' : COLORS.border);

  return (
    <div>
      <div
        style={{
          fontSize: 12, fontWeight: 600, color: COLORS.blue,
          textAlign: 'center', marginBottom: 3,
          letterSpacing: '0.03em', textTransform: 'uppercase',
        }}
      >
        Fale com a gente
      </div>
      <div
        style={{
          fontFamily: 'Sora, sans-serif', fontSize: 17, fontWeight: 700,
          textAlign: 'center', marginBottom: 18, lineHeight: 1.3,
        }}
      >
        Ativamos seu programa em até 2 dias
      </div>
      <form onSubmit={submit}>
        <Field label="Seu nome" error={errors.nome}>
          <input
            style={{ ...inputStyle, borderColor: borderFor('nome') }}
            value={form.nome}
            onChange={set('nome')}
            placeholder="Como você se chama?"
            autoComplete="name"
          />
        </Field>
        <Field label="Estabelecimento" error={errors.estab}>
          <input
            style={{ ...inputStyle, borderColor: borderFor('estab') }}
            value={form.estab}
            onChange={set('estab')}
            placeholder="Nome do seu negócio"
          />
        </Field>
        <Field label="WhatsApp" error={errors.whats}>
          <input
            style={{ ...inputStyle, borderColor: borderFor('whats') }}
            value={form.whats}
            onChange={set('whats')}
            placeholder="(44) 99999-9999"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
          />
        </Field>
        <Field label="Segmento" error={errors.seg}>
          <select
            style={{
              ...inputStyle,
              cursor: 'pointer',
              borderColor: borderFor('seg'),
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235A6272' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 14px center',
            }}
            value={form.seg}
            onChange={set('seg')}
          >
            <option value="">Selecione...</option>
            {SEGMENTS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </Field>
        {Object.keys(errors).length > 0 && (
          <p style={{ fontSize: 12, color: '#EF4444', margin: '4px 0 8px' }}>Preencha todos os campos.</p>
        )}
        <button
          type="submit"
          style={{
            width: '100%', height: 50, background: COLORS.blue, color: '#fff',
            border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 700,
            fontFamily: 'Sora, sans-serif', cursor: 'pointer', marginTop: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            letterSpacing: '-0.01em',
          }}
        >
          Quero ver funcionando →
        </button>
      </form>
      <p style={{ fontSize: 11, color: COLORS.muted, textAlign: 'center', marginTop: 9, lineHeight: 1.5 }}>
        🔒 Sem spam. Retornamos em até 1 hora pelo WhatsApp.
      </p>
    </div>
  );
}

// ─── Steps data ───────────────────────────────────────────────────────────────

const STEPS = [
  { n: 1, title: 'Você cadastra o estabelecimento',       desc: 'Nossa equipe configura tudo junto com você e treina o time do caixa. Em até 2 dias seu programa está pronto.',                             chip: null                        },
  { n: 2, title: 'O cliente pontua pelo número do celular',desc: 'No pagamento, o atendente digita o número do cliente no sistema. Pontos registrados na hora — sem QR code, sem app.',                    chip: '📱 Só o número do celular' },
  { n: 3, title: 'O cliente volta para resgatar',          desc: 'Pontos acumulados viram recompensas que você define — desconto, produto grátis, brinde. O cliente fica motivado a voltar.',              chip: null                        },
  { n: 4, title: 'Você tem tudo sob controle',             desc: 'Painel completo com histórico de clientes, quem está sumindo, quais recompensas são mais resgatadas e muito mais.',                       chip: '📊 Dados em tempo real'    },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function LandingAds() {
  const [successTop,    setSuccessTop]    = useState(false);
  const [successBottom, setSuccessBottom] = useState(false);
  const [successName,   setSuccessName]   = useState('');
  const formRef = useRef<HTMLDivElement>(null);

  // Hide sticky bar when hero form is visible
  useEffect(() => {
    const bar = document.getElementById('sticky-bar');
    if (!formRef.current || !bar) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        bar.style.opacity        = entry.isIntersecting ? '0'    : '1';
        bar.style.pointerEvents  = entry.isIntersecting ? 'none' : 'auto';
      },
      { threshold: 0.3 },
    );
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
      <nav
        style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: COLORS.white, borderBottom: `1px solid ${COLORS.border}`,
          padding: '0 20px', height: 54,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <FanFaveLogo size={28} dark />
      </nav>

      {/* HERO */}
      <section
        style={{
          background: COLORS.blue, padding: '44px 20px 0',
          textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,255,255,0.07) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.11)', border: '1px solid rgba(255,255,255,0.18)',
            color: 'rgba(255,255,255,0.88)', fontSize: 12, fontWeight: 500,
            padding: '5px 13px', borderRadius: 20, marginBottom: 18,
          }}
        >
          Food service · <span style={{ color: COLORS.amber, fontWeight: 600 }}>Demonstração gratuita</span>
        </div>

        <h1
          style={{
            fontFamily: 'Sora, sans-serif', fontSize: 'clamp(30px,8vw,46px)',
            fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em',
            color: '#fff', marginBottom: 14,
          }}
        >
          Seu cliente<br />
          <em style={{ fontStyle: 'normal', color: COLORS.amber }}>sempre volta.</em>
        </h1>

        <p style={{ fontSize: 15, lineHeight: 1.65, color: 'rgba(255,255,255,0.7)', maxWidth: 440, margin: '0 auto 28px' }}>
          Programa de pontos digital para bares, restaurantes, cafeterias e todo setor alimentício.
          Seu cliente pontua pelo celular — sem app, sem QR code.
        </p>

        {/* FORM CARD */}
        <div style={{ maxWidth: 400, margin: '0 auto', position: 'relative', zIndex: 2 }} ref={formRef}>
          <div
            id="hero-form"
            style={{
              background: COLORS.white, borderRadius: '14px 14px 0 0',
              padding: '26px 22px 30px', boxShadow: '0 -6px 40px rgba(0,0,0,0.18)',
            }}
          >
            {successTop
              ? <SuccessView nome={successName} />
              : (
                <LeadForm
                  onSuccess={(n) => { setSuccessName(n); setSuccessTop(true); }}
                />
              )
            }
          </div>
        </div>
      </section>

      {/* NUMBERS */}
      <section style={{ padding: '32px 20px', background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ maxWidth: 400, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {([
            ['600+',  'clientes ativos na plataforma'],
            ['67%',   'taxa média de retorno'],
            ['2 dias','para ativar e começar'],
          ] as [string, string][]).map(([val, lbl]) => (
            <div key={lbl} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 24, fontWeight: 800, color: COLORS.blue, lineHeight: 1 }}>
                {val}
              </div>
              <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4, lineHeight: 1.4 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* STEPS */}
      <section style={{ padding: '40px 20px', background: COLORS.white }}>
        <div style={{ maxWidth: 400, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.blue, marginBottom: 7, textAlign: 'center' }}>
            Como funciona
          </div>
          <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 21, fontWeight: 700, textAlign: 'center', lineHeight: 1.25, marginBottom: 26, color: COLORS.text }}>
            Quatro passos.<br />Seu negócio fidelizando.
          </h2>
          {STEPS.map((s, i) => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '15px 0', borderBottom: i < 3 ? `1px solid ${COLORS.border}` : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: COLORS.blue, color: '#fff', fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {s.n}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.55 }}>{s.desc}</div>
                {s.chip && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 10, background: COLORS.blueLight, color: COLORS.blue, marginTop: 5 }}>
                    {s.chip}
                  </div>
                )}
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
              "Antes o cliente entrava, comia bem, pagava e sumia. Com o Fan Fave consigo ver quem está sumindo
              e o movimento melhorou muito nos dias mais fracos."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: COLORS.amber, color: '#7A4500', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                RM
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Ricardo Mendes</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>Pizzaria Central · Montes Claros</div>
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
            ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>🎉</div>
                <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Recebemos!</div>
                <p style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.65 }}>
                  Nossa equipe entra em contato hoje pelo WhatsApp.<br />
                  Em até 2 dias seu programa já está ativo.
                </p>
              </div>
            )
            : (
              <LeadForm
                onSuccess={(n) => { setSuccessName(n); setSuccessBottom(true); }}
              />
            )
          }
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: COLORS.text, padding: '18px 20px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
          © 2026 Fan Fave ·{' '}
          <a href="https://www.fanfave.com.br" style={{ color: 'rgba(255,255,255,0.35)' }}>
            fanfave.com.br
          </a>{' '}
          · Plataforma de fidelização para food service
        </p>
      </footer>

      {/* STICKY BAR */}
      <div
        id="sticky-bar"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
          background: COLORS.white, borderTop: `1px solid ${COLORS.border}`,
          padding: '12px 20px', boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
          display: 'none', // shown via CSS media query in index.css
        }}
      >
        <button
          onClick={scrollToForm}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', height: 46, background: COLORS.blue, color: '#fff',
            border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700,
            fontFamily: 'Sora, sans-serif', cursor: 'pointer',
          }}
        >
          Quero ver funcionando →
        </button>
      </div>

    </div>
  );
}
