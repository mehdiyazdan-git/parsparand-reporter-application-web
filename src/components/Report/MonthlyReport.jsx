import React, {useCallback, useEffect, useState} from 'react';
import MonthlyReportByProduct from "./MonthlyReportByProduct";
import Button from "../../utils/Button";
import PersianMonthSelect from "../../utils/PersianMonthSelect";
import {useFilter} from "../contexts/useFilter";
import useHttp from "../contexts/useHttp";
import AsyncSelectSearch from "../table/AsyncSelectSearch";



const type = {
    MAIN: 2,
    SCRAPT: 6,
    RAWMATERIAL: 1,
};

const MonthlyReport = () => {
    const http = useHttp();

   const [filter,setFilter] = useState({
        search: {
            jalaliYear: '',
            month: '',
        },
    });
    const handleChange = (search) => {
        setFilter((prev) => ({
            ...prev,
            search: {
                ...prev.search,
                ...search,
            },
        }));
        };




    const [years, setYears] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchYears = useCallback(async () => {
       return await http.get("years/select",'')
            .then((data) => {
                    return data.map((item) => {
                        return {
                            value: item.id,
                            label: item.name,
                        };
                    });
                })
            .catch((err) => {
                console.log(err);
            })
    }, []);

    useEffect(() => {
        fetchYears().then((data) => {
            setYears(data);
            setLoading(false);
        });
    }, [fetchYears]);



    return loading ? (
        <p>{`loading...`}</p> // Loading indicator
    ) : (
        <div className="monthly-report row mb-2" style={{ fontFamily: "IRANSans" }}>
            <div className="col-6">
                <AsyncSelectSearch
                    url={'years/select'}
                    value={years.find((item) => item.value === filter?.search?.jalaliYear)}
                    onChange={handleChange}
                />
            </div>
            <div className="col-6">
                <PersianMonthSelect
                    month={filter?.search?.month}
                    onChange={handleChange}
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

