import React, {useEffect, useState} from 'react';
import SalesTable from "./SalesTable";
import YearSelect from "../Year/YearSelect";
import {titleStyle, labelStyle} from "../styles/styles";
import ProductTypeSelect from "../../utils/ProductTypeSelect";
import axios from "axios";
import PropTypes from "prop-types";
import {useFilter} from "../contexts/useFilter";


const getYearOptions = async () => {
    return await axios.get(`http://localhost:9090/api/years/select`)
        .then(res => res.data);
}

const YearComparisonReport = () => {

    const entityName = "year-comparison-report";
    const { filter, updateSearch} = useFilter(entityName, {
        jalaliYear: null,
        productType: null,
    });


    const [productType, setProductType] = useState(filter.productType);

    const productTypeOptions = [
        { value: 2, label: 'بشکه', measurementIndex: 'عدد' },
        { value: 6, label: 'ضایعات', measurementIndex: 'کیلوگرم' },
        { value: 1, label: 'مواد اولیه', measurementIndex: 'کیلوگرم' },
    ];



    const handleProductTypeChange = (selectedOption) => {
        setProductType(selectedOption.value);
        updateSearch({'productType': selectedOption.value});
    };

    const handleYearChange = (selectedYear) => {
        updateSearch({'jalaliYear': selectedYear});
    };

    useEffect(() => {
        getYearOptions().then(options => {
            updateSearch({ 'jalaliYear': options[0].name, 'productType': 2 });
        });
    }, []);


    return (
        <div className="container-fluid mt-4">

                <div className="row">
                    <strong style={{ ...titleStyle, color: "darkblue" }}>گزارش مقایسه ای سالیانه</strong>
                </div>
                <div className="row" style={{ width: "30%", marginTop: "0.5rem" }}>
                    <div className="col">
                        <ProductTypeSelect
                            value={productType}
                            onProductTypeChange={handleProductTypeChange}
                            options={productTypeOptions}
                        />
                    </div>
                    <div className="col">
                        <YearSelect
                            filter={filter}
                            onChange={handleYearChange}
                        />
                    </div>
                </div>
                    <div className="container-fluid mt-2">
                        {filter.productType && (
                            <div>
                                <div style={labelStyle}>سال جاری</div>
                                <SalesTable
                                    productType={filter.productType}
                                    previousYear={0}
                                    measurementIndex={productTypeOptions.find(o => o.value === filter.productType)?.measurementIndex || ''}
                                    filter={filter}
                                />
                                <div style={labelStyle}>سال قبل</div>
                                <SalesTable
                                    productType={filter.productType}
                                    previousYear={1}
                                    measurementIndex={productTypeOptions.find(o => o.value === filter.productType)?.measurementIndex || ''}
                                    filter={filter}
                                />
                            </div>
                        )}
                    </div>
        </div>
    );
};
SalesTable.propTypes = {
    productType: PropTypes.number.isRequired,
    previousYear: PropTypes.number.isRequired,
    measurementIndex: PropTypes.string.isRequired,
    filter: PropTypes.object.isRequired
};

export default YearComparisonReport;
