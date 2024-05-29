import React from 'react';
import {NumericFormat} from "react-number-format";

const SearchNumberInput = ({ width, id, name, value, onChange, placeholder = "جستجو..." }) => {
    return (
        <th className="m-1" style={{backgroundColor: 'rgba(255, 255, 255, 1)',width:width}}>
            <NumericFormat
                placeholder={placeholder}
                id={id}
                name={name}
                thousandSeparator=","
                value={value}
                onValueChange={(values) => {
                    onChange(values.value);
                }}
                style={{
                    border: '1px solid #ccc',
                    width: '100%',
                    boxSizing: 'border-box',
                    minHeight: '40px',
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    textIndent:"0.5rem",

                }}
            />
        </th>
    );
};

export default SearchNumberInput;
