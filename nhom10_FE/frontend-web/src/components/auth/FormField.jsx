export default function FormField({
  type = "text",
  placeholder,
  value,
  onChange,
  error,
}) {
  return (
    <>
      <input
        type={type}
        className={`auth-input ${error ? "is-invalid" : ""}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <div className="auth-field-error">{error}</div>}
    </>
  );
}
