import React from 'react';
import {useFieldArray, useFormContext, useWatch} from "react-hook-form";

/***
 example description template : حواله شماره 12929 فروش 400 عدد بشکه pph2201 آبی 5015 پلمپ دار به پتروشیمی کارون به تاریخ 1401/10/10
 parts : quantity, product, color, size, seal, destination, date
 defaultValues={{
 warehouseReceiptDate: '',
 warehouseReceiptDescription: '',
 warehouseReceiptNumber: '',
 customerId: '',
 warehouseReceiptItems: [
 {
 productId: '',
 quantity: '',
 unitPrice: '',
 amount: '',
 }
 ],
 }}
 ***/

const GenerateDescriptionButton = () => {

    const {control,setValue} = useFormContext();
    const {fields} = useFieldArray({
        control,
        name: 'invoiceItems',
    });

    const watchedFields = useWatch({
        name: 'invoiceItems',
        control
    });

    const handleClick = () => {
        let description = `حواله شماره ${watchedFields[0].warehouseReceiptNumber} فروش ${watchedFields[0].quantity} عدد بشکه ${watchedFields[0].product} ${watchedFields[0].color} ${watchedFields[0].size} ${watchedFields[0].seal} به ${watchedFields[0].destination} به تاریخ ${watchedFields[0].date}`;
        setValue('warehouseReceiptDescription',description);
    };


    return (
        <div>
            <button className="btn btn-primary" onClick={handleClick}>Generate Description</button>
        </div>
    );
};

export default GenerateDescriptionButton;