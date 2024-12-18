import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function UserAuthContextProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
    const togglePasswordVisibility = () => {
      setShowPassword((prevState) => !prevState);
    };

  const verifyAuth = async () => {
    try {
      const response = await api.get('/user/verify-token', {
        withCredentials: true,
      });
      if (response.status === 200) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error(
        'Token verification failed:',
        error.response?.data || error.message
      );
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verifyAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  // Registration
  const registration = async (formData) => {
    try {
      const response = await api.post('/user/register', formData);
      if (response.status === 201) {
        console.log(response);
        toast.success('Successfully registered!');
      }
    } catch (error) {
      console.error('Error during registration', error);
    }
  };

  // Login
  const login = async (formData) => {
    try {
      const response = await api.post('/user/login', formData, {
        withCredentials: true,
      });

      if (response.status === 200) {
        Cookies.set('jwt', response.data.token);
        setIsAuthenticated(true);
        toast.success('Login Successfull!');
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed, please check your credentials.');
      setIsAuthenticated(false);
    }
  };

  // fetchUserData

  const fetchUserData = async () => {
    try {
      const response = await api.get('/user/myProfile', {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUser(response.data.user);
        console.log(response.data.user);
        console.log('Data from fetchUserData', user);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching userdata', error);
    }
  };

  // Logout
  const logout = async () => {
    try {
      const response = await api.post('/user/logout');
      if (response.status === 200) {
        Cookies.remove('jwt', { path: '/' });
        setIsAuthenticated(false);
        toast.success('Goodbye!');
        setUser(null); // set User back to null
        navigate('/');

        window.location.reload();
      }
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };

  // update user profile

  const updateProfile = async (formData) => {
    try {
      const response = await api.put('/user/updateProfile', formData, {
        withCredentials: true,
      });
      if (response.status === 200) {
        toast.success('User updated succesfully');
        await fetchUserData();
      }
    } catch (error) {
      console.error('Error during update the user', error);
    }
  };

  // get all Users as Admin
  const getAllUsers = async () => {
    try {
      const response = await api.get('/user/allUsers', {
        withCredentials: true,
      });
      if (response.status === 200) {
        setAllUsers(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching userdata from all users');
    }
  };

  // delete user Profile by user

  const deleteMyProfile = async () => {
    try {
      const response = await api.delete('/user/deleteProfile', {
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success('Your Profil is deleted, goodbye!');
        await logout();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // delete user Profile by Admin

  const deleteUserAsAdmin = async (userId) => {
    try {
      const response = await api.delete(`/user/deleteUserAsAdmin/${userId}`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success('User deleted, well done!');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // user add his favourite accomodation

  const addFavourite = async (accommodationId) => {
    try {
      const response = await api.post(`/user/addFavourite/${accommodationId}`);
      if (response.status === 200) {
        toast.success('Added to favourites!');
        await fetchUserData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // user remove a favourite
  const removeFavourite = async (accommodationId) => {
    try {
      const response = await api.post(
        `/user/removeFavourite/${accommodationId}`
      );
      if (response.status === 200) {
        toast.success('Remove from favourites!');
        await fetchUserData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        registration,
        isLoading,
        updateProfile,
        fetchUserData, // use it at any time you need to update the user
        getAllUsers,
        allUsers, // to see all Users as an Admin
        deleteMyProfile,
        deleteUserAsAdmin,
        addFavourite,
        removeFavourite,
        showPassword,
        setShowPassword,
        togglePasswordVisibility
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
