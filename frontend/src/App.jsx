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
import Profile from './components/Account/Profile/Profile.jsx';
import Favourites from './components/Account/Favourites/Favourites.jsx';
import Bookings from './components/Account/Bookings/Bookings.jsx';
import Listings from './components/Account/Listings/Listings.jsx';
import HandleListings from './components/Account/HandleListings/HandleListings.jsx';
import AdminUserList from './components/Account/AdminUserList/AdminUserList.jsx';
import AdminAccoList from './components/Account/AdminAccoList/AdminAccoList.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <UserAuthContextProvider>
      <AccommodationContextProvider>
        <ToastContainer position='top-center' />
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path='accommodation' element={<Accommodation />} />
            <Route path='accommodationlist' element={<AccommodationList />} />
            <Route path='account' element={<Account />}>
              <Route path='profile' element={<Profile />} />
              <Route path='favourites' element={<Favourites />} />
              <Route path='bookings' element={<Bookings />} />
              <Route path='listings' element={<Listings />}>
                <Route path='handleListing' element={<HandleListings />} />
              </Route>
              <Route path='adminUserList' element={<AdminUserList />} />
              <Route path='adminAccoList' element={<AdminAccoList />} />
            </Route>
            <Route path='booking' element={<Booking />} />
            <Route path='information' element={<Information />} />
            <Route path='*' element={<NotFound />} />
          </Route>
        </Routes>
      </AccommodationContextProvider>
    </UserAuthContextProvider>
  );
}
