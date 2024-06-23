import React, { useMemo } from 'react';
import { SiMicrosoftexcel } from "react-icons/si";
import PropTypes from 'prop-types';
import { formatNumber } from "../../utils/functions/formatNumber";
import Tooltip from "../../utils/Tooltip";

const TableFooter = ({ columns, data,allData, downloadExcelFile, listName, getParams, hasSubTotal }) => {

    const dynamicColspan = columns.length - columns.filter(column => column.subtotal).length;

    const subtotals = useMemo(() => {
        return columns.reduce((acc, column) => {
            if (column.subtotal) {
                acc[column.key] = data.reduce((sum, item) => sum + (item[column.key] || 0), 0);
            }
            return acc;
        }, {});
    }, [data]);

    // Calculate overall subtotals for all data
    const overallSubtotals = useMemo(() => {
        return columns.reduce((acc, column) => {
            if (column.subtotal) {
                acc[column.key] = allData.reduce((sum, item) => sum + (item[column.key] || 0), 0);
            }
            return acc;
        }, {});
    }, [columns, allData]);

    return (
        hasSubTotal && (
            <tfoot className="table-footer">
            <tr>
                <td colSpan={dynamicColspan} className="subtotal-label">جمع صفحه</td>
                {columns.map((column) => (
                    column.subtotal ? (
                        <td className="subtotal-col" key={column.key}>
                            {formatNumber(subtotals[column.key])}
                        </td>
                    ) : null
                ))}
                <td>
                    <SiMicrosoftexcel
                        data-tooltip-id="export-current-page-to-excel-button"
                        onClick={() => downloadExcelFile(getParams(listName), false)}
                        size={"1.3rem"}
                        className={"mx-1"}
                        color={"#41941a"}
                        type="button"
                    />
                </td>
            </tr>
            <tr>
                <td colSpan={dynamicColspan} className="subtotal-label">جمع کل</td>
                {columns.map((column) => (
                    column.subtotal ? (
                        <td className="subtotal-col" key={column.key}>
                            {formatNumber(overallSubtotals[column.key])}
                        </td>
                    ) : null
                ))}
                <td>
                    <SiMicrosoftexcel
                        data-tooltip-id="export-total-query-to-excel-button"
                        onClick={() => downloadExcelFile(true)}
                        size={"1.3rem"}
                        className={"mx-1"}
                        color={"#41941a"}
                        type="button"
                    />
                </td>
            </tr>
            <Tooltip
                id="export-current-page-to-excel-button"
                color={"green"}
                content="صفحه جاری"
                place="left"
            />
            <Tooltip
                id="export-total-query-to-excel-button"
                color={"green"}
                content="کل صفحات"
                place="left"
            />
            </tfoot>
        )
    );
};

TableFooter.propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    allData: PropTypes.array.isRequired,
    dynamicColspan: PropTypes.number.isRequired,
    downloadExcelFile: PropTypes.func.isRequired,
    listName: PropTypes.string.isRequired,
    getParams: PropTypes.func.isRequired,
    hasSubTotal: PropTypes.bool.isRequired
};

export default TableFooter;
