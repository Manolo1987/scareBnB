import { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

export const AccommodationContext = createContext();

export const useAcco = () => useContext(AccommodationContext);

export default function AccommodationContextProvider({ children }) {
  const [allAccos, setAllAccos] = useState([]);
  const [currentAcco, setCurrentAcco] = useState(null);
  const [myListings, setMyListings] = useState([]);
  //Filters:
  const [stateFilter, setStateFilter] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxBedrooms, setMaxBedrooms] = useState('');
  const [minBedrooms, setMinBedrooms] = useState('');
  const [minRating, setMinRating] = useState('');
  //sort Options
  const [sortBy, setSortBy] = useState('pricePerNight');
  const [sortOrder, setSortOrder] = useState('asc');
  //pagination
  const [currentPage, setCurrentPage] = useState(2);

  async function getAllAccommodations() {
    // apply loading state here
    try {
      const query = `?state=${stateFilter}&maxPrice=${maxPrice}&minPrice=${minPrice}&minBedrooms=${minBedrooms}&maxBedrooms=${maxBedrooms}&minRating=${minRating}&sortBy=${sortBy}&sortOrder=${sortOrder}&page=${currentPage}`;
      const response = await api.get(`/accommodations/all${query}`);
      setAllAccos(response.data);
      //console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function getOneAccommodation(id) {
    try {
      const response = await api.get(`/accommodations/one/${id}`);
      setCurrentAcco(response.data);
      //console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function getMyListings() {
    try {
      const response = await api.get('/accommodations/my', {
        withCredentials: true,
      });
      setMyListings(response.data);
      //console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  async function addNewListing(formData) {
    console.log(formData);
    try {
      const response = await api.post('/accommodations', formData, {
        //withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
      // if success navigate to myListings?
    } catch (error) {
      console.log(error.response);
    }
  }

  async function deleteListing(id) {
    try {
      const response = await api.delete(`/accommodations/${id}`);
      console.log(response.data.msg);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AccommodationContext.Provider
      value={{
        allAccos,
        setAllAccos,
        getAllAccommodations,
        currentAcco,
        setCurrentAcco,
        getOneAccommodation,
        myListings,
        setMyListings,
        getMyListings,
        addNewListing,
        deleteListing,
      }}
    >
      {children}
    </AccommodationContext.Provider>
  );
}
