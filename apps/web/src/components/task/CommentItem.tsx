import React from 'react';
import { Comment } from '../../types';
import { Button } from '../common/Button';

interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;
  onEdit?: (commentId: string) => void;
  onDelete?: (commentId: string) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUserId,
  onEdit,
  onDelete,
}) => {
  const isOwner = currentUserId === comment.userId;
  const createdAt = new Date(comment.createdAt);
  const updatedAt = new Date(comment.updatedAt);
  const isEdited = createdAt.getTime() !== updatedAt.getTime();

  return (
    <div className="flex gap-3 p-3 bg-tg-secondary-bg rounded-lg">
      <div className="flex-shrink-0">
        {comment.user?.photoUrl ? (
          <img
            src={comment.user.photoUrl}
            alt={comment.user.username || 'User'}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-tg-button flex items-center justify-center">
            <span className="text-sm font-medium text-tg-button-text">
              {comment.user?.username?.[0]?.toUpperCase() || '?'}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-tg-text">
              {comment.user?.username || comment.user?.firstName || 'Unknown'}
            </span>
            <span className="text-xs text-tg-hint">
              {createdAt.toLocaleString()}
              {isEdited && ' (edited)'}
            </span>
          </div>
          
          {isOwner && (onEdit || onDelete) && (
            <div className="flex gap-1">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(comment.id)}
                >
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(comment.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>

        <p className="text-sm text-tg-text whitespace-pre-wrap break-words">
          {comment.content}
        </p>
      </div>
    </div>
  );
};
