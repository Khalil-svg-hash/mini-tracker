import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  onClick?: () => void;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  onClick,
  className = '',
  padding = 'md',
  hover = false,
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };
  
  const hoverClass = hover ? 'hover:shadow-lg transition-shadow duration-200' : '';
  const clickableClass = onClick ? 'cursor-pointer' : '';
  
  return (
    <div
      className={`bg-tg-bg border border-tg-secondary-bg rounded-lg shadow-sm ${paddingClasses[padding]} ${hoverClass} ${clickableClass} ${className}`}
      onClick={onClick}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-tg-text">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-tg-hint mt-1">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};
