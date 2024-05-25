import React, { createContext, useState, useContext, useEffect } from 'react';

const YearContext = createContext();

export const YearProvider = ({ children }) => {
    const [selectedYear, setSelectedYearState] = useState(() => {
        const storedYear = sessionStorage.getItem('selectedYear');
        return storedYear ? JSON.parse(storedYear) : null;
    });

    const setSelectedYear = (year) => {
        setSelectedYearState(year);
        sessionStorage.setItem('selectedYear', JSON.stringify(year));
    };

    return (
        <YearContext.Provider value={{ selectedYear, setSelectedYear }}>
            {children}
        </YearContext.Provider>
    );
};

export const useYear = () => useContext(YearContext);
