import React, { useState } from 'react';
import { Task } from '../../types';
import { Input } from '../common/Input';
import { TextArea } from '../common/TextArea';
import { Button } from '../common/Button';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel: () => void;
}

export interface TaskFormData {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'done' | 'archived';
  assigneeId?: string;
  dueDate?: string;
  startDate?: string;
  estimatedHours?: number;
  tags?: string[];
}

export const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium',
    status: task?.status || 'todo',
    assigneeId: task?.assigneeId || '',
    dueDate: task?.dueDate ? task.dueDate.split('T')[0] : '',
    startDate: task?.startDate ? task.startDate.split('T')[0] : '',
    estimatedHours: task?.estimatedHours || undefined,
    tags: task?.tags || [],
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (formData.estimatedHours && formData.estimatedHours < 0) {
      newErrors.estimatedHours = 'Estimated hours must be positive';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(t => t !== tag) || [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Enter task title"
        fullWidth
        error={errors.title}
        disabled={isSubmitting}
        required
      />

      <TextArea
        label="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Enter task description"
        rows={4}
        fullWidth
        disabled={isSubmitting}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-tg-text">Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
            className="px-4 py-2 bg-tg-bg border-2 border-tg-secondary-bg rounded-lg text-tg-text focus:outline-none focus:border-tg-button transition-colors"
            disabled={isSubmitting}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-tg-text">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="px-4 py-2 bg-tg-bg border-2 border-tg-secondary-bg rounded-lg text-tg-text focus:outline-none focus:border-tg-button transition-colors"
            disabled={isSubmitting}
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Start Date"
          type="date"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          fullWidth
          disabled={isSubmitting}
        />

        <Input
          label="Due Date"
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          fullWidth
          disabled={isSubmitting}
        />
      </div>

      <Input
        label="Estimated Hours"
        type="number"
        value={formData.estimatedHours || ''}
        onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value ? Number(e.target.value) : undefined })}
        placeholder="Enter estimated hours"
        min="0"
        step="0.5"
        fullWidth
        error={errors.estimatedHours}
        disabled={isSubmitting}
      />

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-tg-text">Tags</label>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            placeholder="Add a tag"
            disabled={isSubmitting}
          />
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddTag}
            disabled={!tagInput.trim() || isSubmitting}
          >
            Add
          </Button>
        </div>
        {formData.tags && formData.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-tg-secondary-bg text-tg-text rounded text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-tg-hint hover:text-tg-text"
                  disabled={isSubmitting}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          {task ? 'Update Task' : 'Create Task'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
