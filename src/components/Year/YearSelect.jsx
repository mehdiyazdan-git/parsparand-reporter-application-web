import React, {useEffect, useState} from 'react';
import AsyncSelect from 'react-select/async';
import useFilter from "../contexts/useFilter";

const YearSelect = ({onChange,value}) => {
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState([]);

    useEffect(() => {
        fetch('http://localhost:9090/api/years/select')
            .then(response => response.json())
            .then(data => {
                setOptions(data.map(year => ({ label: year.name.toString(), value: year.id })));
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        if (value) {
            const selectedOption = sessionStorage.getItem(`jalaliYear`) ? Number(options.find(option => option.label === sessionStorage.getItem(`jalaliYear`))) : null;
            if (selectedOption) {
                onChange( `jalaliYear`, Number(selectedOption.label))
            }
            setInputValue(selectedOption ? selectedOption.label : '');
        }
    }, [options]);

    const loadOptions = (inputValue, callback) => {
        fetch('http://localhost:9090/api/years/select')
            .then(response => response.json())
            .then(data => {
                callback(data.map(year => ({ label: year.name.toString(), value: year.id })));
            })
            .catch(error => console.error('Error fetching data:', error));
    };

    const handleInputChange = (newValue) => {
        setInputValue(newValue);
        loadOptions(newValue, (options) => {
            setOptions(options);
        });
    };


    return (
        <AsyncSelect
            value={sessionStorage.getItem(`jalaliYear`) ? options.find(option => option.label === sessionStorage.getItem(`jalaliYear`)) : null}
            // defaultValue={options.find(option => option.value === filter?.jalaliYear)}
            placeholder="انتخاب سال"
            noOptionsMessage={() => "سالی برای نمایش وجود ندارد"}
            loadOptions={loadOptions}
            getOptionLabel={option => option.label}
            getOptionValue={option => option.value}
            defaultOptions
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
