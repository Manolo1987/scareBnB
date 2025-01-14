import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Booking.module.css';
import { useBooking } from '../../context/bookingContext';
import { useAuth } from '../../context/UserAuthContext';
import { toast } from 'react-toastify';

export default function Booking() {
  const navigate = useNavigate();
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

  const isCreditCardValid = () => {
    const { cardNumber, expiryDate, cvv } = creditCardDetails;
    return (
      cardNumber.length === 16 &&
      /^[0-1][0-9]\/[0-9]{2}$/.test(expiryDate) && // MM/YY format check
      cvv.length === 3
    );
  };

  const handleBooking = () => {
    if (paymentMethod === 'creditCard' && !isCreditCardValid()) {
      toast.error('Please enter valid credit card details');
      return;
    }
    createBooking();
  };

  return (
    <section className={`${styles.BookingCard}`}>
      <h1>
        Booking for {user.firstName} {user.lastName}
      </h1>

      <div className={styles.infoContainer}>
        <div className={styles.img_container}>
          {bookingPreview && (
            <Link
              to={`/accommodationList/${bookingPreview.accommodationTitle
                .toLowerCase()
                .replace(/\s+/g, '-')}?id=${bookingPreview.accommodationId}`}
              state={{ id: bookingPreview.accommodationId }}
              target='_blank'
              rel='noopener noreferrer'
              className={styles.viewButton}
            >
              <img
                src={bookingPreview.accommodationTitleImage}
                alt='location-preview'
              />
            </Link>
          )}
        </div>
        <div>
          <h3>{bookingPreview.accommodationTitle}</h3>
          <p>Price per Night: {bookingPreview.pricePerNight}€</p>
          <p>Guests: {currentBooking.numberOfGuests}</p>
          <p>
            CheckIn: {new Date(currentBooking.checkIn).toLocaleDateString()}
          </p>
          <p>
            CheckOut: {new Date(currentBooking.checkOut).toLocaleDateString()}
          </p>
          <p>Total Nights: {bookingPreview.nights}</p>
          <p>Total Price: {bookingPreview.totalPrice}€</p>
        </div>
      </div>

      <div className={styles.paymentMethod}>
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
            onChange={() => setPaymentMethod('banktransfer')}
          />
          Bank Transfer
        </label>
      </div>

      {paymentMethod === 'creditCard' && (
        <form
          className={styles.creditCardForm}
          onSubmit={(e) => {
            e.preventDefault();
            if (isCreditCardValid()) {
              toast.success('Credit card details are valid');
            } else {
              toast.error('Please enter valid credit card details');
            }
          }}
        >
          <h3 className={styles.creditCardHeader} styles={{ color: '#7d23f3' }}>
            Enter Credit Card Details
          </h3>
          <label>
            Card Number
            <input
              type='text'
              maxLength='16'
              value={creditCardDetails.cardNumber}
              onChange={(e) =>
                setCreditCardDetails({
                  ...creditCardDetails,
                  cardNumber: e.target.value,
                })
              }
            />
          </label>
          <label>
            Expiry Date (MM/YY)
            <input
              type='text'
              maxLength='5'
              value={creditCardDetails.expiryDate}
              onChange={(e) =>
                setCreditCardDetails({
                  ...creditCardDetails,
                  expiryDate: e.target.value,
                })
              }
            />
          </label>
          <label>
            CVV
            <input
              type='text'
              maxLength='3'
              value={creditCardDetails.cvv}
              onChange={(e) =>
                setCreditCardDetails({
                  ...creditCardDetails,
                  cvv: e.target.value,
                })
              }
            />
          </label>
          <button type='submit' className={styles.submitButtonCreditcard}>
            Submit
          </button>
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
        className={styles.bookButton}
        onClick={handleBooking}
        disabled={paymentMethod === 'creditCard' && !isCreditCardValid()}
      >
        Book Now
      </button>
    </section>
  );
}
