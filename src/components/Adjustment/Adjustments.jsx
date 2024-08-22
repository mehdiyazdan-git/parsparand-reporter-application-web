import React, { useMemo } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CrudComponent from '../contexts/CrudComponent';
import CreateAdjustmentForm from './CreateAdjustmentForm';
import EditAdjustmentForm from './EditAdjustmentForm';
import { toShamsi } from '../../utils/functions/toShamsi';
import { formatNumber } from '../../utils/functions/formatNumber';

const convertToPersianCaption = (subject) => {
    switch (subject) {
        case "POSITIVE":
            return "مثبت";
        case "NEGATIVE":
            return "منفی";
        default:
            return subject;
    }
};
const Adjustments = ({customerId}) => {
    const adjustmentColumns = useMemo(() => [
        { key: 'id', title: 'شناسه', width: '2%', sortable: true },
        { key: 'adjustmentNumber', title: 'شماره تعدیل', width: '5%', sortable: true, searchable: true },
        { key: 'adjustmentDate', title: 'تاریخ تعدیل', width: '5%', sortable: true, searchable: true, type: 'date', render: (item) => toShamsi(item.adjustmentDate) },
        { key: 'adjustmentType', title: 'نوع تعدیل', width: '5%', sortable: true, searchable: true, render: (item) => convertToPersianCaption(item.adjustmentType), type: 'select', options: [{ value: 'POSITIVE', label: convertToPersianCaption('POSITIVE') }, { value: 'NEGATIVE', label: convertToPersianCaption('NEGATIVE') }] },
        { key: 'invoiceNumber', title: 'شماره فاکتور', width: '5%', sortable: true, searchable: true },
        { key: 'description', title: 'توضیحات', width: '25%', sortable: true, searchable: true },
        { key: 'unitPrice', title: 'قیمت واحد', width: '7%', sortable: true, searchable: true, render: (item) => formatNumber(item.unitPrice) },
        { key: 'quantity', title: 'مقدار', width: '5%', sortable: true, searchable: true, render: (item) => formatNumber(item.quantity), subtotal: true },
        { key: 'totalPrice', title: 'مبلغ کل', width: '7%', sortable: true, searchable: true, render: (item) => formatNumber(item.totalPrice), subtotal: true },
    ], []);



    return (
        <CrudComponent
            resourcePath="adjustments"
            columns={adjustmentColumns}
            createForm={<CreateAdjustmentForm />}
            editForm={<EditAdjustmentForm />}
            hasSubTotal={true}
            hasYearSelect={true}
        />
    );
};

export default React.memo(Adjustments);
