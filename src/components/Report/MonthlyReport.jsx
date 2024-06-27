import React, {useEffect, useState} from 'react';
import MonthlyReportByProduct from "./MonthlyReportByProduct";
import Button from "../../utils/Button";
import useHttp from "../../hooks/useHttp";
import useFilter from "../contexts/useFilter";
import MonthYear from "./MonthYear";
import YearSelect from "../Year/YearSelect";

const MonthlyReport = () => {
    const [ data , setData ] = useState([]);
    const listName = 'monthlyReport';

    const http = useHttp();



    // useEffect(() => {
    //     async function getMonthlyReport() {
    //         const response =  await http.get(`/reports/sales-by-month-and-product-type?${getParams(listName).toString()}`);
    //         console.log(response.data)
    //         return response.data;
    //     }
    //     getMonthlyReport().then(r => setData(r));
    // }, []);


    return (
        <div
            className="monthly-report"
            style={{fontFamily: "IRANSans"}}
        >
            <MonthYear
                listName={listName}
            />
            <div className="col-3">
                <YearSelect
                    listName={listName}
                />
            </div>
            <div className="row mt-5">
                <div>
                    <MonthlyReportByProduct
                        productType={"2"}
                        listName={listName}
                        report={data}
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
