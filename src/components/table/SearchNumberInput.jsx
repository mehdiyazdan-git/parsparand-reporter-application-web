import React, {memo} from 'react';
import {NumericFormat} from "react-number-format";

const SearchNumberInput = ({width, id, name, value, onChange, placeholder = "جستجو..."}) => {
    return (
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
                minHeight: '35px',
                margin: '0',
                backgroundColor: 'rgba(255, 255, 255, 1)',
                textIndent: "0.5rem",
                padding: "0 0.1rem",
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
                    textIndent: "0.5rem",
                },
                "&:WebkitAutofill": {
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

            }}
        />
    );
};

export default SearchNumberInput;
