import * as Yup from 'yup';

/***
 validation rules for create invoice form:
 - advancedPayment and insuranceDeposit and performanceBound and contractId are optional
 * they rendered only if salesType is CONTRACTUAL_SALES
 - yearId, customerId, invoiceStatusId and contractId are type of async-select
 - issueDate and dueDate are type of date and the input field is datepicker of type react-multi-date-picker'
 *   the output of this component is a string in format of 'YYYY-MM-DD'
 - invoiceNumber is type of number
 - salesType is type of select
 - invoiceItems is type of array of objects and each object has productId, quantity and unitPrice
 - productId, quantity and unitPrice are type of number
 - warehouseReceiptId is type of async-select
 - the form should have at least one item in invoiceItems
 ***/

const defaultValues = {
    dueDate: '',
    invoiceNumber: '',
    issuedDate: '',
    salesType: 'CASH_SALES',
    contractId: '',
    customerId: '',
    invoiceStatusId: '',
    advancedPayment: '',
    insuranceDeposit: '',
    performanceBound: '',
    yearId: '',
    invoiceItems: [
        {
            productId: '',
            quantity: '',
            unitPrice: '',
            warehouseReceiptId: '',
        }
    ],
}

const createInvoiceSchema = () => {
    return Yup.object().shape({
        dueDate: Yup.string()
            .matches(/^\d{4}-\d{2}-\d{2}$/, 'فرمت تاریخ نامعتبر است. از YYYY/MM/DD استفاده کنید')
            .required('تاریخ سررسید الزامی است'),
        invoiceNumber: Yup.number().typeError('مقدار فیلد باید عدد باشد').required('مقدار فیلد الزامیست'),
        issuedDate: Yup.string()
            .matches(/^\d{4}-\d{2}-\d{2}$/, 'فرمت تاریخ نامعتبر است. از YYYY-MM-DD استفاده کنید')
            .required('تاریخ صدور الزامی است'),
        salesType: Yup.string()
            .oneOf(['CASH_SALES', 'CONTRACTUAL_SALES'])
            .required('نوع فروش الزامی است'),
        contractId: Yup.number().typeError('مقدار فیلد باید عدد باشد'),
        customerId: Yup.number().typeError('مقدار فیلد باید عدد باشد').required('مقدار فیلد الزامیست.'),
        invoiceStatusId: Yup.number().typeError('مقدار فیلد باید عدد باشد').required('مقدار فیلد الزامیست'),
        advancedPayment: Yup.number().typeError('مقدار فیلد باید عدد باشد'),
        insuranceDeposit: Yup.number().typeError('مقدار فیلد باید عدد باشد'),
        performanceBound: Yup.number().typeError('مقدار فیلد باید عدد باشد'),
        yearId: Yup.string().required('مقدار فیلد الزامیست'),
        invoiceItems: Yup.array().of(
            Yup.object().shape({
                productId: Yup.number().typeError('مقدار فیلد باید عدد باشد').required('مقدار فیلد الزامیست'),
                quantity: Yup.number().typeError('مقدار فیلد باید عدد باشد').required('مقدار فیلد الزامیست'),
                unitPrice: Yup.number().typeError('مقدار فیلد باید عدد باشد').required('مقدار فیلد الزامیست'),
                warehouseReceiptId: Yup.number().typeError('مقدار فیلد باید عدد باشد').required('مقدار فیلد الزامیست'),
            })
        ).required('مقدار فیلد الزامیست').min(1, 'فاکتور باید حداقل یک آیتم داشته باشد.'),
    })
}

export default createInvoiceSchema;