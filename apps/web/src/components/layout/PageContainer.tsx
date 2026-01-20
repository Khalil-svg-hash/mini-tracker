import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = '',
  noPadding = false,
}) => {
  return (
    <div className={`min-h-screen bg-tg-bg ${!noPadding ? 'p-4 pb-20' : 'pb-20'} ${className}`}>
      {children}
    </div>
  );
};
