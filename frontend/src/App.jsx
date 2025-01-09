import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout/Layout.jsx';
import HomePage from './pages/HomePage/HomePage.jsx';
import Accommodation from './pages/Accommodation/Accommodation.jsx';
import AccommodationList from './pages/AccommodationList/AccommodationList.jsx';
import Account from './pages/Account/Account.jsx';
import Booking from './pages/Booking/Booking.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';
import Information from './pages/Information/Information.jsx';
import UserAuthContextProvider from './context/UserAuthContext.jsx';
import AccommodationContextProvider from './context/AccommodationContext.jsx';
import { BookingContextProvider } from './context/bookingContext.jsx';
import Profile from './components/Account/Profile/Profile.jsx';
import Favourites from './components/Account/Favourites/Favourites.jsx';
import Bookings from './components/Account/Bookings/Bookings.jsx';
import Listings from './components/Account/Listings/Listings.jsx';
import CreateListing from './components/Account/CreateListing/CreateListing.jsx';
import BookedListings from './components/Account/BookedListings/BookedListings.jsx';
import AdminUserList from './components/Account/AdminUserList/AdminUserList.jsx';
import AdminAccoList from './components/Account/AdminAccoList/AdminAccoList.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/Account/ProtectedRoute/ProtectedRoute.jsx';

export default function App() {
  return (
    <UserAuthContextProvider>
      <AccommodationContextProvider>
        <BookingContextProvider>
          <ToastContainer position='top-center' />
          <Routes>
            <Route path='/' element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route
                path='accommodationList/:title'
                element={<Accommodation />}
              />
              <Route path='accommodationList' element={<AccommodationList />} />
              <Route
                path='account'
                element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                }
              >
                <Route path='profile' element={<Profile />} />
                <Route path='favourites' element={<Favourites />} />
                <Route path='bookings' element={<Bookings />} />
                <Route path='listings' element={<Listings />} />
                <Route path='add-new-listing' element={<CreateListing />} />
                <Route path='bookedListings' element={<BookedListings />} />
                <Route path='listings' element={<Listings />} />
                <Route path='adminUserList' element={<AdminUserList />} />
                <Route path='adminAccoList' element={<AdminAccoList />} />
              </Route>
              <Route
                path='booking'
                element={
                  <ProtectedRoute>
                    <Booking />
                  </ProtectedRoute>
                }
              />
              <Route path='information' element={<Information />} />
            </Route>
            <Route path='*' element={<NotFound />} />
          </Routes>
        </BookingContextProvider>
      </AccommodationContextProvider>
    </UserAuthContextProvider>
  );
}
