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
                    margin:"0",
                    border: (error) ? '1px solid red' : '1px solid #ccc',
                    width: "100%",
                    boxSizing: "border-box",
                    minHeight: "40px",
                    fontSize:"0.8rem",
                    backgroundColor: 'rgba(255, 255, 255, 0.5)'
                }}
                disabled={isDisable}
            />
        </div>
    );
}

export default AmountNumber;
