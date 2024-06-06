import React from 'react';
import SalesTable from "./SalesTable";
import {titleStyle} from "../styles/styles";

const AnnualReport = () => {
    return (
        <div className="container-fluid mt-4" style={{ fontFamily: "IRANSans",fontSize:"0.85rem" }}>
            <div className="row">
                <strong style={{...titleStyle,color:"darkblue"}}>گزارش فروش تجمیعی</strong>
            </div>
            <div className="row">
                <SalesTable productType="2" label={"بشکه"} measurementIndex={"عدد"} />
            </div>
            <div className="row">
                <SalesTable productType="6" label={"ضایعات"} measurementIndex={"کیلو گرم"} />
            </div>
            <div className="row">
                <SalesTable productType="1" label={"مواد اولیه"} measurementIndex={"کیلو گرم"} />
            </div>
        </div>
    );
};

export default AnnualReport;
