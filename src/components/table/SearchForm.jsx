import React, {createRef, forwardRef, useEffect, useMemo, useState} from 'react';
import {NumericFormat} from "react-number-format";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import FormDate from "./FormDate";

const SearchForm = ({columns,handleChange,handleResetSearch,searchObject}) => {

    const getComponent =(column) => {
        switch (column.type) {
            case 'text':
                return <TextInput name={column.key} value={searchObject[column.key]} onChange={handleChange} />;
            case 'number':
                return <NumberInput name={column.key} value={searchObject[column.key]} onChange={handleChange} />;
            case 'select':
                return <SelectInput name={column.key} value={searchObject[column.key]} options={column.options} onChange={handleChange} />;
            case 'asyncSelect':
                return <AsyncSelectInput name={column.key} defaultValue={searchObject[column.key]} onChange={handleChange} loadOptions={column.loadOptions} />;
            case 'date':
                return <FormDate name={column.key} value={searchObject[column.key]} onChange={handleChange} />;
            case 'checkbox':
                return <CheckboxInput name={column.key} value={searchObject[column.key]} onChange={handleChange} />;
            default:
                return <TextInput name={column.key} value={searchObject[column.key]} onChange={handleChange} />;
        }
    };

    return (
        <tr className="table-header-row">
            {columns.map(column => (
                <th key={column.key}>
                    {getComponent(column)}
                    </th>
                ))}
            <th>
                <button
                    type="button"
                    onClick={handleResetSearch}
                    className="btn btn-primary">reset</button>
            </th>
            </tr>
    );
};

export default SearchForm;

const TextInput = forwardRef((props, ref) => {
    const { name,onChange,value } = props;
    return (
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={"Enter text"}
            ref={ref}
            style={style}
        />
    );
});

const NumberInput = forwardRef((props, ref) => {
    const { name,onChange,value } = props;

    return (
        <NumericFormat
            name={name}
            value={value}
            onValueChange={onChange}
            placeholder="Enter number"
            thousandSeparator={true}
            decimalSeparator={','}
            prefix="$"
            suffix="USD"
            ref={ref}
            style={style}
        />
    );
});
const SelectInput = (props) => {
    const { name,onChange,value, options} = props;
    return (
        <Select
            name={name}
            value={options.find(option => option.value === value)}
            onChange={onChange}
            options ={[
                {value: 2, label: 'اصلی'},
                {value: 6, label: 'ضایعات'},
                {value: 1, label: 'مواد اولیه'},
            ]}
            styles={style}
        />
    );
};

const AsyncSelectInput = forwardRef((props, ref) => {
    const { name,fetchAPIFunc,defaultValue,onChange } = props;
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState(defaultValue);

    const filter = async (inputValue) => {
        await fetchAPIFunc(inputValue).then((response) => {
            const options = response.data.map((i) => {
                i.label = i.name;
                i.value = i.id;
                return i;
            });
            setOptions(options);
        })
    };
    const handleChange = (newValue) => {
        onChange(newValue);
    }

    const promiseOptions = (inputValue) =>
        new Promise((resolve) => {
            resolve(filter(inputValue));
        });
    return (
        <AsyncSelect
            name={name}
            options={options}
            cacheOptions={true}
            loadOptions={promiseOptions}
            inputValue={inputValue}
            onInputChange={(newValue) => setInputValue(newValue)}
            onChange={handleChange}
            defaultOptions={options}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
            ref={ref}
            styles={style}
        />
    );
});

const CheckboxInput = forwardRef((props, ref) => {
    const { name, onChange,value } = props;
    const [checked, setChecked] = useState(false);

    const handleChange = (e) => {
        setChecked(e.target.checked);
        onChange(e);
    };

    useEffect(() => {
        if (ref) {
            if (typeof ref === 'function') {
                ref(createRef());
            } else {
                ref.current = createRef();
            }
        }
    }, [ref]);

    return (
        <input
            type="checkbox"
            name={name}
            ref={ref}
            value={value}
            checked={checked}
            onChange={handleChange}
            style={style}
        />
    );
});
const style ={
    border: '1px solid #ccc',
        width: '100%',
        boxSizing: 'border-box',
        minHeight: '35px',
        margin: '0',
        backgroundColor: 'rgba(255, 255, 255, 1)',
        textIndent:"0.5rem",
        padding:"0 0.1rem",
        borderRadius: "0.25rem",
        fontSize: "0.7rem",
        lineHeight: "1.0rem",
        color: "#334155",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",

        "&:focus": {
        outline: "none",
            borderColor: "#86b7fe",
            boxShadow: "0 0 0 0.25rem rgba(13, 110, 253, 0.25)",
    },
    "&::placeholder": {
        color: "#6b7280",
            opacity: "1",
            textIndent:"0.5rem",
    },
    "&:-webkit-autofill": {
        boxShadow: "0 0 0 1000px rgba(255, 255, 255, 0.5) inset",

            "&:focus": {
            borderColor: "#86b7fe",
                boxShadow: "0 0 0 0.25rem rgba(13, 110, 253, 0.25)",
        },
    },
    "&:disabled": {
        cursor: "not-allowed",
            backgroundColor: "#e5e7eb",
            borderColor: "#d1d5db",
            opacity: 0.5,
    },

}

