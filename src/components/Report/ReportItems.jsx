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

    const warehouseReceiptSelect = useCallback(async (searchQuery = '', yearId = '') => {
        return await http.get(`/warehouse-receipts/select?searchQuery=${searchQuery}&yearId=${yearId.toString()}`);
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

    const thStyle = {
        padding: '0.25rem 0.75rem',
        borderBottom: '1px solid #dee2e6',
        backgroundColor: 'rgba(218,222,225,0.9)',
        borderTop: '1px solid #cccccc',
        borderRight: '1px solid #cccccc',
        borderLeft: '1px solid #cccccc',
        borderTopLeftRadius: '5px',
        borderTopRightRadius: '5px',
        boxSizing: 'border-box',
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontSize: '0.775rem',
        lineHeight: 2,
        color: '#212529',
    };

    const tdStyle = {
        padding: '0.25rem 0.75rem',
        borderBottom: '1px solid #dee2e6',
        verticalAlign: 'top',
        textAlign: 'left',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        backgroundColor: '#fff',
    };

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        tableLayout: 'fixed',
        borderSpacing: 0,
        border: '1px solid #ccc',
        backgroundColor: '#fff',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '5px',
        overflow: 'hidden',
        marginBottom: '1rem',
        fontSize: '0.875rem',
        lineHeight: 1.5,
        color: '#212529',
        boxSizing: 'border-box',
        display: 'block',
        maxWidth: '100%',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
    }

    const renderedFields = useMemo(() => fields.map((field, index) => (
        <tr key={field.id}>
            <td className="m-0 p-0" style={{ width: '25%'}}>
                <AsyncSelectInput name={`reportItems[${index}].customerId`} apiFetchFunction={customerSelect} />
            </td>
            <td className="m-0 p-0" style={{ width: '25%'}}>
                <AsyncSelectInput name={`reportItems[${index}].warehouseReceiptId`} apiFetchFunction={warehouseReceiptSelect} />
            </td>
            <td className="m-0 p-0" style={{ width: '10%'}}>
                <NumberInput name={`reportItems[${index}].unitPrice`} />
            </td>
            <td className="m-0 p-0" style={{ width: '5%'}}>
                <NumberInput name={`reportItems[${index}].quantity`} />
            </td>
            <td className="m-0 p-0" style={{ width: '10%'}}>
                <AmountNumber
                    value={(parseInt(watchedFields[index]?.unitPrice, 10) || 0) * (parseInt(watchedFields[index]?.quantity, 10) || 0)}
                    disabled
                    className={"amount-number"}
                />
            </td>
            <td className="m-0" style={{ width: '5%' , padding:"0.25rem 0.75rem"}}>
                <IconDeleteOutline size={25} type="button" onClick={() => removeItem(index)} />
            </td>
        </tr>
    )), [fields, watchedFields, customerSelect, warehouseReceiptSelect, removeItem]);

    return (
        <div className="form-container">
            <IconAddCircleLine type="button" fontSize={25} onClick={addItem}/>
            <table className="table mt-1" style={tableStyle}>
                <thead>
                <tr>
                    <th style={thStyle}>شناسه مشتری</th>
                    <th style={thStyle}>شناسه رسید انبار</th>
                    <th style={thStyle}>قیمت واحد</th>
                    <th style={thStyle}>مقدار</th>
                    <th style={thStyle}>مجموع</th>
                    <th style={thStyle}>عملیات</th>
                </tr>
                </thead>
                <tbody>
                {renderedFields}
                </tbody>
                <tfoot>
                <tr>
                    <td style={thStyle} className="m-0 p-0" colSpan="3">جمع کل:</td>
                    <td style={thStyle} className="m-0 p-0">
                        <AmountNumber value={totalQuantity} disabled />
                    </td>
                    <td style={thStyle} className="m-0 p-0">
                        <AmountNumber value={subtotal} disabled />
                    </td>
                    <td style={thStyle} className="m-0 p-0"></td>
                </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default ReportItems;
