
/* example of options object passed by parent component 'Contracts' */
const options = {
    storageKey : 'invoices_filtered_by_contractNo',
    filters : {
        search: {'contractNumber' : ''}, // should be added to filter.search
        excludes : ['jalaliYear'] // should be deleted from filter.search
    },
}

export const generateInitialFilters = (columns, options,entityListName) => {
    const storageKey = `filter_${entityListName}`
    const filterSchema = {
        search: {
        },
        pagination: {
            page: 0,
            size: 10,
        },
        sorting: {
            order: 'asc',
            sortBy: 'id',
        },

    };

    columns.forEach(column => {
        if (column.searchable) {
            if (column.key === 'jalaliYear'){
                filterSchema.search[column.key] = new Intl.DateTimeFormat('fa-IR').format(new Date()).substring(0, 4);
            }
            else {
                filterSchema.search[column.key] = '';
            }
        }
    });

    if (options) {
        if (options.storageKey) {
            try {
                const storedFilters = JSON.parse(sessionStorage.getItem(options.storageKey) || '{}');
                filterSchema.search = { ...filterSchema.search, ...storedFilters.search };
            } catch (error) {
                console.error('Error parsing stored filters:', error);
            }
        }

        if (options.filters) {
            if (Array.isArray(options.filters.excludes)) {
                options.filters.excludes.forEach(exclude => {
                    delete filterSchema.search[exclude];
                });
            }

            if (typeof options.filters.search === 'object' && options.filters.search !== null) {
                filterSchema.search = { ...filterSchema.search, ...options.filters.search };
            }
        }
    }

    return filterSchema;
};

