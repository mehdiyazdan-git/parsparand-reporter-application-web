import React, {memo} from 'react';
import moment from 'moment';
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/layouts/prime.css";
import "../../App.css";
import "../../index.css";

const SearchDateInput = memo(({width, value, onChange, placeholder = "جستجو..."}) => {

    return (
        <th width={width} style={{padding: '0px 0px', textAlign: 'center', margin: '0'}}>
            <DatePicker
                value={value}
                format="YYYY/MM/DD"
                type="search"

                style={{
                    border: '1px solid #ccc',
                    width: '15em',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                    minHeight: '35px',
                    margin: '0',
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    textIndent: "0.5rem",
                    padding: "0px",
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
                calendar={persian}
                locale={persian_fa}
                placeholder={placeholder}
                onFocusedDateChange={(dateFocused, dateClicked) => {
                    onChange(dateClicked?.isValid ? moment(new Date(dateClicked)).format('YYYY-MM-DD') : '');
                }}
                onClose={() => onChange('')}
            />
        </th>
    );
});

export default React.memo(SearchDateInput);
