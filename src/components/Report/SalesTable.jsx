import React, {useContext, useEffect, useState} from 'react';
import Table from "react-bootstrap/Table";
import useHttp from "../../hooks/useHttp";
import {formatNumber} from "../../utils/functions/formatNumber";
import axios from "axios";
import PropTypes from "prop-types";
import useDeepCompareEffect from "../../hooks/useDeepCompareEffect";


const headerStyle = {
    backgroundColor: 'rgba(220, 220, 220, 0.1)',
    fontSize: '0.75rem',
    fontFamily:'IRANSans',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    padding: '0.5rem',
    border: '1px #a5b6c9 solid',
};
const rowStyle = {
    fontSize: '0.75rem',
    fontFamily:'IRANSans',
    color: '#333',
    textAlign: 'center',
    padding: '0.5rem',
    border: '1px #a5b6c9 solid',
    width: '14.30%',
    backgroundColor: 'rgba(240, 240, 240, 0.9)',
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

const getYearOptions = async () => {
    return await axios.get(`http://localhost:9090/api/years/select`)
      .then(res => res.data);
}

const SalesTable = ({
                        label,
                        previousYear,
                        measurementIndex ,
                        filter,
                        productType,
    entityName
                    }) => {
    const http = useHttp();

    const [reportData, setReportData] = useState([
        {
            monthNumber: 1,
            monthName: '',
            totalAmount: 0,
            totalQuantity: 0,
        },
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let yearName;
                if (filter?.jalaliYear && filter?.jalaliYear.toString().length === 4) {
                   yearName = filter.jalaliYear - previousYear;
                }else {
                    const years = await getYearOptions();
                    yearName = years.find(y => y.name === filter.jalaliYear).value - previousYear;
                }
                const response = await http.get(`/reports/sales-by-year?yearName=${yearName}&productType=${productType}`);
                setReportData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setReportData([]);
            }
        };
        fetchData();
        }, [previousYear, measurementIndex, filter]);

    const firstHalfData = reportData.slice(0, 6);
    const secondHalfData = reportData.slice(6, 12);
    const totalQuantityFirstHalf = firstHalfData.reduce((acc, item) => acc + item.totalQuantity, 0);
    const totalAmountFirstHalf = firstHalfData.reduce((acc, item) => acc + item.totalAmount, 0);
    const totalQuantitySecondHalf = secondHalfData.reduce((acc, item) => acc + item.totalQuantity, 0);
    const totalAmountSecondHalf = secondHalfData.reduce((acc, item) => acc + item.totalAmount, 0);

    const {data} = useContext(entityName);

    useDeepCompareEffect(() => {
        console.log(data?.content)
    }, [data]);
    return (
        <div style={{ fontSize: "0.7rem" }}>
            <div className="row mt-2">
                {label && <label style={{ fontSize: "0.9rem", fontWeight: "bold", color: "darkblue" }}>{label}</label>}
                <div>
                    <Table style={{ backgroundColor: 'rgba(100, 110, 120, 0.4)' }}>
                        <thead>
                        <tr style={{ border: "1px #ccc solid" }}>
                            <th style={{ width: "12.50%",...headerStyle }}>شش ماه اول</th>
                            <th style={{ width: "12.50%",...headerStyle }}>فروردین</th>
                            <th style={{ width: "12.50%",...headerStyle }}>اردیبهشت</th>
                            <th style={{ width: "12.50%",...headerStyle }}>خرداد</th>
                            <th style={{ width: "12.50%",...headerStyle }}>تیر</th>
                            <th style={{ width: "12.50%",...headerStyle }}>مرداد</th>
                            <th style={{ width: "12.50%",...headerStyle }}>شهریور</th>
                            <th style={{ width: "12.50%",minWidth:"8.75rem" ,...headerStyle}}>جمع نیم سال</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td style={rowStyle}>مبلغ (ریال)</td>
                            {firstHalfData.map((item, index) => (
                                <td style={{ width: "12.50%",...rowStyle }} key={index}>{formatNumber(item.totalAmount)}</td>
                            ))}
                            <td style={{ fontWeight: 'bold',...rowStyle }}>{formatNumber(totalAmountFirstHalf)}</td>
                        </tr>
                        <tr>
                            <td style={rowStyle}>{measurementIndex}</td>
                            {firstHalfData.map((item, index) => (
                                <td style={rowStyle} key={index}>{formatNumber(item.totalQuantity)}</td>
                            ))}
                            <td style={{ fontWeight: 'bold',...rowStyle }}>{formatNumber(totalQuantityFirstHalf)}</td>
                        </tr>
                        <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                            <td style={headerStyle}>شش ماهه دوم</td>
                            {secondHalfData.map((item, index) => (
                                <td style={headerStyle} key={index}>
                                    {item.monthName}
                                </td>
                            ))}
                            <td style={headerStyle}>{formatNumber(totalAmountSecondHalf)}</td>
                        </tr>
                        <tr>
                            <td style={rowStyle}>مبلغ (ریال)</td>
                            {secondHalfData.map((item, index) => (
                                <td style={rowStyle} key={index}>{formatNumber(item.totalAmount)}</td>
                            ))}
                            <td style={{ fontWeight: 'bold',...rowStyle }}>{formatNumber(totalAmountSecondHalf)}</td>
                        </tr>
                        <tr>
                            <td style={rowStyle}>{measurementIndex}</td>
                            {secondHalfData.map((item, index) => (
                                <td style={rowStyle} key={index}>{formatNumber(item.totalQuantity)}</td>
                            ))}
                            <td style={{ fontWeight: 'bold',...rowStyle }}>{formatNumber(totalQuantitySecondHalf)}</td>
                        </tr>
                        </tbody>
                        <tfoot>
                        <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', border: '1px #ccc solid' }}>
                            <td style={footerStyle} colSpan={7}>
                                {`جمع کل (${measurementIndex})`}
                            </td>
                            <td style={footerStyle}>{formatNumber(totalQuantityFirstHalf + totalQuantitySecondHalf)}</td>
                        </tr>
                        <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', border: '1px #ccc solid' }}>
                            <td style={footerStyle} colSpan={7}>
                                جمع کل (ریالی)
                            </td>
                            <td style={footerStyle}>{formatNumber(totalAmountFirstHalf + totalAmountSecondHalf)}</td>
                        </tr>
                        </tfoot>
                    </Table>
                </div>
            </div>
        </div>
    );
};


SalesTable.propTypes = {
    label: PropTypes.string,
    previousYear: PropTypes.number.isRequired,
    measurementIndex: PropTypes.string.isRequired,
    filter: PropTypes.shape({
        jalaliYear: PropTypes.number,
        productType: PropTypes.number
    }),
    productType: PropTypes.number.isRequired,
};

export default SalesTable;
