import React, { useState } from 'react';
import { Ghost, CaretDown } from '@phosphor-icons/react';
import styles from './RatingFilter.module.css';
import { useAcco } from '../../../context/AccommodationContext.jsx';

export default function RatingFilter() {
  const { minRating, setMinRating } = useAcco();
  const [isOpen, setIsOpen] = useState(false);

  const getIconsForRating = (rating) => {
    if (isNaN(rating) || rating < 2 || rating > 5) {
      return null;
    }

    const filledIcons = Array(rating)
      .fill(<Ghost size={18} weight='fill' />)
      .map((icon, index) =>
        React.cloneElement(icon, { key: `filled-${index}` })
      );

    const emptyIcons = Array(5 - rating)
      .fill(<Ghost size={18} />)
      .map((icon, index) =>
        React.cloneElement(icon, { key: `empty-${index}` })
      );

    return [...filledIcons, ...emptyIcons];
  };

  const handleRatingChange = (rating, event) => {
    event.stopPropagation();
    setMinRating(rating === 'all' ? '' : rating);
    setIsOpen(false);
  };

  const ratingOptions = [
    { value: '', label: 'all', rating: 0 },
    { value: '2', label: 'min 2', rating: 2 },
    { value: '3', label: 'min 3', rating: 3 },
    { value: '4', label: 'min 4', rating: 4 },
    { value: '5', label: '5', rating: 5 },
  ];

  const toggleDropdown = () => {
    setIsOpen((prev) => {
      return !prev;
    });
  };

  return (
    <>
      <label htmlFor='rating' className={styles.label}>
        Rating:
      </label>
      <div
        id='rating'
        className={styles.dropdown}
        onClick={toggleDropdown}
        aria-haspopup='listbox'
        aria-expanded={isOpen ? 'true' : 'false'}
        role='combobox'
        aria-label='Filter by rating'
      >
        <div className={styles.selectedValue}>
          {minRating === '' || minRating === 'all'
            ? 'all'
            : getIconsForRating(parseInt(minRating, 10))}
        </div>

        {isOpen && (
          <ul
            className={styles.dropdownList}
            role='listbox'
            aria-labelledby='rating'
          >
            {ratingOptions.map((option) => (
              <li
                key={option.value}
                className={styles.dropdownItem}
                onClick={(event) => handleRatingChange(option.value, event)}
                role='option'
                aria-selected={minRating === option.value ? 'true' : 'false'}
              >
                {option.rating > 0
                  ? getIconsForRating(option.rating)
                  : option.label}
              </li>
            ))}
          </ul>
        )}
        <div className={styles.arrowDown}>
          <CaretDown size={14} />
        </div>
      </div>
    </>
  );
}
