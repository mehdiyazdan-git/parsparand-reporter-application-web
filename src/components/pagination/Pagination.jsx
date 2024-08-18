import React from 'react';
import PropTypes from 'prop-types';
import './Pagination.css';
import PageSizeSelector from './PageSizeSelector';


const Pagination = ({ data,filter,updatePagination }) => {


    const totalPages = data?.totalPages || 0;
    const totalElements = data?.totalElements || 0;
    const currentPage = filter?.pageable?.page || 0;
    const pageSize = filter?.pageable?.size || 10; // Default page size

    const startIndex = data?.first ? 1 : (currentPage * pageSize) + 1;
    const endIndex = data?.last ? totalElements : (currentPage * pageSize) + pageSize;


    const handleSizeChange = (e) => {
        e.preventDefault();
        const newSize = parseInt(e.target.value, 10);
        updatePagination({ page : 0 , size : newSize });
    };

    const goToPage = (pageNo) => {
        updatePagination({ page : pageNo , size : pageSize });
    };

    return (
        <div className="pagination">
            <PageSizeSelector
                size={pageSize}
                handleSizeChange={handleSizeChange} />
            <div className="page-info">
                {`${startIndex} تا ${endIndex} از ${totalElements}`}
            </div>
            <div className="page-controls">
                <button onClick={() => goToPage(0)} disabled={currentPage === 0}>{'<<'}</button>
                <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 0}>{'<'}</button>
                صفحه {currentPage + 1} از {totalPages}
                <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage + 1 >= totalPages}>{'>'}</button>
                <button onClick={() => goToPage(totalPages - 1)} disabled={currentPage + 1 >= totalPages}>{'>>'}</button>
            </div>
        </div>
    );
};

export default Pagination;
