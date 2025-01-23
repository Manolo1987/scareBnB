import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { useAuth } from './UserAuthContext.jsx';
import { useAcco } from './AccommodationContext.jsx';
import { useNavigate } from 'react-router-dom';

const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export const BookingContextProvider = ({ children }) => {
  const { isAuthenticated, user, setShowLogin } = useAuth();
  const { currentAcco, getAllAccommodations } = useAcco();
  const navigate = useNavigate();
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [myBookings, setMyBookings] = useState([]);
  const [myBookedListings, setMyBookedListings] = useState([]);

  const createBookingObject = () => ({
    accommodationId: currentAcco?._id || null,
    accommodation: currentAcco?.title || null,
    numberOfGuests,
    checkIn,
    checkOut,
    paymentMethod,
  });
  const [currentBooking, setCurrentBooking] = useState(createBookingObject);
  const createBookingPreview = () => ({
    accommodationTitle: currentAcco?.title || null,
    accommodationId: currentAcco?._id || null,
    accommodationTitleImage: currentAcco?.titleImage.secure_url || null,
    numberOfGuests,
    checkIn,
    checkOut,
    nights: Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)),
    pricePerNight: currentAcco?.pricePerNight || null,
    totalPrice:
      currentAcco?.pricePerNight *
      Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)),
  });
  const [bookingPreview, setBookingPreview] = useState(createBookingPreview);

  useEffect(() => {
    setCurrentBooking(createBookingObject());
    setBookingPreview(createBookingPreview());
  }, [currentAcco, checkIn, checkOut, numberOfGuests, paymentMethod]);

  // useEffect(() => {
  //   if (user) {
  //     setMyBookings(user?.bookings || []);
  //   }
  // }, [user]);

  const createBooking = async () => {
    try {
      const response = await api.post(
        '/bookings/createBooking',
        currentBooking
      );
      if (response.status === 201) {
        toast.success('Booking successful!');
        setMyBookings((prev) => [...prev, response.data.newBooking]);
        getAllAccommodations(21);
        setTimeout(() => {
          navigate('/account/bookings');
        }, 5000);
      }
      if (response.status === 403 || response.status === 401) {
        setShowLogin(true);
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 403 || status === 401) {
        setShowLogin(true);
      } else {
        toast.error(error.response?.data?.msg || 'Booking failed.');
      }
    }
  };

  const getMyBookings = async () => {
    try {
      const response = await api.get('/bookings/myBookings', {
        withCredentials: true,
      });
      if (response.status === 200) {
        setMyBookings(response.data.bookings);
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 403 || status === 401) {
        setShowLogin(true);
      } else {
        toast.error(error.response?.data?.msg || 'Server Error.');
      }
    }
  };

  const getMyBookedListings = async () => {
    try {
      const response = await api.get('/bookings/myBookedListings', {
        withCredentials: true,
      });
      if (response.status === 200) {
        setMyBookedListings(response.data.bookings);
      }
      if (response.status === 403 || response.status === 401) {
        setShowLogin(true);
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 403 || status === 401) {
        setShowLogin(true);
      } else {
        toast.error(error.response?.data?.msg || 'Server Error.');
      }
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      if (today > checkOut) {
        toast.error('You cannot cancel a booking in the past');
        return;
      }
      const response = await api.put(`/bookings/cancelBooking/${bookingId}`);
      if (response.status === 200) {
        toast.success('Booking cancelled successfully');

        await getMyBookings();
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 403 || status === 401) {
        setShowLogin(true);
      } else {
        toast.error(error.response?.data?.msg || 'Server Error.');
      }
    }
  };

  const giveFeedback = async (bookingId, feedback) => {
    console.log(bookingId, feedback);

    try {
      const response = await api.patch(`/bookings/giveFeedback/${bookingId}`, {
        feedback,
      });
      if (response.status === 200) {
        toast.success('Feedback given successfully');

        await getMyBookings();
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 403 || status === 401) {
        setShowLogin(true);
      } else {
        toast.error(error.response?.data?.msg || 'Server Error.');
      }
    }
  };

  return (
    <BookingContext.Provider
      value={{
        today,
        tomorrow,
        checkIn,
        checkOut,
        setCheckIn,
        setCheckOut,
        numberOfGuests,
        setNumberOfGuests,
        paymentMethod,
        setPaymentMethod,
        myBookings,
        myBookedListings,
        setMyBookedListings,
        createBooking,
        getMyBookedListings,
        currentBooking,
        bookingPreview,
        cancelBooking,
        giveFeedback,
        getMyBookings,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
