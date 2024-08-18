import React, {useCallback, useEffect, useState} from 'react';
import Button from "../../utils/Button";
import PersianMonthSelect from "../../utils/PersianMonthSelect";
import getCurrentYear from "../../utils/functions/getCurrentYear";
import useHttp from "../contexts/useHttp";
import {formatNumber} from "../../utils/functions/formatNumber";
import "./monthlyReport.css";
import AsyncSelectSearch from "../table/AsyncSelectSearch";
import {toast} from "react-toastify";

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
    const {getAll} = useHttp();
    const [years, setYears] = useState([]);
    const [filter, setFilter] = useState(() => {
        const storedFilters = JSON.parse(sessionStorage.getItem("monthly-report"));
        return storedFilters ?? {
            jalaliYear: getCurrentYear(),
            month: 1, // Default to January
            productType: type.MAIN,
        };
    });
    const handleFilterChange = useCallback((newFilter) => {
        setFilter((prevFilter) => {
            const updatedFilter = {...prevFilter, ...newFilter};
            sessionStorage.setItem("monthly-report", JSON.stringify(updatedFilter));
            return updatedFilter;
        });
    }, []);
    const fetchYears = useCallback(async () => {
        try {
            setLoading(true)
            const yearData = await getAll('years/select', {});
            const yearOptions = yearData.data.map(item => ({label: item.name, value: item.id}));
            setYears(yearOptions);

            if (!filter.jalaliYear && yearOptions.length > 0) {
                handleFilterChange({jalaliYear: yearOptions[0].label});
            }
        } catch (err) {
            console.error("Error fetching data:", err);
            // Handle the error gracefully
        } finally {
            setLoading(false); // Set loading to false regardless of success or error
        }
    }, [filter.jalaliYear, handleFilterChange]);

    const calculateSubtotals = useCallback((data) => {
        return data.reduce((acc, row) => {
            acc.quantity += row.totalQuantity;
            acc.cumulative_quantity += row.cumulativeTotalQuantity;
            acc.cumulative_amount += row.cumulativeTotalAmount;
            acc.amount += row.totalAmount;
            return acc;
        }, {
            quantity: 0,
            cumulative_quantity: 0,
            cumulative_amount: 0,
            amount: 0,
        });
    }, []);

    const [loading, setLoading] = useState(true);
    const [monthlyReport, setMonthlyReport] = useState([{
        customerName: '',
        totalAmount: 0,
        totalQuantity: 0,
        cumulativeTotalQuantity: 0,
        cumulativeTotalAmount: 0,
        avgUnitPrice: 0
    }]);
    const [subtotals, setSubtotals] = useState({
        quantity: 0,
        cumulative_quantity: 0,
        cumulative_amount: 0,
        amount: 0,
    });
    const fetchData = useCallback(async () => {
            try {
                setLoading(true)
                const response = await getAll('reports/sales-by-month-and-product-type', {
                    jalaliYear: filter.jalaliYear,
                    month: filter.month,
                    productType: filter.productType,
                });
                if (response.data && Array.isArray(response.data)) {
                    const totalAmount = response.data.reduce((acc, row) => acc + row.totalAmount, 0);
                    const updatedData = response.data.map(row => ({
                        ...row, relativePercentage: totalAmount > 0 ? ((row.totalAmount / totalAmount) * 100).toFixed(2) : 0
                    }))
                    setMonthlyReport(updatedData);
                    setSubtotals(calculateSubtotals(response.data))
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                if (!err.response) {
                    toast.error('network error')
                } else if (err.response && err.response.data.length > 0) {
                    toast.error(err.response.data)
                }
            } finally {
                setLoading(false); // Set loading to false regardless of success or error
            }
        },
        [filter]);


    useEffect(() => {
        fetchYears();
        fetchData();
    }, []);

    useEffect(() => {
        fetchData();
    }, [filter]); // Fetch data whenever the filter changes

    const subtotal = useCallback(
        () => monthlyReport.reduce((acc, curr) => acc + curr.totalAmount, 0),
        [monthlyReport]
    );

    return (
        loading ? <div>Loading...</div> :
            <div className="monthly-report row mb-2" style={{fontFamily: "IRANSans"}}>
                <div className="col-6">
                    <AsyncSelectSearch
                        url="years/select?"
                        value={years.find(item => item.label === filter.jalaliYear)}
                        onChange={value => handleFilterChange({jalaliYear: value?.label})} // Update here
                    />
                </div>
                <div className="col-6">
                    <PersianMonthSelect
                        month={filter?.month}
                        onChange={value => handleFilterChange({month: value})}
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
