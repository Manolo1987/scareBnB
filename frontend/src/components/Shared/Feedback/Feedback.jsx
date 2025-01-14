import React, { useState } from 'react';
import styles from './Feedback.module.css';
import { useBooking } from '../../../context/bookingContext.jsx';


export default function Feedback({ bookingId }) {
  const { giveFeedback } = useBooking();
  const emojis = ["😡", "😕", "😐", "😊", "😍"];

  const [selectedValue, setSelectedValue] = useState(null);

  const handleSubmit = async () => {
    console.log('Button clicked');
    
    try {
      await giveFeedback(bookingId, selectedValue);
    } catch (error) {
      toast.error("Feedback Error.");
    }
  };


  return (
    <div>
      <h3>Feedback</h3>
      <div className={styles.emojiContainer}>
        {emojis.map((emoji, index) => (
          <button key={index} onClick={() => setSelectedValue(index + 1)} className={styles.feedbackEmoji}>
            <p>
            {emoji}
            </p>
          </button>
        ))}
      </div>
      <button onClick={handleSubmit} className='buttonEffect'>Submit</button>
    </div>
  )
}
