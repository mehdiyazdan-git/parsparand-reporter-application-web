import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CrudComponent from '../contexts/CrudComponent';
import CreateVatRateForm from './CreateVatRateForm';
import EditVatRateForm from './EditVatRateForm';
import {toShamsi} from "../../utils/functions/toShamsi";

const VatRates = () => {
    // Define columns for the VAT rates table
    const vatRateColumns = [
        { key: 'id', title: 'شناسه', width: '10%', sortable: true },
        { key: 'rate', title: 'نرخ مالیات بر ارزش افزوده', width: '45%', sortable: true, searchable: true },
        { key: 'effectiveFrom', title: 'تاریخ اجرا', width: '45%', sortable: true, searchable: true ,render : (item) => toShamsi(item.effectiveFrom)},
    ];

    return (
        <CrudComponent
            resourcePath="vat-rates"  // Backend API resource path for VAT rates
            columns={vatRateColumns}  // Columns to display in the table
            createForm={<CreateVatRateForm />}  // Form for creating new VAT rate
            editForm={<EditVatRateForm />}  // Form for editing existing VAT rate
            hasSubTotal={false}  // No subtotal functionality required
            hasYearSelect={false}  // No year selection needed
        />
    );
};

export default VatRates;
