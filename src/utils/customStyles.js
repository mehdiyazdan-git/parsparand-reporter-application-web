export const getCustomSelectStyles = (error) => ({
    control: (provided) => ({
        ...provided,
        width: '100%',
        maxWith:'100%',
        maxHeight: '200px',
        height: "2em",
        overflowY: 'auto',
        placeholderColor: error ? 'red' : '#9ca3af',
        placeholder : error ? error?.message : 'انتخاب کنید...',
        fontFamily: 'IRANSans',
        margin: '0',
        border: error ? "1px red solid" : "1px #ccc solid",
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        padding:"0 0.1rem",
        borderRadius: "0.25rem",
        fontSize: "0.7rem",
        lineHeight: "0.875rem",
        color: "#334155",
        // boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",

        "&:focus": {
            outline: "none",
            borderColor: "#86b7fe",
            boxShadow: "0 0 0 0.25rem rgba(13, 110, 253, 0.25)",
        },
        "&::placeholder": {
            color: error ? "red" : "#686666",
            fontSize: "0.6rem",
            fontFamily: 'IRANSans',
            fontWeight: 'bold',
            textAlign: 'right',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textTransform: 'uppercase',
            overflow: 'hidden'
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
