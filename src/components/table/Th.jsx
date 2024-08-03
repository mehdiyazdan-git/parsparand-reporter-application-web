import React from 'react';



const Th = ({ columnKey, columnTitle, width, filter, updateSort }) => {

    const handleSort = () => {
        const newOrder = filter?.sort?.order === 'asc' ? 'desc' : 'asc';
        updateSort({ order: newOrder, sortBy: columnKey });
    };

    return (
        <th
            onClick={handleSort} // Directly call handleSort
            style={{ cursor: 'pointer', width }}
        >
            {columnTitle}
            {filter?.sort?.sortBy === columnKey && (filter?.sort?.order === 'asc' ? ' 🔼' : ' 🔽')}
        </th>
    );
};
export default Th;

