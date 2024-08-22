import React from 'react';
import { SiMicrosoftexcel } from "react-icons/si";
import PropTypes from 'prop-types';
import { formatNumber } from "../../utils/functions/formatNumber";
import Tooltip from "../../utils/Tooltip";

const TableFooter = ({ data,filters, columns, hasSubTotal, downloadExcelFile }) => {
    const dynamicColspan = hasSubTotal
        ? columns.length - columns.filter(column => column.subtotal).length
        : columns.length;

    const handleDownloadCurrentPage = () => {
        downloadExcelFile(false); // Assuming params are handled elsewhere
    };

    const handleDownloadAllPages = () => {
        downloadExcelFile(true);
    };

    if (!hasSubTotal) return null; // Early return if no subtotals

    return (
        <tfoot className="table-footer">
        {/* Page Subtotal Row */}
        <tr>
            <td colSpan={dynamicColspan} className="subtotal-label">جمع صفحه</td>
            {columns.map(column =>
                column.subtotal ? (
                    <td className="subtotal-col" key={column.key}>
                        {formatNumber(data?.subtotals?.pageSubtotal)}
                    </td>
                ) : null
            )}
            <td className="export-cell"> {/* Added class for better styling control */}
                <Tooltip id="export-current-page-to-excel-button" color="green" content="صفحه جاری" place="left">
                    <SiMicrosoftexcel
                        onClick={handleDownloadCurrentPage}
                        size="1.3rem"
                        className="mx-1"
                        color="#41941a"
                        type="button"
                    />
                </Tooltip>
            </td>
        </tr>

        {/* Overall Subtotal Row */}
        <tr>
            <td colSpan={dynamicColspan} className="subtotal-label">جمع کل</td>
            {columns.map(column =>
                column.subtotal ? (
                    <td className="subtotal-col" key={column.key}>
                        {formatNumber(data?.subtotals?.overallSubtotal)}
                    </td>
                ) : null
            )}
            <td className="export-cell">
                <Tooltip id="export-total-query-to-excel-button" color="green" content="کل صفحات" place="left">
                    <SiMicrosoftexcel
                        onClick={handleDownloadAllPages}
                        size="1.3rem"
                        className="mx-1"
                        color="#41941a"
                        type="button"
                    />
                </Tooltip>
            </td>
        </tr>
        </tfoot>
    );
};
TableFooter.propTypes = {
    data: PropTypes.object,
    columns: PropTypes.array,
    hasSubTotal: PropTypes.bool,
    downloadExcelFile: PropTypes.func
}

export default TableFooter;