import React from 'react';
import YearSelect from "../Year/YearSelect";
import useHttp from "../../hooks/useHttp";
import PropTypes from "prop-types";

const TableYear = ({filter,updateFilter}) => {
    const http = useHttp();
    const years = async () => {
        return await http.get('years/select')
            .then(response =>
                response.data.map((item) => ({
                    label: item.name,
                    value: item.id,
                }))
            );
    };


    const handleSearchChange = (name, value) => {
        updateFilter({ [name]: value });
    };
    return (
        <div className="col-3 mt-3">
            <YearSelect
                onChange={handleSearchChange}
                value={() => {
                    return filter?.jalaliYear
                        ? years().then(years => years.find(year => year.label === filter.jalaliYear))
                        : years()[0];
                }}/>
        </div>
    );
};
TableYear.prototype = {
    filter: PropTypes.object,
    updateFilter: PropTypes.func,
};

export default TableYear;