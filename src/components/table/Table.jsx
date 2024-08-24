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
                   filters,
                   resetFilter,
                   updateSearchParams,
                   updatePagination,
                   updateSorting,
                   handleEditButtonClick,
                   onDownloadExcelFile,
                   onDeleteEntity,
                   resourcePath
               }) => {

    const handleYearChange = useCallback((value) => {
        updateSearchParams({ jalaliYear: parseInt(value, 10) });
    }, [updateSearchParams]);

    const tableData = data?.content || []; // Extract table data for better readability
    return (
        <div className="table-container"> {/* Added a container for better styling */}
            {hasYearSelect && (
                <div style={yearSelectStyle}>
                    <label style={yearSelectLabelStyle}>انتخاب سال</label>
                    <div style={yearSelectContainerStyle}>
                        <YearSelect
                            value={filters?.search?.jalaliYear}
                            onChange={handleYearChange}
                        />
                    </div>
                </div>
            )}

            <table className="recipient-table table-fixed-height mt-3">
                <TableHeader columns={columns} filter={filters} updateSorting={updateSorting}/>
                <TableSearch
                    columns={columns}
                    resourcePath={resourcePath}
                    updateSearchParams={updateSearchParams}
                    updatePagination={updatePagination}
                    filters={filters}
                    resetFilter={resetFilter}
                />
                <TableBody
                    data={tableData}
                    columns={columns}
                    handleEditButtonClick={handleEditButtonClick}
                    onDeleteEntity={onDeleteEntity}
                />
                <TableFooter
                    allData={tableData}
                    columns={columns}
                    downloadExcelFile={onDownloadExcelFile}
                    resourcePath={resourcePath}
                    hasSubTotal={hasSubTotal}
                    data={tableData}
                    filters={filters}
                />
            </table>

            <Pagination
                updatePagination={updatePagination}
                data={data}
            />
        </div>
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
