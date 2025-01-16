import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Booking.module.css';
import { useBooking } from '../../context/bookingContext';
import { useAuth } from '../../context/UserAuthContext';
import { toast } from 'react-toastify';

export default function Booking() {
  const {
    currentBooking,
    createBooking,
    bookingPreview,
    paymentMethod,
    setPaymentMethod,
  } = useBooking();
  const { user } = useAuth();

  // State for credit card details and validation
  const [creditCardDetails, setCreditCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const [validationErrors, setValidationErrors] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const validateCardNumber = (value) => {
    if (!/^\d*$/.test(value)) {
      return 'Card number must contain only numbers.';
    }
    if (value.length < 16) {
      return 'Card number must be 16 digits.';
    }
    if (value.length > 16) {
      return 'Card number cannot exceed 16 digits.';
    }
    return 'Valid card number.';
  };

  const validateExpiryDate = (value) => {
    if (!/^\d{2}\/\d{2}$/.test(value)) {
      return 'Expiry date must be in MM/YY format.';
    }
    const [month, year] = value.split('/').map(Number);
    if (month < 1 || month > 12) {
      return 'Invalid month in expiry date.';
    }
    return 'Valid expiry date.';
  };

  const validateCVV = (value) => {
    if (!/^\d{3}$/.test(value)) {
      return 'CVV must be exactly 3 digits.';
    }
    return 'Valid CVV.';
  };

  const handleInputChange = (field, value) => {
    setCreditCardDetails((prev) => ({ ...prev, [field]: value }));

    if (value === '') {
      setValidationErrors((prev) => ({ ...prev, [field]: '' }));
      return;
    }

    let errorMessage = '';
    if (field === 'cardNumber') {
      errorMessage = validateCardNumber(value);
    } else if (field === 'expiryDate') {
      errorMessage = validateExpiryDate(value);
    } else if (field === 'cvv') {
      errorMessage = validateCVV(value);
    }

    setValidationErrors((prev) => ({ ...prev, [field]: errorMessage }));
  };

  const handleBooking = () => {
    if (
      paymentMethod === 'creditCard' &&
      Object.values(validationErrors).some(
        (error) =>
          error !== 'Valid card number.' &&
          error !== 'Valid expiry date.' &&
          error !== 'Valid CVV.'
      )
    ) {
      toast.error('Please fix the errors before proceeding.');
      return;
    }
    createBooking();
  };

  return (
    <section className={`${styles.BookingCard}`}>
      <h1>
        Booking for {user?.firstName} {user?.lastName}
      </h1>

      <div className={styles.infoContainer}>
        <div className={styles.img_container}>
          {bookingPreview && (
            <Link
              to={`/accommodationList/${bookingPreview?.accommodationTitle
                ?.toLowerCase()
                ?.replace(/\s+/g, '-')}?id=${bookingPreview?.accommodationId}`}
              state={{ id: bookingPreview?.accommodationId }}
              target='_blank'
              rel='noopener noreferrer'
              className={styles.viewButton}
            >
              <img
                src={bookingPreview?.accommodationTitleImage}
                alt='location-preview'
              />
            </Link>
          )}
        </div>
        <div>
          <h3>{bookingPreview?.accommodationTitle}</h3>
          <p>Price per Night: {bookingPreview?.pricePerNight}€</p>
          <p>Guests: {currentBooking.numberOfGuests}</p>
          <p>
            CheckIn:{' '}
            {new Date(currentBooking?.checkIn).toLocaleDateString('de-DE')}
          </p>
          <p>
            CheckOut:{' '}
            {new Date(currentBooking?.checkOut).toLocaleDateString('de-DE')}
          </p>
          <p>Total Nights: {bookingPreview?.nights}</p>
          <p>Total Price: {bookingPreview?.totalPrice}€</p>
        </div>
      </div>

      <div className={styles.paymentMethod}>
        <div className={styles.paymentMethodInfo}>
          <h3>Select Payment Method</h3>
          <label>
            <input
              type='radio'
              name='paymentMethod'
              value='creditCard'
              checked={paymentMethod === 'creditCard'}
              onChange={() => setPaymentMethod('creditCard')}
            />
            Credit Card
          </label>
          <label>
            <input
              type='radio'
              name='paymentMethod'
              value='banktransfer'
              checked={paymentMethod === 'banktransfer'}
              onChange={() => {
                setPaymentMethod('banktransfer');

                setCreditCardDetails({
                  cardNumber: '',
                  expiryDate: '',
                  cvv: '',
                });
                setValidationErrors({
                  cardNumber: '',
                  expiryDate: '',
                  cvv: '',
                });
              }}
            />
            Bank Transfer
          </label>
        </div>
      </div>

      {paymentMethod === 'creditCard' && (
        <form className={styles.creditCardForm}>
          <h3>Enter Credit Card Details</h3>
          <label>
            Card Number
            <input
              type='text'
              maxLength='16'
              value={creditCardDetails.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
            />
            <p
              className={
                validationErrors.cardNumber === 'Valid card number.'
                  ? styles.validMessage
                  : styles.errorMessage
              }
            >
              {validationErrors.cardNumber}
            </p>
          </label>
          <label>
            Expiry Date (MM/YY)
            <input
              type='text'
              maxLength='5'
              value={creditCardDetails.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
            />
            <p
              className={
                validationErrors.expiryDate === 'Valid expiry date.'
                  ? styles.validMessage
                  : styles.errorMessage
              }
            >
              {validationErrors.expiryDate}
            </p>
          </label>
          <label>
            CVV
            <input
              type='text'
              maxLength='3'
              value={creditCardDetails.cvv}
              onChange={(e) => handleInputChange('cvv', e.target.value)}
            />
            <p
              className={
                validationErrors.cvv === 'Valid CVV.'
                  ? styles.validMessage
                  : styles.errorMessage
              }
            >
              {validationErrors.cvv}
            </p>
          </label>
        </form>
      )}

      {paymentMethod === 'banktransfer' && (
        <div className={styles.bankDetails}>
          <h3>
            Your payment must be received within 3 business days, otherwise, we
            will cancel the booking
          </h3>
          <h4>Bank Transfer Details</h4>
          <p>Account Name: ScareBnB</p>
          <p>IBAN: DE89 3704 0044 0532 0130 00</p>
          <p>BIC: COBADEFFXXX</p>
          <p>Bank Name: Commerzbank</p>
        </div>
      )}

      <button
        onClick={handleBooking}
        disabled={
          paymentMethod === 'creditCard' &&
          (!creditCardDetails.cardNumber ||
            !creditCardDetails.expiryDate ||
            !creditCardDetails.cvv ||
            validationErrors.cardNumber !== 'Valid card number.' ||
            validationErrors.expiryDate !== 'Valid expiry date.' ||
            validationErrors.cvv !== 'Valid CVV.')
        }
        className={styles.bookButton}
      >
        Book Now
      </button>
    </section>
  );
}
