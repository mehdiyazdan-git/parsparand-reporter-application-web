import React, {useContext} from 'react';
import {useFormContext, useWatch} from "react-hook-form";
import {AppContext} from "../contexts/AppProvider";
import {toShamsi} from "../../utils/functions/toShamsi";
import GenerateDescIcon from "../assets/icons/GenerateDescIcon";


const GenerateWarehouseDescriptionButton = () => {

    const {control,setValue,watch} = useFormContext();
    const {customers,products} = useContext(AppContext);

    const customerId = watch('customerId');
    const warehouseReceiptDate = toShamsi(watch('warehouseReceiptDate'));
    const warehouseReceiptNumber = watch('warehouseReceiptNumber');


    const watchedFields = useWatch({
        name: 'warehouseReceiptItems',
        control
    });


    const handleClick = (e) => {
        e.preventDefault();
        console.log(watchedFields);
        const quantity = watchedFields.reduce((acc, item) => acc + parseInt(item.quantity), 0);
        const product = (watchedFields.length === 1) ? products.find(product => product.value === watchedFields[0]?.productId)?.label : 'بشکه';
        const customer = customers.find(customer => customer.value === customerId)?.label;
        setValue('warehouseReceiptDescription',
            `  حواله شماره ${warehouseReceiptNumber} فروش ${quantity} عدد ${product} به ${customer} به تاریخ ${warehouseReceiptDate}`);
    };
    return (
        <GenerateDescIcon
            className={"generate-desc-icon"}
            type={"button"}
            onClick={handleClick}
        />
    );
};

export default GenerateWarehouseDescriptionButton;