import React, {useCallback, useContext} from 'react';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TableFooter from './TableFooter';
import Pagination from '../pagination/Pagination';
import TableSearch from './TableSearch';
import PropTypes from 'prop-types';

import yearSelectLabelStyle from '../styles/yearSelectLabelStyle';
import yearSelectContainerStyle from '../styles/yearSelectContainerStyle';
import yearSelectStyle from '../styles/yearSelectStyle';
import AsyncSelectSearch from "./AsyncSelectSearch";
import {AppContext} from "../contexts/AppProvider";


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
    /* option schema = {value: 3, label: 1402} */
    const handleYearChange = useCallback((option) => {
        updateSearchParams({ jalaliYear: parseInt(option?.label, 10) });
    }, [updateSearchParams]);

    const {years} = useContext(AppContext);


    const tableData = data?.content || []; // Extract table data for better readability
    return (
        <div className="table-container"> {/* Added a container for better styling */}
            {hasYearSelect && (
                <div style={yearSelectStyle}>
                    <label style={yearSelectLabelStyle}>انتخاب سال</label>
                    <div style={yearSelectContainerStyle}>
                        <AsyncSelectSearch
                            url="years/select"
                            value={years.find(year => year.value === filters?.search?.jalaliYear) || years[0]}
                            onChange={handleYearChange}
                            styles={{width:"300px"}}
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
                    content={tableData}
                    columns={columns}
                    downloadExcelFile={onDownloadExcelFile}
                    resourcePath={resourcePath}
                    hasSubTotal={hasSubTotal}
                    data={data}
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
