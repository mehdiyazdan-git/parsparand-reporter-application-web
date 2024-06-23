import React, {useEffect, useState} from 'react';
import AsyncSelect from 'react-select/async';
import useHttp from "../../hooks/useHttp";
import years from "./Years";





const YearSelect = ({onChange,value,listName,filter,updateFilter}) => {
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState([{label: '', value: ''}]);
    const http = useHttp();


    useEffect(() => {
        if (!JSON.parse(sessionStorage.getItem(`filter_${listName}`))) {
            const jalaliYear = options.find(option => option.value === value)?.label;
            updateFilter(listName,{jalaliYear: jalaliYear});
        }
    }, [listName]);

    useEffect(() => {
        if (!value) {
            setInputValue('');
        }else {
            setInputValue(value);
        }
    }, [value]);

    useEffect(() => {
        if (filter?.jalaliYear) {
            setInputValue(filter.jalaliYear);
        }
    }, [filter]);

    useEffect(() => {
        if (inputValue) {
            loadOptions(inputValue, (options) => {
                setOptions(options);
            });
        }
    }, [inputValue]);

    function handleChange(newValue) {
        onChange(newValue?.value);
        sessionStorage.setItem(`jalaliYear`, JSON.stringify({jalaliYear: newValue?.value}));
    }
    const handleInputChange = (newValue) => {
        setInputValue(newValue);
        loadOptions(newValue, (options) => {
            setOptions(options);
        });
    };

    function loadOptions(inputValue, callback) {
        http.get('/years/select')
            .then(response => callback(response.data.map(year => ({ label: year.name.toString(), value: year.id }))))
            .catch(error => console.error('Error fetching data:', error));
    }
    const render = () => (
        <AsyncSelect
            value={years.find(year => year.id === value)}
            defaultValue={years.find(year => year.id === filter?.jalaliYear)}
            placeholder="انتخاب سال"
            loadOptions={loadOptions}
            options={options}
            onChange={handleChange}
            onInputChange={handleInputChange}
        />
    )
    return render();

};

export default YearSelect;
