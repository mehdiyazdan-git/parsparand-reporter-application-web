import React, {useEffect, useState, useCallback, memo} from 'react';
import "./monthlyReport.css";
import useHttp from "../../hooks/useHttp";
import {formatNumber} from "../../utils/functions/formatNumber";
import useFilter from "../contexts/useFilter";
import getCurrentYear from "../../utils/functions/getCurrentYear";
import YearSelect from "../Year/YearSelect";
import MonthYear from "./MonthYear";
import PersianMonthSelect from "../../utils/PersianMonthSelect";

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



const MonthlyReportByProduct = memo(({productType, listName}) => {
    const http = useHttp();

    const {filter, getParams, updateFilter} = useFilter(listName, {
        productType: productType,
        jalaliYear: getCurrentYear(),
        month: 1,
    });
    const [month, setMonth] = useState(filter.month);
    const [year, setYear] = useState(filter.jalaliYear || getCurrentYear());
    const [monthlyReport, setMonthlyReport] = useState([]);
    const [subtotals, setSubtotals] = useState({
        quantity: 0,
        cumulative_quantity: 0,
        cumulative_amount: 0,
        amount: 0,
    });

    const loadMonthlyReport = useCallback(async () => {
        try {
            const params = getParams(listName);
            // Convert year in the parameters to the format expected by your API (if needed)
            const adjustedYear = params.get('jalaliYear');
            if (adjustedYear) {
                params.set('jalaliYear', adjustedYear); // Assuming your API uses the same 'jalaliYear' key
            }
            const response = await http.get(`/reports/sales-by-month-and-product-type?${params}`);
            setMonthlyReport(response.data);
        } catch (error) {
            console.log(error);
        }
    }, [getParams, listName]);

    useEffect(() => {
        Object.keys(filter).map((key) => {
            if (key === 'jalaliYear') {
                setYear(filter.jalaliYear);
            }
            if (key === 'month') {
                setMonth(filter.month);
            }
        })

    }, []);

    useEffect(() => {
        loadMonthlyReport();
    }, [filter.jalaliYear, filter.month]);

    useEffect(() => {
        if (!filter?.productType) {
            updateFilter(listName, {productType: 2});
        }
    }, [filter.jalaliYear, filter.month]);


    useEffect(() => {
        const calculatedSubtotals = monthlyReport.reduce((acc, curr) => {
            acc.quantity += curr.totalQuantity;
            acc.cumulative_quantity += curr.cumulativeTotalQuantity;
            acc.cumulative_amount += curr.cumulativeTotalAmount;
            acc.amount += curr.totalAmount;
            return acc;
        }, {quantity: 0, cumulative_quantity: 0, cumulative_amount: 0, amount: 0});
        setSubtotals(calculatedSubtotals);
    }, [monthlyReport]);

    const subtotal = useCallback(() => {
        return monthlyReport.reduce((acc, curr) => acc + curr.totalAmount, 0);
    }, [monthlyReport]);

    let handleYearChange = (selectedYear) => {
        setYear(selectedYear.value);  // Use selectedYear.value
        updateFilter(listName, { jalaliYear: selectedYear.value }); // Update the filter
    };

    let handleMonthChange = (month) => {
        setMonth(month)
        updateFilter(listName, {month: Number(month)});
    };

    return (
        <div className="monthly-report" style={{fontFamily: "IRANSans", backgroundColor: 'rgba(220, 220, 220, 0.2)'}}>
            <div className="row mt-3 mx-1 mb-3 ">
                <div className="row mt-3 mx-1 mb-3 ">
                    <div className="col-3">
                        <YearSelect value={year} onChange={handleYearChange}/>
                    </div>
                    <div className="col-3">
                        <PersianMonthSelect month={month} onChange={handleMonthChange}/>
                    </div>
                </div>
            </div>


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
                {monthlyReport.map((item, index) => (
                    <tr key={index}>
                        <td style={rowStyle}>{index + 1}</td>
                        <td style={rowStyle}>{item?.customerName}</td>
                        <td style={rowStyle}>{formatNumber(item?.totalQuantity)}</td>
                        <td style={rowStyle}>{formatNumber(item?.cumulativeTotalQuantity)}</td>
                        <td style={rowStyle}>{formatNumber(item?.avgUnitPrice ? item.avgUnitPrice : 0)}</td>
                        <td style={rowStyle}>{formatNumber(item?.totalAmount)}</td>
                        <td style={rowStyle}>{formatNumber(((item.totalAmount / subtotal()) * 100).toFixed(2))}%</td>
                    </tr>
                ))}
                </tbody>
                <tfoot>
                <tr>
                    <td colSpan={2} style={footerStyle}>جمع کل:</td>
                    <td style={footerStyle}>{formatNumber(subtotals?.quantity)}</td>
                    <td style={footerStyle}>{formatNumber(subtotals?.cumulative_quantity)}</td>
                    <td style={footerStyle}>{formatNumber(
                        isNaN(subtotals?.cumulative_amount) || isNaN(subtotals?.cumulative_quantity) || subtotals?.cumulative_quantity === 0
                            ? 0
                            : (subtotals?.cumulative_amount / subtotals?.cumulative_quantity).toFixed(0)
                    )}</td>
                    <td style={footerStyle}>{formatNumber(subtotals?.amount)}</td>
                    <td style={footerStyle}>{formatNumber(
                        isNaN(subtotals?.amount) || subtotal() === 0
                            ? 0
                            : ((subtotals?.amount) / subtotal()) * 100
                    )}%
                    </td>
                </tr>
                </tfoot>
            </table>
        </div>
    );
});

export default MonthlyReportByProduct;
