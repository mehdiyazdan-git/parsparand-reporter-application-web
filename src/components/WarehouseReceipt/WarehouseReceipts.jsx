import React, {useMemo} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CrudComponent from '../contexts/CrudComponent';
import CreateWarehouseReceiptForm from './CreateWarehouseReceiptForm';
import EditWarehouseReceiptForm from './EditWarehouseReceiptForm';
import {toShamsi} from '../../utils/functions/toShamsi';
import {formatNumber} from '../../utils/functions/formatNumber';

const WarehouseReceipts = () => {
    const columns = useMemo(() => [
        {key: 'id', title: 'شناسه', width: '3%', sortable: true},
        {key: 'warehouseReceiptNumber', title: 'شماره حواله', width: '5%', sortable: true, searchable: true},
        {
            key: 'warehouseReceiptDate',
            title: 'تاریخ رسید',
            width: '7%',
            sortable: true,
            searchable: true,
            type: 'date',
            render: (item) => toShamsi(item.warehouseReceiptDate)
        },
        {key: 'warehouseReceiptDescription', title: 'توضیحات', width: '40%', sortable: true, searchable: true},
        {
            key: 'customerName',
            title: 'مشتری',
            width: '15%',
            sortable: true,
            searchable: true,
            type: 'async-select',
            url: 'customers/select',
            searchKey: 'customerId'
        },
        {
            key: 'totalQuantity',
            title: 'تعداد کل',
            width: '7%',
            sortable: true,
            searchable: true,
            type: 'number',
            subtotal: true,
            render: (item) => formatNumber(item.totalQuantity)
        },
        {
            key: 'totalPrice',
            title: 'مبلغ کل',
            width: '10%',
            sortable: true,
            searchable: true,
            type: 'number',
            subtotal: true,
            render: (item) => formatNumber(item.totalPrice)
        },
    ], []);

    return (
        <CrudComponent
            resourcePath={'warehouse-receipts'}
            entityName="warehouse-receipts"
            columns={columns}
            createForm={<CreateWarehouseReceiptForm/>}
            editForm={<EditWarehouseReceiptForm/>}
            hasSubTotal={true}
            hasYearSelect={true}
        />
    );
};

export default React.memo(WarehouseReceipts);
