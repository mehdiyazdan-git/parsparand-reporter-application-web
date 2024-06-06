export const getCustomSelectStyles = (error) => ({
    control: (provided) => ({
        ...provided,
        maxHeight: '200px',
        height: "35px",
        overflowY: 'auto',

        fontFamily: 'IRANSans',
        margin: '0px',
        padding: '0px',
        fontSize: '0.75rem',
        border: error ? "1px red solid" : "1px #ccc solid",
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    }),
    option: (provided) => ({
        ...provided,
        fontSize: '0.65rem',
        color: "black",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        fontFamily: 'IRANSans',
        fontsize: '0.75rem',
        textAlign: 'right',
        fontWeight: 'bold',
        borderBottom: '1px #ddd solid',
        '&:hover': {
            backgroundColor: '#f5f5f5',
            color: 'black'
        },
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden'
    }),
    placeholder: (provided) => ({
        ...provided,
        fontSize: "0.6rem",
        color: error ? "red" : "#686666"
    }),
    clearIndicator: (provided) => ({
        ...provided,
        color: "#626262",
        padding: "0px 1px",
        margin: "0px 0px"

    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        color: "#626262",
        padding: "0px 1px",
        margin: "0px 0px"
    }),
    devider: (provided) => ({
        ...provided,
        color: "#626262",
        padding: "0px 0px",
        margin: "0px 0px"

    }),
    input: (provided) => ({
        ...provided,
        fontSize: "0.6rem",
        color: error ? "red" : "#686666",
        margin: "0px 0px",
        padding: "0px 0px",
        width: "100%",
    })
});
