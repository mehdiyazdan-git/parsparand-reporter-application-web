import getCurrentYear from "../../utils/functions/getCurrentYear";

export const generateInitialFilters = (columns) => {
    const initialFilters = {
        search: {
            jalaliYear : getCurrentYear()
        },
        pageable: {
            page: 0,
            size: 10,
        },
        sort: {
            order: 'asc',
            sortBy: 'id',
        },
        subTotals: columns.filter(col => col.subtotal).map(col => col.key),
    };

    columns.forEach(column => {
        if (column.searchable) {
            initialFilters.search[column.key] = '';
        }
    });

    return initialFilters;
};
