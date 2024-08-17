import {useMemo} from 'react';

const DefaultFilter = () => {

    return useMemo(() => ({
        search: {},
        pageable: {
            page: 0,
            size: 10
        },
        sort: {
            order: 'asc',
            sortBy: 'id',
        }
    }), []);
};

export default DefaultFilter;