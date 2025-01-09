import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/UserAuthContext';
import { useAcco } from '../../../context/AccommodationContext';
import styles from './Comments.module.css'; // Import der CSS-Module
import { XCircle } from '@phosphor-icons/react';

export default function Comments() {
  const { currentAcco, postComment, deleteComment } = useAcco();
  const { user, isAuthenticated } = useAuth();
  const [newComment, setNewComment] = useState({ title: '', content: '' });
  const [comments, setComments] = useState([]);

  useEffect(() => {
    console.log({ user });
    console.log({ currentAcco });
    console.log({ comments });

    if (currentAcco?.comments) {
      setComments(currentAcco.comments);
    }
  }, [currentAcco]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.title || !newComment.content) return;

    const postedComment = await postComment(currentAcco._id, newComment);
    if (postedComment) {
      setComments((prevComments) => [...prevComments, postedComment]);
      setNewComment({ title: '', content: '' });
    } else {
      console.error('Failed to post comment');
    }
  };

  const handleCommentDelete = async (commentId) => {
    const deleted = await deleteComment(commentId);
    if (deleted) {
      setComments((prevComments) =>
        prevComments.filter((c) => c._id !== commentId)
      );
    } else {
      console.error('Failed to delete comment');
    }
  };

  return (
    <section className={styles.comment_section}>
      <h3 className={styles.header}>Comments</h3>
      {comments?.length > 0 ? (
        <ul className={styles.comment_list}>
          {comments.map((comment) => (
            <li key={comment?._id} className={styles.comment_item}>
              <h4 className={styles.comment_title}>{comment?.title}</h4>
              <p className={styles.comment_content}>{comment?.content}</p>
              <small className={styles.comment_author}>
                By: {user?.firstName}{' '}{user?.lastName}
              </small>
              {(comment?.author === user?._id || user?.roles === 'admin') && (
                <button
                  onClick={() => handleCommentDelete(comment?._id)}
                  className={styles.deleteButton}
                >
                  <XCircle size={30} color='crimson' weight='fill' />
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.noComments}>
          No comments yet. Be the first to comment!
        </p>
      )}

      {isAuthenticated && (
        <form onSubmit={handleCommentSubmit} className={styles.comment_form}>
          <input
            type='text'
            placeholder='Title'
            value={newComment.title}
            onChange={(e) =>
              setNewComment((prev) => ({ ...prev, title: String(e.target.value) }))
            }
            className={styles.input}
          />
          <textarea
            placeholder='Write your comment...'
            value={newComment.content}
            onChange={(e) =>
              setNewComment((prev) => ({ ...prev, content: String(e.target.value) }))
            }
            className={styles.textarea}
          />
          <button
            type='submit'
            className={`buttonEffect ${styles.submit_button}`}
          >
            Add Comment
          </button>
        </form>
      )}
    </section>
  );
}
