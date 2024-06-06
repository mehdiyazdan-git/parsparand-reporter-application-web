import React, {useEffect, useState} from 'react';
import "./monthlyReport.css"
import useHttp from "../../hooks/useHttp";
import {useFilters} from "../contexts/FilterContext";

function MonthlyReportByProduct({productType,year, month}) {
    const http = useHttp();
    const {filters} = useFilters();
    const [monthlyReport, setMonthlyReport] = useState([]);

    useEffect(() => {
        async function loadMonthlyReport(productType){
            http.get(`/reports/by-product/${Number(year)}/${Number(month)}/${productType}`)
                .then(response => {
                    console.log(response.data)
                    setMonthlyReport(response.data);
                })
                .catch(error => {
                    console.log(error);
                });
        }
        loadMonthlyReport(productType)
    },[filters])
    const formatNumber = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
    const calculateSubtotals = (report) => {
        const subtotals = {
            id: '',
            name: 'جمع کل:',
            quantity: 0,
            cumulative_quantity: 0,
            cumulative_amount: 0,
            avg_unit_price: 0,
            amount: 0,
            relative_percentage: 0,
        };
        report.forEach(item => {
            subtotals.quantity += isNaN(item.totalQuantity) ? 0 : item.totalQuantity;
            subtotals.cumulative_quantity += isNaN(item.cumulativeTotalQuantity) ? 0 : item.cumulativeTotalQuantity;

            if (!isNaN(item.avgUnitPrice)) {
                subtotals.avg_unit_price += item.avgUnitPrice;
            }
            if (!isNaN(item.totalAmount)) {
                subtotals.amount += item.totalAmount;
            }
            if (!isNaN(item.cumulativeTotalAmount)) {
                subtotals.cumulative_amount += item.cumulativeTotalAmount;
            }
        });
        subtotals.relative_percentage = subtotals.amount / subtotals.cumulative_amount * 100;
        return subtotals;
    };


    // Calculate the subtotals
    const subtotals = calculateSubtotals(monthlyReport);
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
    }
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
    }

    return (
        <div className="monthly-report" style={{fontFamily:"IRANSans",backgroundColor: 'rgba(220, 220, 220, 0.2)'}}>
            <table style={{fontSize:"0.75rem",border:"1px #a5b6c9 solid"}} className="table table-bordered table-responsive">
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
                {monthlyReport.map((report, index) => {
                    const subtotal = monthlyReport.reduce((acc, curr) => acc + curr.totalAmount, 0);
                    const relativePercentage = subtotal === 0 ? 0 : (report.totalAmount / subtotal) * 100;

                    return (
                        <tr key={index}>
                            <td style={rowStyle}>{index+1}</td>
                            <td style={rowStyle}>{report.customerName}</td>
                            <td style={rowStyle}>{formatNumber(report.totalQuantity)}</td>
                            <td style={rowStyle}>{formatNumber(report.cumulativeTotalQuantity)}</td>
                            <td style={rowStyle}>{formatNumber((isNaN(report.cumulativeTotalQuantity) || isNaN(report.cumulativeTotalAmount) || report.cumulativeTotalQuantity === 0) ? 0 : Math.round(report.cumulativeTotalAmount/report.cumulativeTotalQuantity, 0))}</td>
                            <td style={rowStyle}>{formatNumber(report.cumulativeTotalAmount)}</td>
                            <td style={rowStyle}>{relativePercentage.toFixed(2)}%  </td>
                        </tr>
                    );
                })}
                </tbody>
                <tfoot>
                <tr>
                    <td colSpan={2} style={footerStyle}>{subtotals.name}</td>
                    <td style={footerStyle}>{formatNumber(subtotals.quantity)}</td>
                    <td style={footerStyle}>{formatNumber(subtotals.cumulative_quantity)}</td>
                    <td style={footerStyle}>{formatNumber(isNaN(subtotals.cumulative_amount) && isNaN(subtotals.cumulative_quantity) ? 0 : (subtotals.cumulative_amount / subtotals.cumulative_quantity).toFixed(0))}</td>
                    <td style={footerStyle}>{formatNumber((isNaN(subtotals.cumulative_amount) ? 0 : subtotals.cumulative_amount))}</td>
                </tr>
                </tfoot>

            </table>
        </div>
    );
}

export default MonthlyReportByProduct;
