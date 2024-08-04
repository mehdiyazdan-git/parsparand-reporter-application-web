import React, {useEffect} from 'react';
import SalesTable from "./SalesTable";
import {titleStyle} from "../styles/styles";
import {useFilter} from "../contexts/useFilter";
import getCurrentYear from "../../utils/functions/getCurrentYear";
import useHttp from "../contexts/useHttp";
import AsyncSelectSearch from "../table/AsyncSelectSearch";

const AnnualReport = () => {
    const entityName = "annual";
    const { filter, updateSearch} = useFilter(entityName,{
        yearName: getCurrentYear(),
        productType: 2
    });
    const http = useHttp();
    const [years,setYears] = React.useState([]);


    useEffect(() => {
        http.get('years/select',null).then(data => {
            setYears(data.map(item => {
                return ({
                    value: item.id,
                    label: item.name
                });
        }));
            });
        }, []);


    return (
        <div className="container-fluid mt-4" style={{ fontFamily: "IRANSans",fontSize:"0.85rem" }}>
            <div className="row">
                <strong style={{...titleStyle,color:"darkblue"}}>گزارش فروش تجمیعی</strong>
            </div>
            <div className="col-3">
                <AsyncSelectSearch
                     url={'years/select'}
                     onChange={value => updateSearch({'yearName': value})}
                     value={filter?.search ? filter.search.yearName : ''}
                />
            </div>
            <div className="row">
                <SalesTable
                    productType="2"
                    previousYear={0}
                    label={"بشکه"}
                    measurementIndex={"عدد"}
                    filter={filter}
                    years={years}
                />
            </div>
            <div className="row">
                <SalesTable
                    productType="6"
                    previousYear={0}
                    label={"ضایعات"}
                    measurementIndex={"کیلو گرم"}
                    filter={filter}
                    years={years}
                />
            </div>
            <div className="row">
                <SalesTable
                    productType="1"
                    previousYear={0}
                    label={"مواد اولیه"}
                    measurementIndex={"کیلو گرم"}
                    filter={filter}
                    years={years}
                />
            </div>
        </div>
    );
};

export default AnnualReport;
