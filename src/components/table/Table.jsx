import React, {useCallback, useEffect} from 'react';
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
import {useFilter} from "../contexts/useFilter";

const Table = ({
                   data, columns, onEdit, onDelete, onResetPassword, entityName,
                   downloadExcelFile, hasYearSelect,hasSubTotal,
                   refreshTrigger,updateSearch,updatePageable,filter,updateSort,getParams
               }) => {


    const handleYearChange = useCallback((value) => {
        updateSearch('jalaliYear', value);
    }, [updateSearch]);


    return (
        <>
            {hasYearSelect && (
                <div style={yearSelectStyle}>
                    <label style={yearSelectLabelStyle}>انتخاب سال</label>
                    <div style={yearSelectContainerStyle}>
                        <YearSelect filter={filter} onChange={handleYearChange} />
                    </div>
                </div>
            )}
            <table className="recipient-table table-fixed-height mt-3">
                <TableHeader
                    columns={columns}
                    entityName={entityName}
                    filter={filter}
                    updateSort={updateSort}
                />
                <TableSearch
                    columns={columns}
                    entityName={entityName}
                    updateSearch={updateSearch}
                    updatePageable={updatePageable}
                    filter={filter}
                />
                <TableBody
                    data={data?.content || []}
                    refreshTrigger={refreshTrigger}
                    entityName={entityName}
                    columns={columns}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onResetPassword={onResetPassword}
                />
                <TableFooter
                    allData={data?.content || []}
                    columns={columns}
                    downloadExcelFile={downloadExcelFile}
                    entityName={entityName}
                    hasSubTotal={hasSubTotal}
                    data={data?.content || []}
                />
            </table>
                <Pagination
                    entityName={entityName}
                    filter={filter}
                    updatePageable={updatePageable}
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
    url: PropTypes.string.isRequired,
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
    initialFilter: { page: 0, size: 10 }
};

export default Table;
