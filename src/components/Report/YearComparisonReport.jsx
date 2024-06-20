import React, { useEffect } from 'react';
import Select from 'react-select';
import SalesTable from "./SalesTable";


import useHttp from "../../hooks/useHttp";
import YearSelect from "../Year/YearSelect";
import { getCustomSelectStyles } from "../../utils/customStyles";
import { titleStyle } from "../styles/styles";
import useFilter from "../contexts/useFilter";


const labelStyle = {
    color: '#ffffff',
    border: '1px #0056b3 solid',
    margin: 0,
    backgroundColor: 'rgba(3,33,76,0.4)'
};

const YearComparisonReport = ({ error }) => {

    const http = useHttp();
    const listName = "yearComparisonReport"
    const {filter,updateFilter,getParams} = useFilter(listName,() =>( {
        page : 0,
        size : 10,
        order : 'ASC',
        sortBy : 'id',
        jalaliYear: JSON.parse(sessionStorage.getItem('jalaliYear')),
    }));
    const initProductType = { value: 2, label: 'بشکه', measurementIndex: 'عدد' };

    const options = [
        { value: 2, label: 'بشکه', measurementIndex: 'عدد' },
        { value: 6, label: 'ضایعات', measurementIndex: 'کیلوگرم' },
        { value: 1, label: 'مواد اولیه', measurementIndex: 'کیلوگرم' },
    ];
    const handleProductTypeChange = (selectedOption) => {
        updateFilter({ 'productType': selectedOption.value });
    };
    const handleJalaliYearChange = (value,label) => {
        updateFilter({ 'jalaliYear': Number(label) });
    };



    useEffect(() => {
        if (!filter.productType) {
            updateFilter({ 'productType': initProductType.value });
            updateFilter({ 'jalaliYear': Number(JSON.parse(sessionStorage.getItem('jalaliYear'))) });
        }
    }, [filter]); // Only run once on mount

    return (
        <div className="container-fluid mt-4" style={{ fontFamily: 'IRANSans', fontSize: '0.85rem', textAlign: "center" }}>
            <div className="row">
                <strong style={{ ...titleStyle, color: "darkblue" }}>گزارش مقایسه ای سالیانه</strong>
            </div>
            <div className="row" style={{ width: "30%", marginTop: "0.5rem" }}>
                <div className="col">
                    <Select
                        placeholder="انتخاب..."
                        options={options}
                        value={{
                            value: filter?.productType,
                            label: options.find(o => o.value === filter?.productType)?.label,
                            measurementIndex: options.find(o => o.value === filter?.productType)?.measurementIndex,
                        }}
                        onChange={handleProductTypeChange}
                        styles={getCustomSelectStyles}
                    />
                </div>
                <div className="col">
                    <YearSelect
                        value={sessionStorage.getItem(`jalaliYear`)}
                        onChange={handleJalaliYearChange}
                        />
                </div>
            </div>
            <div className="container-fluid mt-2">
                {filter?.productType === 2 && (
                    <div>
                        <div style={labelStyle}>سال جاری</div>
                        <div>
                            <SalesTable
                                productType={2}
                                measurementIndex={options.find(o => o.value === filter?.productType).measurementIndex}
                                jalaliYear={filter?.jalaliYear}
                            />
                        </div>
                        <div style={labelStyle}>سال قبل</div>
                        <div>
                            <SalesTable
                                productType={2}
                                previousYear={1}
                                measurementIndex={options.find(o => o.value === filter?.productType).measurementIndex}
                                jalaliYear={filter?.jalaliYear}
                            />
                        </div>
                    </div>
                )}
                {filter?.productType === 6 && (
                    <div>
                        <div style={labelStyle}>سال جاری</div>
                        <div>
                            <SalesTable
                                productType={6}
                                measurementIndex={options.find(o => o.value === filter.productType).measurementIndex}
                                jalaliYear={filter?.jalaliYear}
                            />
                        </div>
                        <div className="table-year-label">سال قبل</div>
                        <div>
                            <SalesTable
                                productType={6}
                                previousYear={1}
                                measurementIndex={options.find(o => o.value === filter?.productType).measurementIndex}
                                jalaliYear={filter?.jalaliYear}
                            />
                        </div>
                    </div>
                )}
                {filter?.productType === 1 && (
                    <div>
                        <div style={labelStyle}>سال جاری</div>
                        <div>
                            <SalesTable
                                productType={1}
                                measurementIndex={options.find(o => o.value === filter?.productType).measurementIndex}
                                jalaliYear={filter?.jalaliYear}
                            />
                        </div>
                        <div style={labelStyle}>سال قبل</div>
                        <div>
                            <SalesTable
                                productType={1}
                                previousYear={1}
                                measurementIndex={options.find(o => o.value === filter?.productType).measurementIndex}
                                jalaliYear={filter?.jalaliYear}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default YearComparisonReport;
