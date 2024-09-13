import React, {useContext} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Row } from "react-bootstrap";
import * as Yup from "yup";
import Button from "../../utils/Button";
import { TextInput } from "../../utils/TextInput";
import DateInput from "../../utils/DateInput";
import { Form } from "../../utils/Form";
import { useYupValidationResolver } from "../../hooks/useYupValidationResolver";
import moment from "jalali-moment";
import { bodyStyle} from "../styles/styles";

import AsyncSelectInput from "../../utils/AsyncSelectInput";
import NumberInput from "../../utils/NumberInput";
import SelectInput from "../../utils/SelectInput";
import Subtotal from "../../utils/Subtotal";
import CustomModal, {Body, Container, Header, Title} from "../../utils/CustomModal";
import ErrorMessage from "../../utils/ErrorMessage";
import {AppContext} from "../contexts/AppProvider";


const CreateAdjustmentForm = ({ onCreateEntity, show, onHide }) => {
    const {invoices} = useContext(AppContext);

    const validationSchema = Yup.object().shape({
        adjustmentType: Yup.string()
            .oneOf(['POSITIVE', 'NEGATIVE'], 'نوع تعدیل باید مثبت یا منفی باشد.')
            .required('نوع تعدیل الزامیست.'),
        description: Yup.string()
            .trim()
            .min(3, 'توضیحات باید حداقل 3 کاراکتر باشد.')
            .max(500, 'توضیحات نباید بیشتر از 500 کاراکتر باشد.')
            .required('توضیحات الزامیست.'),
        quantity: Yup.number()
            .typeError('مقدار باید عدد باشد.')
            .positive('مقدار باید مثبت باشد.')
            .max(1000000, 'مقدار نمی‌تواند بیشتر از 1,000,000 باشد.')
            .required('مقدار الزامیست.'),
        unitPrice: Yup.number()
            .typeError('قیمت واحد باید عدد باشد.')
            .positive('قیمت واحد باید مثبت باشد.')
            .max(1000000000, 'قیمت واحد نمی‌تواند بیشتر از 1,000,000,000 باشد.')
            .required('قیمت واحد الزامیست.'),
        invoiceId: Yup.number()
            .integer('شناسه فاکتور باید عدد صحیح باشد.')
            .positive('شناسه فاکتور باید مثبت باشد.')
            .required('شناسه فاکتور الزامیست.'),
        adjustmentDate: Yup.date()
            .typeError('تاریخ تعدیل باید یک تاریخ معتبر باشد.')
            .max(new Date(), 'تاریخ تعدیل نمی‌تواند در آینده باشد.')
            .required('تاریخ تعدیل الزامیست.'),
        adjustmentNumber: Yup.number()
            .typeError('شماره تعدیل باید عدد باشد.')
            .integer('شماره تعدیل باید عدد صحیح باشد.')
            .positive('شماره تعدیل باید مثبت باشد.')
            .max(1000000, 'شماره تعدیل نمی‌تواند بیشتر از 1,000,000 باشد.')
            .required('شماره تعدیل الزامیست.'),
    });

    const resolver = useYupValidationResolver(validationSchema);

    const [errorMessage, setErrorMessage] = React.useState(null);

    const onSubmit = async (data) => {
        if (data.adjustmentDate) {
            data.adjustmentDate = moment(new Date(data.adjustmentDate)).format('YYYY-MM-DD');
        }
        const errorMessage = await onCreateEntity(data);
        if (errorMessage) {
            setErrorMessage(errorMessage);
        } else {
            setErrorMessage(null);
            onHide();
        }

    };

    return (
        <CustomModal size={"xl"} show={show} >
            <Header>
                <Title>
                    {"ایجاد تعدیل جدید"}
                </Title>
            </Header>
            <Body style={bodyStyle}>
                <Container>
                    <Form
                        defaultValues={{
                            adjustmentType: 'POSITIVE',
                            description: '',
                            quantity: '',
                            unitPrice: '',
                            invoiceId: '',
                            adjustmentDate: '',
                            adjustmentNumber: '',
                        }}
                        onSubmit={onSubmit}
                        resolver={resolver}
                    >
                        <Row>
                            <Col>
                                <Row>
                                    <Col>
                                        <NumberInput name="adjustmentNumber" label={"شماره سند تعدیل"} />
                                    </Col>
                                    <Col>
                                        <SelectInput
                                            name="adjustmentType"
                                            label={"نوع تعدیل"}
                                            options={[
                                                { label: "مثبت", value: "POSITIVE" },
                                                { label: "منفی", value: "NEGATIVE" },
                                            ]}
                                        />
                                    </Col>

                                </Row>
                                <Row>
                                    <Col>
                                        <AsyncSelectInput
                                            name="invoiceId"
                                            label={"شناسه فاکتور"}
                                            options={invoices} />
                                    </Col>
                                    <Col>
                                        <DateInput name="adjustmentDate" label={"تاریخ تعدیل"} />
                                    </Col>
                                </Row>
                                <TextInput name="description" label={"توضیحات"} />
                                <hr/>
                                <Row className={"justify-content-center align-items-center mb-2"}>
                                    <Col>
                                        <NumberInput name="unitPrice" label={"قیمت واحد"} />
                                    </Col>
                                    <Col>
                                        <NumberInput name="quantity" label={"مقدار"} />
                                    </Col>
                                   <Col>
                                        <Subtotal label={"مبلغ کل"} />
                                   </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Button $variant="success" type={"submit"}>
                            ایجاد
                        </Button>
                        <Button onClick={onHide} $variant="warning" type="button">
                            انصراف
                        </Button>
                    </Form>
                    {errorMessage && <ErrorMessage message={errorMessage}/>}
                </Container>
            </Body>
        </CustomModal>
    );
};

export default CreateAdjustmentForm;
