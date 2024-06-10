import React from 'react';
import {useFormContext, useWatch} from "react-hook-form";
import AmountNumber from "./AmountNumber";


const Subtotal = ({label}) => {
    const {control} = useFormContext();
    const unitPrice = useWatch({control,name: 'unitPrice'});
    const quantity = useWatch({control,name: 'quantity'});
    return (
        <>
            {label && <label htmlFor={label}>{label}</label>}
            <AmountNumber
                value={unitPrice * quantity}
                disabled
                className={"amount-number"}
            />
        </>
    );
};

export default Subtotal;
