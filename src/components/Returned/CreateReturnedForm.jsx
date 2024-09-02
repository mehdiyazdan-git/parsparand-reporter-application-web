import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Row } from "react-bootstrap";
import * as Yup from "yup";
import Button from "../../utils/Button";
import { TextInput } from "../../utils/TextInput";
import DateInput from "../../utils/DateInput";
import { Form } from "../../utils/Form";
import { useYupValidationResolver } from "../../hooks/useYupValidationResolver";
import moment from "jalali-moment";
import AsyncSelectInput from "../../utils/AsyncSelectInput";
import NumberInput from "../../utils/NumberInput";

import Subtotal from "../../utils/Subtotal";
import CustomModal, {Body, Container, Header, Title} from "../../utils/CustomModal";


const CreateReturnedForm = ({ onCreateEntity, show, onHide }) => {

    const validationSchema = Yup.object().shape({
        quantity: Yup.number()
            .typeError('مقدار باید عدد باشد.')
            .positive('مقدار باید مثبت باشد.')
            .required('مقدار الزامیست.'),
        unitPrice: Yup.number()
            .typeError('قیمت واحد باید عدد باشد.')
            .positive('قیمت واحد باید مثبت باشد.')
            .required('قیمت واحد الزامیست.'),
        returnedDate: Yup.string().required('تاریخ الزامیست.'),
        returnedDescription: Yup.string()
            .max(255, 'توضیحات نمیتواند بیشتر از 255 کاراکتر باشد.')
            .min(3, 'توضیحات نمیتواند کمتر از 3 کاراکتر باشد.')
            .required('توضیحات  الزامیست.'),
        returnedNumber: Yup.number()
            .typeError('شماره مرجوعی باید عدد باشد.')
            .integer('شماره مرجوی باید عدد صحیح باشد.')
            .required('شماره  الزامیست.'),
        customerId: Yup.number()
            .typeError('مشتری الزامیست.')
            .required(' مشتری الزامیست.'),
    });

    const resolver = useYupValidationResolver(validationSchema);

    const onSubmit = async (data) => {
        if (data.returnedDate) {
            data.returnedDate = moment(new Date(data.returnedDate)).format('YYYY-MM-DD');
        }
        await onCreateEntity(data);
        onHide();
    };

    return (
        <CustomModal size={"xl"} show={show} >
            <Header>
                <Title>
                    {"ایجاد مرجوعی جدید"}
                </Title>
            </Header>
            <Body>
                <Container>
                    <Form
                        defaultValues={{
                            quantity: '',
                            returnedDate: '',
                            returnedDescription: '',
                            returnedNumber: '',
                            unitPrice: '',
                            customerId: '',
                        }}
                        onSubmit={onSubmit}
                        resolver={resolver}
                    >
                        <Row>
                            <Col>
                                <Row>
                                    <Col>
                                        <NumberInput name="returnedNumber" label={"شماره"} />
                                    </Col>
                                    <Col>
                                        <DateInput name="returnedDate" label={"تاریخ "} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <TextInput name="returnedDescription" label={"توضیحات "} />
                                    </Col>
                                    <Col>
                                        <Col>
                                            <AsyncSelectInput
                                                name="customerId"
                                                label={"شناسه مشتری"}
                                                url={"customers/select"}
                                            />
                                        </Col>
                                    </Col>
                                </Row>
                                <Row>
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
                </Container>
            </Body>
        </CustomModal>
    );
};

export default CreateReturnedForm;
