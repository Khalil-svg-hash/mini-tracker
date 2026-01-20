import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { TaskCard } from './TaskCard';
import { AddTaskForm } from './AddTaskForm';
import { BoardColumn, Task } from '../../types';

interface ColumnProps {
  column: BoardColumn;
  onAddTask?: (data: { title: string; description: string; columnId: string }) => void;
  onTaskClick?: (task: Task) => void;
  onTaskDragStart?: (task: Task, e: React.DragEvent) => void;
  onTaskDragEnd?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (columnId: string, e: React.DragEvent) => void;
}

export const Column: React.FC<ColumnProps> = ({
  column,
  onAddTask,
  onTaskClick,
  onTaskDragStart,
  onTaskDragEnd,
  onDragOver,
  onDrop,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddTask = (data: { title: string; description: string; columnId: string }) => {
    onAddTask?.(data);
    setShowAddForm(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOver?.(e);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop?.(column.id, e);
  };

  const tasks = column.tasks || [];

  return (
    <div
      className="flex-shrink-0 w-80"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Card padding="sm" className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-tg-secondary-bg">
          <div className="flex items-center gap-2">
            {column.color && (
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: column.color }}
              />
            )}
            <h3 className="font-semibold text-tg-text">{column.name}</h3>
            <span className="text-sm text-tg-hint">({tasks.length})</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-[200px]">
          {showAddForm && (
            <AddTaskForm
              columnId={column.id}
              onSubmit={handleAddTask}
              onCancel={() => setShowAddForm(false)}
            />
          )}

          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick?.(task)}
              onDragStart={(e) => onTaskDragStart?.(task, e)}
              onDragEnd={onTaskDragEnd}
            />
          ))}
        </div>

        {!showAddForm && (
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            onClick={() => setShowAddForm(true)}
            className="mt-3"
          >
            + Add Task
          </Button>
        )}
      </Card>
    </div>
  );
};
