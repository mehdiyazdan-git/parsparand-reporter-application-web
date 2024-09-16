import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useFieldArray, useFormContext, useWatch} from 'react-hook-form';
import AsyncSelectInput from "../../utils/AsyncSelectInput";
import NumberInput from "../../utils/NumberInput";
import AmountNumber from "../../utils/AmountNumber";
import IconDeleteOutline from "../assets/icons/IconDeleteOutline";
import IconAddCircleLine from "../assets/icons/IconAddCircleLine";
import {tableStyle, tdStyle, thStyle} from "../styles/styles";
import {AppContext} from "../contexts/AppProvider";




const InvoiceItems = () => {

    const {control, watch, setValue} = useFormContext();
    const {fields, append, remove} = useFieldArray({
        control,
        name: 'invoiceItems',
    });
    const {products, warehouseReceipts} = useContext(AppContext);
    const watchedFields = useWatch({
        name: 'invoiceItems',
        control
    });
    const issuedDate = watch(['issuedDate']);
    const vatRateId = watch(['vatRateId']);
    const vatAmount = watch(['vatAmount']);
    const totalAmount = watch(['totalAmount']);

    const contractId = watch(['contractId']);

    const {VATRates,contracts} = useContext(AppContext);






// useEffect to calculate subtotal
    useEffect(() => {
        const newSubtotal = watchedFields.reduce((acc, item) => {
            const unitPrice = parseFloat(item.unitPrice) || 0;
            const quantity = parseInt(item.quantity, 10) || 0;
            return acc + (unitPrice * quantity);
        }, 0);
        setValue('totalAmount', newSubtotal);
    }, [setValue, watchedFields]);

    // useEffect to calculate totalQuantity
    useEffect(() => {
        const newTotalQuantity = watchedFields.reduce((acc, item) => {
            const quantity = parseInt(item.quantity, 10) || 0;
            return acc + quantity;
        }, 0);
        setValue('totalQuantity', newTotalQuantity);
    }, [setValue, watchedFields]);

   const setVatRate = useCallback( () => {
       const selectedVatRate = VATRates.find(rate => new Date(rate.effectiveFrom) <= new Date(issuedDate));
       setValue('vatRateId', selectedVatRate?.id || VATRates[0]?.id);
   },[issuedDate]);

    useEffect(() => {
        setVatRate();
    }, [setVatRate]);

    useEffect(() => {
        setValue('vatAmount', ((totalAmount * vatRateId) / 100));
        setValue('totalAmountWithVat', parseInt(totalAmount, 10) + parseInt(vatAmount, 10));
    }, [setValue, totalAmount, vatRateId]);

    useEffect(() => {
        if (contractId) {
            const contract = contracts.find(contract => contract.id === contractId);
            const advancedPayment = parseFloat(contract?.advancedPayment);
            const insuranceDeposit = parseFloat(contract?.insuranceDeposit);
            const performanceBound = parseFloat(contract?.performanceBound);

            setValue('advancedPayment', Number((totalAmount * advancedPayment).toFixed(0)));
            setValue('insuranceDeposit', Number((totalAmount * insuranceDeposit).toFixed(0)));
            setValue('performanceBond', Number((totalAmount * performanceBound).toFixed(0)));
        }
    }, [contractId, setValue, totalAmount]);



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
                    <td style={{...thStyle, borderBottom: '1px solid #ccc'}} className="m-0 p-0" colSpan="3">جمع کل:
                    </td>
                    <td style={{...thStyle, borderBottom: '1px solid #ccc'}} className="m-0 p-0">
                        <NumberInput name="totalQuantity"/>
                    </td>
                    <td style={thStyle} className="m-0 p-0">
                        <NumberInput name="totalAmount"/>
                    </td>
                    <td style={thStyle} className="m-0 p-0"></td>
                </tr>
                <tr>
                    <td style={{...thStyle, borderBottom: '1px solid #ccc'}} className="m-0 p-0" colSpan="4">مالیات بر
                        ارزش افزوده:
                    </td>
                    <td style={{...thStyle, borderBottom: '1px solid #ccc'}} className="m-0 p-0"><NumberInput
                        name={"vatAmount"}/></td>
                    <td style={thStyle} className="m-0 p-0"></td>
                </tr>
                <tr style={{borderTop: '1px solid #ddd'}}>
                    <td style={{...thStyle, borderBottom: '1px solid #ccc'}} className="m-0 p-0" colSpan="4">جمع کل با
                        احتساب مالیات:
                    </td>
                    <td style={{...thStyle, borderBottom: '1px solid #ccc'}} className="m-0 p-0"><NumberInput
                        name={"totalAmountWithVat"}/></td>
                    <td style={thStyle} className="m-0 p-0"></td>
                </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default InvoiceItems;
