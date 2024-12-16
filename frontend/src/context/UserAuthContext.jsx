import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function UserAuthContextProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Neuen State für den Benutzer hinzufügen
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Login, Logout und Registrierung wie bisher
  const login = async (formData) => {
    try {
      const response = await api.post('/user/login', formData, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setIsAuthenticated(true);
        toast.success('Login Successfull!');
        setUser(response.data.user); // Benutzer nach erfolgreichem Login setzen
        Cookies.set('jwt', response.data.token);
        console.log(response.data.user);
      }
    } catch (error) {
      console.error('Login failed:', error || error.message);
      toast.error('Login fehlgeschlagen. Bitte überprüfe deine Zugangsdaten.');
      setIsAuthenticated(false);
    }
  };

  const logout = async () => {
    try {
      const response = await api.post('/user/logout');
      if (response.status === 200) {
        Cookies.remove('jwt', { path: '/' });
        //Cookies.remove('jwt1');
        setIsAuthenticated(false);
        toast.success('Goodbye!');
        setUser(null); // Benutzer-Informationen beim Logout löschen
        navigate('/');
        
        window.location.reload();
      }
    } catch (error) {
      console.log('Fehler beim Logout:', error);
    }
  };

  const registration = async (formData) => {
    try {
      const response = await api.post('/user/register', formData);
      if (response.status === 201) {
        console.log(response);
        toast.success('Erfolgreich registriert!');
      }
    } catch (error) {
      // Extrahiere globale und spezifische Fehler
      const globalMsg =
        error.response?.data?.msg || 'Ein unbekannter Fehler ist aufgetreten.';
      const fieldErrors = error.response?.data?.errors || [];

      // Werfe ein detailliertes Fehlerobjekt
      throw {
        globalMsg,
        fieldErrors,
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user, // Den Benutzer hier verfügbar machen
        login,
        logout,
        registration,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
