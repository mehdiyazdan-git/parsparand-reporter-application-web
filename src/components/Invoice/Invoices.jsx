import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CrudComponent from '../contexts/CrudComponent';
import CreateInvoiceForm from './CreateInvoiceForm';
import EditInvoiceForm from './EditInvoiceForm';
import {toShamsi} from '../../utils/functions/toShamsi';
import {formatNumber} from '../../utils/functions/formatNumber';

const Invoices = ({filterOptions}) => {


    const columns = [
        {key: 'id', title: 'شناسه', width: '5%', sortable: true},
        {key: 'invoiceNumber', title: 'شماره فاکتور', width: '5%', sortable: true, searchable: true},
        {
            key: 'issuedDate',
            title: 'تاریخ صدور',
            width: '5%',
            sortable: true,
            searchable: true,
            type: 'date',
            render: (item) => toShamsi(item.issuedDate)
        },
        {
            key: 'customerName',
            title: 'مشتری',
            width: '15%',
            sortable: true,
            searchable: true,
            type: 'async-select',
            url: 'customers/select',
            searchKey: 'customerId',
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
    ];

    return (
        <CrudComponent
            resourcePath="invoices"
            entityName="invoices"
            columns={columns}
            filterOptions={filterOptions}
            createForm={<CreateInvoiceForm/>}
            editForm={<EditInvoiceForm/>}
            hasSubTotal={true}
            hasYearSelect={true}
        />
    );
};


export default React.memo(Invoices);
