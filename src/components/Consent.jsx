export default function Consent({ id, error, ref, ...props }) {
  return <div className="consent">
    <label htmlFor={id}><input
      {...props}
      type="checkbox"
      ref={ref}
      id={id}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
    /><span>Согласен на обработку тестовых данных в этой вкладке <span aria-hidden="true">*</span></span></label>
    {error && <span id={`${id}-error`} className="field-error" role="alert">{error}</span>}
  </div>;
}
