import React, {useEffect, useState, useCallback, memo} from 'react';
import "./monthlyReport.css";

import {formatNumber} from "../../utils/functions/formatNumber";
import useHttp from "../contexts/useHttp";

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

const MonthlyReportByProduct = memo(({ filter }) => {
    const http = useHttp();
    const [monthlyReport, setMonthlyReport] = useState([]);
    const [subtotals, setSubtotals] = useState({
        quantity: 0,
        cumulative_quantity: 0,
        cumulative_amount: 0,
        amount: 0,
    });
    const { jalaliYear, month, productType } = filter;

    useEffect(() => {
        const url = "sales-by-month-and-product-type";
        const params = { jalaliYear, month, productType };

        http.get(url, { params })
            .then((result) => {
                // Calculate subtotalAmount directly
                const subtotalAmount = result.reduce((acc, row) => acc + row.totalAmount, 0);

                // Process data and update state in one go
                setMonthlyReport(
                    result.map((row) => ({
                        ...row,  // Include original properties for flexibility
                        averagePrice: (row.totalAmount / row.totalQuantity).toFixed(0) || 0,
                        percentage: ((row.totalAmount / subtotalAmount) * 100).toFixed(2) || 0,
                    }))
                );

                // Calculate subtotals more efficiently
                const newSubtotals = result.reduce(
                    (acc, row) => ({
                        quantity: acc.quantity + row.totalQuantity,
                        cumulative_quantity: acc.cumulative_quantity + row.cumulativeTotalQuantity,
                        cumulative_amount: acc.cumulative_amount + row.totalAmount,
                        amount: acc.amount + row.totalAmount,
                    }),
                    { ...subtotals } // Start with current subtotals
                );
                setSubtotals(newSubtotals);
            })
            .catch(console.error); // Handle errors
    }, [http, jalaliYear, month, productType]); // Proper dependency array

    // Remove unused loadMonthlyReport function

    const subtotal = useCallback(
        () => monthlyReport.reduce((acc, curr) => acc + curr.totalAmount, 0),
        [monthlyReport]
    );

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
