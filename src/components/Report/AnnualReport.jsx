import React from 'react';
import SalesTable from "./SalesTable";
import {titleStyle} from "../styles/styles";
import YearSelect from "../Year/YearSelect";
import useFilter from "../contexts/useFilter";
import getCurrentYear from "../../utils/functions/getCurrentYear";




const AnnualReport = () => {
    const listName = "annual";
    const { filter, updateFilter} = useFilter('annual',{
        jalaliYear: getCurrentYear()
    });

    const handleJalaliYearChange = (value,label) => {
        updateFilter(listName,{ 'jalaliYear': value });
    };
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
                <SalesTable productType="2" label={"بشکه"} measurementIndex={"عدد"} jalaliYear={filter?.jalaliYear} />
            </div>
            <div className="row">
                <SalesTable productType="6" label={"ضایعات"} measurementIndex={"کیلو گرم"} jalaliYear={filter?.jalaliYear}  />
            </div>
            <div className="row">
                <SalesTable productType="1" label={"مواد اولیه"} measurementIndex={"کیلو گرم"} jalaliYear={filter?.jalaliYear}  />
            </div>
        </div>
    );
};

export default AnnualReport;
