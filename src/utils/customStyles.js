export const getCustomSelectStyles = (error) => ({
    control: (provided) => ({
        ...provided,
        maxHeight: '200px',
        height: "40px",
        overflowY: 'auto',
        fontFamily: 'IRANSans',
        margin: 0,
        fontSize: '0.75rem',
        border: error ? "1px red solid" : "1px #ccc solid",
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    }),
    option: (provided) => ({
        ...provided,
        fontSize: '0.75rem',
        color: "black",
        fontFamily: 'IRANSans',
        fontsize: '0.75rem',
    }),
    placeholder: (provided) => ({
        ...provided,
        fontSize: "0.6rem",
        color: error ? "red" : "#686666"
    }),
    clearIndicator: (provided) => ({
        ...provided,
        color: "#626262"
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        color: "#626262"
    })
});
