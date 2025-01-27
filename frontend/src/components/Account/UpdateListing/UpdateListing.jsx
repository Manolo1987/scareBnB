import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../App.css';
import styles from './UpdateListing.module.css';
import { useAcco } from '../../../context/AccommodationContext.jsx';
import { states } from '../../../assets/data/statesList.js';
import { featureList } from '../../../assets/data/featureList.js';
import { Trash, Pencil } from '@phosphor-icons/react';
import UpdateImage from './UpdateImage.jsx';

export default function UpdateListing({ listing, setShowUpdateForm }) {
  const { updateListing, imagesToDelete } = useAcco();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTitleImageInput, setShowTitleImageInput] = useState(false);
  const [showOtherImagesInput, setShowOtherImagesInput] = useState(false);
  const [remainingImages, setRemainingImages] = useState(0);

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
    titleImage: null,
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

  const isFormValid = () => {
    return Object.values(formErrors).every((error) => error === '');
  };

  useEffect(() => {
    setRemainingImages(
      Math.max(
        0,
        4 -
          (listing.images.length -
            imagesToDelete.length +
            formData.otherImages.length)
      )
    );
    //update FormErrors für otherimages here
    if (
      formData.otherImages.length >
      4 - (listing.images.length - imagesToDelete.length)
    ) {
      setFormErrors((prevState) => ({
        ...prevState,
        otherImages: `You can upload only 4 images, each no larger than 5MB.`,
      }));
    } else {
      setFormErrors((prevState) => ({
        ...prevState,
        otherImages: '',
      }));
    }
  }, [formData.otherImages, imagesToDelete]);

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
        //differenzierte Fehlermeldung zurückgeben: zu viele files oder image size too big
      } else if (name === 'otherImages') {
        const selectedFiles = Array.from(files);
        // if (
        //   selectedFiles.length >
        //   4 - (listing.images.length - imagesToDelete.length)
        // ) {
        //   setFormErrors((prevState) => ({
        //     ...prevState,
        //     otherImages: `You can upload only 4 images, each no larger than 5MB.`,
        //   }));
        // } else {
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
        // }
      }
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }

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
      const bedroomValue = parseInt(value, 10);
      if (bedroomValue < 1 || bedroomValue > 5) {
        setFormErrors((prevState) => ({
          ...prevState,
          bedrooms: 'The number of bedrooms must be between 1 and 5.',
        }));
      } else {
        setFormErrors((prevState) => ({
          ...prevState,
          bedrooms: '',
        }));
      }
    } else if (name === 'pricePerNight') {
      const isValidPrice = /^[1-9]\d*$/.test(value);
      if (value.length > 0 && !isValidPrice) {
        setFormErrors((prevState) => ({
          ...prevState,
          pricePerNight:
            'Please enter a valid positive whole number for the price',
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
    if (!isFormValid()) {
      return;
    }
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

    updateListing(listing._id, form)
      .then((response) => {
        setIsLoading(false);
        setShowUpdateForm(false);
      })
      .catch((error) => {
        setIsLoading(false);
        setError('Server error, please try again later.');
      });
  }

  useEffect(() => {
    if (
      listing.images.length - imagesToDelete.length >= 4 &&
      formData.otherImages.length < 1
    ) {
      setShowOtherImagesInput(false);
    } else {
      setShowOtherImagesInput(true);
    }
  }, [imagesToDelete, remainingImages]);

  return (
    <div className={styles.overlay}>
      <div className={`${styles.formWrapper} ${styles.overlayContent}`}>
        <form className='accountForm' onSubmit={handleSubmit}>
          <div className='inputContainer'>
            <label htmlFor='title'>Title</label>
            <input
              type='text'
              name='title'
              id='title'
              value={formData.title}
              onChange={handleInputChange}
            />
            {formErrors.title && (
              <p className='inputError'>{formErrors.title}</p>
            )}
          </div>
          <div className='inputContainer'>
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
              <p className='inputError'>{formErrors.description}</p>
            )}
          </div>
          <div className='inputRow'>
            <div className='inputContainer'>
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
            <div className='inputContainer'>
              <label htmlFor='city'>City</label>
              <input
                type='text'
                name='city'
                id='city'
                value={formData.city}
                onChange={handleInputChange}
              />
              {formErrors.city && (
                <p className='inputError'>{formErrors.city}</p>
              )}
            </div>
          </div>
          <div className='inputRow'>
            <div className='inputContainer'>
              <label htmlFor='latitude'>Latitude</label>
              <input
                type='text'
                name='latitude'
                id='latitude'
                value={formData.latitude}
                onChange={handleInputChange}
              />
              {formErrors.latitude && (
                <p className='inputError'>{formErrors.latitude}</p>
              )}
            </div>
            <div className='inputContainer'>
              <label htmlFor='longitude'>Longitude</label>
              <input
                type='text'
                name='longitude'
                id='longitude'
                value={formData.longitude}
                onChange={handleInputChange}
              />
              {formErrors.longitude && (
                <p className='inputError'>{formErrors.longitude}</p>
              )}
            </div>
          </div>
          <div className='inputRow'>
            <div className='inputContainer'>
              <label htmlFor='bedrooms'>Bedrooms</label>
              <select
                name='bedrooms'
                id='bedrooms'
                value={formData.bedrooms}
                onChange={handleInputChange}
              >
                {[...Array(5)].map((_, index) => {
                  return (
                    <option key={index + 1} value={index + 1}>
                      {index + 1}
                    </option>
                  );
                })}
              </select>
              {formErrors.bedrooms && (
                <p className='inputError'>{formErrors.bedrooms}</p>
              )}
            </div>
            <div className='inputContainer'>
              <label htmlFor='pricePerNight'>Price per Night</label>
              <input
                type='text'
                name='pricePerNight'
                id='pricePerNight'
                value={formData.pricePerNight}
                onChange={handleInputChange}
              />
              {formErrors.pricePerNight && (
                <p className='inputError'>{formErrors.pricePerNight}</p>
              )}
            </div>
          </div>
          <div className='inputContainer'>
            <label htmlFor='features'>Features</label>
            <div className='featureList'>
              {featureList.map((feature, index) => (
                <label key={feature} className='featureListItem'>
                  <input
                    type='checkbox'
                    name='features'
                    value={feature}
                    checked={formData.features.includes(feature)}
                    onChange={handleInputChange}
                  />
                  {feature}
                </label>
              ))}
            </div>
          </div>
          {error && <p className='inputError'>{error}</p>}

          <div className={styles.titleImageContainer}>
            <label htmlFor='titleImageUpdate'>Title Image</label>
            <div className={styles.imageContainer}>
              <img
                src={listing.titleImage.secure_url}
                alt='title image'
                className={styles.thumb}
              />
              <button
                type='button'
                className={styles.titleImageEditButton}
                onClick={() => setShowTitleImageInput(true)}
                title='Edit Title Image'
                aria-label='Edit Title Image'
              >
                <Pencil size={24} className={styles.buttonIcon} />
              </button>
            </div>
            {showTitleImageInput && (
              <input
                type='file'
                name='titleImage'
                id='titleImageUpdate'
                accept='image/*'
                onChange={handleInputChange}
              />
            )}
            {formErrors.titleImage && (
              <p className={styles.fileInputError}>{formErrors.titleImage}</p>
            )}
          </div>
          <div className={styles.otherImagesContainer}>
            <label htmlFor='otherImagesUpdate'>Other Images</label>

            {listing.images.length > 0 && (
              <div className={styles.imageWrapper}>
                {listing.images.map((img, index) => {
                  return <UpdateImage img={img} key={index} />;
                })}
              </div>
            )}
            {showOtherImagesInput && (
              <>
                <p className={styles.uploadMessage}>
                  You can upload {remainingImages} more image
                  {remainingImages > 1 ? 's' : ''}.
                </p>
                <input
                  type='file'
                  name='otherImages'
                  id='otherImagesUpdate'
                  accept='image/*'
                  onChange={handleInputChange}
                  multiple
                />
              </>
            )}
            {formErrors.otherImages && (
              <p className={styles.fileInputError}>{formErrors.otherImages}</p>
            )}
          </div>

          <div className='formFooter'>
            <button
              type='button'
              className='cancelButton'
              onClick={setShowUpdateForm}
              title='Close without Saving'
            >
              Close without Saving
            </button>
            <button
              type='submit'
              className='saveButton'
              disabled={!isFormValid() || isLoading}
              title='Save Changes'
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
