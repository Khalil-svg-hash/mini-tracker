import React, { useState } from 'react';
import { Comment } from '../../types';
import { CommentItem } from './CommentItem';
import { TextArea } from '../common/TextArea';
import { Button } from '../common/Button';

interface CommentSectionProps {
  comments: Comment[];
  currentUserId?: string;
  onAddComment: (content: string) => Promise<void>;
  onEditComment?: (commentId: string, content: string) => Promise<void>;
  onDeleteComment?: (commentId: string) => Promise<void>;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  currentUserId,
  onAddComment,
  onEditComment,
  onDeleteComment,
}) => {
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onAddComment(newComment);
      setNewComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditStart = (commentId: string) => {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      setEditingId(commentId);
      setEditContent(comment.content);
    }
  };

  const handleEditSubmit = async () => {
    if (!editContent.trim() || !editingId || !onEditComment) return;
    
    setIsSubmitting(true);
    try {
      await onEditComment(editingId, editContent);
      setEditingId(null);
      setEditContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleDelete = async (commentId: string) => {
    if (!onDeleteComment) return;
    
    if (window.confirm('Are you sure you want to delete this comment?')) {
      setIsSubmitting(true);
      try {
        await onDeleteComment(commentId);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-tg-text">
        Comments ({comments.length})
      </h3>

      <div className="space-y-3">
        {comments.map((comment) => (
          editingId === comment.id ? (
            <div key={comment.id} className="space-y-2">
              <TextArea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
                fullWidth
                disabled={isSubmitting}
              />
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleEditSubmit}
                  disabled={!editContent.trim() || isSubmitting}
                  loading={isSubmitting}
                >
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              onEdit={onEditComment ? handleEditStart : undefined}
              onDelete={onDeleteComment ? handleDelete : undefined}
            />
          )
        ))}
      </div>

      <div className="space-y-2 pt-2 border-t border-tg-secondary-bg">
        <TextArea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows={3}
          fullWidth
          disabled={isSubmitting}
        />
        <Button
          variant="primary"
          size="sm"
          onClick={handleSubmit}
          disabled={!newComment.trim() || isSubmitting}
          loading={isSubmitting}
        >
          Add Comment
        </Button>
      </div>
    </div>
  );
};
