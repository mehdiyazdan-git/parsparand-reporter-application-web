import React, {useContext} from 'react';
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
import AsyncSelectComponent from "../templates/AsyncSelectComponent";


const CreateContractForm = ({ onCreateEntity, show, onHide }) => {

    const [errorMessage, setErrorMessage] = React.useState(null);

    const validationSchema = Yup.object().shape({
        contractNumber: Yup.string()
            .trim()
            .matches(/^[A-Za-z0-9-]+$/, 'شماره قرارداد باید شامل حروف، اعداد و خط تیره باشد.')
            .min(3, 'شماره قرارداد باید حداقل 3 کاراکتر باشد.')
            .max(20, 'شماره قرارداد نباید بیشتر از 20 کاراکتر باشد.')
            .required('شماره قرارداد الزامیست.'),
        contractDescription: Yup.string()
            .trim()
            .min(10, 'توضیحات قرارداد باید حداقل 10 کاراکتر باشد.')
            .max(500, 'توضیحات قرارداد نباید بیشتر از 500 کاراکتر باشد.')
            .required('توضیحات قرارداد الزامیست.'),
        startDate: Yup.date()
            .typeError('تاریخ شروع باید یک تاریخ معتبر باشد.')
            .min(new Date(), 'تاریخ شروع نمی‌تواند در گذشته باشد.')
            .required('تاریخ شروع الزامیست.'),
        endDate: Yup.date()
            .typeError('تاریخ پایان باید یک تاریخ معتبر باشد.')
            .min(
                Yup.ref('startDate'),
                'تاریخ پایان باید بعد از تاریخ شروع باشد.'
            )
            .required('تاریخ پایان الزامیست.'),
        customerId: Yup.number()
            .typeError('مشتری باید انتخاب شود.')
            .positive('شناسه مشتری باید عددی مثبت باشد.')
            .integer('شناسه مشتری باید عدد صحیح باشد.')
            .required('انتخاب مشتری الزامیست.'),
        advancePayment: Yup.number()
            .typeError('پیش پرداخت باید عدد باشد.')
            .min(0, 'پیش پرداخت نمی‌تواند منفی باشد.')
            .max(100, 'پیش پرداخت نمی‌تواند بیشتر از 100 درصد باشد.')
            .nullable(),
        insuranceDeposit: Yup.number()
            .typeError('ودیعه بیمه باید عدد باشد.')
            .min(0, 'ودیعه بیمه نمی‌تواند منفی باشد.')
            .max(100, 'ودیعه بیمه نمی‌تواند بیشتر از 100 درصد باشد.')
            .nullable(),
        performanceBond: Yup.number()
            .typeError('ضمانت اجرا باید عدد باشد.')
            .min(0, 'ضمانت اجرا نمی‌تواند منفی باشد.')
            .max(100, 'ضمانت اجرا نمی‌تواند بیشتر از 100 درصد باشد.')
            .nullable(),
        contractItems: Yup.array().of(
            Yup.object().shape({
                productId: Yup.number()
                    .typeError('محصول باید انتخاب شود.')
                    .positive('شناسه محصول باید عددی مثبت باشد.')
                    .integer('شناسه محصول باید عدد صحیح باشد.')
                    .required('انتخاب محصول الزامیست.'),
                quantity: Yup.number()
                    .typeError('مقدار باید عدد باشد.')
                    .positive('مقدار باید عددی مثبت باشد.')
                    .required('مقدار الزامیست.'),
                unitPrice: Yup.number()
                    .typeError('قیمت واحد باید عدد باشد.')
                    .positive('قیمت واحد باید عددی مثبت باشد.')
                    .required('قیمت واحد الزامیست.'),
            })
        )
            .min(1, "حداقل یک آیتم کالا الزامی است")
            .required('حداقل یک آیتم کالا الزامی است'),
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
                                    <AsyncSelectComponent
                                        dataKey="customers"
                                    />
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
