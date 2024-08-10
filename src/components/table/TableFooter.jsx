import React from 'react';
import { SiMicrosoftexcel } from "react-icons/si";
import PropTypes from 'prop-types';
import { formatNumber } from "../../utils/functions/formatNumber";
import Tooltip from "../../utils/Tooltip";
import useHttp from "../contexts/useHttp";





const TableFooter = ({data,columns, hasSubTotal, entityName,filter}) => {
   const {download} = useHttp();

    const dynamicColspan = hasSubTotal
        ? columns.length - columns.filter(column => column.subtotal).length
        : columns.length;

    const downloadExcelFile = async (exportAll) => {
        const _params = {};

        Object.keys(filter.search).forEach(key => {
            if (filter.search[key]) {
                _params[key] = filter.search[key];
            }
            if (exportAll) {
                _params['page'] = 0;
                _params['size'] = 10000;
            } else {
                _params['page'] = filter.page;
                _params['size'] = filter.size;
            }
        });

        const url = `${entityName}/download-all-${entityName}.xlsx`;
        const fileName = `${entityName}.xlsx`;

        await download({ url, params: _params, fileName });
    }


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
                        onClick={()=>downloadExcelFile(false)}
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
                            {formatNumber(data?.subtotals?.overallSubtotal)}
                        </td>
                    ) : null
                )}
                <td>
                    <SiMicrosoftexcel
                        data-tooltip-id="export-total-query-to-excel-button"
                        onClick={()=>downloadExcelFile(true)}
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
    entityName: PropTypes.string.isRequired,
    hasSubTotal: PropTypes.bool.isRequired,
};

export default TableFooter;
