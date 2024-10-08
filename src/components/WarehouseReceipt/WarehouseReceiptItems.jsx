import React, {useContext, useEffect, useState} from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import AsyncSelectInput from "../../utils/AsyncSelectInput";
import NumberInput from "../../utils/NumberInput";
import AmountNumber from "../../utils/AmountNumber";
import IconDeleteOutline from "../assets/icons/IconDeleteOutline";
import IconAddCircleLine from "../assets/icons/IconAddCircleLine";
import {tableStyle, thStyle} from "../styles/styles";
import {AppContext} from "../contexts/AppProvider";


const WarehouseReceiptItems = () => {
    const [subtotal, setSubtotal] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'warehouseReceiptItems',
    });

    const watchedFields = useWatch({
        name: 'warehouseReceiptItems',
        control
    });
    const {products} = useContext(AppContext);


    useEffect(() => {
        const newTotalQuantity = watchedFields.reduce((acc, item) => {
            return acc + (parseInt(item.quantity, 10) || 0);
        }, 0);
        setTotalQuantity(newTotalQuantity);
        const newSubtotal = watchedFields.reduce((acc, item) => {
            return acc + (parseInt(item.unitPrice, 10) || 0) * (parseInt(item.quantity, 10) || 0);
        }, 0);
        setSubtotal(newSubtotal);
    }, [watchedFields]);

    const addItem = () => {
        append({
            productId: '',
            quantity: '',
            unitPrice: '',
            amount: '',
        });
    };

    const removeItem = (index) => {
        remove(index);
    };

    return (
        <div className="form-container">
            <IconAddCircleLine type="button" fontSize={25}  onClick={addItem}/>
            <table className="table mt-1" style={{...tableStyle,overflow: 'visible'}}>
                <thead>
                <tr>
                    <th style={thStyle}> محصول</th>
                    <th style={thStyle}>قیمت واحد</th>
                    <th style={thStyle}>مقدار</th>
                    <th style={thStyle}>مجموع</th>
                    <th style={thStyle}>عملیات</th>
                </tr>
                </thead>
                <tbody>
                {fields.map((field, index) => (
                    <tr key={field.id}>
                        <td className="m-0 p-0" style={{ width: '50%' }}>
                            <AsyncSelectInput
                                options={products}
                                name={`warehouseReceiptItems[${index}].productId`}
                                value={fields[index]['productId']}
                            />
                        </td>
                        <td className="m-0 p-0" style={{ width: '15%' }}>
                            <NumberInput name={`warehouseReceiptItems[${index}].unitPrice`} field={field} />
                        </td>
                        <td className="m-0 p-0" style={{ width: '15%' }}>
                            <NumberInput name={`warehouseReceiptItems[${index}].quantity`} field={field} />
                        </td>
                        <td className="m-0 p-0" style={{ width: '20%' }}>
                            <AmountNumber
                                value={(parseInt(watchedFields[index]?.unitPrice, 10) || 0) * (parseInt(watchedFields[index]?.quantity, 10) || 0)}
                                disabled
                                className={"amount-number"}
                            />
                        </td>
                        <td className="m-0 p-0" style={{ width: '10%' }}>
                            <IconDeleteOutline size={25} type="button" onClick={() => removeItem(index)} />
                        </td>
                    </tr>
                ))}
                </tbody>
                <tfoot>
                <tr>
                    <td style={thStyle} className="m-0 p-0" colSpan="2">جمع کل:</td>
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

export default WarehouseReceiptItems;
