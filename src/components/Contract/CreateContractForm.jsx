import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Row } from "react-bootstrap";
import * as Yup from "yup";
import Button from "../../utils/Button";
import { TextInput } from "../../utils/TextInput";
import DateInput from "../../utils/DateInput";
import { Form } from "../../utils/Form";
import { useYupValidationResolver } from "../../hooks/useYupValidationResolver";

import ContractItems from "./ContractItems";
import AsyncSelectInput from "../../utils/AsyncSelectInput";
import NumberInput from "../../utils/NumberInput";
import CustomModal, {Body, Container, Header, Title} from "../../utils/CustomModal";
import ErrorMessage from "../../utils/ErrorMessage";
import moment from "jalali-moment";


const CreateContractForm = ({ onCreateEntity, show, onHide }) => {

    const [errorMessage, setErrorMessage] = React.useState(null);

    const validationSchema = Yup.object().shape({
        contractNumber: Yup.string().required('شماره قرارداد الزامیست.'),
        contractDescription: Yup.string().required('عنوان قرارداد الزامیست.'),
        startDate: Yup.string().required('تاریخ شروع الزامیست.'),
        endDate: Yup.string().required('تاریخ پایان الزامیست.'),
        customerId: Yup.number().typeError('مشتری الزامیست.').required(' مشتری الزامیست.'),
        contractItems: Yup.array().of(
            Yup.object().shape({
                productId: Yup.number().typeError('محصول الزامیست.').required(' محصول الزامیست.'),
                quantity: Yup.number().typeError('مقدار الزامیست.').required('مقدار الزامیست.'),
                unitPrice: Yup.number().typeError('قمت واحد الزامیست.').required('قیمت واحد الزامیست.'),
            })
        ).length(1, "حداقل یک آیتم کالا الزامی است"),
    });
    // Sun Sep 01 2024 06:49:39 GMT-0700 (Pacific Daylight Time)
    const resolver = useYupValidationResolver(validationSchema);

    const onSubmit = async (data) => {

        if (data.startDate) {
            data.startDate = moment(data.startDate).format("YYYY-MM-DD");
        }
        if (data.endDate) {
            data.endDate = moment(data.endDate).format("YYYY-MM-DD");
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
                    {"ایجاد قرارداد جدید"}
                </Title>
            </Header>
            <Body>
                <Container>
                    <Form
                        defaultValues={{
                            contractNumber: '',
                            contractDescription: '',
                            startDate: '',
                            endDate: '',
                            customerId: '',
                            advancePayment: '', //percentage type ( 0.00 to 100.00) or decimal type
                            insuranceDeposit: '',//percentage type ( 0.00 to 100.00) or decimal type
                            performanceBond: '',//percentage type ( 0.00 to 100.00) or decimal type
                            contractItems: [
                                {
                                    productId: '',
                                    quantity: '',
                                    unitPrice: '',
                                }
                            ],
                        }}
                        onSubmit={onSubmit}
                        resolver={resolver}
                    >
                        <Row>
                            <Col>
                                <Row>
                                    <Col>
                                        <TextInput name="contractNumber" label={"شماره قرارداد"} />
                                    </Col>
                                    <Col>
                                        <DateInput name="startDate" label={"تاریخ شروع"} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <DateInput name="endDate" label={"تاریخ پایان"} />
                                    </Col>
                                    <Col>
                                        <NumberInput name="advancePayment" label={"پیش پرداخت"} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <NumberInput name="insuranceDeposit" label={"ودیعه بیمه"} />
                                    </Col>
                                    <Col>
                                        <NumberInput name="performanceBond" label={"ضمانت اجرا"} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <AsyncSelectInput
                                            name="customerId"
                                            label={"شناسه مشتری"}
                                            url={"customers/select"}
                                        />
                                    </Col>
                                </Row>
                                <TextInput
                                    name="contractDescription"
                                    label={"توضیحات قرارداد"}
                                />
                            </Col>
                        </Row>
                        <ContractItems />
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

export default CreateContractForm;
