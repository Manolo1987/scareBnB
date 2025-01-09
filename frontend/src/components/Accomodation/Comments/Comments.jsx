import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/UserAuthContext';
import { useAcco } from '../../../context/AccommodationContext';
import styles from './Comments.module.css';
import { XCircle } from '@phosphor-icons/react';

export default function Comments() {
  const { currentAcco, postComment, deleteComment } = useAcco();
  const { user, isAuthenticated } = useAuth();
  const [newComment, setNewComment] = useState({ title: '', content: '' });
  const [comments, setComments] = useState([]);
  const [visibleGroups, setVisibleGroups] = useState(1);

  useEffect(() => {
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

  const handleShowMore = () => {
    setVisibleGroups((prevGroups) => prevGroups + 1);
  };

  const handleShowLess = () => {
    setVisibleGroups(1);
  };

  const groupedComments = [];
  const reversedComments = [...comments].reverse();
  for (let i = 0; i < reversedComments.length; i += 4) {
    groupedComments.push(reversedComments.slice(i, i + 4));
  }

  return (
    <section className={styles.comment_section}>
      <h3 className={styles.header}>Comments</h3>
      {comments.length === 0 ? (
        <p className={styles.noComments}>
          No comments yet, be the first to comment!
        </p>
      ) : (
        groupedComments.slice(0, visibleGroups).map((group, index) => (
          <div key={index} className={styles.comment_group}>
            <ul className={styles.comment_list}>
              {group.map((comment) => (
                <li key={comment?._id} className={styles.comment_item}>
                  <h4 className={styles.comment_title}>{comment?.title}</h4>
                  <p className={styles.comment_content}>{comment?.content}</p>
                  <small className={styles.comment_author}>
                    By: {comment?.author?.firstName} {comment?.author?.lastName}
                  </small>
                  {(comment?.author?._id === user?._id ||
                    user?.roles === 'admin') && (
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
            {index < visibleGroups - 1 && (
              <hr className={styles.comment_divider} />
            )}
          </div>
        ))
      )}

      {comments.length > visibleGroups * 4 && (
        <button
          onClick={handleShowMore}
          className={`buttonEffect ${styles.pagination_button}`}
        >
          Show More
        </button>
      )}

      {visibleGroups > 1 && (
        <button
          onClick={handleShowLess}
          className={`buttonEffect ${styles.pagination_button}`}
        >
          Show Less
        </button>
      )}

      {isAuthenticated && (
        <form onSubmit={handleCommentSubmit} className={styles.comment_form}>
          <input
            type='text'
            placeholder='Title'
            value={newComment.title}
            onChange={(e) =>
              setNewComment((prev) => ({
                ...prev,
                title: String(e.target.value),
              }))
            }
            className={styles.input}
          />
          <textarea
            placeholder='Write your comment...'
            value={newComment.content}
            onChange={(e) =>
              setNewComment((prev) => ({
                ...prev,
                content: String(e.target.value),
              }))
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
