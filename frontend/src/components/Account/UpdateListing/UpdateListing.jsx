import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UpdateListing.module.css';
import { useAcco } from '../../../context/AccommodationContext.jsx';
import { states } from '../../../assets/data/statesList.js';
import { featureList } from '../../../assets/data/featureList.js';
import ListingsNav from '../ListingsNav/ListingsNav.jsx';

export default function UpdateListing({ listing, setShowUpdateForm }) {
  const { updateListing } = useAcco(); // Funktion, um das Listing zu aktualisieren
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialisiere den Formulardatenzustand mit den erhaltenen Listing-Daten
  const [formData, setFormData] = useState({
    title: listing.title || '',
    description: listing.description || '',
    state: listing.state || states[0],
    city: listing.city || '',
    latitude: listing.latitude || '',
    longitude: listing.longitude || '',
    bedrooms: listing.bedrooms || 1,
    pricePerNight: listing.pricePerNight || 0,
    features: listing.features || [],
    titleImage: null, // Bilder werden vorerst ignoriert
    otherImages: [],
  });

  const [formErrors, setFormErrors] = useState({
    title: '',
    description: '',
    city: '',
    latitude: '',
    longitude: '',
    bedrooms: '',
    pricePerNight: '',
    titleImage: '',
    otherImages: '',
  });

  function isValidTextField(v) {
    return /^[a-zA-Z0-9\s.,;:'"@_\-\u00C0-\u017F()]+$/.test(v);
  }

  function isValidTextFieldWithLineBreaks(v) {
    return /^[a-zA-Z0-9\s.,;:'"()!?&_\-\u00C0-\u017F\n\r]+$/.test(v);
  }

  function isValidCoordinate(v) {
    return /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?|[-+]?180(\.0+)?)/.test(v);
  }

  const validateFile = (file, maxSize) => {
    if (!file) return false;
    const isImage = file.type.startsWith('image/');
    const isValidSize = file.size <= maxSize;
    return isImage && isValidSize;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setFormData((prevState) => {
        const updatedFeatures = checked
          ? [...prevState.features, value]
          : prevState.features.filter((feature) => feature !== value);

        return { ...prevState, features: updatedFeatures };
      });
    } else if (type === 'file') {
      if (name === 'titleImage') {
        const file = files[0];
        if (file && validateFile(file, 5 * 1024 * 1024)) {
          setFormData((prevState) => ({
            ...prevState,
            titleImage: file,
          }));
          setFormErrors((prevState) => ({
            ...prevState,
            titleImage: '',
          }));
        } else {
          setFormErrors((prevState) => ({
            ...prevState,
            titleImage: 'Please upload an image (max 5MB).',
          }));
        }
      } else if (name === 'otherImages') {
        const selectedFiles = Array.from(files);
        if (selectedFiles.length > 4) {
          setFormErrors((prevState) => ({
            ...prevState,
            otherImages:
              'You can upload up to 4 images, each no larger than 5MB.',
          }));

          e.target.value = '';
        } else {
          // Filter valid files (bis 5 MB und Bilddateien)
          const validFiles = selectedFiles.filter((file) =>
            validateFile(file, 5 * 1024 * 1024)
          );

          setFormData((prevState) => ({
            ...prevState,
            otherImages: validFiles,
          }));
          setFormErrors((prevState) => ({
            ...prevState,
            otherImages: '',
          }));
        }
      }
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }

    // Durchführung der gleichen Validierungen wie in HandleListings
    // Beispiel für Title-Validierung
    if (name === 'title') {
      if (value.length > 50) {
        setFormErrors((prevState) => ({
          ...prevState,
          title: 'Title must not be longer than 50 characters.',
        }));
      } else if (value.length > 0 && !isValidTextField(value)) {
        setFormErrors((prevState) => ({
          ...prevState,
          title: 'Title contains invalid characters.',
        }));
      } else {
        setFormErrors((prevState) => ({
          ...prevState,
          title: '',
        }));
      }
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData();
    for (const [key, value] of Object.entries(formData)) {
      if (key === 'titleImage' && value) {
        form.append('titleImage', value);
      } else if (key === 'otherImages' && value.length > 0) {
        value.forEach((file) => {
          form.append('otherImages', file);
        });
      } else if (key !== 'titleImage' && key !== 'otherImages') {
        form.append(key, value);
      }
    }

    setIsLoading(true);
    setError(null);

    updateListing(listing._id, form) // Aufruf der updateListing-Funktion mit Listing-ID und Formulardaten
      .then((response) => {
        setIsLoading(false);
        navigate('/account/listings');
      })
      .catch((error) => {
        setIsLoading(false);
        setError('Server error, please try again later.');
      });
  }

  return (
    <div className={styles.overlay}>
      <div className={`${styles.formContainer} ${styles.overlayContent}`}>
        <form className={styles.handleListings} onSubmit={handleSubmit}>
          <div className={styles.inputContainer}>
            <label htmlFor='title'>Title</label>
            <input
              type='text'
              name='title'
              id='title'
              value={formData.title}
              onChange={handleInputChange}
            />
            {formErrors.title && (
              <p className={styles.error}>{formErrors.title}</p>
            )}
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor='description'>Description</label>
            <textarea
              name='description'
              id='description'
              value={formData.description}
              onChange={handleInputChange}
              rows='4'
              cols='50'
            />
            {formErrors.description && (
              <p className={styles.error}>{formErrors.description}</p>
            )}
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor='state'>State</label>
            <select
              name='state'
              id='state'
              value={formData.state}
              onChange={handleInputChange}
            >
              {states.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor='city'>City</label>
            <input
              type='text'
              name='city'
              id='city'
              value={formData.city}
              onChange={handleInputChange}
            />
            {formErrors.city && (
              <p className={styles.error}>{formErrors.city}</p>
            )}
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor='latitude'>Latitude</label>
            <input
              type='text'
              name='latitude'
              id='latitude'
              value={formData.latitude}
              onChange={handleInputChange}
            />
            {formErrors.latitude && (
              <p className={styles.error}>{formErrors.latitude}</p>
            )}
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor='longitude'>Longitude</label>
            <input
              type='text'
              name='longitude'
              id='longitude'
              value={formData.longitude}
              onChange={handleInputChange}
            />
            {formErrors.longitude && (
              <p className={styles.error}>{formErrors.longitude}</p>
            )}
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor='bedrooms'>Bedrooms</label>
            <input
              type='number'
              name='bedrooms'
              id='bedrooms'
              value={formData.bedrooms}
              onChange={handleInputChange}
            />
            {formErrors.bedrooms && (
              <p className={styles.error}>{formErrors.bedrooms}</p>
            )}
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor='pricePerNight'>Price per Night</label>
            <input
              type='number'
              name='pricePerNight'
              id='pricePerNight'
              value={formData.pricePerNight}
              onChange={handleInputChange}
            />
            {formErrors.pricePerNight && (
              <p className={styles.error}>{formErrors.pricePerNight}</p>
            )}
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor='features'>Features</label>
            {featureList.map((feature, index) => (
              <div key={index}>
                <input
                  type='checkbox'
                  name='features'
                  value={feature}
                  checked={formData.features.includes(feature)}
                  onChange={handleInputChange}
                />
                <label>{feature}</label>
              </div>
            ))}
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.inputContainer}>
            <button type='submit' disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          <p className={styles.closeLink} onClick={setShowUpdateForm}>
            Close without Saving
          </p>
        </form>
      </div>
    </div>
  );
}
