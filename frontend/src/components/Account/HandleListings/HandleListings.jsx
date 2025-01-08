import React, { useState, useEffect } from 'react';
import styles from './HandleListings.module.css';
import { useAcco } from '../../../context/AccommodationContext.jsx';
import { states } from '../../../assets/data/statesList.js';
import { featureList } from '../../../assets/data/featureList.js';
import ListingsNav from '../ListingsNav/ListingsNav.jsx';
import { useNavigate } from 'react-router-dom';

export default function HandleListings() {
  const { addNewListing, getAllAccommodations } = useAcco();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    state: states[0],
    city: '',
    latitude: '',
    longitude: '',
    bedrooms: 1,
    pricePerNight: 0,
    features: [],
    titleImage: null,
    otherImages: [],
  });

  const [formErrors, setFormErrors] = useState({
    title: '',
    description: '',
    //state: '',
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
    // Perform validation checks and update the error state
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
    } else if (name === 'description') {
      if (value.length > 5000) {
        setFormErrors((prevState) => ({
          ...prevState,
          description: 'Description must not be longer than 5000 characters.',
        }));
      } else if (value.length > 0 && !isValidTextFieldWithLineBreaks(value)) {
        setFormErrors((prevState) => ({
          ...prevState,
          description: 'Description contains invalid characters.',
        }));
      } else {
        setFormErrors((prevState) => ({
          ...prevState,
          description: '',
        }));
      }
    } else if (name === 'city') {
      if (value.length > 50) {
        setFormErrors((prevState) => ({
          ...prevState,
          city: 'City must not be longer than 50 characters.',
        }));
      } else if (value.length > 0 && !isValidTextField(value)) {
        setFormErrors((prevState) => ({
          ...prevState,
          city: 'City contains invalid characters.',
        }));
      } else {
        setFormErrors((prevState) => ({
          ...prevState,
          city: '',
        }));
      }
    } else if (name === 'latitude') {
      if (value.length > 0 && !isValidCoordinate(value)) {
        setFormErrors((prevState) => ({
          ...prevState,
          latitude: 'Latitude contains invalid characters.',
        }));
      } else {
        setFormErrors((prevState) => ({
          ...prevState,
          latitude: '',
        }));
      }
    } else if (name === 'longitude') {
      if (value.length > 0 && !isValidCoordinate(value)) {
        setFormErrors((prevState) => ({
          ...prevState,
          longitude: 'Longitude contains invalid characters.',
        }));
      } else {
        setFormErrors((prevState) => ({
          ...prevState,
          longitude: '',
        }));
      }
    } else if (name === 'bedrooms') {
      if (value.length > 0 && value < 1) {
        setFormErrors((prevState) => ({
          ...prevState,
          bedrooms: 'Your accommodation must at least have 1 bedroom.',
        }));
      } else {
        setFormErrors((prevState) => ({
          ...prevState,
          bedrooms: '',
        }));
      }
    } else if (name === 'pricePerNight') {
      if (value.length > 0 && value < 1) {
        setFormErrors((prevState) => ({
          ...prevState,
          pricePerNight: 'Please set a price for your accommodation',
        }));
      } else {
        setFormErrors((prevState) => ({
          ...prevState,
          pricePerNight: '',
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

    addNewListing(form)
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
    <div>
      <ListingsNav />
      HandleListings
      <div className={styles.formContainer}>
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
              {states.map((option, index) => {
                return (
                  <option key={index} value={option}>
                    {option}
                  </option>
                );
              })}
            </select>
            {/* {formErrors.state && (
              <p className={styles.error}>{formErrors.state}</p>
            )} */}
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
            <label htmlFor='longitude'>longitude</label>
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
            <label htmlFor='pricePerNight'>pricePerNight</label>
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
            <label>Features</label>
            {featureList.map((feature) => (
              <div key={feature} className={styles.checkboxContainer}>
                <label>
                  <input
                    type='checkbox'
                    name='features'
                    value={feature}
                    checked={formData.features.includes(feature)}
                    onChange={handleInputChange}
                  />
                  {feature}
                </label>
              </div>
            ))}
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor='titleImage'>Title Image</label>
            <input
              type='file'
              name='titleImage'
              id='titleImage'
              accept='image/*'
              onChange={handleInputChange}
            />
            {formErrors.titleImage && (
              <p className={styles.error}>{formErrors.titleImage}</p>
            )}
          </div>

          {/* File input for Other Images */}
          <div className={styles.inputContainer}>
            <label htmlFor='otherImages'>Other Images</label>
            <input
              type='file'
              name='otherImages'
              id='otherImages'
              accept='image/*'
              multiple
              onChange={handleInputChange}
            />
            {formErrors.otherImages && (
              <p className={styles.error}>{formErrors.otherImages}</p>
            )}
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type='submit' disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </form>
      </div>
    </div>
  );
}
