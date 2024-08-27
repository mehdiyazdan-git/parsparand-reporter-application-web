import React, {useMemo} from 'react';
import {SiMicrosoftexcel} from "react-icons/si";
import PropTypes from 'prop-types';
import {formatNumber} from "../../utils/functions/formatNumber";
import Tooltip from "../../utils/Tooltip";

const TableFooter = ({data,content, columns, hasSubTotal, downloadExcelFile}) => {
    const [pageSubtotal, setPageSubtotal] = React.useState({});

    React.useEffect(() => {
        const calculateSubtotals = (data) => {
            const totals = {
                total: 0,
                totalItems: 0,
            };
            const pageTotals = {};

            data.forEach((row) => {
                totals.total += row.total;
                totals.totalItems += row.totalItems;

                columns.forEach((column) => {
                    if (column.subtotal) {
                        if (!pageTotals[column.key]) {
                            pageTotals[column.key] = 0;
                        }
                        pageTotals[column.key] += row[column.key];
                    }
                });
            });
            setPageSubtotal(pageTotals);
        };
        calculateSubtotals(content);
    }, [content, columns]);


// ... (rest of your component code)

    const dynamicColspan = useMemo(() => {
        return hasSubTotal
            ? columns.length - columns.filter(column => column.subtotal).length
            : columns.length;
    }, [hasSubTotal, columns]); // Dependencies for memoization

// ... (rest of your component code)

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
            <td  colSpan={dynamicColspan} className="subtotal-label">جمع صفحه</td>
            {columns.map(column =>
                column.subtotal ? (
                    <td className="subtotal-col" key={column.key}>
                        {formatNumber(pageSubtotal[column.key])}
                    </td>
                ) : null
            )}
            <td className="export-cell"> {/* Added class for better styling control */}
                <SiMicrosoftexcel
                    onClick={handleDownloadCurrentPage}
                    size="1.3rem"
                    className="mx-1"
                    color="#41941a"
                    type="button"
                />
                <Tooltip id="export-current-page-to-excel-button" color="green" content="صفحه جاری" place="left"/>
            </td>
        </tr>

        {/* Overall Subtotal Row */}
        <tr>
            <td colSpan={dynamicColspan} className="subtotal-label">جمع کل</td>
            {columns.map(column =>
                column.subtotal ? (
                    <td  className="subtotal-col" key={column.key}>
                        {column.key === "totalQuantity" && formatNumber(data?.overallTotalQuantity)}
                        {column.key === "totalPrice" && formatNumber(data?.overallTotalPrice)}
                        {column.key === "paymentAmount" && formatNumber(data?.overallTotalAmount)}
                    </td>
                ) : null
            )}
            <td className="export-cell">
                <SiMicrosoftexcel
                    id="export-total-query-to-excel-button"
                    onClick={handleDownloadAllPages}
                    size="1.3rem"
                    className="mx-1"
                    color="#41941a"
                    type="button"
                />
                <Tooltip id="export-total-query-to-excel-button" color="green" content="کل صفحات" place="left"/>
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

// const data = {
//     "content": [
//         {
//             "id": 6,
//             "warehouseReceiptDate": "2024-05-04",
//             "warehouseReceiptDescription": "حواله فروش 400 عدد بشکه pph2201 آبی و سفید بهران به نفت بهران",
//             "warehouseReceiptNumber": 14998,
//             "customerId": 75,
//             "customerName": "نفت بهران",
//             "yearId": 4,
//             "yearName": 1403,
//             "totalQuantity": 400,
//             "totalPrice": 4.08E9,
//             "warehouseReceiptItems": [
//                 {
//                     "id": 6,
//                     "quantity": 400,
//                     "unitPrice": 10200000,
//                     "productId": 10
//                 }
//             ]
//         }
//     ],
//     "pageable": {
//         "pageNumber": 0,
//         "pageSize": 1,
//         "sort": {
//             "sorted": true,
//             "unsorted": false,
//             "empty": false
//         },
//         "offset": 0,
//         "unpaged": false,
//         "paged": true
//     },
//     "overallTotalQuantity": 400.0,
//     "overallTotalPrice": 4.08E9,
//     "totalElements": 319,
//     "totalPages": 319,
//     "last": false,
//     "numberOfElements": 1,
//     "size": 1,
//     "number": 0,
//     "sort": {
//         "sorted": true,
//         "unsorted": false,
//         "empty": false
//     },
//     "first": true,
//     "empty": false
// }