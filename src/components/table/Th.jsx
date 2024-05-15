import React from 'react';

const Th = ({ width, sortBy, sortOrder, setSortBy, setSortOrder, children, sortKey }) => {
    const handleClick = () => {
        if (sortBy === sortKey) {
            setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
        } else {
            setSortBy(sortKey);
            setSortOrder('ASC');
        }

    };

    return (
        <th width={width} onClick={handleClick}>
            {children} {sortBy === sortKey && (sortOrder === 'ASC' ? '↑' : '↓')}
        </th>
    );
};

export default React.memo(Th);
