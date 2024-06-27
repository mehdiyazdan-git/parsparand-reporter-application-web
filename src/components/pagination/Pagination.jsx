import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import "./Pagination.css";
import PageSizeSelector from "./PageSizeSelector";

const Pagination = ({ filter, updateFilter, listName }) => {
    const [startIndex, setStartIndex] = React.useState(1);
    const [endIndex, setEndIndex] = React.useState(Math.min(filter.size));

    useEffect(() => {
        setStartIndex(filter.page * filter.size + 1);
        setEndIndex(Math.min((filter.page + 1) * filter.size, filter.totalElements));
    }, [filter.page, filter.size, filter.totalElements]);

    const handleSizeChange = (event) => {
        const newSize = parseInt(event.target.value, 10);
        updateFilter(listName, { size: newSize, page: 0 });
    };

    const goToFirstPage = () => updateFilter(listName, { page: 0 });

    const goToPrevPage = () => updateFilter(listName, { page: Math.max(0, filter.page - 1) });

    const goToNextPage = () => updateFilter(listName, { page: Math.min(filter.totalPages - 1, filter.page + 1) });

    const goToLastPage = () => updateFilter(listName, { page: filter.totalPages - 1 });


    return (
        <div className="pagination">
            <PageSizeSelector size={filter.size} handleSizeChange={handleSizeChange} />
            <div className="page-info">
                {`${startIndex} تا ${endIndex} از ${filter.totalElements}`}
            </div>
            <div className="page-controls">
                <button onClick={goToFirstPage} disabled={filter.page === 0}>{'<<'}</button>
                <button onClick={goToPrevPage} disabled={filter.page === 0}>{'<'}</button>
                صفحه {filter.page + 1} از {filter.totalPages}
                <button onClick={goToNextPage} disabled={filter.page + 1 >= filter.totalPages}>{'>'}</button>
                <button onClick={goToLastPage} disabled={filter.page + 1 >= filter.totalPages}>{'>>'}</button>
            </div>
        </div>
    );
};

Pagination.propTypes = {
    filter: PropTypes.object.isRequired,
    updateFilter: PropTypes.func.isRequired,
    listName: PropTypes.string.isRequired,
};

export default Pagination;
