import React, { useEffect, useState } from 'react';
import '../../../App.css';
import styles from './ListingsCard.module.css';
import { Link } from 'react-router-dom';
import { Trash, Pencil, Ghost } from '@phosphor-icons/react';
import { useAcco } from '../../../context/AccommodationContext.jsx';
import UpdateListing from '../UpdateListing/UpdateListing.jsx';
import Overlay from '../UpdateListing/Overlay.jsx';

export default function ListingsCard({ listing }) {
  const { deleteListing, setImagesToDelete } = useAcco();
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showDeleteMessage, setShowDeleteMessage] = useState(false);

  const toggleDeleteMessage = () => {
    setShowDeleteMessage(!showDeleteMessage);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    e.preventDefault();
    deleteListing(listing._id);
  };
  const handleShowForm = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setShowUpdateForm(true);
  };
  const handleCloseUpdateForm = () => {
    setShowUpdateForm(false);
    setImagesToDelete([]);
  };

  return (
    <>
      <div className='cardContainer'>
        <div className='imgContainer'>
          <Link
            to={`/accommodationList/${listing.title
              .toLowerCase()
              .replace(/\s+/g, '-')}?id=${listing._id}`}
            state={{ id: listing._id }}
            className='cardLink'
            title='View Accommodation'
          >
            <img
              src={listing.titleImage.secure_url}
              alt={listing.title}
              className='cardImage'
              title={listing.title}
            />
          </Link>
        </div>
        <div className='infoContainer'>
          <div className='infoHeader'>
            <span className='cardTitle'>{listing.title}</span>
            <span className='cardCity'>{listing.city}</span>
          </div>
          <div className='infoBody'>
            <span
              className='cardRating'
              title={`Rating: ${listing.rating.toFixed(1)} spooks`}
            >
              <Ghost className='ghost' weight='fill' size={24} color='white' />
              {listing.rating.toFixed(1)}
            </span>
            <span className='cardBedrooms'>Bedrooms: {listing.bedrooms}</span>
            <span className='cardPricePerNight'>
              Price per Night: {listing.pricePerNight} €
            </span>
          </div>
          <div className='cardButtonContainer'>
            <button
              className='cardButton'
              onClick={handleShowForm}
              title='Edit Accommodation'
              aria-label='Edit Accommodation'
            >
              <Pencil size={32} className='buttonIcon' />
            </button>
            <button
              className='cardButton'
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setShowDeleteMessage(true);
              }}
              title='Delete Accommodation'
              aria-label='Delete Accommodation'
            >
              <Trash size={32} className='buttonIcon' />
            </button>
          </div>
        </div>
      </div>

      {showUpdateForm && (
        <UpdateListing
          listing={listing}
          setShowUpdateForm={handleCloseUpdateForm}
        />
      )}
      {
        <Overlay isOpen={showDeleteMessage} onClose={toggleDeleteMessage}>
          <div className={styles.deleteMessageContainer}>
            <p className={styles.deleteMessage}>
              Do you really want to delete this accommodation?
            </p>
            <div className='formFooter'>
              <button
                type='button'
                className='cancelButton'
                onClick={() => setShowDeleteMessage(false)}
                aria-label='Cancel'
                title='Cancel'
              >
                Cancel
              </button>
              <button
                type='button'
                className='saveButton'
                onClick={handleDelete}
                aria-label='Delete'
                title='Delete'
              >
                Delete
              </button>
            </div>
          </div>
        </Overlay>
      }
    </>
  );
}
