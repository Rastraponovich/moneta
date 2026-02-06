import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = "", ...props }: InputProps) {
  const inputClasses = `w-full px-4 py-2 border border-border rounded-xl bg-surface text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[44px] transition-colors ${className}`;

  if (label) {
    return (
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          {label}
        </label>
        <input className={inputClasses} {...props} />
      </div>
    );
  }

  return <input className={inputClasses} {...props} />;
}
