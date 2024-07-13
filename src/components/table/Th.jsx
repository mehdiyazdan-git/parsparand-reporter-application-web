import React from 'react';
import PropTypes from 'prop-types';

const Th = ({ columnKey, columnTitle, width, filter, updateFilter, entityName }) => {
    const handleSort = () => {
        const isAsc = filter.sortBy === columnKey && filter.order === 'asc';
        updateFilter({
            sortBy: columnKey,
            order: isAsc ? 'desc' : 'asc'
        });
    };

    return (
        <th
            onClick={handleSort}
            style={{ cursor: 'pointer', width }}
        >
            {columnTitle}
            {filter.sortBy === columnKey && (filter.order === 'asc' ? ' 🔼' : ' 🔽')}
        </th>
    );
};

Th.propTypes = {
    columnKey: PropTypes.string.isRequired,
    columnTitle: PropTypes.string.isRequired,
    width: PropTypes.string,
    filter: PropTypes.object.isRequired,
    updateFilter: PropTypes.func.isRequired,
    listName: PropTypes.string.isRequired,
};

export default Th;
