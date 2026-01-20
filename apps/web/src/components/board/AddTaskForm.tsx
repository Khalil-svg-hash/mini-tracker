import React, { useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { TextArea } from '../common/TextArea';

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
        
        <TextArea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
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
