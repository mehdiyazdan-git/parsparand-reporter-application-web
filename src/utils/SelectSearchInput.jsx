import React, { memo } from 'react';
import Select from "react-select";
import { getCustomSelectStyles } from "./customStyles";

const SelectSearchInput = memo(({ options, value, onChange, name }) => {
    return (
        <Select
            options={options}
            styles={getCustomSelectStyles()}
            name={name}
            value={value ? options.find(option => option.value === value) : ''}
            onChange={value => onChange(value?.value ? value?.value : '')}
            className={"table-search-input m-0 p-0"}
            placeholder={'انتخاب...'}
            isRtl={true}
            isClearable={true}
        />
    );
});

export default SelectSearchInput;
