import useData from "./DataContext";
import {useHttp} from "./useHttp";
import {useFilter} from "./useFilter";


//const Reports = () => {
//     const reportColumns = [
//         { key: 'id', title: 'شناسه', width: '5%', sortable: true, searchable: true },
//         { key: 'reportDate', title: 'تاریخ', width: '5%', sortable: true, searchable: true, type: 'date', render: (item) => toShamsi(item.reportDate) },
//         { key: 'reportExplanation', title: 'توضیحات', width: '40%', sortable: true, searchable: true },
//         { key: 'totalQuantity', title: 'تعداد کل', width: '7%', sortable: true, searchable: true, type: 'number', subtotal: true, render: (item) => formatNumber(item.totalQuantity) },
//         { key: 'totalPrice', title: 'مبلغ کل', width: '10%', sortable: true, searchable: true, type: 'number', subtotal: true, render: (item) => formatNumber(item.totalPrice) },
//     ];
//
//     return (
//         <CrudTable
//             entityName={entityName}
//             columns={reportColumns}
//             hasSubTotal={true}
//             hasYearSelect={true}
//         />
//     );
// };

const CrudTable = ({ entityName, columns,hasSubTotal=false ,hasYearSelect=false }) => {
    const { data } = useData(entityName);
    const { accessToken, postEntity, updateEntity, deleteEntity } = useHttp(entityName);

    const handleDelete = (id) => {
        deleteEntity(id, accessToken);
    };

    const handleUpdate = (id, data) => {
        updateEntity(id, data, accessToken);
    };

    const handleCreate = (data) => {
        postEntity(data, accessToken);
    };

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column}>{column}</th>
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            {columns.map((column) => (
                                <td key={column}>{item[column]}</td>
                            ))}
                            <td>
                                <button onClick={() => handleDelete(item.id)}>Delete</button>
                                <button onClick={() => handleUpdate(item.id, item)}>Update</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                {
                    hasSubTotal && <tfoot>
                    <tr>
                        {columns.map((column) => (
                            <tfoot key={column.key}>{column[column.key]}</tfoot>
                            ))}
                        <td></td>
                        </tr>
                    </tfoot>
                }
            </table>
            <button onClick={() => handleCreate({ name: "New Item" })}>Create</button>
        </div>
    );
};

export default CrudTable;
