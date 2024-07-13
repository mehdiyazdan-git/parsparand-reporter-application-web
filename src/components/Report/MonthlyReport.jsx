import React, {useCallback, useEffect, useState} from 'react';
import MonthlyReportByProduct from "./MonthlyReportByProduct";
import Button from "../../utils/Button";
import YearSelect from "../Year/YearSelect";
import useFilter from "../contexts/useFilter";
import getYearOptions from "../../utils/functions/getYearOptions";
import PersianMonthSelect from "../../utils/PersianMonthSelect";
import useData from "../../hooks/useData";

const type = {
    MAIN: 2,
    SCRAPT: 6,
    RAWMATERIAL: 1,
}
const MonthlyReport = () => {
    const entityName = 'monthlyReport';
    const [loading,setLoading] = useState(false);

    const { filter, updateFilter,getParams} = useData(entityName,{
        jalaliYear: getYearOptions().then(options => options[0].name)
    });

    const handleYearChange = useCallback((selectedYear) => {
        updateFilter({'jalaliYear': selectedYear});
    }, [updateFilter]);

    const handleMonthChange = useCallback((selectedMonth) => {
        updateFilter({'month': selectedMonth});
    }, [updateFilter]);

    useEffect(() => {
        setLoading(true);

        getYearOptions().then(options => {
            updateFilter({ jalaliYear: options[0].name, productType: 2,month: 1 });
        });
        setLoading(false);
    }, [updateFilter]);

    return loading
        ? <p>{`loading...`}</p>
        : <>
            <div
                className="monthly-report row mb-2"
                style={{fontFamily: "IRANSans"}}
            >
                <div className="col-2">
                    <YearSelect
                        filter={filter}
                        onChange={handleYearChange}
                    />
                </div>
                <div className="col-2">
                    <PersianMonthSelect
                        month={filter?.month}
                        onChange={handleMonthChange}
                    />
                </div>
                <div>
                    <div className="mt-2">
                        <MonthlyReportByProduct
                            productType={type.MAIN}
                            filter={filter}
                            getParams={getParams}
                        />
                    </div>
                    <Button variant={"warning"}>
                        برگشت
                    </Button>
                </div>
            </div>
        </>
        ;
};

export default MonthlyReport;
