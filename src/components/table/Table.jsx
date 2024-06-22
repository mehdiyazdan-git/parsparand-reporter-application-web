import React from "react";
import TableHeader from './TableHeader';
import TableSearch from './TableSearch';
import TableBody from './TableBody';
import TableFooter from './TableFooter';
import Pagination from "../pagination/Pagination";
import PropTypes from "prop-types";
import useFilter from "../contexts/useFilter";
import TableYear from "./TableYear";

const Table = ({ columns, fetchData, onEdit, onDelete, onResetPassword, refreshTrigger, listName, downloadExcelFile, hasYearSelect = false, hasSubTotal = false }) => {
    const { filter, updateFilter, getParams } = useFilter(listName);
    return (
        <>
            {hasYearSelect && <TableYear filter={filter} updateFilter={updateFilter}/>}
            <table className="recipient-table table-fixed-height mt-3">
                <TableHeader columns={columns} filter={filter} updateFilter={updateFilter} />
                <TableSearch columns={columns} filter={filter} />
                <TableBody columns={columns} fetchData={fetchData} listName={listName} filter={filter} refreshTrigger={refreshTrigger} getParams={getParams} updateFilter={updateFilter} onEdit={onEdit} onDelete={onDelete} onResetPassword={onResetPassword}/>
                <TableFooter columns={columns}  downloadExcelFile={downloadExcelFile} listName={listName} getParams={getParams} hasSubTotal={hasSubTotal} />
            </table>
            <Pagination filter={filter} updateFilter={updateFilter} />
        </>
    );
};

Table.propTypes = {
    columns: PropTypes.array.isRequired,
    fetchData: PropTypes.func.isRequired,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    onResetPassword: PropTypes.func,
    refreshTrigger: PropTypes.func,
    listName: PropTypes.string.isRequired,
    downloadExcelFile: PropTypes.func,
    hasYearSelect: PropTypes.bool,
    hasSubTotal: PropTypes.bool,
};

Table.defaultProps = {
    onEdit: null,
    onDelete: null,
    onResetPassword: null,
    refreshTrigger: null,
    downloadExcelFile: null,
    hasYearSelect: false,
    hasSubTotal: false,
};

Table.displayName = 'Table';


export default Table;
