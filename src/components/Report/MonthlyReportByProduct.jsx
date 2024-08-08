import React, {useState, useCallback} from 'react';
import "./monthlyReport.css";

import {formatNumber} from "../../utils/functions/formatNumber";
import useHttp from "../contexts/useHttp";
import useDeepCompareEffect from "../../hooks/useDeepCompareEffect";

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

const MonthlyReportByProduct = ({filter}) => {
    const http = useHttp();
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

    useDeepCompareEffect(() => {
        const url = "reports/sales-by-month-and-product-type";
        http.get(url, {...filter.search})
            .then((data) => {
                if (Array.isArray(data)) {
                    const totalAmount = data.reduce((acc, row) => acc + row.totalAmount, 0);

                    // Calculate relativePercentage for each row
                    const updatedData = data.map(row => ({
                        customerName: row.customerName,
                        totalAmount: row.totalAmount,
                        totalQuantity: row.totalQuantity,
                        cumulativeTotalQuantity: row.cumulativeTotalQuantity,
                        cumulativeTotalAmount: row.cumulativeTotalAmount,
                        avgUnitPrice: row.avgUnitPrice,
                        relativePercentage: totalAmount > 0 ? ((row.totalAmount / totalAmount) * 100).toFixed(2) : 0
                    }));

                    setMonthlyReport(updatedData);

                    // Calculate subtotals (using updatedData)
                    const newSubtotals = updatedData.reduce((acc, row) => {
                        return {
                            quantity: acc.quantity + row.totalQuantity,
                            cumulative_quantity: acc.cumulative_quantity + row.cumulativeTotalQuantity,
                            amount: acc.amount + row.totalAmount,
                            cumulative_amount: acc.cumulative_amount + row.cumulativeTotalAmount
                        };
                    }, {quantity: 0, cumulative_quantity: 0, amount: 0, cumulative_amount: 0});

                    setSubtotals(newSubtotals);
                } else {
                    console.error("Unexpected data format from API:", data);
                }
            })
            .catch((error) => {
                console.error("Error fetching monthly report:", error);
            });
    }, [filter]);

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
    );
};

export default MonthlyReportByProduct;
