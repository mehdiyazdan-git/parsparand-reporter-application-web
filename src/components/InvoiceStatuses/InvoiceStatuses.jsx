import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CrudComponent from '../../utils/CrudComponent';
import CreateInvoiceStatusForm from './CreateInvoiceStatusForm';
import EditInvoiceStatusForm from './EditInvoiceStatusForm';
import PropTypes from 'prop-types';

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

InvoiceStatuses.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            width: PropTypes.string,
            sortable: PropTypes.bool,
            searchable: PropTypes.bool,
            type: PropTypes.oneOf(['text', 'date', 'number', 'select', 'async-select', 'custom']),
            render: PropTypes.func,
            options: PropTypes.arrayOf(
                PropTypes.shape({
                    value: PropTypes.string.isRequired,
                    label: PropTypes.string.isRequired,
                })
            ),
            apiFetchFunction: PropTypes.func,
            subtotal: PropTypes.bool,
        })
    ).isRequired,
};

export default InvoiceStatuses;
