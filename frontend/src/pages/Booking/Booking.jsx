import React, { useState } from 'react';
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

  const isCreditCardValid = () => {
    const { cardNumber, expiryDate, cvv } = creditCardDetails;
    return (
      cardNumber.length === 16 &&
      /^[0-1][0-9]\/[0-9]{2}$/.test(expiryDate) && // MM/YY format check
      cvv.length === 3
    );
  };

  const handleBooking = () => {
    if (paymentMethod === 'creditcard' && !isCreditCardValid()) {
      toast.error('Please enter valid credit card details');
      return;
    }
    createBooking();
  };

  return (
    <section className={styles.bookingWrapper}>
      <h1>
        Booking for {user.firstName} {user.lastName}
      </h1>
      <p>You'll book: {bookingPreview.accommodation}</p>
      <p>Price per Night: {bookingPreview.pricePerNight}</p>
      <p>Guests: {currentBooking.numberOfGuests}</p>
      <p>CheckIn: {currentBooking.checkIn.toISOString().split('T')[0]}</p>
      <p>CheckOut: {currentBooking.checkOut.toISOString().split('T')[0]}</p>
      <p>Nights: {bookingPreview.nights}</p>
      <p>Total Price: {bookingPreview.totalPrice}</p>

      <div className={styles.paymentMethod}>
        <h2>Select Payment Method</h2>
        <label>
          <input
            type='radio'
            name='paymentMethod'
            value='creditcard'
            checked={paymentMethod === 'creditcard'}
            onChange={() => setPaymentMethod('creditcard')}
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

      {paymentMethod === 'creditcard' && (
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
          <h3>Enter Credit Card Details</h3>
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
          <button type='submit'>Submit</button>
        </form>
      )}

      {paymentMethod === 'banktransfer' && (
        <div className={styles.bankDetails}>
          <h2>
            Your payment must be received within 3 business days, otherwise, we
            will cancel the booking
          </h2>
          <h3>Bank Transfer Details</h3>
          <p>Account Name: ScareBnB</p>
          <p>IBAN: DE89 3704 0044 0532 0130 00</p>
          <p>BIC: COBADEFFXXX</p>
          <p>Bank Name: Commerzbank</p>
        </div>
      )}

      <button
        onClick={handleBooking}
        disabled={paymentMethod === 'creditcard' && !isCreditCardValid()}
      >
        Book Now
      </button>
    </section>
  );
}
