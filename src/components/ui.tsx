
import React from 'react';
import { COLORS, CANAL_COLOR, CANAL_LABEL, STATUS_COLOR, STATUS_LABEL } from '../lib/constants';

// ─── Logo ────────────────────────────────────────────────────────────────────

interface LogoProps {
  size?: number;
  dark?: boolean;
  showCrm?: boolean;
}

export function FanFaveLogo({ size = 28, dark = false, showCrm = false }: LogoProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
      <svg width={size} height={size} viewBox="0 0 34 34" fill="none" aria-hidden="true">
        <rect width="34" height="34" rx="8" fill={COLORS.blue} />
        {/* Amber triangle (front) */}
        <path d="M10 10L10 24L20 17L10 10Z" fill={COLORS.amber} />
        {/* Teal triangle (back) */}
        <path d="M15 10L15 24L25 17L15 10Z" fill={COLORS.teal} opacity="0.85" />
      </svg>
      <span
        style={{
          fontFamily: 'Sora, sans-serif',
          fontWeight: 800,
          fontSize: size * 0.52,
          color: dark ? COLORS.text : '#fff',
          letterSpacing: '-0.03em',
        }}
      >
        fan
        <span style={{ color: dark ? COLORS.blue : '#fff' }}>fave</span>
        {showCrm && (
          <span style={{ color: COLORS.grayText, fontWeight: 400, fontSize: size * 0.38, marginLeft: 4 }}>
            CRM
          </span>
        )}
      </span>
    </div>
  );
}

// ─── Status pill ─────────────────────────────────────────────────────────────

export function StatusPill({ status }: { status: string }) {
  const c = STATUS_COLOR[status] ?? { bg: COLORS.grayBg, text: COLORS.grayText };
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 600,
        padding: '2px 7px',
        borderRadius: 8,
        background: c.bg,
        color: c.text,
        whiteSpace: 'nowrap',
      }}
    >
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

// ─── Canal pill ──────────────────────────────────────────────────────────────

export function CanalPill({ canal }: { canal: string }) {
  const c = CANAL_COLOR[canal] ?? { bg: COLORS.grayBg, text: COLORS.grayText };
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 500,
        padding: '2px 7px',
        borderRadius: 10,
        background: c.bg,
        color: c.text,
        whiteSpace: 'nowrap',
      }}
    >
      {CANAL_LABEL[canal] ?? canal}
    </span>
  );
}

// ─── Button ──────────────────────────────────────────────────────────────────

type BtnVariant = 'primary' | 'ghost' | 'danger';

interface BtnProps {
  variant?: BtnVariant;
  onClick?: () => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
  type?: 'button' | 'submit';
}

const btnStyles: Record<BtnVariant, React.CSSProperties> = {
  primary: { background: COLORS.blue,  color: '#fff',             border: `1px solid ${COLORS.blue}`,      marginLeft: 'auto' },
  ghost:   { background: COLORS.white, color: COLORS.text,        border: `1px solid ${COLORS.grayBorder}` },
  danger:  { background: COLORS.white, color: '#DC2626',          border: '1px solid #FCA5A5'               },
};

export function Btn({ variant = 'ghost', onClick, children, style, type = 'button' }: BtnProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        height: 36,
        padding: '0 16px',
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer',
        fontFamily: 'Inter, sans-serif',
        transition: 'all 0.12s',
        ...btnStyles[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// ─── Stat card ───────────────────────────────────────────────────────────────

interface StatCardProps {
  val: string | number;
  lbl: string;
  delta?: string;
}

export function StatCard({ val, lbl, delta }: StatCardProps) {
  return (
    <div
      style={{
        background: COLORS.white,
        border: `1px solid ${COLORS.grayBorder}`,
        borderRadius: 8,
        padding: '14px 16px',
      }}
    >
      <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 24, fontWeight: 700, color: COLORS.text, lineHeight: 1 }}>
        {val}
      </div>
      <div style={{ fontSize: 12, color: COLORS.grayText, marginTop: 4 }}>{lbl}</div>
      {delta && (
        <div style={{ fontSize: 11, fontWeight: 500, color: COLORS.blue, marginTop: 5 }}>{delta}</div>
      )}
    </div>
  );
}

// ─── Toast ───────────────────────────────────────────────────────────────────

export function Toast({ msg }: { msg: string }) {
  if (!msg) return null;
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        background: COLORS.text,
        color: '#fff',
        padding: '10px 16px',
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 500,
        zIndex: 999,
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        pointerEvents: 'none',
      }}
    >
      {msg}
    </div>
  );
}

// ─── Modal ───────────────────────────────────────────────────────────────────

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  if (!open) return null;
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        zIndex: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        style={{
          background: COLORS.white,
          borderRadius: 14,
          width: '100%',
          maxWidth: 480,
          maxHeight: '88vh',
          overflowY: 'auto',
          boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: `1px solid ${COLORS.grayBorder}`,
            position: 'sticky',
            top: 0,
            background: COLORS.white,
            zIndex: 1,
          }}
        >
          <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 16, fontWeight: 700 }}>{title}</span>
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28, border: 'none', background: COLORS.grayBg,
              borderRadius: 6, cursor: 'pointer', fontSize: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ padding: '18px 20px', flex: 1 }}>{children}</div>
        {footer && (
          <div
            style={{
              display: 'flex',
              gap: 8,
              padding: '14px 20px',
              borderTop: `1px solid ${COLORS.grayBorder}`,
              background: COLORS.grayBg,
              borderRadius: '0 0 14px 14px',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Form fields ─────────────────────────────────────────────────────────────

const fieldInputStyle: React.CSSProperties = {
  width: '100%',
  height: 40,
  padding: '0 12px',
  border: `1.5px solid ${COLORS.grayBorder}`,
  borderRadius: 8,
  fontSize: 13,
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
  color: COLORS.text,
  background: COLORS.white,
  boxSizing: 'border-box',
};

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
}

export function InputField({ label, value, onChange, placeholder, type = 'text', inputMode }: InputFieldProps) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: COLORS.grayText, marginBottom: 4 }}>
        {label}
      </label>
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={fieldInputStyle}
      />
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<string | { v: string; l: string }>;
}

export function SelectField({ label, value, onChange, options }: SelectFieldProps) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: COLORS.grayText, marginBottom: 4 }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...fieldInputStyle, cursor: 'pointer' }}
      >
        {options.map((o) => {
          const v = typeof o === 'string' ? o : o.v;
          const l = typeof o === 'string' ? o : o.l;
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
    </div>
  );
}

// ─── Status selector ─────────────────────────────────────────────────────────

interface StatusSelectorProps {
  current: string;
  onChange: (s: string) => void;
}

export function StatusSelector({ current, onChange }: StatusSelectorProps) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
      {Object.keys(STATUS_LABEL).map((s) => {
        const sel = current === s;
        const c = STATUS_COLOR[s];
        return (
          <button
            key={s}
            onClick={() => onChange(s)}
            style={{
              padding: '5px 12px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              border: `1.5px solid ${sel ? c.text : COLORS.grayBorder}`,
              background: sel ? c.bg : COLORS.white,
              color: sel ? c.text : COLORS.grayText,
            }}
          >
            {STATUS_LABEL[s]}
          </button>
        );
      })}
    </div>
  );
}
