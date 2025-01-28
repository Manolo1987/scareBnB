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
  const [favourites, setFavourites] = useState([]);
  const [allUsers, setAllUsers] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

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
      console.log(
        'Please log in to enjoy the full functionality of this website'
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
      const fetchData = async () => {
        await fetchUserData();
      };
      fetchData();
    }
  }, [isAuthenticated]);

  // useEffect(() => {
  //   if (user?.roles === 'admin') {
  //     const getUsers = async () => {
  //       await getAllUsers();
  //     };
  //     getUsers();
  //   }
  // }, [user]);

  // Registration
  const registration = async (formData) => {
    try {
      const response = await api.post('/user/register', formData);
      if (response.status === 201) {
        toast.success('Successfully registered!');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.msg);
      } else {
        console.error('Error during registration', error);
        toast.error('Registration failed');
      }
    }
  };

  // Login

  const fiveHoursLater = new Date();
  fiveHoursLater.setHours(fiveHoursLater.getHours() + 5);
  const login = async (formData) => {
    try {
      const response = await api.post('/user/login', formData, {
        withCredentials: true,
      });

      if (response.status === 200) {
        Cookies.set('jwt', response.data.token, {
          expires: fiveHoursLater,
          path: '/',
        });
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
        setFavourites(response.data.user.favourites || []);

        setIsLoading(false);
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 403 || status === 401) {
        setShowLogin(true);
      } else {
        toast.error(error.response?.data?.msg || 'Server Error.');
        console.error('Error fetching userdata', error);
      }
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

        Cookies.set('jwt', '', { expires: new Date(0), path: '/' });

        //window.location.reload();
      }
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Logout failed');
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
      const status = error.response?.status;
      if (status === 403 || status === 401) {
        setShowLogin(true);
      } else {
        toast.error(error.response?.data?.msg || 'Server Error.');
      }
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
      const status = error.response?.status;
      if (status === 403 || status === 401) {
        setShowLogin(true);
      } else {
        toast.error(error.response?.data?.msg || 'Server Error.');
      }
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
      const status = error.response?.status;
      if (status === 403 || status === 401) {
        setShowLogin(true);
      } else {
        toast.error(error.response?.data?.msg || 'Server Error.');
      }
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
        await getAllUsers();
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

  // user add his favourite accomodation

  const addFavourite = async (accommodationId) => {
    try {
      const response = await api.post(`/user/addFavourite/${accommodationId}`);
      if (response.status === 200) {
        await fetchUserData();
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

  // user remove a favourite
  const removeFavourite = async (accommodationId) => {
    try {
      const response = await api.delete(
        `/user/removeFavourite/${accommodationId}`
      );
      console.log(response);
      if (response.status === 200) {
        await fetchUserData();
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
        togglePasswordVisibility,
        favourites,
        showLogin,
        setShowLogin,
        showRegister,
        setShowRegister,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
