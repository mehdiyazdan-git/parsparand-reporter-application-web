import React from 'react';

const Th = ({ width, sortBy, sortOrder, setSortBy, setSortOrder, children, sortKey, listName, setFilter }) => {
    const handleClick = () => {
        let newSortOrder = 'ASC';
        if (sortBy === sortKey) {
            newSortOrder = sortOrder === 'ASC' ? 'DESC' : 'ASC';
        }
        setSortBy(sortKey);
        setSortOrder(newSortOrder);
        setFilter(listName, 'sortBy', sortKey);
        setFilter(listName, 'order', newSortOrder);
    };

    return (
        <th className="text-center" style={{width:`${width}`,fontSize:"0.71rem"}} onClick={handleClick}>
            {children} {sortBy === sortKey && (sortOrder === 'ASC' ? '↑' : '↓')}
        </th>
    );
};

export default React.memo(Th);
