import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <div className={`flex flex-col gap-1 ${widthClass}`}>
      {label && (
        <label className="text-sm font-medium text-tg-text">
          {label}
        </label>
      )}
      <input
        className={`px-4 py-2 bg-tg-bg border-2 ${
          error ? 'border-red-500' : 'border-tg-secondary-bg'
        } rounded-lg text-tg-text placeholder-tg-hint focus:outline-none focus:border-tg-button transition-colors ${className}`}
        {...props}
      />
      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
      {helperText && !error && (
        <span className="text-sm text-tg-hint">{helperText}</span>
      )}
    </div>
  );
};
