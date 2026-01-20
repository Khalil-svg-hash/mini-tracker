import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Card } from '../common/Card';

interface AddColumnButtonProps {
  onAddColumn: (name: string) => void;
}

export const AddColumnButton: React.FC<AddColumnButtonProps> = ({ onAddColumn }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [columnName, setColumnName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (columnName.trim()) {
      onAddColumn(columnName.trim());
      setColumnName('');
      setIsAdding(false);
    }
  };

  if (!isAdding) {
    return (
      <div className="flex-shrink-0 w-80">
        <Button
          variant="outline"
          fullWidth
          onClick={() => setIsAdding(true)}
          className="h-full min-h-[100px]"
        >
          + Add Column
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 w-80">
      <Card padding="sm">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            placeholder="Column name"
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
            fullWidth
            autoFocus
            required
          />
          <div className="flex gap-2">
            <Button type="submit" variant="primary" size="sm" fullWidth>
              Add Column
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsAdding(false);
                setColumnName('');
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
