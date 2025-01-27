import React, { useState } from 'react';
import styles from './Feedback.module.css';
import { useBooking } from '../../../context/bookingContext.jsx';
import { Ghost } from '@phosphor-icons/react';

export default function Feedback({ bookingId }) {
  const { giveFeedback, getMyBookings } = useBooking();
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);

  const handleClick = (e, currentRating) => {
    e.stopPropagation();
    e.preventDefault();
    giveFeedback(bookingId, currentRating);
    // getMyBookings();
  };
  return (
    <div className={styles.feedbackContainer}>
      <span className={styles.label}>Give Feedback: </span>
      {[...Array(5)].map((ghost, index) => {
        const currentRating = index + 1;
        return (
          <span key={index}>
            {currentRating <= (hover || rating) ? (
              <Ghost
                size={32}
                weight='fill'
                className={styles.ratingGhostFilled}
                onMouseEnter={() => setHover(currentRating)}
                onMouseLeave={() => setHover(null)}
                onClick={(e) => handleClick(e, currentRating)}
              />
            ) : (
              <Ghost
                size={32}
                className={styles.ratingGhost}
                onMouseEnter={() => setHover(currentRating)}
                onMouseLeave={() => setHover(null)}
                onClick={(e) => handleClick(e, currentRating)}
              />
            )}
          </span>
        );
      })}
    </div>
  );
}
