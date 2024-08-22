import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CrudComponent from '../contexts/CrudComponent';
import CreateContractForm from './CreateContractForm';
import EditContractForm from './EditContractForm';
import { toShamsi } from '../../utils/functions/toShamsi';
import { formatNumber } from '../../utils/functions/formatNumber';

const Contracts = () => {
    const contractColumns = [
        { key: 'id', title: 'شناسه', width: '3%', sortable: true },
        { key: 'contractNumber', title: 'شماره قرارداد', width: '7%', sortable: true, searchable: true },
        { key: 'contractDescription', title: 'توضیحات قرارداد', width: '25%', sortable: true, searchable: true },
        { key: 'startDate', title: 'تاریخ شروع', width: '5%', sortable: true, searchable: true, type: 'date', render: (item) => toShamsi(item.startDate) },
        { key: 'endDate', title: 'تاریخ پایان', width: '5%', sortable: true, searchable: true, type: 'date', render: (item) => toShamsi(item.endDate) },
        { key: 'customerName', title: 'شناسه مشتری', width: '15%', sortable: true, searchable: true },
        { key: 'totalQuantity', title: 'تعداد کل', width: '7%', sortable: true, searchable: true, type: 'number', subtotal: true, render: (item) => formatNumber(item.totalQuantity) },
        { key: 'totalPrice', title: 'مبلغ کل', width: '10%', sortable: true, searchable: true, type: 'number', subtotal: true, render: (item) => formatNumber(item.totalPrice) },
    ];

    return (
        <CrudComponent
            resourcePath="contracts"
            columns={contractColumns}
            createForm={<CreateContractForm />}
            editForm={<EditContractForm />}
            hasSubTotal={true}
            hasYearSelect={true}
        />
    );
};

export default React.memo(Contracts);
