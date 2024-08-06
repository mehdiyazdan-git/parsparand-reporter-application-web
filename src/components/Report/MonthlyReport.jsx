import React, {useCallback, useEffect, useState} from 'react';
import MonthlyReportByProduct from "./MonthlyReportByProduct";
import Button from "../../utils/Button";
import PersianMonthSelect from "../../utils/PersianMonthSelect";
import AsyncSelectSearch from "../table/AsyncSelectSearch";



const type = {
    MAIN: 2,
    SCRAPT: 6,
    RAWMATERIAL: 1,
};

const MonthlyReport = () => {
    const [years, setYears] = useState([]);

   const [filter,setFilter] = useState({
        search: {
            jalaliYear: 1402,
            month: 1,
            productType : type.MAIN,
        },
    });
    const handleChange = (newSearch) => {
            setFilter({
            ...filter,
            search: {
                ...filter.search,
                ...newSearch,
            },
        });
        };
    const [loading, setLoading] = useState(true);

    const loadYears = useCallback(async () => {
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };// Load years from API
       await fetch("http://localhost:9090/api/years/select", requestOptions)
            .then((response) => response.text())
            .then((result) => JSON.parse(result))
            .then((result) => {
                return result.map((item) => ({ label: item.name, value: item.id }))
            })
            .then((result) => setYears(result))
            .catch((error) => console.error(error));
    }, []);

    useEffect(() => {
        setLoading(true);
        loadYears()
        setLoading(false);
    }, []);



    return loading ? (
        <p>{`loading...`}</p> // Loading indicator
    ) : (
        <div className="monthly-report row mb-2" style={{ fontFamily: "IRANSans" }}>
            <div className="col-6">
                <AsyncSelectSearch
                    url={'years/select'}
                    value={filter?.search?.jalaliYear}
                    onChange={value => handleChange({ 'jalaliYear' : value})}
                />
            </div>
            <div className="col-6">
                <PersianMonthSelect
                    month={filter?.search?.month}
                    onChange={value => handleChange({ 'month' : value})}
                />
            </div>
            <div>
                <div className="mt-2">
                    <MonthlyReportByProduct
                        filter={filter}
                    />
                </div>
                <Button variant="warning">برگشت</Button>
            </div>
        </div>
    );
};

export default MonthlyReport;

