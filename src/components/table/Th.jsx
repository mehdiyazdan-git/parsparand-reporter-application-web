import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

const Th = ({
                width,
                filter,
                updateFilter,
                listName,
                columnKey,
                columnTitle
            }) => {
    const [order, setOrder] = useState(filter['order'] || null);
    const [sortBy, setSortBy] = useState(filter['sortBy'] || null);

    useEffect(() => {
       if (filter['sortBy'] === null){
          setSortBy(filter['id']);
           }else {
             setSortBy(filter['sortBy']);
       }
        if (filter['order'] === null){
            setOrder(filter['asc']);
        }else {
            setOrder(filter['order']);
        }
    }, [filter]);

    useEffect(
        () => {
            setOrder(filter['order']);
            setSortBy(filter['sortBy']);
        }, [filter]);

    const handleSortChange = () => {
        setOrder((order === 'ASC' && sortBy === columnKey) ? 'DESC' : 'ASC');
        setSortBy(columnKey);
        updateFilter(listName,{ sortBy, order});
        console.log({sortBy: sortBy,order: order})
    };

    return (
        <th width={width} onClick={handleSortChange} style={{cursor: 'pointer'}}>
            {columnTitle} {(sortBy === columnKey) && (order === 'ASC' ? '↑' : '↓')}
        </th>
    );
};

Th.propTypes = {
    width: PropTypes.string,
    filter: PropTypes.shape({
        sortBy: PropTypes.string,
        order: PropTypes.string
    }).isRequired,
    updateFilter: PropTypes.func.isRequired,
    listName: PropTypes.string.isRequired,
    columnKey: PropTypes.string.isRequired,
    columnTitle: PropTypes.string.isRequired
};

export default React.memo(Th);
