import React, { useMemo } from 'react';
import { SiMicrosoftexcel } from "react-icons/si";
import PropTypes from 'prop-types';
import { formatNumber } from "../../utils/functions/formatNumber";
import Tooltip from "../../utils/Tooltip";

const TableFooter = ({
                         columns,
                         data,
                         allData,
                         downloadExcelFile,
                         listName,
                         hasSubTotal,
                         getParams,
                     }) => {
    const dynamicColspan = hasSubTotal
        ? columns.length - columns.filter(column => column.subtotal).length
        : columns.length;

    const subtotals = useMemo(() => {
        if (data && data?.length === 0) return 0;
        return columns.reduce((acc, column) => {
            if (column?.subtotal) {
                if (data && data?.length > 0) {
                    acc[column.key] = data.reduce((sum, item) => sum + (item[column.key] || 0), 0);
                }
            }
            return acc;
        }, {});
    }, [data, columns]);

    const overallSubtotals = useMemo(() => {
        if(allData && allData?.length === 0) return 0;
        return columns.reduce((acc, column) => {
            if (column?.subtotal) {
               if (allData && allData?.length > 0){
                   acc[column.key] = allData.reduce((sum, item) => sum + (item[column.key] || 0), 0);
               }
            }
            return acc;
        }, {});
    }, [allData, columns]);

    return (
        hasSubTotal && (
            <tfoot className="table-footer">
            <tr>
                <td colSpan={dynamicColspan} className="subtotal-label">جمع صفحه</td>
                {columns.map((column) =>
                    column.subtotal ? (
                        <td className="subtotal-col" key={column.key}>
                            {formatNumber(subtotals[column.key])}
                        </td>
                    ) : null
                )}
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
                {columns.map((column) =>
                    column.subtotal ? (
                        <td className="subtotal-col" key={column.key}>
                            {formatNumber(overallSubtotals[column.key])}
                        </td>
                    ) : null
                )}
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
    downloadExcelFile: PropTypes.func.isRequired,
    listName: PropTypes.string.isRequired,
    hasSubTotal: PropTypes.bool.isRequired,
    getParams: PropTypes.func.isRequired,
};

export default TableFooter;
