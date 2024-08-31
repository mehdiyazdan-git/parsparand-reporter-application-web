import React, {useEffect, useMemo, useRef, useState} from 'react';
import AsyncSelect from 'react-select/async';
import {Controller} from 'react-hook-form';
import {ConnectForm} from './ConnectForm';
import {getCustomSelectStyles} from './customStyles';
import useHttp from "../components/contexts/useHttp";


const AsyncSelectInput = ({name, url,onChange, value, isDisabled, label}) => {
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const ref = useRef();
    const {getAll} = useHttp();
    const labelStyle = useMemo(() => (
        {fontFamily: 'IRANSansBold', fontSize: '0.7rem'}
    ), []);

    // Fetch data from the API
    const fetchData = async (inputValue = '') => {
        return await getAll(encodeURI(url), {'searchQuery': encodeURIComponent(inputValue.trim())})
            .then(res => {
                    if (res && Array.isArray(res.data)) {
                        return res.data.map((record) => ({
                            label: record.name,
                            value: record.id,
                        }))
                    }
                }
            )
    };

    useEffect(() => {
        fetchData().then((data) => {
            setOptions(data);
            if (value) setSelectedOption(data.find((o) => o.value === value));
        });
    }, [value]);


    return (
        <ConnectForm>
            {({control, setValue,}) => (
                <Controller
                    name={name}
                    control={control}
                    render={(
                        {field,
                            fieldState: {error}}) => (
                        <div style={{position: 'relative'}}>
                            {label && <label style={labelStyle} htmlFor={name}>{label}</label>}
                            <AsyncSelect
                                {...field}
                                value={selectedOption}
                                onChange={(option) => {
                                    if (onChange) {
                                        onChange(option);
                                    } else {
                                        setValue(name, option?.value);
                                        setSelectedOption(option);
                                    }
                                }}
                                cacheOptions
                                loadOptions={fetchData}
                                ref={ref}
                                getOptionLabel={option => option.label}
                                getOptionValue={option => option.value}
                                defaultOptions={options}
                                placeholder={error ? error.message : 'انتخاب..'}
                                menuPortalTarget={document.body}
                                styles={{
                                    ...getCustomSelectStyles(error),
                                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                                    menuPortal: (base) => ({...base, zIndex: 9999}),
                                }}
                                isDisabled={isDisabled}
                            />
                        </div>
                    )}
                />
            )}
        </ConnectForm>
    );
};

export default AsyncSelectInput;