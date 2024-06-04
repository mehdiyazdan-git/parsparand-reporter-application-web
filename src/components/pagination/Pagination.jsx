import React, { useMemo } from 'react';
import { useFilters } from "../contexts/FilterContext"; // Correct import statement for useFilters
import "./Pagination.css";

const Pagination = ({ listName }) => {
    const { filters, setPagination } = useFilters(); // Correctly using the useFilters hook

    // Retrieve pagination details from filters using the listName
    const currentPage = filters[listName]?.page || 0;
    const totalPages = filters[listName]?.totalPages || 1;
    const pageSize = filters[listName]?.pageSize || 10;
    const totalItems = filters[listName]?.totalElements || 0;

    // Handle changing the page size and resetting to the first page
    const handlePageSizeChange = (event) => {
        const newSize = Number(event.target.value);
        setPagination(listName, 0, newSize); // Reset to first page when page size changes
    };

    // Handle navigation to a specific page
    const goToPage = (pageNumber) => {
        setPagination(listName, pageNumber - 1, pageSize); // Subtract 1 because pages might be zero indexed in context
    };

    // Memoize page size options to avoid re-creation on each render
    const pageSizeOptions = useMemo(() => [5, 10, 20], []);

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
