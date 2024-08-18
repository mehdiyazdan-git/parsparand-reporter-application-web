import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CrudComponent from '../contexts/CrudComponent';
import CreatePaymentForm from './CreatePaymentForm';
import EditPaymentForm from './EditPaymentForm';
import { formatNumber } from '../../utils/functions/formatNumber';
import { toShamsi } from '../../utils/functions/toShamsi';
import PropTypes from 'prop-types';

const Payments = ({ customerId }) => {
    const convertToPersianSubject = (subject) => {
        switch (subject) {
            case "PRODUCT":
                return "محصول";
            case "INSURANCEDEPOSIT":
                return "سپرده بیمه";
            case "PERFORMANCEBOUND":
                return "حسن انجام کار";
            case "ADVANCEDPAYMENT":
                return "پیش پرداخت";
            default:
                return subject;
        }
    };

    const paymentColumns = [
        { key: 'id', title: 'شناسه', width: '5%', sortable: true },
        { key: 'paymentDescription', title: 'توضیحات', width: '14rem', sortable: true, searchable: true },
        { key: 'paymentDate', title: 'تاریخ', width: '11%', sortable: true, searchable: true, type: 'date', render: (item) => toShamsi(item.paymentDate) },
        {
            key: 'paymentSubject',
            title: 'موضوع',
            width: '15%',
            sortable: true,
            searchable: true,
            render: item => convertToPersianSubject(item.paymentSubject),
            type: 'select',
            options: [
                { value: "PRODUCT", label: 'محصول' },
                { value: "INSURANCEDEPOSIT", label: 'سپرده بیمه' },
                { value: "PERFORMANCEBOUND", label: 'حسن انجام کار' },
                { value: "ADVANCEDPAYMENT", label: 'پیش پرداخت' },
            ]
        },
        { key: 'paymentAmount', title: 'مبلغ', width: '12%', sortable: true, searchable: true, subtotal: true, type: 'number', render: item => formatNumber(item.paymentAmount) },
        { key: 'customerName', title: 'نام مشتری', width: '15%', sortable: true, searchable: true, type: 'async-select', url: 'customers/select', searchKey: 'customerId' },
    ];

    return (
        <CrudComponent
            resourcePath="payments"
            columns={paymentColumns}
            createForm={<CreatePaymentForm />}
            editForm={<EditPaymentForm />}
            hasSubTotal={true}
            hasYearSelect={true}
        />
    );
};

Payments.propTypes = {
    customerId: PropTypes.string
};

export default Payments;
