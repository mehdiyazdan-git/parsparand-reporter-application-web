import React, {useCallback, useEffect, useState} from 'react';
import SalesTable from "./SalesTable";
import {titleStyle} from "../styles/styles";
import useHttp from "../contexts/useHttp";
import YearSelect from "../Year/YearSelect";
import {toast} from "react-toastify";

const productTypeOptions = [
    {value: 2, label: 'بشکه', measurementIndex: 'عدد'},
    {value: 6, label: 'ضایعات', measurementIndex: 'کیلوگرم'},
    {value: 1, label: 'مواد اولیه', measurementIndex: 'کیلوگرم'},
];

const productTypes = {
    'MAIN' : 2,
    'SCRAPT' : 6,
    'RAWMATERIAL' : 1
}


const AnnualReport = () => {
    const [filter, setFilter] = useState(() => {
        const storedFilter = JSON.parse(sessionStorage.getItem("annual_report"));
        return storedFilter ?? { // Use nullish coalescing operator to provide default if no stored filter
            yearName: new Intl.DateTimeFormat('fa-IR').format(new Date()).substring(0, 4),
        };
    });

    const [productData, setProductData] = useState([]);
    const [scraptData, setScrapData] = useState([]);
    const [rawMaterialData, setRawMaterialData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const http = useHttp();

    const handleFilterChange = useCallback((newFilter) => {
        setFilter((prevFilter) => {
            const updatedFilter = {
                ...prevFilter,
                ...newFilter,
            };
            sessionStorage.setItem("annual_report", JSON.stringify(updatedFilter)); // Save to session storage
            return updatedFilter;
        });
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            try {
                const [productData,scraptData,rawMaterialData] = await Promise.all([
                    http.get('reports/sales-by-year', { yearName: filter.yearName, productType: productTypes.MAIN }),
                    http.get('reports/sales-by-year', { yearName: filter.yearName, productType: productTypes.SCRAPT }),
                    http.get('reports/sales-by-year', { yearName: filter.yearName, productType: productTypes.RAWMATERIAL })
                ]);
                    setProductData(productData);
                    setScrapData(scraptData);
                    setRawMaterialData(rawMaterialData);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("خطا در دریافت اطلاعات. لطفا مجددا تلاش کنید.", { autoClose: 3000 });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData(); // Fetch data whenever the filter changes
    }, [filter]);


    return (
        <div className="container-fluid mt-4" style={{ fontFamily: "IRANSans",fontSize:"0.85rem" }}>
            <div className="row">
                <strong style={{...titleStyle,color:"darkblue"}}>گزارش فروش تجمیعی</strong>
            </div>
            <div className="col-3">
                <YearSelect
                    value={filter.yearName}
                    onChange={(value) => handleFilterChange({ 'yearName': value })}
                />
            </div>
            <div className="row">
                <SalesTable
                    data={productData}
                    measurementIndex={productTypeOptions.find(o => o.value === filter.productType)?.measurementIndex || ''}
                />
            </div>
            <div className="row">
                <SalesTable
                    data={scraptData}
                    measurementIndex={productTypeOptions.find(o => o.value === filter.productType)?.measurementIndex || ''}
                />
            </div>
            <div className="row">
                <SalesTable
                    data={rawMaterialData}
                    measurementIndex={productTypeOptions.find(o => o.value === filter.productType)?.measurementIndex || ''}
                />
            </div>
        </div>
    );
};

export default AnnualReport;
