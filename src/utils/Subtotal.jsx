import React from 'react';
import {useFormContext, useWatch} from "react-hook-form";
import AmountNumber from "./AmountNumber";


const Subtotal = ({label}) => {
    const {control} = useFormContext();
    const unitPrice = useWatch({control,name: 'unitPrice'});
    const quantity = useWatch({control,name: 'quantity'});
    return (
        <div>
            {label && <label htmlFor={label}>{label}</label>}
            <AmountNumber
                value={unitPrice * quantity}
                disabled
                className={"amount-number"}
            />
        </div>
    );
};

export default Subtotal;
