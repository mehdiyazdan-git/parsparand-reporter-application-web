import React from 'react';

const Th = ({ columnKey, filter, updateFilter, width, children }) => {
    const handleSortChange = (column) => {
        const isAsc = filter.sortBy === column && filter.order === 'asc';
        updateFilter({
            sortBy: column,
            order: isAsc ? 'desc' : 'asc'
        });
    };

    return (
        <th className="text-center" style={{ width: `${width}`, fontSize: "0.71rem" }} onClick={() => handleSortChange(columnKey)}>
            {children} {filter?.sortBy === columnKey ? (filter.order === 'asc' ? '↑' : '↓') : ''}
        </th>
    );
};

export default React.memo(Th);
