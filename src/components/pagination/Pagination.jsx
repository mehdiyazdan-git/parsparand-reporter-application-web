import React, { useMemo } from 'react';
import "./Pagination.css";

const Pagination = ({ currentPage, totalPages, pageSize, totalItems, onPageChange, onPageSizeChange }) => {
    const handlePageSizeChange = (event) => {
        onPageSizeChange(Number(event.target.value));
        onPageChange(0); // Reset to first page (zero-indexed) when page size changes
    };

    const goToPage = (pageNumber) => {
        onPageChange(pageNumber - 1); // Subtract 1 for the zero-index-based server before sending the page number
    };

    const pageSizeOptions = useMemo(() => [5, 10, 20], []); // Memoize page size options to avoid re-creation on each render

    return (
        <div className="pagination">
            <div className="page-size">
                اندازه صفحه :
                <select onChange={handlePageSizeChange} value={pageSize}>
                    {pageSizeOptions.map(size => (
                        <option key={size} value={size}>{size}</option>
                    ))}
                </select>
            </div>
            <div className="page-info">
                {`${Math.max(currentPage * pageSize + 1, 1)} تا ${Math.min((currentPage + 1) * pageSize, totalItems)} از ${totalItems}`}
            </div>
            <div className="page-controls">
                <button onClick={() => goToPage(1)} disabled={currentPage === 0}>{'<<'}</button>
                <button onClick={() => goToPage(currentPage)} disabled={currentPage === 0}>{'<'}</button>
                صفحه {currentPage + 1} از {totalPages}
                <button onClick={() => goToPage(currentPage + 2)} disabled={currentPage + 1 >= totalPages}>{'>'}</button>
                <button onClick={() => goToPage(totalPages)} disabled={currentPage + 1 >= totalPages}>{'>>'}</button>
            </div>
        </div>
    );
};

export default Pagination;
