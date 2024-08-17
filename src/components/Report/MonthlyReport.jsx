import React, {useEffect, useState, useCallback} from 'react';
import Button from "../../utils/Button";
import PersianMonthSelect from "../../utils/PersianMonthSelect";
import YearSelect from "../Year/YearSelect";
import getCurrentYear from "../../utils/functions/getCurrentYear";
import useHttp from "../contexts/useHttp";
import useDeepCompareEffect from "../../hooks/useDeepCompareEffect";
import {formatNumber} from "../../utils/functions/formatNumber";
import "./monthlyReport.css";
import axios from "axios";

const type = {
    MAIN: 2,
    SCRAPT: 6,
    RAWMATERIAL: 1,
};

const headerStyle = {
    backgroundColor: 'rgba(220, 220, 220, 0.1)',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    padding: '0.5rem',
    border: '1px #a5b6c9 solid',
};

const rowStyle = {
    fontSize: '0.75rem',
    color: '#333',
    textAlign: 'center',
    padding: '0.5rem',
    border: '1px #a5b6c9 solid',
    fontFamily: 'IRANSans',
    width: '14.30%',
};

const footerStyle = {
    backgroundColor: 'rgba(220, 220, 220, 0.3)',
    fontSize: '0.75rem',
    color: '#333',
    textAlign: 'center',
    padding: '0.5rem',
    border: '1px #a5b6c9 solid',
    fontFamily: 'IRANSans',
    fontWeight: 'bold',
    width: '14.30%',
};

const MonthlyReport = () => {
    const {get} = useHttp();
    const [years, setYears] = useState([]);
    const [filter, setFilter] = useState({
        search: {
            jalaliYear: getCurrentYear(),
            month: 1, // Default to January
            productType: type.MAIN,
        },
    });
    const [loading, setLoading] = useState(true);
    const [monthlyReport, setMonthlyReport] = useState([{
        customerName: '',
        totalAmount: 0,
        totalQuantity: 0,
        cumulativeTotalQuantity: 0,
        cumulativeTotalAmount: 0,
        avgUnitPrice: 0,
        relativePercentage: 0
    }]);
    const [subtotals, setSubtotals] = useState({
        quantity: 0,
        cumulative_quantity: 0,
        cumulative_amount: 0,
        amount: 0,
    });

    const handleChange = (newSearch) => {
        setFilter({
            ...filter,
            search: {...filter.search, ...newSearch},
        });
    };

    useEffect(() => {
        const loadYears = async () => {
            try {
                const response = await fetch('http://localhost:9090/api/years/select');
                if (!response.ok) {
                    throw new Error(`Error loading years: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                const formattedYears = data.map(item => ({label: item.name, value: item.id}));
                setYears(formattedYears);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadYears();
        if (!filter.search.jalaliYear) {
            if (years.length > 0) {
                handleChange({'jalaliYear': parseInt(years[0].label, 10)});
            } else {
                handleChange({'jalaliYear': getCurrentYear()});
            }
        }
    }, [filter.search.jalaliYear, years]);

    useDeepCompareEffect(() => {

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:9090/api/reports/sales-by-month-and-product-type',
            headers: {}
        };

        axios.request(config)
            .then((response) => {
                if (Array.isArray(response.data)) {
                    // Calculate totalAmount
                    const totalAmount = response.data.reduce((acc, row) => acc + row.totalAmount, 0);

                    // Transform data
                    const updatedData = response.data.map(row => ({
                        customerName: row.customerName,
                        totalAmount: row.totalAmount,
                        totalQuantity: row.totalQuantity,
                        cumulativeTotalQuantity: row.cumulativeTotalQuantity,
                        cumulativeTotalAmount: row.cumulativeTotalAmount,
                        avgUnitPrice: row.avgUnitPrice,
                        relativePercentage: totalAmount > 0 ? ((row.totalAmount / totalAmount) * 100).toFixed(2) : 0
                    }));

                    // Now you can use 'updatedData' which contains the transformed data with relative percentages.
                    console.log(updatedData);

                } else {
                    // Handle the case where response.data is not an array
                    console.error("Unexpected response format. Expected an array.");
                    // You might want to display an error message to the user or take other corrective actions.
                }
            })
            .catch((error) => {
                // Handle any errors that occurred during the request
                console.error("Error fetching data:", error);
                // Again, you might want to display an error message or handle the error gracefully.
            });


    },[]);



        const subtotal = useCallback(
                    () => monthlyReport.reduce((acc, curr) => acc + curr.totalAmount, 0),
                    [monthlyReport]
                );

                return (
                    loading ? <div>Loading...</div> :
                        <div className="monthly-report row mb-2" style={{fontFamily: "IRANSans"}}>
                            <div className="col-6">
                                <YearSelect
                                    value={filter.search.jalaliYear}
                                    onChange={value => handleChange({'jalaliYear': value})}
                                />
                            </div>
                            <div className="col-6">
                                <PersianMonthSelect
                                    month={filter?.search?.month}
                                    onChange={value => handleChange({'month': value})}
                                />
                            </div>
                            <div>
                                <div className="mt-2">
                                    <div className="monthly-report"
                                         style={{fontFamily: "IRANSans", backgroundColor: 'rgba(220, 220, 220, 0.2)'}}>
                                        <table style={{fontSize: "0.75rem", border: "1px #a5b6c9 solid"}}
                                               className="table table-bordered table-responsive">
                                            <thead>
                                            <tr style={{backgroundColor: 'rgba(220, 220, 220, 0.1)'}}>
                                                <th style={headerStyle}>ردیف</th>
                                                <th style={headerStyle}>نام شرکت</th>
                                                <th style={headerStyle}>تعداد ماه جاری</th>
                                                <th style={headerStyle}>تعداد تجمعی</th>
                                                <th style={headerStyle}>میانگین قیمت</th>
                                                <th style={headerStyle}>فروش ناخالص</th>
                                                <th style={headerStyle}>درصد نسبی</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {monthlyReport.map((row, index) => (
                                                <tr key={index}>
                                                    <td style={rowStyle}>{index + 1}</td>
                                                    <td style={rowStyle}>{row.customerName}</td>
                                                    <td style={rowStyle}>{formatNumber(row.totalQuantity)}</td>
                                                    <td style={rowStyle}>{formatNumber(row.cumulativeTotalQuantity)}</td>
                                                    <td style={rowStyle}>{formatNumber(row.avgUnitPrice)}</td>
                                                    <td style={rowStyle}>{formatNumber(row.totalAmount)}</td>
                                                    <td style={rowStyle}>{`${formatNumber(row.relativePercentage)} %`}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                            <tfoot>
                                            <tr>
                                                <td colSpan={2} style={footerStyle}>جمع کل:</td>
                                                <td style={footerStyle}>{formatNumber(subtotals?.quantity)}</td>
                                                <td style={footerStyle}>{formatNumber(subtotals?.cumulative_quantity)}</td>
                                                <td style={footerStyle}>{formatNumber(
                                                    isNaN(subtotals?.amount) || isNaN(subtotals?.quantity) || subtotals?.quantity === 0
                                                        ? 0
                                                        : ((subtotals?.amount) / subtotals?.quantity).toFixed(0)
                                                )}</td>
                                                <td style={footerStyle}>{formatNumber(subtotals?.amount)}</td>
                                                <td style={footerStyle}>{formatNumber(
                                                    subtotal() > 0
                                                        ? ((subtotals?.amount / subtotal()) * 100).toFixed(2)
                                                        : 0
                                                )}%
                                                </td>
                                            </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                                <Button variant="warning">برگشت</Button>
                            </div>
                        </div>
                );
            };

        export default MonthlyReport;
