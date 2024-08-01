import React from 'react';

//const filter ={
//     search: {},
//     pageable: {
//         page: 0,
//         size: 10
//     },
//     sort: {
//         order: 'asc',
//         sortBy: 'id',
//     },
//     subTotals: []
// }

//const updateFilter = (field, value) => {
//         setFilter({ ...filter, [field]: value });
//     };

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

