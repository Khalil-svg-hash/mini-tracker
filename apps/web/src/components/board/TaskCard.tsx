import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Task } from '../../types';
import { PRIORITY_VARIANT, PRIORITY_LABEL } from '../../constants';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onClick,
  onDragStart,
  onDragEnd,
}) => {
  return (
    <Card
      className="mb-3 cursor-move"
      padding="sm"
      hover
      onClick={onClick}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-tg-text line-clamp-2">
          {task.title}
        </h4>
        
        {task.description && (
          <p className="text-xs text-tg-hint line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between gap-2 flex-wrap">
          <Badge variant={PRIORITY_VARIANT[task.priority]} size="sm">
            {PRIORITY_LABEL[task.priority]}
          </Badge>
          
          {task.dueDate && (
            <span className="text-xs text-tg-hint">
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>

        {task.tags && task.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {task.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="default" size="sm">
                {tag}
              </Badge>
            ))}
            {task.tags.length > 3 && (
              <Badge variant="default" size="sm">
                +{task.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
