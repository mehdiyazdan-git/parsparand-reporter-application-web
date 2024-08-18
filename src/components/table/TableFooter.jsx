import React from 'react';
import { SiMicrosoftexcel } from "react-icons/si";
import PropTypes from 'prop-types';
import { formatNumber } from "../../utils/functions/formatNumber";
import Tooltip from "../../utils/Tooltip";

const TableFooter = ({ data, columns, hasSubTotal, downloadExcelFile, params }) => {
    const dynamicColspan = hasSubTotal
        ? columns.length - columns.filter(column => column.subtotal).length
        : columns.length;

    const handleDownloadCurrentPage = () => {
        downloadExcelFile( false, params);
    };

    const handleDownloadAllPages = () => {
        downloadExcelFile( true, params);
    };

    return (
        hasSubTotal && (
            <tfoot className="table-footer">
            <tr>
                <td colSpan={dynamicColspan} className="subtotal-label">جمع صفحه</td>
                {columns.map((column) =>
                    column.subtotal ? (
                        <td className="subtotal-col" key={column.key}>
                            {formatNumber(data?.subtotals?.pageSubtotal)}
                        </td>
                    ) : null
                )}
                <td>
                    <SiMicrosoftexcel
                        data-tooltip-id="export-current-page-to-excel-button"
                        onClick={handleDownloadCurrentPage}
                        size={"1.3rem"}
                        className={"mx-1"}
                        color={"#41941a"}
                        type="button"
                    />
                    <Tooltip
                        id="export-current-page-to-excel-button"
                        color={"green"}
                        content="صفحه جاری"
                        place="left"
                    />
                </td>
            </tr>
            <tr>
                <td colSpan={dynamicColspan} className="subtotal-label">جمع کل</td>
                {columns.map((column) =>
                    column.subtotal ? (
                        <td className="subtotal-col" key={column.key}>
                            {formatNumber(data?.subtotals?.overallSubtotal)}
                        </td>
                    ) : null
                )}
                <td>
                    <SiMicrosoftexcel
                        data-tooltip-id="export-total-query-to-excel-button"
                        onClick={handleDownloadAllPages}
                        size={"1.3rem"}
                        className={"mx-1"}
                        color={"#41941a"}
                        type="button"
                    />
                    <Tooltip
                        id="export-total-query-to-excel-button"
                        color={"green"}
                        content="کل صفحات"
                        place="left"
                    />
                </td>
            </tr>
            </tfoot>
        )
    );
};

TableFooter.propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.object.isRequired,
    hasSubTotal: PropTypes.bool.isRequired,
    downloadExcelFile: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
};

export default TableFooter;