import React, {useEffect, useState} from 'react';
import useHttp from "../../hooks/useHttp";
import PropTypes from "prop-types";
import AsyncSelect from "react-select/async";


const TableYear = ({filter,updateFilter,listName}) => {
    const http = useHttp();
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState([{label: '', value: ''}]);

    const loadOptions = async (inputValue, callback) => {
        if (inputValue.trim().length < 3) {
            callback([]);
            return;
        }
        const response = await http.get(`/years/select?`);
        callback(response.data.map((item) => ({
            label: item.name,
            value: item.id,
        })));
    };
    useEffect(() => {
        (async () => {
            const response = await http.get(`/years/select?`);
            setOptions(response.data.map((item) => ({
                label: item.name,
                value: item.id,
            })));
        })();
    }, []);


    const handleChange = (selectedOption) => {
        updateFilter(listName,{jalaliYear: selectedOption.value});
    };
    const handleInputChange = (inputValue) => {
        setInputValue(inputValue)
    };

    return (
        <div className="col-3 mt-3">
            <AsyncSelect
                value={options.find(option => option.label === filter?.jalaliYear)}
                defaultValue={options.find(year => year.label === JSON.parse(sessionStorage.getItem(`filter_${listName}`))?.jalaliYear)}
                placeholder="انتخاب سال"
                loadOptions={loadOptions}
                options={options}
                inputValue={inputValue}
                onChange={handleChange}
                onInputChange={handleInputChange}
            />
        </div>
    );
};
TableYear.prototype = {
    filter: PropTypes.object,
    updateFilter: PropTypes.func,
};

export default TableYear;
