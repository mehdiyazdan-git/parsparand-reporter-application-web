import React from 'react';
import MonthlyReportByProduct from "./MonthlyReportByProduct";
import Button from "../../utils/Button";
import {useFilters} from "../contexts/FilterContext";
import getCurrentYear from "../../utils/functions/getCurrentYear";

const MonthlyReport = () => {
    const {filters,setFilter } = useFilters();
    const listName = 'monthlyReport';

    const persianMonths = [
        'فروردین',
        'اردیبهشت',
        'خرداد',
        'تیر',
        'مرداد',
        'شهریور',
        'مهر',
        'آبان',
        'آذر',
        'دی',
        'بهمن',
        'اسفند',
    ];

    const handleMonthChange = (event) => {
        setFilter(listName, 'month' , event.target.value);
    };
    return (
        <div className="monthly-report" style={{fontFamily:"IRANSans"}}>
            <div className="col-3 mt-2 align-content-lg-end">
                <select style={{
                    boxSizing: "border-box",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    fontSize: "16px",
                    minWidth: "250px",
                    padding: "8px 12px",
                    transition: "border-color 0.2s ease-in-out",
                    width: "100%",
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                }} value={filters[listName]?.month ? filters[listName]?.month : ''} onChange={handleMonthChange}>
                    <option value="">انتخاب ماه</option>
                    {persianMonths.map((persianMonth, index) => (
                        <option key={index} value={index + 1}>{persianMonth}</option>
                    ))}
                </select>
            </div>
            <div className="row mt-5">
                <div>
                    <MonthlyReportByProduct
                        productType={"2"}
                        month={filters[listName]?.month || 1}
                        year={filters?.years?.jalaliYear?.label || getCurrentYear()}
                    />
                </div>
            </div>
            <Button variant={"warning"}>
                برگشت
            </Button>
        </div>
    );
};

export default MonthlyReport;
