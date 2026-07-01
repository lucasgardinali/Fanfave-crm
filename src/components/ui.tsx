import React from 'react';
import { COLORS, CANAL_COLOR, CANAL_LABEL, STATUS_COLOR, STATUS_LABEL } from '../lib/constants';

// ─── Logo ────────────────────────────────────────────────────────────────────

interface LogoProps {
  size?: number;
  dark?: boolean;
  showCrm?: boolean;
}

export function FanFaveLogo({ size = 28, dark = false, showCrm = false }: LogoProps) {
  // Proporção original: 123 x 20 — calculamos a altura com base no size
  const height = size;
  const width = Math.round((123 / 20) * height);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: showCrm ? 6 : 0 }}>
      <svg width={width} height={height} viewBox="0 0 123 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Fan Fave">
        <g clipPath="url(#ffclip)">
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
          <clipPath id="ffclip">
            <rect width="123" height="20" fill="white"/>
          </clipPath>
        </defs>
      </svg>
      {showCrm && (
        <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 400, fontSize: height * 0.6, color: COLORS.grayText, letterSpacing: '-0.01em' }}>
          CRM
        </span>
      )}
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
