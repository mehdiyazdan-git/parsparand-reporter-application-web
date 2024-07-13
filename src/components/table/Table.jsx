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
import useData from '../../hooks/useData';

const Table = ({
                   data,
                   columns,
                   onEdit,
                   onDelete,
                   onResetPassword,
                   entityName,
                   downloadExcelFile,
                   hasYearSelect,
                   initialFilter,
                   hasSubTotal,
                   refreshTrigger
               }) => {
    const {
        filter,
        updateFilter,
        handleSizeChange,
        goToFirstPage,
        goToPrevPage,
        goToNextPage,
        goToLastPage,
    } = useData(entityName, initialFilter);

    const handleYearChange = useCallback((value) => {
        updateFilter({ jalaliYear: value, page: 0 });
    }, [updateFilter]);

    const resetFilter = useCallback(() => {
        const columnsFilter = columns.reduce((acc, column) => {
            acc[column.key] = '';
            return acc;
        }, {});
        updateFilter({ ...columnsFilter, jalaliYear: '', page: 0 });
    }, [columns, updateFilter]);

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
                    filter={filter}
                    updateFilter={updateFilter}
                    entityName={entityName}
                />
                <TableSearch
                    columns={columns}
                    filter={filter}
                    updateFilter={updateFilter}
                    entityName={entityName}
                    resetFilter={resetFilter}
                />
                <TableBody
                    refreshTrigger={refreshTrigger}
                    data={data?.content || []}
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
                    data={data}
                    filter={filter}
                    handleSizeChange={handleSizeChange}
                    goToFirstPage={goToFirstPage}
                    goToPrevPage={goToPrevPage}
                    goToNextPage={goToNextPage}
                    goToLastPage={goToLastPage}
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
