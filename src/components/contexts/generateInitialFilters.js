
export const generateInitialFilters = (columns) => {
    const initialFilters = {
        search: {},
        pageable: {
            page: 0,
            size: 10,
        },
        sort: {
            order: 'asc',
            sortBy: 'id',
        },
        subTotals: columns.filter(col => col.subtotal).map(col => col.key), // Extract subtotal keys
    };

    columns.forEach(column => {
        if (column.searchable) {
            initialFilters.search[column.key] = '';
        }
    });

    return initialFilters;
};
