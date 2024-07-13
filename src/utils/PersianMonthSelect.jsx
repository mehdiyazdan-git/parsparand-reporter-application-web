import React, {memo, useEffect, useState} from 'react';
import Select from 'react-select';
import {getCustomSelectStyles} from "./customStyles";

const PersianMonthSelect = ({ month, onChange }) => {
    const months = [
        { value: 1, label: 'فروردین' },
        { value: 2, label: 'اردیبهشت' },
        { value: 3, label: 'خرداد' },
        { value: 4, label: 'تیر' },
        { value: 5, label: 'مرداد' },
        { value: 6, label: 'شهریور' },
        { value: 7, label: 'مهر' },
        { value: 8, label: 'آبان' },
        { value: 9, label: 'آذر' },
        { value: 10, label: 'دی' },
        { value: 11, label: 'بهمن' },
        { value: 12, label: 'اسفند' },
        { value: 13, label: 'کل ماه' },
        { value: 14, label: 'کل سال' },
    ];

    const customStyles = getCustomSelectStyles();

    return (
        <Select
            value={months.find(m => m.value === month)} // Find the matching month object
            options={months}
            onChange={(selectedOption) => onChange(selectedOption.value)}
            styles={customStyles}
        />
    );
};

export default memo(PersianMonthSelect);
