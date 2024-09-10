import React from 'react';
import {useFormContext, useWatch} from "react-hook-form";
import {toShamsi} from "../../utils/functions/toShamsi";
import GenerateDescIcon from "../assets/icons/GenerateDescIcon";

const GenerateReportExplanationButton = () => {

    const {control,setValue,watch} = useFormContext();
    const watchedFields = useWatch({
        name: 'reportItems',
        control
    });

    const handleClick = (e) => {
        e.preventDefault();
        const quantity = watchedFields.reduce((acc, item) => acc + parseInt(item.quantity), 0);
        const reportDate =toShamsi( watch('reportDate'));
        const explanation = `گزارش روزانه فروش - تعداد ${quantity} بشکه در تاریخ ${reportDate} .`;
       setValue('reportExplanation', explanation);
    }


    return (
        <GenerateDescIcon
            className={"generate-desc-icon"}
            type={"button"}
            onClick={handleClick}
        />
    );
};

export default GenerateReportExplanationButton;