import React from 'react';
import * as Yup from "yup";

const CreateInvoiceSchema = () => {
    const [contractFieldsVisibility, setContractFieldsVisibility] = React.useState(false);

    return Yup.object().shape({
        dueDate: Yup.date()
            .transform((value, originalValue) => originalValue === '' ? null : value)
            .required('تاریخ تحویل الزامی است'),
        invoiceNumber: Yup.number().typeError('مقدار فیلد باید عدد باشد').required('مقدار فیلد الزامیست'),
        issuedDate: Yup.string()
            .transform((value, originalValue) => originalValue === '' ? null : value)
            .required('تاریخ صدور الزامی است'),
        salesType: Yup.string()
            .oneOf(['CASH_SALES', 'CONTRACTUAL_SALES'])
            .required('نوع فروش الزامی است'),
        contractId: contractFieldsVisibility && Yup.number().typeError('مقدار فیلد باید عدد باشد').notRequired(),
        customerId: Yup.number().typeError('مقدار فیلد باید عدد باشد').required('مقدار فیلد الزامیست.'),
        invoiceStatusId: Yup.number().typeError('مقدار فیلد باید عدد باشد').required('مقدار فیلد الزامیست'),
        advancedPayment: contractFieldsVisibility && Yup.number().typeError('مقدار فیلد باید عدد باشد').notRequired(),
        insuranceDeposit: contractFieldsVisibility && Yup.number().typeError('مقدار فیلد باید عدد باشد').notRequired(),
        performanceBound: contractFieldsVisibility && Yup.number().typeError('مقدار فیلد باید عدد باشد').notRequired(),
        yearId: Yup.string().required('مقدار فیلد الزامیست'),
        invoiceItems: Yup.array().of(
            Yup.object().shape({
                productId: Yup.number().typeError('مقدار فیلد باید عدد باشد').required('مقدار فیلد الزامیست'),
                quantity: Yup.number().typeError('مقدار فیلد باید عدد باشد').required('مقدار فیلد الزامیست'),
                unitPrice: Yup.number().typeError('مقدار فیلد باید عدد باشد').required('مقدار فیلد الزامیست'),
                warehouseReceiptId: Yup.number().typeError('مقدار فیلد باید عدد باشد').required('مقدار فیلد الزامیست'),
            })
        ).required('مقدار فیلد الزامیست').min(1, 'فاکتور باید حداقل یک آیتم داشته باشد.'),
    });
};

export default CreateInvoiceSchema;