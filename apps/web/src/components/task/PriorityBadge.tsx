import React from 'react';
import { Badge } from '../common/Badge';

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high' | 'urgent';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const PRIORITY_VARIANT = {
  low: 'info' as const,
  medium: 'default' as const,
  high: 'warning' as const,
  urgent: 'danger' as const,
};

const PRIORITY_LABEL = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = 'md',
  className,
}) => {
  return (
    <Badge 
      variant={PRIORITY_VARIANT[priority]} 
      size={size}
      className={className}
    >
      {PRIORITY_LABEL[priority]}
    </Badge>
  );
};
