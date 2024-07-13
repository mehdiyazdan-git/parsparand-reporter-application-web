import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './Pagination.css';
import PageSizeSelector from './PageSizeSelector';
import useDeepCompareEffect from "../../hooks/useDeepCompareEffect";

const Pagination = (
                    { data,
                        handleSizeChange,
                        goToFirstPage,
                        goToPrevPage,
                        goToNextPage,
                        goToLastPage,
                    }) => {
    const [totalPages, setTotalPages] = React.useState(0);
    const [totalElements, setTotalElements] = React.useState(0);
    const [startIndex, setStartIndex] = React.useState(0);
    const [endIndex, setEndIndex] = React.useState(0);

    useDeepCompareEffect(() => {
        if (data) {
            setTotalPages(data?.totalPages);
            setTotalElements(data?.totalElements);
            setStartIndex(data.first ? 1 : (data?.pageable?.pageNumber * data?.pageable?.pageSize) + 1);
            setEndIndex(data.last ? data?.totalElements : (data.pageable?.pageNumber * data?.pageable?.pageSize) + data?.pageable?.pageSize);
        }
    }, [data]);

    return (
        <div className="pagination">
            <PageSizeSelector
                size={data?.size}
                handleSizeChange={handleSizeChange}
            />
            <div className="page-info">
                {`${startIndex} تا ${endIndex} از ${totalElements}`}
            </div>
            <div className="page-controls">
                <button onClick={goToFirstPage} disabled={data?.pageable?.pageNumber === 0}>{'<<'}</button>
                <button onClick={goToPrevPage} disabled={data?.pageable?.pageNumber === 0}>{'<'}</button>
                صفحه {data?.pageable?.pageNumber + 1} از {totalPages}
                <button onClick={goToNextPage} disabled={data?.pageable?.pageNumber + 1 >= data?.totalPages}>{'>'}</button>
                <button onClick={goToLastPage} disabled={data?.pageable?.pageNumber + 1 >= data?.totalPages}>{'>>'}</button>
            </div>
        </div>
    );
};

Pagination.propTypes = {
    data: PropTypes.object.isRequired,
    handleSizeChange: PropTypes.func.isRequired,
    goToFirstPage: PropTypes.func.isRequired,
    goToPrevPage: PropTypes.func.isRequired,
    goToNextPage: PropTypes.func.isRequired,
    goToLastPage: PropTypes.func.isRequired
};

export default Pagination;
