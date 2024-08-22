import React, {useEffect} from 'react';
import './Pagination.css';
import PageSizeSelector from './PageSizeSelector';


const Pagination = ({ data,updatePagination}) => {

    const [totalPages,setTotalPages] = React.useState(0);
    const [totalElements,setTotalElements] = React.useState(0);
    const [currentPage,setCurrentPage] = React.useState(0);
    const [pageSize,setPageSize] = React.useState(10);
    const [startIndex, setStartIndex] = React.useState(0);
    const [endIndex, setEndIndex] = React.useState(0);


    const handleSizeChange = (e) => {
        const newSize = parseInt(e.target.value, 10);
        updatePagination({ page : 0 , size : newSize });
    };

    useEffect(() => {
        if (data) {
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
            setCurrentPage(data.pageable?.pageNumber);
            setPageSize(data.pageable?.pageSize);
            setStartIndex(data.pageable.offset + 1); // offset is 0-based, so add 1
            setEndIndex(Math.min(data.pageable.offset + data.pageable.pageSize, data.totalElements));
        }
    }, [data]);

    return (
        <div className="pagination">
            <PageSizeSelector
                size={pageSize}
                handleSizeChange={handleSizeChange} />
            <div className="page-info">
                {`${startIndex} تا ${endIndex} از ${totalElements}`}
            </div>
            <div className="page-controls">
                <button onClick={()=> updatePagination({ page : 0 })} disabled={data?.first}>{'<<'}</button>
                <button onClick={()=> updatePagination({ page : currentPage - 1 })} disabled={data?.first}>{'<'}</button>
                صفحه {currentPage + 1} از {totalPages}
                <button onClick={()=>updatePagination({ page : currentPage + 1 })} disabled={data?.last}>{'>'}</button>
                <button onClick={()=> updatePagination({ page : totalPages - 1 })} disabled={data?.last}>{'>>'}</button>
            </div>
        </div>
    );
};

export default Pagination;