import React, { useState, useEffect } from 'react';
import styles from './UpdateImage.module.css';
import { Trash, ArrowCounterClockwise } from '@phosphor-icons/react';
import { useAcco } from '../../../context/AccommodationContext.jsx';
import Overlay from './Overlay';

export default function UpdateImage({ img }) {
  const { imagesToDelete, setImagesToDelete } = useAcco();

  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const toggleOverlay = () => {
    setIsOverlayOpen(!isOverlayOpen);
  };

  const handleDeleteImage = () => {
    setImagesToDelete((prevImagesToDelete) => [
      ...prevImagesToDelete,
      img.public_id,
    ]);

    setIsOverlayOpen(false);
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
          onClick={toggleOverlay}
        >
          <Trash size={24} />
        </button>
      )}

      <Overlay isOpen={isOverlayOpen} onClose={toggleOverlay}>
        <div className={styles.deleteMessageContainer}>
          <p className={styles.deleteMessage}>
            Do you really want to delete this image?
          </p>
          <img src={img.secure_url} alt='' className={styles.deletedImage} />
          <div className='formFooter'>
            <button
              type='button'
              className='cancelButton'
              onClick={() => setIsOverlayOpen(false)}
            >
              Cancel
            </button>
            <button
              type='button'
              className='saveButton'
              onClick={handleDeleteImage}
            >
              Delete
            </button>
          </div>
        </div>
      </Overlay>
    </div>
  );
}
