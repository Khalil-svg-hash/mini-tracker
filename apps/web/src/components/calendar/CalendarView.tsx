import React, { useState } from 'react';
import { format, addMonths, subMonths, addWeeks, subWeeks } from 'date-fns';
import { Task } from '../../types';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { Button } from '../common/Button';

interface CalendarViewProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onDayClick?: (date: Date) => void;
  initialView?: 'month' | 'week';
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  onTaskClick,
  onDayClick,
  initialView = 'month',
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>(initialView);

  const handlePrevious = () => {
    if (view === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(subWeeks(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(addWeeks(currentDate, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getHeaderText = () => {
    if (view === 'month') {
      return format(currentDate, 'MMMM yyyy');
    } else {
      return format(currentDate, 'MMM d, yyyy');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={handlePrevious}>
            ‹
          </Button>
          <h2 className="text-xl font-bold text-tg-text min-w-[200px] text-center">
            {getHeaderText()}
          </h2>
          <Button variant="ghost" onClick={handleNext}>
            ›
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={handleToday}>
            Today
          </Button>
          <div className="flex gap-1 bg-tg-secondary-bg rounded-lg p-1">
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                view === 'week'
                  ? 'bg-tg-button text-tg-button-text'
                  : 'text-tg-text hover:bg-tg-bg'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setView('month')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                view === 'month'
                  ? 'bg-tg-button text-tg-button-text'
                  : 'text-tg-text hover:bg-tg-bg'
              }`}
            >
              Month
            </button>
          </div>
        </div>
      </div>

      {view === 'month' ? (
        <MonthView
          currentDate={currentDate}
          tasks={tasks}
          onDayClick={onDayClick}
        />
      ) : (
        <WeekView
          currentDate={currentDate}
          tasks={tasks}
          onTaskClick={onTaskClick}
        />
      )}
    </div>
  );
};
