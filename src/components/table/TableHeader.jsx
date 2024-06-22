import React from 'react';
import Th from './Th';
import PropTypes from 'prop-types';

const TableHeader = ({ columns, filter, updateFilter }) => (
    <thead>
    <tr className="table-header-row p-0 m-0">
        {columns.map((column, index) => (
            <Th key={index} columnKey={column.key} width={column.width} filter={filter} updateFilter={updateFilter}>
                {column.title}
            </Th>
        ))}
        <th width="7%">{"ویرایش|حذف"}</th>
    </tr>
    </thead>
);

TableHeader.propTypes = {
    columns: PropTypes.array.isRequired,
    filter: PropTypes.object.isRequired,
    updateFilter: PropTypes.func.isRequired
};

export default TableHeader;
