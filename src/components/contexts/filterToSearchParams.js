

export const filterToSearchParams = (filter) => {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(filter)) {
        if (key === 'search') {
            for (const [searchKey, searchValue] of Object.entries(value)) {
                if (searchValue !== '') {
                    searchParams.append(searchKey, searchValue);
                }
            }
        } else if (key === 'pageable') {
            searchParams.append('page', value.page);
            searchParams.append('size', value.size);
        } else if (key === 'sort') {
            searchParams.append('sort', `${value.sortBy},${value.order}`);
        } else if (key === 'subTotals' && value.length > 0) {
            searchParams.append('subTotals', value.join(','));
        }
    }

    return searchParams;
};
