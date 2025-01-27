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
  const [errors, setErrors] = useState({ title: '', content: '' });

  useEffect(() => {
    if (currentAcco?.comments) {
      setComments(currentAcco.comments);
    }
  }, [currentAcco]);

  const validateComment = (field, value) => {
    let error = '';
    const regex = /^[a-zA-Z0-9\s.,;:'"()!?&€$@_\+\*\-/^°\u00C0-\u017F\n\r]+$/;

    if (value.trim() === '') {
      return '';
    }

    if (field === 'content') {
      if (value.length > 1000) {
        error = 'Content exceeds maximum length of 1000 characters.';
      } else if (!regex.test(value)) {
        error = `Content contains invalid characters!`;
      }
    } else if (field === 'title') {
      if (value.length > 100) {
        error = 'Title exceeds maximum length of 100 characters.';
      } else if (!regex.test(value)) {
        error = `Title contains invalid characters!`;
      }
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewComment((prev) => ({
      ...prev,
      [name]: value,
    }));

    const error = value.trim() === '' ? '' : validateComment(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    const titleError =
      newComment.title.trim() === ''
        ? 'Title is required.'
        : validateComment('title', newComment.title);
    const contentError =
      newComment.content.trim() === ''
        ? 'Content is required.'
        : validateComment('content', newComment.content);

    if (titleError || contentError) {
      setErrors({ title: titleError, content: contentError });
      return;
    }

    const postedComment = await postComment(currentAcco._id, newComment);
    if (postedComment) {
      setComments((prevComments) => [...prevComments, postedComment]);
      setNewComment({ title: '', content: '' });
      setErrors({ title: '', content: '' });
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
                      title='Delete Comment'
                      aria-label='Delete Comment'
                    >
                      <XCircle size={28} color='crimson' weight="bold" />
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
          title='show more comments'
          aria-label='show more comments'
        >
          Show More
        </button>
      )}

      {visibleGroups > 1 && (
        <button
          onClick={handleShowLess}
          className={`buttonEffect ${styles.pagination_button}`}
          title='show less comments'
          aria-label='show less comments'
        >
          Show Less
        </button>
      )}

      {isAuthenticated && (
        <form onSubmit={handleCommentSubmit} className={styles.comment_form}>
          <label htmlFor='title' className={styles.srOnly}>
            Title
          </label>
          <input
            type='text'
            id='title'
            name='title'
            placeholder='Title'
            value={newComment.title}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.title && <p className={styles.error}>{errors.title}</p>}
          <label htmlFor='content' className={styles.srOnly}>
            Content
          </label>
          <textarea
            id='content'
            name='content'
            placeholder='Write your comment...'
            value={newComment.content}
            onChange={handleChange}
            className={styles.textarea}
          />
          {errors.content && <p className={styles.error}>{errors.content}</p>}
          <button
            type='submit'
            className={`buttonEffect ${styles.submit_button}`}
            title='Add Comment'
            aria-label='Add Comment'
          >
            Add Comment
          </button>
        </form>
      )}
    </section>
  );
}
