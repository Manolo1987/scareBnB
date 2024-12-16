import { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

export const AccommodationContext = createContext();

export const useAcco = () => useContext(AccommodationContext);

export default function AccommodationContextProvider({ children }) {
  const [allAccos, setAllAccos] = useState([]);
  const [currentAcco, setCurrentAcco] = useState(null);
  const [myListings, setMyListings] = useState([]);

  async function getAllAccommodations() {
    //apply filter, sort etc. here
    // apply loading state here
    try {
      const response = await api.get('/accommodations/all');
      setAllAccos(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function getOneAccommodation(id) {
    try {
      const response = await api.get(`/accommodations/one/${id}`);
      setCurrentAcco(response.data);
      console.log(response.data);
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
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    //getAllAccommodations(); //is working
    //getOneAccommodation('675954a6cbdf5dcef1f79d07'); //is working
    //getMyListings(); // in working
  }, []);

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
      }}
    >
      {children}
    </AccommodationContext.Provider>
  );
}
