"use client";

interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "textarea" | "number";
  value: string | number | boolean;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
}

export function FormField({ label, name, type = "text", value, onChange, required, placeholder }: FormFieldProps) {
  const c =
    "mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm focus:border-brand-primary focus:outline-none";
  // Booleans only come from checkbox state; coerce to string for input/textarea value.
  const displayValue = typeof value === "boolean" ? String(value) : value;
  return (
    <div>
      <label htmlFor={name} className="text-sm text-foreground/70">
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={displayValue}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          rows={4}
          className={c}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={displayValue}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          className={c}
        />
      )}
    </div>
  );
}