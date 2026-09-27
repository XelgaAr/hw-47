import { useState } from 'react';

// React 19 passes ref as a prop; React Hook Form receives the actual input node.
export default function Field({ label, id, error, hint, type = 'text', ref, ...props }) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const description = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') || undefined;
  return <div className={`form-field ${error ? 'invalid' : ''}`}>

    <label htmlFor={id}>{label} <span aria-hidden="true">*</span></label>

    <div className="input-wrap">
      <input
        {...props}
        ref={ref}
        id={id}
        type={isPassword && show ? 'text' : type}
        aria-invalid={Boolean(error)}
        aria-describedby={description}
      />

      {isPassword && <button
        type="button"
        className="password-toggle"
        aria-label={`${show ? 'Скрыть' : 'Показать'}: ${label.toLowerCase()}`}
        aria-pressed={show}
        onClick={() => setShow((previous) => !previous)}
      >{show ? 'Скрыть' : 'Показать'}</button>}

    </div>

    {hint && <span id={`${id}-hint`} className="field-hint">{hint}</span>}

    {error && <span className="field-error" id={`${id}-error`} role="alert">{error}</span>}

  </div>;
}
