import React from 'react';

const MonthYear = ({ filter, updateFilter,listName }) => {

    return (
        <div className="month-year-selector">
            <div className="col-3 mt-2 align-content-lg-end">
                <select
                    style={{
                        boxSizing: "border-box",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        fontSize: "16px",
                        minWidth: "250px",
                        padding: "8px 12px",
                        transition: "border-color 0.2s ease-in-out",
                        width: "100%",
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    }}
                    value={filter?.month || 1}
                    onChange={(e) => updateFilter({ ...filter, month: e.target.value })}
                    className="table-search-input"
                    id="month"
                    name="month"
                    required
                >
                    <option value={1}>فروردین</option>
                    <option value={2}>اردیبهشت</option>
                    <option value={3}>خرداد</option>
                    <option value={4}>تیر</option>
                    <option value={5}>مرداد</option>
                    <option value={6}>شهریور</option>
                    <option value={7}>مهر</option>
                    <option value={8}>آبان</option>
                    <option value={9}>آذر</option>
                    <option value={10}>دی</option>
                    <option value={11}>بهمن</option>
                    <option value={12}>اسفند</option>
                </select>
            </div>

        </div>
    );
};

export default MonthYear;
