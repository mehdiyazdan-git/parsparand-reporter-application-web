import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CrudComponent from '../../utils/CrudComponent';
import CreateInvoiceForm from './CreateInvoiceForm';
import EditInvoiceForm from './EditInvoiceForm';
import { toShamsi } from '../../utils/functions/toShamsi';
import { formatNumber } from '../../utils/functions/formatNumber';
import PropTypes from 'prop-types';

const Invoices = ({ contractNumber, parent_list_name }) => {
    const listName = parent_list_name && parent_list_name.length > 0 ? parent_list_name : 'invoices';


    const invoiceColumns = [
        { key: 'id', title: 'شناسه', width: '5%', sortable: true },
        { key: 'invoiceNumber', title: 'شماره فاکتور', width: '5%', sortable: true, searchable: true },
        { key: 'issuedDate', title: 'تاریخ صدور', width: '5%', sortable: true, searchable: true, type: 'date', render: (item) => toShamsi(item.issuedDate) },
        { key: 'customerName', title: 'نام مشتری', width: '20%', sortable: true, searchable: true, type: 'async-select', url: '/customers/select', searchKey: 'customerId' },
        { key: 'totalQuantity', title: 'تعداد کل', width: '7%', sortable: true, searchable: true, type: 'number', subtotal: true, render: (item) => formatNumber(item.totalQuantity) },
        { key: 'totalPrice', title: 'مبلغ کل', width: '10%', sortable: true, searchable: true, type: 'number', subtotal: true, render: (item) => formatNumber(item.totalPrice) },
    ];

    return (
        <CrudComponent
            url={'/invoices'}
            entityName={'invoices'}
            columns={invoiceColumns}
            createForm={<CreateInvoiceForm />}
            editForm={<EditInvoiceForm />}
            hasSubTotal={true}
            hasYearSelect={true}
            filters={[{ contractNumber: contractNumber }]}
        />
    );
};

Invoices.propTypes = {
    contractNumber: PropTypes.string,
    parent_list_name: PropTypes.string,
};

export default React.memo(Invoices);
