import React, { useMemo, useCallback } from 'react';
import "./Pagination.css";
import PageSizeSelector from "./PageSizeSelector";

const Pagination = ({ filter, updateFilter }) => {

    const goToFirstPage = useCallback(() => updateFilter({ page: 0 }), [updateFilter]);

    const goToPrevPage = useCallback(() => updateFilter({ page: Math.max(0, filter?.page - 1) }), [updateFilter, filter]);

    const goToNextPage = useCallback(() => updateFilter({ page: Math.min(filter?.totalPages - 1, filter?.page + 1) }), [updateFilter, filter]);

    const goToLastPage = useCallback(() => updateFilter({ page: filter?.totalPages - 1 }), [updateFilter, filter]);

    const startIndex = () => filter?.page * filter?.size + 1;

    const endIndex = () => Math.min((filter?.page + 1) * filter?.size, filter?.totalElements);

    return (
        <div className="pagination">
            <PageSizeSelector filter={filter} updateFilter={updateFilter}/>
            <div className="page-info">
                {`${startIndex()} تا ${endIndex()} از ${filter?.totalElements}`}
            </div>
            <div className="page-controls">
                <button onClick={goToFirstPage} disabled={filter?.page === 0}>{'<<'}</button>
                <button onClick={goToPrevPage} disabled={filter?.page === 0}>{'<'}</button>
                صفحه  {filter?.page + 1} از {filter?.totalPages}
                <button onClick={goToNextPage} disabled={filter?.page + 1 >= filter?.totalPages}>{'>'}</button>
                <button onClick={goToLastPage} disabled={filter?.page + 1 >= filter?.totalPages}>{'>>'}</button>
            </div>
        </div>
    );
};

export default Pagination;
