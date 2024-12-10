import { createContext, useState } from "react";

export const AccommodationContext = createContext();

export default function AccommodationContextProvider({ children }) {
    const [accoData, setAccoData] = useState({});

    return (
        <AccommodationContext.Provider value={{ accoData, setAccoData }}>
            {children}
        </AccommodationContext.Provider>
    );
}