export const getCustomSelectStyles = (error) => ({
    control: (provided) => ({
        ...provided,
        width: '100%', // Ensures the control takes up full width
        height: '2em', // Sets a fixed height
        overflowY: 'auto', // Enables vertical scrolling if content overflows
        fontFamily: 'IRANSans',
        margin: 0, // Removes default margins
        border: error ? '1px solid red' : '1px solid #ccc', // Conditional border color based on error state
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent background
        padding: '0 0.1rem', // Slight padding
        borderRadius: '0.25rem',
        fontSize: '0.7rem',
        lineHeight: '0.875rem',
        color: '#334155',
        textAlign: 'right',

        '&:focus': {
            outline: 'none', // Removes default focus outline
            borderColor: '#86b7fe', // Changes border color on focus
            boxShadow: '0 0 0 0.25rem rgba(13, 110, 253, 0.25)', // Adds a subtle focus shadow
        },

        "&::placeholder": {
            color: error ? 'red' : '#686666',
            fontSize: '0.7rem',
            fontFamily: 'IRANSans',
            fontWeight: 'bold',
            textAlign: 'right', // Aligns placeholder text to the right
            textOverflow: 'ellipsis', // Truncates overflowing text with ellipsis
            whiteSpace: 'nowrap', // Prevents placeholder text from wrapping
            overflow: 'hidden', // Hides any overflowing content
        },

        "&:-webkit-autofill": {
            boxShadow: '0 0 0 1000px rgba(255, 255, 255, 0.5) inset', // Styles for autofill

            '&:focus': {
                borderColor: '#86b7fe',
                boxShadow: '0 0 0 0.25rem rgba(13, 110, 253, 0.25)',
            },
        },

        '&:disabled': {
            cursor: 'not-allowed',
            backgroundColor: '#e5e7eb',
            borderColor: '#d1d5db',
            opacity: 0.5, // Makes the control appear disabled
        },
    }),

    option: (provided) => ({
        ...provided,
        fontSize: '0.75rem',
        color: 'black',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        fontFamily: 'IRANSans',
        textAlign: 'right',
        fontWeight: 'bold',
        borderBottom: '1px solid #ddd', // Adds a subtle separator between options
        '&:hover': {
            backgroundColor: '#f5f5f5', // Changes background on hover
            color: 'black',
        },
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        position: 'relative',
    }),

    placeholder: (provided) => ({
        ...provided,
        fontSize: '0.7rem',
        color: error ? 'red' : '#686666',
        fontFamily: 'IRANSans',
        textAlign: 'right',
    }),

    input: (provided) => ({
        ...provided,
        fontSize: '0.6rem', // Smaller font size for input text
        color: error ? 'red' : '#686666',
        margin: 0,
        padding: 0,
        width: '100%',
        textAlign: 'right',
    }),

    menu: (provided) => ({
        ...provided,
        width: '100%',
        maxHeight: '200px',
        overflowY: 'auto',
        border: '1px solid #ccc',
        borderRadius: '0.25rem',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        fontSize: '0.7rem',
        fontFamily: 'IRANSans',
        textAlign: 'right',

        "&::-webkit-scrollbar": {
            width: '0.5em',
            height: '0.5em',
        },
        "&::-webkit-scrollbar-track": {
            borderRadius: '0.25rem',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
        },
        "&::-webkit-scrollbar-thumb": {
            borderRadius: '0.25rem',
            backgroundColor: '#ccc',
        },
    }),
});
