import React from 'react';
import moment from 'moment';
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/layouts/prime.css";

const SearchDateInput = ({ width, value, onChange, placeholder = "جستجو..." }) => {

    return (
        <th width={width} style={{ padding: '0px 0px', textAlign: 'center',margin:'0'}}>
            <DatePicker
                value={value}
                format="YYYY/MM/DD"
                type="search"
                inputClass="table-search-input"
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
};

export default React.memo(SearchDateInput);
