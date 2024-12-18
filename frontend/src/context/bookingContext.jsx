import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext.jsx';
import { useAcco } from './AccommodationContext.jsx';
import { useNavigate } from 'react-router-dom';

const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export const BookingContextProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const { currentAcco } = useAcco();
  const navigate = useNavigate();
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const createBookingObject = () => ({
    accommodationId: currentAcco?._id || null,
    numberOfGuests,
    checkIn,
    checkOut,
    paymentMethod,
  });
  const [currentBooking, setCurrentBooking] = useState(createBookingObject);
  const createBookingPreview = () => ({
    accommodation: currentAcco?._id || null,
    numberOfGuests,
    checkIn,
    checkOut,
  });
  const [bookingPreview, setBookingPreview] = useState(createBookingPreview);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    setCurrentBooking(createBookingObject());
    setBookingPreview(createBookingPreview());
  }, [currentAcco, checkIn, checkOut, numberOfGuests, paymentMethod]);

  const createBooking = async () => {
    try {
      const response = await api.post(
        '/bookings/createBooking',
        currentBooking
      );
      toast.success('Booking successful!');
      navigate('/my-bookings');
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Booking failed.');
    }
  };

  return (
    <BookingContext.Provider value={{}}>{children}</BookingContext.Provider>
  );
};
