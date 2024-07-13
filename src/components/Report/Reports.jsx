import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CrudComponent from '../../utils/CrudComponent';
import CreateReportForm from './CreateReportForm';
import EditReportForm from './EditReportForm';
import { toShamsi } from '../../utils/functions/toShamsi';
import { formatNumber } from '../../utils/functions/formatNumber';

const Reports = () => {
    const reportColumns = [
        { key: 'id', title: 'شناسه', width: '5%', sortable: true, searchable: true },
        { key: 'reportDate', title: 'تاریخ', width: '5%', sortable: true, searchable: true, type: 'date', render: (item) => toShamsi(item.reportDate) },
        { key: 'reportExplanation', title: 'توضیحات', width: '40%', sortable: true, searchable: true },
        { key: 'totalQuantity', title: 'تعداد کل', width: '7%', sortable: true, searchable: true, type: 'number', subtotal: true, render: (item) => formatNumber(item.totalQuantity) },
        { key: 'totalPrice', title: 'مبلغ کل', width: '10%', sortable: true, searchable: true, type: 'number', subtotal: true, render: (item) => formatNumber(item.totalPrice) },
    ];

    return (
        <CrudComponent
            url={'/reports'}
            entityName="reports"
            columns={reportColumns}
            createForm={<CreateReportForm />}
            editForm={<EditReportForm />}
            hasSubTotal={true}
            hasYearSelect={true}
        />
    );
};

export default Reports;
