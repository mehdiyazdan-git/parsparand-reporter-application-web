import React, {useEffect, useState} from 'react';
import AsyncSelect from 'react-select/async';
import useHttp from "../../hooks/useHttp";

const YearSelect = ({onChange,value}) => {
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState([{label: '', value: ''}]);
    const http = useHttp();

    const loadOptions = (inputValue, callback) => {
        http.get('/years/select')
            .then(response => callback(response.data.map(year => ({ label: year.name.toString(), value: year.id }))))
            .catch(error => console.error('Error fetching data:', error));
    };

    useEffect(() => {
        http.get('/years/select')
            .then(response => {
                setOptions(response.data.map(year => ({label: year.name.toString(), value: year.id})));
            })
            .then(() => setInputValue(options[0].label))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleInputChange = (newValue) => {
        setInputValue(newValue);
        loadOptions(newValue, (options) => {
            setOptions(options);
        });
    };


    return (
        <AsyncSelect
            value={value ? options.find(option => option.label === value.toString()) : options[0]}
            // defaultValue={options.find(option => option.value === filter?.jalaliYear)}
            placeholder="انتخاب سال"
            noOptionsMessage={() => "سالی برای نمایش وجود ندارد"}
            loadOptions={loadOptions}
            getOptionLabel={option => option.label}
            getOptionValue={option => option.value}
            defaultOptions
            inputValue={inputValue}
            onInputChange={sessionStorage.getItem(`jalaliYear`) ? handleInputChange : undefined}
            onChange={(option) => {
                if (option) {
                    sessionStorage.setItem(`jalaliYear`, option.label);
                    onChange( `jalaliYear`, option.label)
                }
            }}
        />
    );
};

export default YearSelect;
