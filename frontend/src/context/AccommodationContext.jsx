import { createContext, useState, useContext } from 'react';
import api from '../utils/api';
import { useAuth } from './UserAuthContext';
import { toast } from 'react-toastify';

export const AccommodationContext = createContext();

export const useAcco = () => useContext(AccommodationContext);

export default function AccommodationContextProvider({ children }) {
  const { setShowLogin } = useAuth();
  const [allAccos, setAllAccos] = useState([]);
  const [specialAccos, setSpecialAccos] = useState([]);
  const [currentAcco, setCurrentAcco] = useState(null);
  const [myListings, setMyListings] = useState([]);
  //Filters:
  const [stateFilter, setStateFilter] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [minRating, setMinRating] = useState('');
  //sort Options
  const [sortBy, setSortBy] = useState('pricePerNight');
  const [sortOrder, setSortOrder] = useState('asc');
  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  // map and gallery view in AccommodationList Component:
  const [selectedView, setSelectedView] = useState('gallery-view');
  //for update Listing Component
  const [imagesToDelete, setImagesToDelete] = useState([]);

  async function getAllAccommodations(limit) {
    try {
      const query = `?state=${stateFilter}&maxPrice=${maxPrice}&minPrice=${minPrice}&bedrooms=${bedrooms}&minRating=${minRating}&sortBy=${sortBy}&sortOrder=${sortOrder}&page=${currentPage}&limit=${limit}`;
      const response = await api.get(`/accommodations/all${query}`);
      if (response.status === 200) {
        setAllAccos(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getOneAccommodation(id) {
    try {
      const response = await api.get(`/accommodations/one/${id}`);
      if (response.status === 200) {
        setCurrentAcco(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getMyListings() {
    try {
      const response = await api.get('/accommodations/my', {
        withCredentials: true,
      });
      if (response.status === 200) {
        setMyListings(response.data);
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 403 || status === 401) {
        setShowLogin(true);
      } else {
        toast.error(error.response?.data?.msg || 'Server Error.');
      }
    }
  }

  async function addNewListing(formData) {
    console.log(formData);
    try {
      const response = await api.post('/accommodations', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        toast.success('New listing added');
        return response.data;
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 403 || status === 401) {
        setShowLogin(true);
      } else {
        toast.error(error.response?.data?.msg || 'Server Error.');
      }
    }
  }

  async function updateListing(id, formData) {
    console.log(formData);
    try {
      const response = await api.patch(
        `/accommodations/${id}?imagesToDelete=${imagesToDelete}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        toast.success('Listing updated');
        getMyListings();
        return response.data;
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 403 || status === 401) {
        setShowLogin(true);
      } else {
        toast.error(error.response?.data?.msg || 'Server Error.');
      }
    }
  }

  async function deleteListing(id) {
    try {
      const response = await api.delete(`/accommodations/${id}`);

      if (response.status === 200) {
        toast.success('Listing deleted');
        getMyListings();
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 403 || status === 401) {
        setShowLogin(true);
      } else {
        toast.error(error.response?.data?.msg || 'Server Error.');
      }
    }
  }

  async function postComment(id, comment) {
    try {
      const response = await api.post(`/accommodations/comment/${id}`, comment);

      setCurrentAcco(response.data);
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      if (status === 403 || status === 401) {
        setShowLogin(true);
      } else {
        toast.error(error.response?.data?.msg || 'Server Error.');
        return null;
      }
    }
  }

  async function deleteComment(commentId) {
    try {
      const response = await api.delete(`/accommodations/comment/${commentId}`);

      return response.data;
    } catch (error) {
      const status = error.response?.status;
      if (status === 403 || status === 401) {
        setShowLogin(true);
      } else {
        toast.error(error.response?.data?.msg || 'Server Error.');
        return null;
      }
    }
  }

  async function getSpecial() {
    try {
      const response = await api.get('/accommodations/special');
      setSpecialAccos(response.data);
    } catch (error) {
      console.error('Error deleting comment:', error);
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
        stateFilter,
        setStateFilter,
        maxPrice,
        setMaxPrice,
        minPrice,
        setMinPrice,
        bedrooms,
        setBedrooms,
        minRating,
        setMinRating,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        currentPage,
        setCurrentPage,
        postComment,
        deleteComment,
        specialAccos,
        setSpecialAccos,
        getSpecial,
        selectedView,
        setSelectedView,
        updateListing,
        imagesToDelete,
        setImagesToDelete,
      }}
    >
      {children}
    </AccommodationContext.Provider>
  );
}
