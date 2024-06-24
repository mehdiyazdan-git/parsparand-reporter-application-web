import React, {useEffect, useState} from 'react';
import useHttp from "../../hooks/useHttp";
import PropTypes from "prop-types";
import AsyncSelect from "react-select/async";


const TableYear = ({filter,updateFilter,listName}) => {
    const http = useHttp();
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState([{label: '', value: ''}]);


    useEffect(() => {
        (async () => {
            const response = await http.get(`/years/select?`);
            console.log(`/years/select:  `,response.data)
            setOptions(prevState =>  response.data.map((item) => ({
                label: item.name,
                value: item.id,
            })));
        })();
        setInputValue(filter?.jalaliYear ? filter.jalaliYear : options[0].label)
    }, []);

    return (
        <div className="col-3 mt-3">
            <AsyncSelect
                name={'jalaliYear'}
                value={options.find((option) => option.label === filter?.jalaliYear)}
                onChange={(option) => {
                    updateFilter(listName,{'jalaliYear' :option.label});
                }}
                loadOptions={async (inputValue) => {
                    const response = await http.get(`/years/select?name=${inputValue}`);
                    return response.data.map((item) => ({
                        label: item.name,
                        value: item.id,
                    }));
                }}
                defaultOptions={options}
                classNamePrefix="select"
                noOptionsMessage={() => "هیچ مورد یافت نشد"}
                placeholder="انتخاب سال"
                inputValue={inputValue}
                onInputChange={(newValue) => {
                    setInputValue(newValue);
                }}
            />
        </div>
    );
};
TableYear.prototype = {
    filter: PropTypes.object,
    updateFilter: PropTypes.func,
};

export default TableYear;
