import {createContext} from "react";
import axios from "axios";


const FilterContext = createContext(null);




const FilterContextProvider = ({ children }) => {
    return (
        <FilterContext.Provider value={null}>
            {children}
        </FilterContext.Provider>
    );
};

export {FilterContextProvider,FilterContext};