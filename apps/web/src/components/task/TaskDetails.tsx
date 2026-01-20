import React from 'react';
import { Task } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { PriorityBadge } from './PriorityBadge';
import { CommentSection } from './CommentSection';
import { STATUS_LABEL } from '../../constants';

interface TaskDetailsProps {
  task: Task;
  currentUserId?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddComment?: (content: string) => Promise<void>;
  onEditComment?: (commentId: string, content: string) => Promise<void>;
  onDeleteComment?: (commentId: string) => Promise<void>;
}

export const TaskDetails: React.FC<TaskDetailsProps> = ({
  task,
  currentUserId,
  onEdit,
  onDelete,
  onAddComment,
  onEditComment,
  onDeleteComment,
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 className="text-2xl font-bold text-tg-text">{task.title}</h2>
          {(onEdit || onDelete) && (
            <div className="flex gap-2">
              {onEdit && (
                <Button variant="secondary" size="sm" onClick={onEdit}>
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDelete}
                  className="text-red-500 hover:text-red-600"
                >
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <PriorityBadge priority={task.priority} />
            <Badge variant="default">
              {STATUS_LABEL[task.status]}
            </Badge>
            {task.column && (
              <Badge variant="primary" size="sm">
                {task.column.name}
              </Badge>
            )}
          </div>

          {task.description && (
            <div>
              <h3 className="text-sm font-semibold text-tg-text mb-2">
                Description
              </h3>
              <p className="text-tg-text whitespace-pre-wrap">{task.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {task.assignee && (
              <div>
                <h4 className="text-sm font-semibold text-tg-hint mb-1">
                  Assignee
                </h4>
                <div className="flex items-center gap-2">
                  {task.assignee.photoUrl ? (
                    <img
                      src={task.assignee.photoUrl}
                      alt={task.assignee.username || 'User'}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-tg-button flex items-center justify-center">
                      <span className="text-xs text-tg-button-text">
                        {task.assignee.username?.[0]?.toUpperCase() || '?'}
                      </span>
                    </div>
                  )}
                  <span className="text-sm text-tg-text">
                    {task.assignee.username || task.assignee.firstName || 'Unknown'}
                  </span>
                </div>
              </div>
            )}

            {task.reporter && (
              <div>
                <h4 className="text-sm font-semibold text-tg-hint mb-1">
                  Reporter
                </h4>
                <div className="flex items-center gap-2">
                  {task.reporter.photoUrl ? (
                    <img
                      src={task.reporter.photoUrl}
                      alt={task.reporter.username || 'User'}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-tg-button flex items-center justify-center">
                      <span className="text-xs text-tg-button-text">
                        {task.reporter.username?.[0]?.toUpperCase() || '?'}
                      </span>
                    </div>
                  )}
                  <span className="text-sm text-tg-text">
                    {task.reporter.username || task.reporter.firstName || 'Unknown'}
                  </span>
                </div>
              </div>
            )}

            {task.startDate && (
              <div>
                <h4 className="text-sm font-semibold text-tg-hint mb-1">
                  Start Date
                </h4>
                <p className="text-sm text-tg-text">{formatDate(task.startDate)}</p>
              </div>
            )}

            {task.dueDate && (
              <div>
                <h4 className="text-sm font-semibold text-tg-hint mb-1">
                  Due Date
                </h4>
                <p className="text-sm text-tg-text">{formatDate(task.dueDate)}</p>
              </div>
            )}

            {task.estimatedHours !== undefined && (
              <div>
                <h4 className="text-sm font-semibold text-tg-hint mb-1">
                  Estimated Hours
                </h4>
                <p className="text-sm text-tg-text">{task.estimatedHours}h</p>
              </div>
            )}

            {task.actualHours !== undefined && (
              <div>
                <h4 className="text-sm font-semibold text-tg-hint mb-1">
                  Actual Hours
                </h4>
                <p className="text-sm text-tg-text">{task.actualHours}h</p>
              </div>
            )}
          </div>

          {task.tags && task.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-tg-hint mb-2">Tags</h4>
              <div className="flex gap-2 flex-wrap">
                {task.tags.map((tag, index) => (
                  <Badge key={index} variant="default" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {task.attachments && task.attachments.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-tg-hint mb-2">
                Attachments ({task.attachments.length})
              </h4>
              <div className="space-y-2">
                {task.attachments.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={attachment.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 bg-tg-secondary-bg rounded hover:bg-opacity-80 transition-colors"
                  >
                    <span className="text-sm text-tg-link">{attachment.fileName}</span>
                    <span className="text-xs text-tg-hint">
                      ({(attachment.fileSize / 1024).toFixed(1)} KB)
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-tg-secondary-bg text-xs text-tg-hint space-y-1">
            <p>Created: {formatDateTime(task.createdAt)}</p>
            <p>Updated: {formatDateTime(task.updatedAt)}</p>
          </div>
        </div>
      </Card>

      {task.comments && onAddComment && (
        <Card>
          <CommentSection
            comments={task.comments}
            currentUserId={currentUserId}
            onAddComment={onAddComment}
            onEditComment={onEditComment}
            onDeleteComment={onDeleteComment}
          />
        </Card>
      )}
    </div>
  );
};
