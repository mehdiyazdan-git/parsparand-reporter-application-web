import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CrudComponent from '../../utils/CrudComponent';
import CreateInvoiceStatusForm from './CreateInvoiceStatusForm';
import EditInvoiceStatusForm from './EditInvoiceStatusForm';

const InvoiceStatuses = () => {
    const invoiceStatusColumns = [
        { key: 'id', title: 'شناسه', width: '10%', sortable: true },
        { key: 'name', title: 'نام وضعیت', width: '80%', sortable: true, searchable: true },
    ];

    return (
        <CrudComponent
            url={'/invoice-statuses'}
            entityName="invoice-statuses"
            columns={invoiceStatusColumns}
            createForm={<CreateInvoiceStatusForm />}
            editForm={<EditInvoiceStatusForm />}
            hasSubTotal={false}
            hasYearSelect={false}
        />
    );
};

export default InvoiceStatuses;
