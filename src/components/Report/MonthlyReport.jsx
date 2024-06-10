import React, {useEffect, useState} from 'react';
import MonthlyReportByProduct from "./MonthlyReportByProduct";
import Button from "../../utils/Button";
import { useFilters } from "../contexts/FilterContext";

const MonthlyReport = () => {
    const { filters, setFilter } = useFilters();
    const [ report , setReport ] = useState([]);
    const listName = 'monthlyReport';

    const handleMonthChange = (event) => {
        setFilter(listName, 'search', { ...filters[listName]?.search, month: parseInt(event.target.value, 10) });
    }

    useEffect(() => {
        setFilter(listName, 'search', { ...filters[listName]?.search, month: 1 });

        return () => {
            setFilter(listName, 'search', { ...filters[listName]?.search, month: 1 });
        };
    }, []);

    useEffect(() => {
        if (filters[listName]?.search?.month) {
            setReport([]);
        }
    }, [filters[listName]?.search?.month]);




    return (
        <div className="monthly-report" style={{ fontFamily: "IRANSans" }}>
            <div className="col-3 mt-2 align-content-lg-end">
                <select
                    style={{
                        boxSizing: "border-box",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        fontSize: "16px",
                        minWidth: "250px",
                        padding: "8px 12px",
                        transition: "border-color 0.2s ease-in-out",
                        width: "100%",
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    }}
                    onChange={handleMonthChange}
                    value={filters[listName]?.search?.month || 1}
                    className="table-search-input"
                    id="month"
                    name="month"
                    required
                >
                    <option value={1}>فروردین</option>
                    <option value={2}>اردیبهشت</option>
                    <option value={3}>خرداد</option>
                    <option value={4}>تیر</option>
                    <option value={5}>مرداد</option>
                    <option value={6}>شهریور</option>
                    <option value={7}>مهر</option>
                    <option value={8}>آبان</option>
                    <option value={9}>آذر</option>
                    <option value={10}>دی</option>
                    <option value={11}>بهمن</option>
                    <option value={12}>اسفند</option>
                </select>
            </div>

            <div className="row mt-5">
                <div>
                    <MonthlyReportByProduct
                        productType={"2"}
                        listName={listName}
                        report={report}
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
