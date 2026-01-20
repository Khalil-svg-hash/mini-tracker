import React from 'react';
import { isSameMonth, isToday, format } from 'date-fns';
import { Task } from '../../types';
import { Badge } from '../common/Badge';
import { PRIORITY_VARIANT } from '../../constants';

interface DayCellProps {
  date: Date;
  currentMonth: Date;
  tasks: Task[];
  onClick?: (date: Date) => void;
}

export const DayCell: React.FC<DayCellProps> = ({
  date,
  currentMonth,
  tasks,
  onClick,
}) => {
  const isCurrentMonth = isSameMonth(date, currentMonth);
  const isCurrentDay = isToday(date);

  const dayTasks = tasks.filter((task) => {
    if (task.dueDate) {
      const taskDate = new Date(task.dueDate);
      return format(taskDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    }
    return false;
  });

  const handleClick = () => {
    if (onClick) {
      onClick(date);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`min-h-[100px] p-2 border border-tg-secondary-bg ${
        onClick ? 'cursor-pointer hover:bg-tg-secondary-bg/50' : ''
      } ${!isCurrentMonth ? 'bg-tg-secondary-bg/30' : 'bg-tg-bg'} ${
        isCurrentDay ? 'ring-2 ring-tg-button' : ''
      }`}
    >
      <div
        className={`text-sm font-medium mb-1 ${
          isCurrentMonth ? 'text-tg-text' : 'text-tg-hint'
        } ${isCurrentDay ? 'text-tg-button' : ''}`}
      >
        {format(date, 'd')}
      </div>

      <div className="space-y-1">
        {dayTasks.slice(0, 3).map((task) => (
          <div
            key={task.id}
            className="text-xs p-1 rounded bg-tg-secondary-bg hover:bg-tg-secondary-bg/70 cursor-pointer truncate"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-1">
              <Badge variant={PRIORITY_VARIANT[task.priority]} size="sm">
                {task.priority.charAt(0).toUpperCase()}
              </Badge>
              <span className="text-tg-text truncate">{task.title}</span>
            </div>
          </div>
        ))}
        {dayTasks.length > 3 && (
          <div className="text-xs text-tg-hint pl-1">
            +{dayTasks.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
};
