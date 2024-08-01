
import {createContext, useEffect, useState} from "react";
import useHttp from "../../hooks/useHttp";

const DataContext = createContext();

export const DataProvider = ({children, entityName, initialData, baseUrl}) => {


    const data = useData(entityName, initialData, baseUrl);

    return (
        <DataContext.Provider value={data}>
            {children}
        </DataContext.Provider>
 )};

const useData = (entityName, initialData, baseUrl) => {
    const { findAll } = useHttp(entityName);
    const [data, setData] = useState(initialData);

    const storageKey = `data-${entityName}`;

    // useEffect(() => {
    //     const storedData = JSON.parse(sessionStorage.getItem(storageKey));
    //     if (storedData) {
    //         setData(storedData);
    //     } else {
    //         findAll().then(response => {
    //             setData(response.data);
    //         });
    //     }
    // }, [entityName, initialData]);

    const setSessionStorageData = (newData) => {
        setData(newData);
        sessionStorage.setItem(storageKey, JSON.stringify(newData));
    };

    const getSessionStorageData = (
    ) => {
        return data;
    };

    return {
        data: getSessionStorageData(),
        setSessionStorageData
    };
};

export default useData;


const dataSchema = {
    content: [],
    pageable: {
        pageNumber: 0,
        pageSize: 10,
        sort: {
            empty: false,
            sorted: true,
            unsorted: false
        },
        offset: 0,
        unpaged: false,
        paged: true
    },
    last: false,
    subTotals : {
        'col_name': {
            'page_subtotal' : 0,
            'overall_subtotal' : 0
        },
        'col_name1': {
            'page_subtotal' : 0,
            'overall_subtotal' : 0
        }
    },
    size: 10,
    number: 0,
    numberOfElements: 0,
    first: true,
    empty: false
}
