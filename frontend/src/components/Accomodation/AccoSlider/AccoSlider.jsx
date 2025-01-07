import React, { useState } from 'react';
import styles from './AccoSlider.module.css';
import { ArrowRight, ArrowLeft } from '@phosphor-icons/react';

export default function AccoSlider({ titleImage, images }) {
  const allImages = [titleImage, ...images];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showArrows, setShowArrows] = useState(false);

  const changeImage = (direction) => {
    setCurrentImageIndex((prevIndex) => {
      const newIndex = prevIndex + direction;
      if (newIndex < 0) return allImages.length - 1;
      if (newIndex >= allImages.length) return 0;
      return newIndex;
    });
  };

  const selectImage = (index) => {
    setCurrentImageIndex(index);
  };

  const hasMultipleImages = allImages.length > 1;

  return (
    <div className={styles.imageGallery}>
      <div
        className={styles.imageContainer}
        onMouseEnter={() => setShowArrows(true)}
        onMouseLeave={() => setShowArrows(false)}
      >
        {hasMultipleImages && showArrows && (
          <button
            className={`${styles.arrow} ${styles.arrowLeft}`}
            onClick={() => changeImage(-1)}
          >
            <ArrowLeft className={styles.icon} />
          </button>
        )}

        <img
          src={allImages[currentImageIndex].secure_url}
          alt='Main Display'
          className={styles.mainImage}
        />

        {hasMultipleImages && showArrows && (
          <button
            className={`${styles.arrow} ${styles.arrowRight}`}
            onClick={() => changeImage(1)}
          >
            <ArrowRight className={styles.icon} />
          </button>
        )}

        {hasMultipleImages && (
          <div className={styles.navigationDots}>
            {allImages.map((_, index) => (
              <span
                key={index}
                className={`${styles.dot} ${
                  currentImageIndex === index ? styles.dotActive : ''
                }`}
                onClick={() => selectImage(index)}
              ></span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
