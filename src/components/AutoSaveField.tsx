import { useState, useEffect, useRef } from "react";

interface AutoSaveFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
}

const AutoSaveField = ({ label, value, onChange, placeholder, multiline, rows = 3 }: AutoSaveFieldProps) => {
  const [saved, setSaved] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const handleChange = (val: string) => {
    onChange(val);
    setSaved(false);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setSaved(true), 600);
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  const baseClass =
    "w-full rounded-lg border border-border bg-popover px-4 py-3 text-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-label font-medium text-muted-foreground">{label}</label>
        {saved && (
          <span className="text-xs text-green-600 font-medium animate-fade-in">✓ Saved</span>
        )}
      </div>
      {multiline ? (
        <textarea
          className={baseClass + " resize-y"}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
        />
      ) : (
        <input
          className={baseClass}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default AutoSaveField;
