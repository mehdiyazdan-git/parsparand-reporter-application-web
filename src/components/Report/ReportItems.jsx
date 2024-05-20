import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import useHttp from '../../hooks/useHttp';
import AsyncSelectInput from "../../utils/AsyncSelectInput";
import NumberInput from "../../utils/NumberInput";
import AmountNumber from "../../utils/AmountNumber";
import IconDeleteOutline from "../assets/icons/IconDeleteOutline";
import IconAddCircleLine from "../assets/icons/IconAddCircleLine";

const ReportItems = () => {
    const [subtotal, setSubtotal] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'reportItems',
    });

    const http = useHttp();
    const customerSelect = useCallback(async (searchQuery = '') => {
        return await http.get(`/customers/select?searchQuery=${searchQuery}`);
    }, [http]);

    const warehouseReceiptSelect = useCallback(async (searchQuery = '', yearId = '2') => {
        return await http.get(`/warehouse-receipts/select?searchQuery=${searchQuery}&yearId=${yearId}`);
    }, [http]);

    const watchedFields = useWatch({
        name: 'reportItems',
        control
    });

    useEffect(() => {
        const calculateTotals = () => {
            const newSubtotal = watchedFields.reduce((acc, item) => {
                return acc + (parseInt(item.unitPrice, 10) || 0) * (parseInt(item.quantity, 10) || 0);
            }, 0);
            setSubtotal(newSubtotal);

            const newTotalQuantity = watchedFields.reduce((acc, item) => {
                return acc + (parseInt(item.quantity, 10) || 0);
            }, 0);
            setTotalQuantity(newTotalQuantity);
        };
        calculateTotals();
    }, [watchedFields]);

    const addItem = useCallback(() => {
        append({
            quantity: '',
            unitPrice: '',
            customerId: '',
            warehouseReceiptId: '',
        });
    }, [append]);

    const removeItem = useCallback((index) => {
        remove(index);
    }, [remove]);

    const renderedFields = useMemo(() => fields.map((field, index) => (
        <tr key={field.id}>
            <td className="m-0 p-0" style={{ width: '25%' }}>
                <AsyncSelectInput name={`reportItems[${index}].customerId`} apiFetchFunction={customerSelect} />
            </td>
            <td className="m-0 p-0" style={{ width: '25%' }}>
                <AsyncSelectInput name={`reportItems[${index}].warehouseReceiptId`} apiFetchFunction={warehouseReceiptSelect} />
            </td>
            <td className="m-0 p-0" style={{ width: '15%' }}>
                <NumberInput name={`reportItems[${index}].unitPrice`} />
            </td>
            <td className="m-0 p-0" style={{ width: '15%' }}>
                <NumberInput name={`reportItems[${index}].quantity`} />
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
    )), [fields, watchedFields, customerSelect, warehouseReceiptSelect, removeItem]);

    return (
        <div className="form-container">
            <IconAddCircleLine type="button" fontSize={25} onClick={addItem} />
            <table className="table table-striped table-bordered form-table">
                <thead>
                <tr>
                    <th>شناسه مشتری</th>
                    <th>شناسه رسید انبار</th>
                    <th>قیمت واحد</th>
                    <th>مقدار</th>
                    <th>مجموع</th>
                    <th>عملیات</th>
                </tr>
                </thead>
                <tbody>
                {renderedFields}
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

export default ReportItems;
