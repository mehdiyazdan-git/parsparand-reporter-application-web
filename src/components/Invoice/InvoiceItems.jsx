import React, {useContext, useEffect, useState} from 'react';
import {useFieldArray, useFormContext, useWatch} from 'react-hook-form';
import AsyncSelectInput from "../../utils/AsyncSelectInput";
import NumberInput from "../../utils/NumberInput";
import AmountNumber from "../../utils/AmountNumber";
import IconDeleteOutline from "../assets/icons/IconDeleteOutline";
import IconAddCircleLine from "../assets/icons/IconAddCircleLine";
import {tableStyle, tdStyle, thStyle} from "../styles/styles";
import {AppContext} from "../contexts/AppProvider";
import FooterNumber from "../../utils/FooterNumber";



const InvoiceItems = () => {
    const [subtotal, setSubtotal] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [vatRate, setVatRate] = useState(null);
    const [vatAmount, setVatAmount] = useState(0);
    const [error, setError] = useState(null);
    const {control, watch} = useFormContext();
    const {fields, append, remove} = useFieldArray({
        control,
        name: 'invoiceItems',
    });
    const {products, warehouseReceipts} = useContext(AppContext);

    const watchedFields = useWatch({
        name: 'invoiceItems',
        control
    });
    const issuedDate = watch('issuedDate');

    const VATRates = [
        {
            "id": 1,
            "rate": 0.1,
            "effectiveFrom": "2024-09-12"
        },
        {
            "id": 3,
            "rate": 0.08,
            "effectiveFrom": "2020-09-12"
        }
    ];

    useEffect(() => {
        try {
            if (issuedDate) {
                const issuedDateObj = new Date(issuedDate);
                const selectedVatRate = VATRates.find(rate => new Date(rate.effectiveFrom) <= issuedDateObj);
                if (!selectedVatRate) {
                    throw new Error('No applicable VAT rate found for the given date.');
                }
                setVatRate(selectedVatRate);
                const calculatedVatAmount = ((subtotal * selectedVatRate.rate) / 100);
                setVatAmount(calculatedVatAmount);
            }
        } catch (error) {
            console.error('Error in VAT calculation:', error.message);
            setError('An error occurred while calculating VAT. Please check the issued date.');
            setVatRate(null);
            setVatAmount(0);
        }
    }, [issuedDate, subtotal, watchedFields]);

    useEffect(() => {
        try {
            const newSubtotal = watchedFields.reduce((acc, item) => {
                const unitPrice = parseInt(item.unitPrice, 10);
                const quantity = parseInt(item.quantity, 10);
                if (isNaN(unitPrice) || isNaN(quantity)) {
                    throw new Error('Invalid unit price or quantity.');
                }
                return acc + (unitPrice * quantity);
            }, 0);
            setSubtotal(newSubtotal);
        } catch (error) {
            console.error('Error in subtotal calculation:', error.message);
            setError('An error occurred while calculating subtotal. Please check your input values.');
            setSubtotal(0);
        }
    }, [watchedFields]);

    useEffect(() => {
        try {
            const newTotalQuantity = watchedFields.reduce((acc, item) => {
                const quantity = parseInt(item.quantity, 10);
                if (isNaN(quantity)) {
                    throw new Error('Invalid quantity.');
                }
                return acc + quantity;
            }, 0);
            setTotalQuantity(newTotalQuantity);
        } catch (error) {
            console.error('Error in total quantity calculation:', error.message);
            setError('An error occurred while calculating total quantity. Please check your input values.');
            setTotalQuantity(0);
        }
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
            <IconAddCircleLine type="button" fontSize={25} onClick={addItem}/>
            <table className="table mt-1" style={{...tableStyle, overflow: 'visible'}}>
                <thead>
                <tr>
                    <th style={thStyle}>شناسه محصول</th>
                    <th style={thStyle}>شناسه رسید انبار</th>
                    <th style={thStyle}>قیمت واحد</th>
                    <th style={thStyle}>مقدار</th>
                    <th style={thStyle}>مجموع</th>
                    <th style={thStyle}>عملیات</th>
                </tr>
                </thead>
                <tbody>
                {fields.map((field, index) => (
                    <tr key={field.id}>
                        <td className="m-0 p-0" style={{width: '25%', ...tdStyle}}>
                            <AsyncSelectInput
                                options={products}
                                name={`invoiceItems[${index}].productId`}
                                value={fields[index]['productId']}
                            />
                        </td>
                        <td className="m-0 p-0" style={{width: '25%', ...tdStyle}}>
                            <AsyncSelectInput
                                options={warehouseReceipts}
                                name={`invoiceItems[${index}].warehouseReceiptId`}
                                value={fields[index]['warehouseReceiptId']}
                            />
                        </td>
                        <td className="m-0 p-0" style={{width: '15%', ...tdStyle}}>
                            <NumberInput name={`invoiceItems[${index}].unitPrice`}/>
                        </td>
                        <td className="m-0 p-0" style={{width: '15%', ...tdStyle}}>
                            <NumberInput name={`invoiceItems[${index}].quantity`}/>
                        </td>
                        <td className="m-0 p-0" style={{width: '15%', ...tdStyle}}>
                            <AmountNumber
                                value={(parseInt(watchedFields[index]?.unitPrice, 10) || 0) * (parseInt(watchedFields[index]?.quantity, 10) || 0)}
                                disabled
                                className={"amount-number"}
                            />
                        </td>
                        <td className="m-0 p-1" style={{
                            width: '5%', ...tdStyle,
                            textAlign: 'center',
                            justifyContent: 'center',
                            padding: '0.2rem'
                        }}>
                            <IconDeleteOutline size={25} type="button" onClick={() => removeItem(index)}/>
                        </td>
                    </tr>
                ))}
                </tbody>
                <tfoot>
                <tr>
                    <td style={{...thStyle,borderBottom: '1px solid #ccc'}} className="m-0 p-0" colSpan="3">جمع کل:</td>
                    <td style={{...thStyle,borderBottom: '1px solid #ccc'}} className="m-0 p-0">
                        <AmountNumber value={totalQuantity} isDisable={true}/>
                    </td>
                    <td style={thStyle} className="m-0 p-0">
                        <AmountNumber value={subtotal} isDisable={true}/>
                    </td>
                    <td style={thStyle} className="m-0 p-0"></td>
                </tr>
                <tr>
                    <td style={{...thStyle,borderBottom: '1px solid #ccc'}} className="m-0 p-0" colSpan="4">مالیات بر ارزش  افزوده:</td>
                    <td style={{...thStyle,borderBottom: '1px solid #ccc'}} className="m-0 p-0"><FooterNumber number={vatAmount}/></td>
                    <td style={thStyle} className="m-0 p-0"></td>
                </tr>
                <tr style={{borderTop: '1px solid #ddd'}}>
                    <td style={{...thStyle,borderBottom: '1px solid #ccc'}} className="m-0 p-0" colSpan="4">جمع کل با احتساب مالیات:</td>
                    <td style={{...thStyle,borderBottom: '1px solid #ccc'}} className="m-0 p-0"><FooterNumber number={Number(subtotal + vatAmount)} disabled/></td>
                    <td style={thStyle} className="m-0 p-0"></td>
                    </tr>
                </tfoot>
            </table>
        </div>
);
};

export default InvoiceItems;
