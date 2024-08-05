import React from 'react';
import { SiMicrosoftexcel } from "react-icons/si";
import PropTypes from 'prop-types';
import { formatNumber } from "../../utils/functions/formatNumber";
import Tooltip from "../../utils/Tooltip";
import {useFilter} from "../contexts/useFilter";
import {filterToSearchParams} from "../contexts/filterToSearchParams";

const response = {
    content: [],
    pageable: {
        pageNumber: 0,
        pageSize: 10,
        sort: {
            empty: false,
            sorted: true,
            unsorted: false
        },
        offset: 0,
        unpaged: false,
        paged: true
    },
    last: false,
    subTotals : {
        'totalPrice': {
            'page_subtotal' : 0,
            'overall_subtotal' : 0
        },
        'totalQuantity': {
            'page_subtotal' : 0,
            'overall_subtotal' : 0
        }
    },
    size: 10,
    number: 0,
    numberOfElements: 0,
    first: true,
    empty: false
};

const TableFooter = ({columns, hasSubTotal, entityName}) => {

   const {filter,filteredData} = useFilter(entityName);

   const params = filterToSearchParams(filter);

    const downloadExcelFile = async () => {
       return;
    };


    const dynamicColspan = hasSubTotal
        ? columns.length - columns.filter(column => column.subtotal).length
        : columns.length;



    return (
        hasSubTotal && (
            <tfoot className="table-footer">
            <tr>
                <td colSpan={dynamicColspan} className="subtotal-label">جمع صفحه</td>
                {columns.map((column) =>
                    column.subtotal ? (
                        <td className="subtotal-col" key={column.key}>
                            {formatNumber(filteredData?.subtotals?.pageSubtotal)}
                        </td>
                    ) : null
                )}
                <td>
                    <SiMicrosoftexcel
                        data-tooltip-id="export-current-page-to-excel-button"
                        onClick={downloadExcelFile}
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
                            {formatNumber(filteredData?.subtotals?.overallSubtotal)}
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
    entityName: PropTypes.string.isRequired,
    hasSubTotal: PropTypes.bool.isRequired,
};

export default TableFooter;
