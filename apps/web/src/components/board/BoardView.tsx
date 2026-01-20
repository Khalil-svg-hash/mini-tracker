import React, { useState } from 'react';
import { Column } from './Column';
import { AddColumnButton } from './AddColumnButton';
import { Board, Task } from '../../types';

interface BoardViewProps {
  board: Board;
  onAddColumn?: (name: string) => void;
  onAddTask?: (data: { title: string; description: string; columnId: string }) => void;
  onTaskClick?: (task: Task) => void;
  onTaskMove?: (taskId: string, targetColumnId: string) => void;
}

export const BoardView: React.FC<BoardViewProps> = ({
  board,
  onAddColumn,
  onAddTask,
  onTaskClick,
  onTaskMove,
}) => {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const handleTaskDragStart = (task: Task, e: React.DragEvent) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleTaskDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDrop = (columnId: string) => {
    if (draggedTask && draggedTask.columnId !== columnId) {
      onTaskMove?.(draggedTask.id, columnId);
    }
    setDraggedTask(null);
  };

  const columns = board.columns || [];
  const sortedColumns = [...columns].sort((a, b) => a.position - b.position);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-tg-text">{board.name}</h2>
        {board.description && (
          <p className="text-tg-hint mt-1">{board.description}</p>
        )}
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 pb-4 min-h-full">
          {sortedColumns.map((column) => (
            <Column
              key={column.id}
              column={column}
              onAddTask={onAddTask}
              onTaskClick={onTaskClick}
              onTaskDragStart={handleTaskDragStart}
              onTaskDragEnd={handleTaskDragEnd}
              onDrop={handleDrop}
            />
          ))}
          
          {onAddColumn && (
            <AddColumnButton onAddColumn={onAddColumn} />
          )}
        </div>
      </div>
    </div>
  );
};
