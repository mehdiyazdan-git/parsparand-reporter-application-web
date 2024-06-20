import React from 'react';
import SalesTable from "./SalesTable";
import {titleStyle} from "../styles/styles";
import YearSelect from "../Year/YearSelect";
import useFilter from "../contexts/useFilter";




const AnnualReport = () => {
    const { filter, updateFilter, getParams } = useFilter('annual');

    const handleJalaliYearChange = (value,label) => {
        updateFilter({ 'jalaliYear': Number(label) });
    };
    return (
        <div className="container-fluid mt-4" style={{ fontFamily: "IRANSans",fontSize:"0.85rem" }}>

            <div className="row">
                <strong style={{...titleStyle,color:"darkblue"}}>گزارش فروش تجمیعی</strong>
            </div>
            <div className="col-3">
                <YearSelect  value={{label:filter?.jalaliYear,value:filter?.jalaliYear}}
                             onChange={handleJalaliYearChange}
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
