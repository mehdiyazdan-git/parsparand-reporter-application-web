import React, {useEffect} from 'react';
import SalesTable from "./SalesTable";
import {titleStyle} from "../styles/styles";
import YearSelect from "../Year/YearSelect";
import getYearOptions from "../../utils/functions/getYearOptions";
import useData from "../../hooks/useData";

const AnnualReport = () => {
    const entityName = "annual";
    const { filter, updateFilter} = useData(entityName,{
        jalaliYear: getYearOptions().then(options => options[0].name)
    });

    const handleJalaliYearChange = (value,label) => {
        updateFilter({ 'jalaliYear': value });
    };
    useEffect(() => {
        getYearOptions().then(options => {
            updateFilter({ jalaliYear: options[0].name, productType: 2 });
        });
    }, []);
    return (
        <div className="container-fluid mt-4" style={{ fontFamily: "IRANSans",fontSize:"0.85rem" }}>
            <div className="row">
                <strong style={{...titleStyle,color:"darkblue"}}>گزارش فروش تجمیعی</strong>
            </div>
            <div className="col-3">
                <YearSelect
                             onChange={handleJalaliYearChange}
                             filter={filter}
                />
            </div>
            <div className="row">
                <SalesTable productType="2" previousYear={0} label={"بشکه"} measurementIndex={"عدد"} filter={filter} />
            </div>
            <div className="row">
                <SalesTable productType="6" previousYear={0} label={"ضایعات"} measurementIndex={"کیلو گرم"} filter={filter}  />
            </div>
            <div className="row">
                <SalesTable productType="1" previousYear={0} label={"مواد اولیه"} measurementIndex={"کیلو گرم"} filter={filter}  />
            </div>
        </div>
    );
};

export default AnnualReport;
