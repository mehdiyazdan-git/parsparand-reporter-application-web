import React, {useCallback, useEffect, useState} from 'react';
import SalesTable from "./SalesTable";
import YearSelect from "../Year/YearSelect";
import {titleStyle} from "../styles/styles";
import ProductTypeSelect from "../../utils/ProductTypeSelect";
import useHttp from "../contexts/useHttp";
import {toast} from "react-toastify";


const productTypeOptions = [
    {value: 2, label: 'بشکه', measurementIndex: 'عدد'},
    {value: 6, label: 'ضایعات', measurementIndex: 'کیلوگرم'},
    {value: 1, label: 'مواد اولیه', measurementIndex: 'کیلوگرم'},
];


const YearComparisonReport = () => {
    const [currentYearData, setCurrentYearData] = useState([]);
    const [previousYearData, setPreviousYearData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const http = useHttp();

    const [filter, setFilter] = useState(() => {
        const storedFilter = JSON.parse(sessionStorage.getItem("filter_year_comparison_report"));
        return storedFilter ?? {
            currentYear: new Intl.DateTimeFormat('fa-IR').format(new Date()).substring(0, 4),
            previousYear: new Intl.DateTimeFormat('fa-IR').format(new Date()).substring(0, 4) - 1,
            productType: 2,
        };
    });

    const handleFilterChange = useCallback((newFilter) => {
        setFilter((prevFilter) => {
            const updatedFilter = {
                ...prevFilter,
                ...newFilter,
            };
            sessionStorage.setItem("filter_year_comparison_report", JSON.stringify(updatedFilter)); // Save to session storage
            return updatedFilter;
        });
    }, []);

    useEffect(() => {

        const fetchData = async () => {
            setIsLoading(true);

            try {
                const [currentYearResponse, previousYearResponse] = await Promise.all([
                    http.get('reports/sales-by-year', { yearName: filter.currentYear, productType: filter.productType }),
                    http.get('reports/sales-by-year', { yearName: filter.previousYear, productType: filter.productType })
                ]);
                setCurrentYearData(currentYearResponse);
                setPreviousYearData(previousYearResponse);
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
        <div className="container-fluid mt-4">
            <div className="row">
                <strong style={{ ...titleStyle, color: "darkblue" }}>گزارش مقایسه ای سالیانه</strong>
            </div>

            <div className="row" style={{ width: "30%", marginTop: "0.5rem" }}>
                <div className="col">
                    <ProductTypeSelect
                        value={filter.productType}
                        onChange={(value) => handleFilterChange({ productType: value })}
                        options={productTypeOptions}
                    />
                </div>
                <div className="col">
                    <YearSelect
                        value={filter.currentYear}
                        onChange={(value) => handleFilterChange({ currentYear: value, previousYear: parseInt(value, 10) - 1 })}
                    />
                </div>
            </div>

            <div className="container-fluid mt-2">
                {!isLoading && (
                    <>
                        <div>سال جاری ({filter.currentYear})</div>
                        <SalesTable
                            data={currentYearData}
                            measurementIndex={productTypeOptions.find(o => o.value === filter.productType)?.measurementIndex || ''}
                        />

                        <div>سال قبل ({filter.previousYear})</div>
                        <SalesTable
                            data={previousYearData}
                            measurementIndex={productTypeOptions.find(o => o.value === filter.productType)?.measurementIndex || ''}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default YearComparisonReport;

