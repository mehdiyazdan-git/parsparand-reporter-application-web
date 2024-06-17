import React from 'react';

const PageSizeSelector = ({filter,updateFilter}) => {
    const handlePageSizeChange = React.useCallback((event) => {
        const size = parseInt(event.target.value);
        const page = Math.floor(filter?.page * filter?.size / size);
        updateFilter({ size, page });
    }, [filter, updateFilter]);
    return (
        <div className="page-size">
            اندازه صفحه:
            <select onChange={handlePageSizeChange} value={filter?.size}>
                <option key={1} value={5}>{5}</option>
                <option key={2} value={10}>{10}</option>
                <option key={3} value={20}>{20}</option>
            </select>
        </div>
    );
};

export default React.memo(PageSizeSelector);
