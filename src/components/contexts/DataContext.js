import React, {createContext, useContext, useState} from 'react';
import useDeepCompareEffect from "../../hooks/useDeepCompareEffect";

const DataContext = createContext(null);

export const DataProvider = ({children}) => {
    const [dataState, setDataState] = useState({});

    useDeepCompareEffect(() => {
        if (dataState) {
            console.log("data changed",dataState);
        }
    }, [dataState]);

    return (
        <DataContext.Provider value={{dataState,setDataState}}>
            {children}
        </DataContext.Provider>
    );
};
export const useDataContext = () => useContext(DataContext);
