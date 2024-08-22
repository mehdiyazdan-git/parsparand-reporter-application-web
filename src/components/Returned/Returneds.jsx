import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CrudComponent from '../contexts/CrudComponent';
import CreateReturnedForm from './CreateReturnedForm';
import EditReturnedForm from './EditReturnedForm';
import { toShamsi } from '../../utils/functions/toShamsi';

const Returneds = () => {
    const returnedColumns = [
        { key: 'id', title: 'شناسه', width: '5%', sortable: true },
        { key: 'returnedNumber', title: 'شماره مرجوعی', width: '15%', sortable: true, searchable: true },
        { key: 'returnedDate', title: 'تاریخ مرجوعی', width: '15%', sortable: true, searchable: true, type: 'date', render: (item) => toShamsi(item.returnedDate) },
        { key: 'returnedDescription', title: 'توضیحات', width: '25%', sortable: true, searchable: true },
        { key: 'quantity', title: 'مقدار', width: '10%', sortable: true, searchable: true },
        { key: 'unitPrice', title: 'قیمت واحد', width: '10%', sortable: true, searchable: true },
        { key: 'customerName', title: 'نام مشتری', width: '15%', sortable: true, searchable: true },
    ];

    return (
        <CrudComponent
            resourcePath="returneds"
            columns={returnedColumns}
            createForm={<CreateReturnedForm />}
            editForm={<EditReturnedForm />}
            hasSubTotal={true}
            hasYearSelect={true}
        />
    );
};

export default Returneds;
