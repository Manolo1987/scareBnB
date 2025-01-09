import React, { useState, useEffect } from 'react';
import styles from './UpdateImage.module.css';
import { Trash, ArrowCounterClockwise } from '@phosphor-icons/react';
import { useAcco } from '../../../context/AccommodationContext.jsx';

export default function UpdateImage({ img }) {
  const [showDeleteMessage, setShowDeleteMessage] = useState(false);
  const { imagesToDelete, setImagesToDelete } = useAcco();

  const handleCancelDelete = () => {
    setShowDeleteMessage(false);
  };

  const handleDeleteImage = () => {
    setImagesToDelete((prevImagesToDelete) => [
      ...prevImagesToDelete,
      img.public_id,
    ]);
    setShowDeleteMessage(false);
  };

  const handleTrashClick = () => {
    setShowDeleteMessage(true);
  };
  const handleRecoverImage = () => {
    setImagesToDelete((prevImagesToDelete) =>
      prevImagesToDelete.filter((id) => id !== img.public_id)
    );
  };

  const isImageDeleted = imagesToDelete.includes(img.public_id);

  return (
    <div className={styles.imageContainer}>
      <img src={img.secure_url} alt='image preview' className={styles.thumb} />
      {isImageDeleted ? (
        <div className={styles.deletedOverlay}>
          <span>deleted</span>
          <button
            type='button'
            className={styles.imageRecoverButton}
            onClick={handleRecoverImage}
          >
            <ArrowCounterClockwise size={24} />
          </button>
        </div>
      ) : (
        <button
          type='button'
          className={styles.imageDeleteButton}
          onClick={handleTrashClick}
        >
          <Trash size={24} />
        </button>
      )}

      {showDeleteMessage && (
        <div className={styles.deleteMessageContainer}>
          <div className={styles.deleteMessageInner}>
            <p className={styles.deleteMessage}>
              Do you really want to delete this image?
            </p>
            <img src={img.secure_url} alt='' className={styles.deletedImage} />
            <div className={styles.messageFooter}>
              <button
                type='button'
                className={styles.cancelButton}
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                type='button'
                className={styles.deleteButton}
                onClick={handleDeleteImage}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
