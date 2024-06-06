import React from 'react';
import Select from 'react-select'
import {titleStyle} from "../styles/styles";
import SalesTable from "./SalesTable";
import {useFilters} from "../contexts/FilterContext";

const labelStyle = {
    color: '#ffffff',
    border: '1px #0056b3 solid',
    margin: 0,
    backgroundColor: 'rgba(3,33,76,0.4)'
}
const YearComparisonReport = ({ error }) => {

    const{filters,setFilter} = useFilters();
    const listName = 'yearComparisonReport';
    const initProductType = { value: "2", label: 'بشکه',measurementIndex : 'عدد' };

    const customStyles = {
        control: (provided) => ({
            ...provided,
            maxHeight: '200px',
            overflowY: 'auto',
            fontFamily: 'IRANSans',
            margin: 0,
            fontSize: '0.75rem',
            border: error ? '1px red solid' : '1px #ccc solid',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',

        }),
        option: (provided) => ({
            ...provided,
            fontSize: '0.75rem',
            color: 'black',
        }),
        placeholder: (provided) => ({
            ...provided,
            fontSize: '0.75rem',
            color: error ? 'red' : '#686666',
        }),
        dropdownIndicator : (provided) => ({
            ...provided,
            color : "#000"
        })
    };

    const options = [
        { value: "2", label: 'بشکه',measurementIndex : 'عدد' },
        { value: "6", label: 'ضایعات',measurementIndex : 'کیلوگرم' },
        { value: "1", label: 'مواد اولیه',measurementIndex : 'کیلوگرم' },
    ];

    const handleProductTypeChange = (selectedOption) => {
        setFilter(listName,'productType',selectedOption);
    };

    return (
        <div className="container-fluid mt-4" style={{ fontFamily: 'IRANSans', fontSize: '0.85rem',textAlign:"center" }}>
            <div className="row">
                <strong style={{...titleStyle,color:"darkblue"}}>گزارش مقایسه ای سالیانه</strong>
            </div>
            <div style={{width : "30%", marginTop : " 0.5rem"}}>
                <Select
                    placeholder="انتخاب..."
                    options={options}
                    value={filters[listName]?.productType || initProductType}
                    onChange={handleProductTypeChange}
                    styles={customStyles}
                />
            </div>
            <div className="container-fluid mt-2">
                {filters[listName]?.productType?.value === "2" && (
                    <div>
                        <div style={labelStyle}>سال جاری</div>
                        <div>
                            <SalesTable
                                productType={"2"}
                                measurementIndex={filters[listName]?.productType?.["measurementIndex"]}
                            />
                        </div>
                        <div
                            style={labelStyle}>سال قبل</div>
                        <div>
                            <SalesTable
                                productType={"2"}
                                previousYear={1}
                                measurementIndex={filters[listName]?.productType?.["measurementIndex"]}
                            />
                        </div>
                    </div>
                )}
                {filters[listName]?.productType?.value === "6" && (
                    <div>
                        <div style={labelStyle}>سال جاری</div>
                        <div><SalesTable productType={"6"} measurementIndex={filters[listName]?.productType?.["measurementIndex"]}/></div>
                        <div className="table-year-label">سال قبل</div>
                        <div>
                            <SalesTable
                                productType={"6"}
                                previousYear={1}
                                measurementIndex={filters[listName]?.productType?.["measurementIndex"]}
                            />
                        </div>
                    </div>
                )}
                {filters[listName]?.productType?.value === "1" && (
                    <div>
                        <div style={labelStyle}>سال جاری</div>
                        <div><SalesTable productType={"1"} measurementIndex={filters[listName]?.productType?.["measurementIndex"]}/></div>
                        <div style={labelStyle}>سال قبل</div>
                        <div>
                            <SalesTable
                                productType={"1"}
                                previousYear={1}
                                measurementIndex={filters[listName]?.productType?.["measurementIndex"]}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default YearComparisonReport;
