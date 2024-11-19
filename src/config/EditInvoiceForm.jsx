import React from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import AsyncSelect from 'react-select/async';

const EditInvoiceForm = ({ defaultValues, loadContracts, loadCustomers, loadVatRates }) => {
    const { control, handleSubmit, register } = useForm({
        defaultValues,
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'invoiceItems'
    });

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* Invoice ID */}
            <div>
                <label>Invoice ID</label>
                <input {...register('id')} className="form-control"/>
            </div>

            {/* Due Date */}
            <div>
                <label>Due Date</label>
                <Controller
                    name="dueDate"
                    control={control}
                    render={({ field }) => (
                        <DatePicker
                            {...field}
                            calendar={persian}
                            locale={persian_fa}
                            value={field.value}
                            onChange={(date) => field.onChange(date?.format('YYYY-MM-DD'))}
                        />
                    )}
                />
            </div>

            {/* Invoice Number */}
            <div>
                <label>Invoice Number</label>
                <input {...register('invoiceNumber')} className="form-control" />
            </div>

            {/* Issued Date */}
            <div>
                <label>Issued Date</label>
                <Controller
                    name="issuedDate"
                    control={control}
                    render={({ field }) => (
                        <DatePicker
                            {...field}
                            calendar={persian}
                            locale={persian_fa}
                            value={field.value}
                            onChange={(date) => field.onChange(date?.format('YYYY-MM-DD'))}
                        />
                    )}
                />
            </div>

            {/* Sales Type */}
            <div>
                <label>Sales Type</label>
                <input {...register('salesType')} className="form-control" />
            </div>

            {/* Contract ID */}
            <div>
                <label>Contract</label>
                <Controller
                    name="contractId"
                    control={control}
                    render={({ field }) => (
                        <AsyncSelect
                            {...field}
                            cacheOptions
                            loadOptions={loadContracts}
                        />
                    )}
                />
            </div>

            {/* Customer ID */}
            <div>
                <label>Customer</label>
                <Controller
                    name="customerId"
                    control={control}
                    render={({ field }) => (
                        <AsyncSelect
                            {...field}
                            cacheOptions
                            loadOptions={loadCustomers}
                        />
                    )}
                />
            </div>

            {/* Advanced Payment */}
            <div>
                <label>Advanced Payment</label>
                <Controller
                    name="advancedPayment"
                    control={control}
                    render={({ field }) => (
                        <NumericFormat
                            {...field}
                            thousandSeparator=","
                            displayType="input"
                            className="form-control"
                        />
                    )}
                />
            </div>

            {/* Insurance Deposit */}
            <div>
                <label>Insurance Deposit</label>
                <Controller
                    name="insuranceDeposit"
                    control={control}
                    render={({ field }) => (
                        <NumericFormat
                            {...field}
                            thousandSeparator=","
                            displayType="input"
                            className="form-control"
                        />
                    )}
                />
            </div>

            {/* Invoice Items Table */}
            <div>
                <label>Invoice Items</label>
                <table className="table table-bordered table-responsive">
                    <thead>
                    <tr>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total Price</th>
                    </tr>
                    </thead>
                    <tbody>
                    {fields.map((item, index) => (
                        <tr key={item.id}>
                            <td>
                                <Controller
                                    name={`invoiceItems[${index}].quantity`}
                                    control={control}
                                    render={({ field }) => (
                                        <NumericFormat
                                            {...field}
                                            thousandSeparator=","
                                            displayType="input"
                                            className="form-control"
                                        />
                                    )}
                                />
                            </td>
                            <td>
                                <Controller
                                    name={`invoiceItems[${index}].unitPrice`}
                                    control={control}
                                    render={({ field }) => (
                                        <NumericFormat
                                            {...field}
                                            thousandSeparator=","
                                            displayType="input"
                                            className="form-control"
                                        />
                                    )}
                                />
                            </td>
                            <td>
                                <Controller
                                    name={`invoiceItems[${index}].totalPrice`}
                                    control={control}
                                    render={({ field }) => (
                                        <NumericFormat
                                            {...field}
                                            thousandSeparator=","
                                            displayType="input"
                                            className="form-control"
                                        />
                                    )}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <button type="submit">Save</button>
        </form>
    );
};

export default EditInvoiceForm;
