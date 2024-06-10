import React, {useEffect, useState} from 'react';

function AmountNumber({value, name, onChange, id,error,isDisable=false}) {
    const [formattedValue, setFormattedValue] = useState(null);

    const formatValue = (value) => {
        const numericValue = value.replace(/\D/g, '');
        return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
    useEffect(() => {
        setFormattedValue(formatValue(`${value}`))
    }, [value])
    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        const formatted = formatValue(inputValue);
        setFormattedValue(formatted);
        onChange(inputValue.replace(/,/g, ''));
    };

    return (
        <div>
            <input
                id={id}
                type="text"
                name={name}
                value={formattedValue}
                onChange={handleInputChange}
                style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    minHeight: '38px',
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    textIndent:"0.5rem",
                    padding:"0.1rem",
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
                }}
                disabled={isDisable}
            />
        </div>
    );
}

export default AmountNumber;
