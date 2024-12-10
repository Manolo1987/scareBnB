// import { createContext, useState } from "react";

// export const UserAuthContext = createContext();

// export default function UserAuthContextProvider({ children }) {
//     const [userData, setUserData] = useState({});

//     return (
//         <UserAuthContext.Provider value={{ userData, setUserData }}>
//             {children}
//         </UserAuthContext.Provider>
//     );
// }



import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null); // Neuen State für den Benutzer hinzufügen
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const verifyAuth = async () => {
        try {
            const response = await api.get("/user/verify-token", {
                withCredentials: true, // Wichtig: Cookies mitschicken
            });
            if (response.status === 200) {
                setIsAuthenticated(true);
                setUser(response.data.user); // Benutzer setzen
            }
        } catch (error) {
            console.error(
                "Token verification failed:",
                error.response?.data || error.message
            );
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false); // Prüfung abgeschlossen
        }
    };

    // Ohne Cookies.get("jwt")
    useEffect(() => {
        verifyAuth();
    }, []);

    // Login, Logout und Registrierung wie bisher
    const login = async (email, password) => {
        try {
            const response = await api.post(
                "/user/login",
                { email, password },
                { withCredentials: true }
            );

            if (response.status === 200) {
                setIsAuthenticated(true);
                toast.success("Erfolgreich eingeloggt!");
                setUser(response.data.user); // Benutzer nach erfolgreichem Login setzen
                Cookies.set("jwt1", response.data.token);
                navigate("/applications", { replace: true });
            }
        } catch (error) {
            console.error("Login failed:", error.response?.data || error.message);
            toast.error("Login fehlgeschlagen. Bitte überprüfe deine Zugangsdaten.");
            setIsAuthenticated(false);
        }
    };

    const logout = async () => {
        try {
            const response = await api.post("/user/logout");
            if (response.status === 200) {
                Cookies.remove("jwt", { path: "/" });
                Cookies.remove("jwt1");
                setIsAuthenticated(false);
                toast.success("Erfolgreich ausgeloggt!");
                setUser(null); // Benutzer-Informationen beim Logout löschen
                navigate("/");
                window.location.reload();
            }
        } catch (error) {
            console.log("Fehler beim Logout:", error);
        }
    };

    const registration = async (username, email, password) => {
        try {
            const response = await api.post("/user/register", {
                username,
                email,
                password,
            });
            if (response.status === 201) {
                toast.success("Erfolgreich registriert!");
                navigate("/login", { replace: true });
            }
        } catch (error) {
            // Extrahiere globale und spezifische Fehler
            const globalMsg =
                error.response?.data?.msg || "Ein unbekannter Fehler ist aufgetreten.";
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
};