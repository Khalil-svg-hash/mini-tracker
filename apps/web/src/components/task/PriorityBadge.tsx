import React from 'react';
import { Badge } from '../common/Badge';
import { PRIORITY_VARIANT, PRIORITY_LABEL } from '../../constants';

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high' | 'urgent';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

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
