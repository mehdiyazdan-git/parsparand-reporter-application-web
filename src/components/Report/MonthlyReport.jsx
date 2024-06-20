import React, {useEffect, useState} from 'react';
import MonthlyReportByProduct from "./MonthlyReportByProduct";
import Button from "../../utils/Button";
import YearSelect from "../Year/YearSelect";
import useHttp from "../../hooks/useHttp";
import useFilter from "../contexts/useFilter";




const MonthlyReport = () => {
    const [ report , setReport ] = useState([]);
    const listName = 'monthlyReport';
    const { filter, updateFilter,getParams } = useFilter(listName);
    const http = useHttp();
    const handleMonthChange = (event) => {
        updateFilter({ 'month': Number(event.target.value) });
    };

   async function getMonthlyReport(month, year) {
        return await http.get(`/reports/sales-by-month-and-product-type?${getParams(listName).toString()}`).then((r => r.data));
    }

    useEffect(() => {
        if (filter?.month) {
            const month = filter?.month;
            const year = filter?.jalaliYear;
            const data = getMonthlyReport(month, year);
            setReport(data);
        }
    }, [filter?.month, filter?.jalaliYear]);

    const handleJalaliYearChange = (value,label) => {
        updateFilter({ 'jalaliYear': Number(label) });
    };

    useEffect(() => {
       updateFilter({ 'month': 1 });
    }, []);

    // useEffect(() => {
    //     if (!filter.month) {
    //         setReport([]);
    //     }
    // }, [filter?.month]);




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
                    value={filter?.month || 1}
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
            <div className="col-3">
                <YearSelect  value={sessionStorage.getItem(`jalaliYear`)}
                             onChange={handleJalaliYearChange}
                />
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
