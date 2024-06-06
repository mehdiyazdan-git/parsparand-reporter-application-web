import React from 'react';
import Select from "react-select";
import { getCustomSelectStyles } from "./customStyles";

const SelectSearchInput = ({options,value,onChange}) => {

    return (
            <Select
                options={options}
                styles={getCustomSelectStyles()}
                value={value ? options.find(option => option.value === value) : ''}
                onChange={value => onChange(value?.value ? value?.value : '')}
                className={"table-search-input m-0 p-0"}
                placeholder={'انتخاب...'}
                isRtl={true}
                isClearable={true}
            />

    );
};

export default SelectSearchInput;
