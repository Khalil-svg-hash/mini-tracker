import React, { useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

interface AddTaskFormProps {
  columnId: string;
  onSubmit: (data: { title: string; description: string; columnId: string }) => void;
  onCancel: () => void;
}

export const AddTaskForm: React.FC<AddTaskFormProps> = ({
  columnId,
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({
        title: title.trim(),
        description: description.trim(),
        columnId,
      });
      setTitle('');
      setDescription('');
    }
  };

  return (
    <Card padding="sm" className="mb-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          autoFocus
          required
        />
        
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 bg-tg-bg border-2 border-tg-secondary-bg rounded-lg text-tg-text placeholder-tg-hint focus:outline-none focus:border-tg-button transition-colors resize-none"
          rows={3}
        />

        <div className="flex gap-2">
          <Button type="submit" variant="primary" size="sm" fullWidth>
            Add Task
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};
