import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import AsyncSelectInput from "../../utils/AsyncSelectInput";
import NumberInput from "../../utils/NumberInput";
import AmountNumber from "../../utils/AmountNumber";
import IconDeleteOutline from "../assets/icons/IconDeleteOutline";
import IconAddCircleLine from "../assets/icons/IconAddCircleLine";
import {tableStyle, tdStyle, thStyle} from "../styles/styles";


const ReportItems = () => {
    const [subtotal, setSubtotal] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'reportItems',
    });

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
            <td className="m-0 p-0" style={{ width: '25%',...tdStyle}}>
                <AsyncSelectInput
                    url={"customers/select"}
                    name={`reportItems[${index}].customerId`}
                    value={fields[index]['customerId']}
                    // onChange has already been passed by form context. No need to pass it again
                />
            </td>
            <td className="m-0 p-0" style={{ width: '25%',...tdStyle}}>
                <AsyncSelectInput
                    url={"warehouse-receipts/select"}
                    name={`reportItems[${index}].warehouseReceiptId`}
                    value={fields[index]['warehouseReceiptId']}
                    // onChange has already been passed by form context. No need to pass it again
                />
            </td>
            <td className="m-0 p-0" style={{ width: '10%',...tdStyle}}>
                <NumberInput name={`reportItems[${index}].unitPrice`} />
            </td>
            <td className="m-0 p-0" style={{ width: '5%',...tdStyle}}>
                <NumberInput name={`reportItems[${index}].quantity`} />
            </td>
            <td className="m-0 p-0" style={{ width: '10%',...tdStyle}}>
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
    )), [fields, watchedFields, removeItem]);

    return (
        <div className="form-container" >
            <IconAddCircleLine type="button" fontSize={25} onClick={addItem}/>
            <table className="table mt-1" style={{...tableStyle,overflow: 'visible'}}>
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
