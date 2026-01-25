import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = "", ...props }: InputProps) {
  const inputClasses = `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] ${className}`;

  if (label) {
    return (
      <div>
        <label className="block text-sm font-medium mb-1">{label}</label>
        <input className={inputClasses} {...props} />
      </div>
    );
  }

  return <input className={inputClasses} {...props} />;
}
