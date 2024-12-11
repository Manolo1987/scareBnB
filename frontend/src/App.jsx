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

export default function App() {
  return (
    <UserAuthContextProvider>
      <AccommodationContextProvider>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path='accommodation' element={<Accommodation />} />
            <Route path='accommodationlist' element={<AccommodationList />} />
            <Route path='account' element={<Account />} />
            <Route path='booking' element={<Booking />} />
            <Route path='information' element={<Information />} />
          </Route>
          <Route path='*' element={<NotFound />} />
        </Routes>
      </AccommodationContextProvider>
    </UserAuthContextProvider>
  )
}

