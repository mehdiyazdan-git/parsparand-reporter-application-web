import React, { useEffect, useState } from 'react';
import SalesTable from "./SalesTable";
import useHttp from "../../hooks/useHttp";
import YearSelect from "../Year/YearSelect";
import {titleStyle, labelStyle} from "../styles/styles";
import useFilter from "../contexts/useFilter";
import ProductTypeSelect from "../../utils/ProductTypeSelect";
import getCurrentYear from "../../utils/functions/getCurrentYear";
import * as PropTypes from "prop-types";
import { BarLoader } from 'react-spinners';

function ErrorBoundary({ children }) {
    const [hasError, setHasError] = useState(false);
    const [errorInfo, setErrorInfo] = useState(null);

    useEffect(() => {
        const errorHandler = (error, errorInfo) => {
            setHasError(true);
            setErrorInfo(errorInfo);
            // You can also log the error here if needed:
            console.error('Error caught by ErrorBoundary:', error, errorInfo);
        };

        window.addEventListener('error', errorHandler);
        return () => {
            window.removeEventListener('error', errorHandler);
        };
    }, []); // Empty dependency array ensures this runs only once

    if (hasError) {
        return (
            <div>
                <h2>Something went wrong.</h2>
            </div>
        );
    }

    return children; // Render the child components if there's no error
}
const LoadingIndicator = () => {
    return (
        <BarLoader color="#0000FF" />
    );
};

ErrorBoundary.propTypes = {children: PropTypes.node};
const YearComparisonReport = () => {
    const http = useHttp();
    const listName = "year-comparison-report";
    const { filter, updateFilter, getParams } = useFilter(listName, {
        page: 0,
        size: 10,
        order: 'ASC',
        sortBy: 'id',
        jalaliYear: '',
        productType: 2,
    });

    const [year, setYear] = useState(filter.jalaliYear);
    const [productType, setProductType] = useState(filter.productType);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const productTypeOptions = [
        { value: 2, label: 'بشکه', measurementIndex: 'عدد' },
        { value: 6, label: 'ضایعات', measurementIndex: 'کیلوگرم' },
        { value: 1, label: 'مواد اولیه', measurementIndex: 'کیلوگرم' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                await http.get(`/reports/sales-by-month-and-product-type?${getParams(listName)}`);
                setIsLoading(false);
            } catch (err) {
                setError(err);
                setIsLoading(false);
            }
        };
        fetchData();
    }, [filter.jalaliYear,filter.productType]);

    const handleProductTypeChange = (selectedOption) => {
        setProductType(selectedOption.value);
        updateFilter(listName, { productType: selectedOption.value });
    };

    const handleYearChange = (selectedYear) => {
        setYear(selectedYear.value);
        updateFilter(listName, { jalaliYear: Number(selectedYear.value) });
    };

    return (
        <div className="container-fluid mt-4">
            <ErrorBoundary>
                <div className="row">
                    <strong style={{ ...titleStyle, color: "darkblue" }}>گزارش مقایسه ای سالیانه</strong>
                </div>
                <div className="row" style={{ width: "30%", marginTop: "0.5rem" }}>
                    <div className="col">
                        <ProductTypeSelect
                            value={productType}
                            onProductTypeChange={handleProductTypeChange}
                            options={productTypeOptions}
                        />
                    </div>
                    <div className="col">
                        <YearSelect
                            value={year}
                            onChange={handleYearChange}
                        />
                    </div>
                </div>
                {isLoading ? (
                    <LoadingIndicator />
                ) : (
                    <div className="container-fluid mt-2">
                        {filter.productType && (
                            <div>
                                <div style={labelStyle}>سال جاری</div>
                                <SalesTable
                                    productType={filter.productType}
                                    measurementIndex={productTypeOptions.find(o => o.value === filter.productType)?.measurementIndex || ''}
                                    jalaliYear={Number(filter.jalaliYear)}
                                />
                                <div style={labelStyle}>سال قبل</div>
                                <SalesTable
                                    productType={filter.productType}
                                    previousYear={1}
                                    measurementIndex={productTypeOptions.find(o => o.value === filter.productType)?.measurementIndex || ''}
                                    jalaliYear={Number(filter.jalaliYear)}
                                />
                            </div>
                        )}
                    </div>
                )}
            </ErrorBoundary>
        </div>
    );
};

export default YearComparisonReport;
