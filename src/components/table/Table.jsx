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
import {AppContext} from "../contexts/AppProvider";
import AsyncSelectComponent from "../templates/AsyncSelectComponent";


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
        updateSearchParams({ ['jalaliYear']: option?.label });
    }, [updateSearchParams]);

    const {years} = useContext(AppContext);



    const tableData = data?.content || [];
    return (
        <div className="table-container">
            {hasYearSelect && (
                <div style={yearSelectStyle}>
                    <label style={yearSelectLabelStyle}>انتخاب سال</label>
                    <div style={yearSelectContainerStyle}>

                        <AsyncSelectComponent
                            options={years}
                            value={years.find((item) => item.label === filters?.search?.['jalaliYear'])}
                            onChange={handleYearChange}
                            width={'500px'}
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
