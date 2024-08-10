
/* example of options object passed by parent component 'Contracts' */
const options = {
    storageKey : 'invoices_filtered_by_contractNo',
    filters : {
        search: {'contractNumber' : ''}, // should be added to filter.search
        excludes : ['jalaliYear'] // should be deleted from filter.search
    },
}

export const generateInitialFilters = (columns, options) => {
    const initialFilters = {
        search: {
            jalaliYear: new Intl.DateTimeFormat('fa-IR').format(new Date()).substring(0, 4), // Default year
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

    if (options) {
        if (options.storageKey) {
            try {
                const storedFilters = JSON.parse(sessionStorage.getItem(options.storageKey) || '{}');
                initialFilters.search = { ...initialFilters.search, ...storedFilters.search };
            } catch (error) {
                console.error('Error parsing stored filters:', error);
            }
        }

        if (options.filters) {
            if (Array.isArray(options.filters.excludes)) {
                options.filters.excludes.forEach(exclude => {
                    delete initialFilters.search[exclude];
                });
            }

            if (typeof options.filters.search === 'object' && options.filters.search !== null) {
                initialFilters.search = { ...initialFilters.search, ...options.filters.search };
            }
        }
    }

    return initialFilters;
};

