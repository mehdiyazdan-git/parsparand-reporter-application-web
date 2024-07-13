import React, {useEffect, useState, useCallback, memo} from 'react';
import "./monthlyReport.css";
import useHttp from "../../hooks/useHttp";
import {formatNumber} from "../../utils/functions/formatNumber";
import useFilter from "../contexts/useFilter";
import getCurrentYear from "../../utils/functions/getCurrentYear";
import YearSelect from "../Year/YearSelect";
import MonthYear from "./MonthYear";
import PersianMonthSelect from "../../utils/PersianMonthSelect";
import getYearOptions from "../../utils/functions/getYearOptions";

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

const MonthlyReportByProduct = memo(({ getParams, listName, filter, productType }) => {
    const http = useHttp();

    const [monthlyReport, setMonthlyReport] = useState([]);
    const [subtotals, setSubtotals] = useState({
        quantity: 0,
        cumulative_quantity: 0,
        cumulative_amount: 0,
        amount: 0,
    });

    const loadMonthlyReport = async () => {
        try {
            let productType = filter?.productType || 2;
            let jalaliYear = filter?.jalaliYear || await getYearOptions().then(options => options[0].name);
            let month = filter?.month || 1;
            let params = new URLSearchParams({
                productType,
                jalaliYear,
                month,
            });
            const response = await http.get(`/reports/sales-by-month-and-product-type?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    useEffect(() => {
        loadMonthlyReport().then((data) => {
            const subtotalAmount = data.reduce((acc, row) => acc + row.totalAmount, 0);
            const monthlyReport = data.map((row) => ({
                customerName: row.customerName,
                month: row.month,
                productType: row.productType,
                totalQuantity: row.totalQuantity,
                cumulativeTotalQuantity: row.cumulativeTotalQuantity,
                averagePrice: !isNaN(row.totalAmount / row.totalQuantity) ? (row.totalAmount / row.totalQuantity).toFixed(0) : 0,
                totalAmount: row.totalAmount,
                percentage: subtotalAmount > 0 ? ((row.totalAmount / subtotalAmount) * 100).toFixed(2) : 0,
            }));
            setMonthlyReport(monthlyReport);
            setSubtotals(monthlyReport.reduce((acc, curr) => ({
                quantity: acc.quantity + curr.totalQuantity,
                cumulative_quantity: acc.cumulative_quantity + curr.cumulativeTotalQuantity,
                cumulative_amount: acc.cumulative_amount + curr.totalAmount,
                amount: acc.amount + curr.totalAmount,
            }), {
                quantity: 0,
                cumulative_quantity: 0,
                cumulative_amount: 0,
                amount: 0,
            }));
        });
    }, [getParams, listName, filter]);

    const subtotal = useCallback(() => {
        return monthlyReport.reduce((acc, curr) => acc + curr.totalAmount, 0);
    }, [monthlyReport]);

    return (
        <div className="monthly-report" style={{fontFamily: "IRANSans", backgroundColor: 'rgba(220, 220, 220, 0.2)'}}>
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
                        <td style={rowStyle}>{formatNumber(row.averagePrice)}</td>
                        <td style={rowStyle}>{formatNumber(row.totalAmount)}</td>
                        <td style={rowStyle}>{`${formatNumber(row.percentage)} %`}</td>
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
    );
});

export default MonthlyReportByProduct;
