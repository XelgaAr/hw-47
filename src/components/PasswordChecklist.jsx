import { passwordChecks } from '../lib/validation.js';
export default function PasswordChecklist({ password }) {
  return <div className="password-checklist" aria-label="Требования к паролю">
    {passwordChecks(password).map((check) => <span key={check.label} className={check.passed ? 'passed' : ''}><span aria-hidden="true">{check.passed ? '✓' : '·'}</span>{check.label}</span>)}
  </div>;
}
