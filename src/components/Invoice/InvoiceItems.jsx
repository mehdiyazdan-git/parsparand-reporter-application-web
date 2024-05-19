import React, { useEffect, useState } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import useHttp from '../../hooks/useHttp';
import AsyncSelectInput from "../../utils/AsyncSelectInput";
import NumberInput from "../../utils/NumberInput";
import AmountNumber from "../../utils/AmountNumber";
import IconDeleteOutline from "../assets/icons/IconDeleteOutline";
import IconAddCircleLine from "../assets/icons/IconAddCircleLine";

const InvoiceItems = () => {
    const [subtotal, setSubtotal] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'invoiceItems',
    });

    const http = useHttp();
    const productSelect = async (searchQuery = '') => {
        return await http.get(`/products/select?searchQuery=${searchQuery}`);
    }

    const warehouseReceiptSelect = async (searchQuery = '') => {
        return await http.get(`/warehouse-receipts/select?searchQuery=${searchQuery}`);
    }

    const watchedFields = useWatch({
        name: 'invoiceItems',
        control
    });

    useEffect(() => {
        const newSubtotal = watchedFields.reduce((acc, item) => {
            return acc + (parseInt(item.unitPrice, 10) || 0) * (parseInt(item.quantity, 10) || 0);
        }, 0);
        setSubtotal(newSubtotal);
    }, [watchedFields]);

    useEffect(() => {
        const newTotalQuantity = watchedFields.reduce((acc, item) => {
            return acc + (parseInt(item.quantity, 10) || 0);
        }, 0);
        setTotalQuantity(newTotalQuantity);
    }, [watchedFields]);

    const addItem = () => {
        append({
            productId: '',
            quantity: '',
            unitPrice: '',
            warehouseReceiptId: '',
        });
    };

    const removeItem = (index) => {
        remove(index);
    };

    return (
        <div className="form-container">
            <IconAddCircleLine type="button" fontSize={25} onClick={addItem} />
            <table className="table table-striped table-bordered form-table">
                <thead>
                <tr>
                    <th>شناسه محصول</th>
                    <th>شناسه رسید انبار</th>
                    <th>قیمت واحد</th>
                    <th>مقدار</th>
                    <th>مجموع</th>
                    <th>عملیات</th>
                </tr>
                </thead>
                <tbody>
                {fields.map((field, index) => (
                    <tr key={field.id}>
                        <td className="m-0 p-0" style={{ width: '25%' }}>
                            <AsyncSelectInput name={`invoiceItems[${index}].productId`} apiFetchFunction={productSelect} />
                        </td>
                        <td className="m-0 p-0" style={{ width: '25%' }}>
                            <AsyncSelectInput name={`invoiceItems[${index}].warehouseReceiptId`} apiFetchFunction={warehouseReceiptSelect} />
                        </td>
                        <td className="m-0 p-0" style={{ width: '15%' }}>
                            <NumberInput name={`invoiceItems[${index}].unitPrice`} />
                        </td>
                        <td className="m-0 p-0" style={{ width: '15%' }}>
                            <NumberInput name={`invoiceItems[${index}].quantity`} />
                        </td>
                        <td className="m-0 p-0" style={{ width: '15%' }}>
                            <AmountNumber
                                value={(parseInt(watchedFields[index]?.unitPrice, 10) || 0) * (parseInt(watchedFields[index]?.quantity, 10) || 0)}
                                disabled
                                className={"amount-number"}
                            />
                        </td>
                        <td className="m-0 p-0" style={{ width: '5%' }}>
                            <IconDeleteOutline size={25} type="button" onClick={() => removeItem(index)} />
                        </td>
                    </tr>
                ))}
                </tbody>
                <tfoot>
                <tr>
                    <td className="m-0 p-0" colSpan="3">جمع کل:</td>
                    <td className="m-0 p-0">
                        <AmountNumber value={totalQuantity} disabled />
                    </td>
                    <td className="m-0 p-0">
                        <AmountNumber value={subtotal} disabled />
                    </td>
                    <td className="m-0 p-0"></td>
                </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default InvoiceItems;
