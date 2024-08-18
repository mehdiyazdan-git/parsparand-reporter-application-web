import React, {useCallback} from 'react';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TableFooter from './TableFooter';
import Pagination from '../pagination/Pagination';
import TableSearch from './TableSearch';
import PropTypes from 'prop-types';
import YearSelect from '../Year/YearSelect';
import yearSelectLabelStyle from '../styles/yearSelectLabelStyle';
import yearSelectContainerStyle from '../styles/yearSelectContainerStyle';
import yearSelectStyle from '../styles/yearSelectStyle';


const Table = ({
                   data,
                   columns,
                   hasSubTotal,
                   hasYearSelect,
                   filter,
                   resetFilter,
                   updateSearchParams,
                   updatePagination,
                   updateSorting,
                   params,
                   handleEditButtonClick,
                   onDownloadExcelFile,
                   onDeleteEntity,
                   resourcePath
               }) => {


    const handleYearChange = useCallback((value) => {
        updateSearchParams({'jalaliYear': parseInt(value, 10)});
    }, [updateSearchParams]);


    return (
        <>
            {hasYearSelect && (
                <div style={yearSelectStyle}>
                    <label style={yearSelectLabelStyle}>انتخاب سال</label>
                    <div style={yearSelectContainerStyle}>
                        <YearSelect
                            value={filter?.search?.jalaliYear}
                            onChange={handleYearChange}
                        />
                    </div>
                </div>
            )}
            <table className="recipient-table table-fixed-height mt-3">
                <TableHeader
                    columns={columns}
                    filter={filter}
                    updateSorting={updateSorting}
                />
                <TableSearch
                    columns={columns}
                    resourcePath={resourcePath}
                    updateSearchParams={updateSearchParams}
                    updatePagination={updatePagination}
                    filter={filter}
                    resetFilter={resetFilter}
                />
                <TableBody
                    data={data?.content || []}
                    columns={columns}
                    handleEditButtonClick={handleEditButtonClick}
                    onDeleteEntity={onDeleteEntity}
                 />
                <TableFooter
                    allData={data?.content || []}
                    columns={columns}
                    downloadExcelFile={onDownloadExcelFile}
                    resourcePath={resourcePath}
                    hasSubTotal={hasSubTotal}
                    data={data?.content || []}
                    params={params}
                    filter={filter}
                />
            </table>
            <Pagination
                filter={filter}
                updatePagination={updatePagination}
                data={data}
            />
        </>
    );
};

Table.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        width: PropTypes.string,
        sortable: PropTypes.bool,
        searchable: PropTypes.bool,
        type: PropTypes.string,
        options: PropTypes.array,
        fetchAPI: PropTypes.func,
        render: PropTypes.func
    })).isRequired,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    onResetPassword: PropTypes.func,
    downloadExcelFile: PropTypes.func,
    initialFilter: PropTypes.object,
    hasSubTotal: PropTypes.bool,
    hasYearSelect: PropTypes.bool,
    refreshTrigger: PropTypes.any
};

Table.defaultProps = {
    initialFilter: {page: 0, size: 10}
};

export default Table;
