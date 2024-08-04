import React, { useEffect, useState } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import AsyncSelectInput from "../../utils/AsyncSelectInput";
import NumberInput from "../../utils/NumberInput";
import AmountNumber from "../../utils/AmountNumber";
import IconDeleteOutline from "../assets/icons/IconDeleteOutline";
import IconAddCircleLine from "../assets/icons/IconAddCircleLine";
import {tableStyle, tdStyle, thStyle} from "../styles/styles";
import useHttp from "../contexts/useHttp";

const ContractItems = () => {
    const [subtotal, setSubtotal] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'contractItems',
    });

    const http = useHttp();
    const productSelect = async (searchQuery = '') => {
        return await http.get(`/products/select?searchQuery=${searchQuery}`,{});
    }

    const watchedFields = useWatch({
        name: 'contractItems',
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
        });
    };

    const removeItem = (index) => {
        remove(index);
    };

    return (
        <div className="form-container">
            <IconAddCircleLine type="button" fontSize={25} onClick={addItem} />
            <table className="table mt-1" style={{...tableStyle,overflow: 'visible'}}>
                <thead>
                <tr>
                    <th style={thStyle}>شناسه محصول</th>
                    <th style={thStyle}>قیمت واحد</th>
                    <th style={thStyle}>مقدار</th>
                    <th style={thStyle}>مجموع</th>
                    <th style={thStyle}>عملیات</th>
                </tr>
                </thead>
                <tbody>
                {fields.map((field, index) => (
                    <tr key={field.id}>
                        <td className="m-0 p-0" style={{ width: '50%',...tdStyle }}>
                            <AsyncSelectInput name={`contractItems[${index}].productId`} apiFetchFunction={productSelect} />
                        </td>
                        <td className="m-0 p-0" style={{ width: '15%',...tdStyle }}>
                            <NumberInput name={`contractItems[${index}].unitPrice`} />
                        </td>
                        <td className="m-0 p-0" style={{ width: '15%',...tdStyle }}>
                            <NumberInput name={`contractItems[${index}].quantity`} />
                        </td>
                        <td className="m-0 p-0" style={{ width: '20%',...tdStyle }}>
                            <AmountNumber
                                value={(parseInt(watchedFields[index]?.unitPrice, 10) || 0) * (parseInt(watchedFields[index]?.quantity, 10) || 0)}
                                disabled
                                className={"amount-number"}
                            />
                        </td>
                        <td className="m-0 p-0" style={{ width: '10%',...tdStyle }}>
                            <IconDeleteOutline size={25} type="button" onClick={() => removeItem(index)} />
                        </td>
                    </tr>
                ))}
                </tbody>
                <tfoot>
                <tr>
                    <td style={thStyle} className="m-0 p-0" colSpan="2">جمع کل:</td>
                    <td style={thStyle}  className="m-0 p-0">
                        <AmountNumber value={totalQuantity} disabled />
                    </td>
                    <td style={thStyle}  className="m-0 p-0">
                        <AmountNumber value={subtotal} disabled />
                    </td>
                    <td style={thStyle}  className="m-0 p-0"></td>
                </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default ContractItems;
