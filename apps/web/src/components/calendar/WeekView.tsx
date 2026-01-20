import React from 'react';
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isToday,
} from 'date-fns';
import { Task } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { PRIORITY_VARIANT, PRIORITY_LABEL } from '../../constants';

interface WeekViewProps {
  currentDate: Date;
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  tasks,
  onTaskClick,
}) => {
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getTasksForDay = (date: Date) => {
    return tasks.filter((task) => {
      if (task.dueDate) {
        const taskDate = new Date(task.dueDate);
        return format(taskDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
      }
      if (task.startDate) {
        const taskDate = new Date(task.startDate);
        return format(taskDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
      }
      return false;
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
      {days.map((day) => {
        const dayTasks = getTasksForDay(day);
        const isCurrentDay = isToday(day);

        return (
          <div key={day.toISOString()} className="space-y-2">
            <div
              className={`p-3 text-center rounded-lg ${
                isCurrentDay
                  ? 'bg-tg-button text-tg-button-text'
                  : 'bg-tg-secondary-bg text-tg-text'
              }`}
            >
              <div className="text-xs font-medium">{format(day, 'EEE')}</div>
              <div className="text-lg font-bold">{format(day, 'd')}</div>
            </div>

            <div className="space-y-2">
              {dayTasks.map((task) => (
                <Card
                  key={task.id}
                  padding="sm"
                  hover
                  onClick={() => onTaskClick?.(task)}
                >
                  <div className="space-y-1">
                    <div className="flex items-start gap-2">
                      <Badge variant={PRIORITY_VARIANT[task.priority]} size="sm">
                        {PRIORITY_LABEL[task.priority]}
                      </Badge>
                    </div>
                    <h4 className="text-sm font-medium text-tg-text line-clamp-2">
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className="text-xs text-tg-hint line-clamp-1">
                        {task.description}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
              {dayTasks.length === 0 && (
                <div className="text-xs text-tg-hint text-center py-2">
                  No tasks
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
