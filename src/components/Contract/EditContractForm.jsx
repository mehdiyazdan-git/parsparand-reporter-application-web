import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import {Col, Row} from "react-bootstrap";
import * as Yup from "yup";
import Button from "../../utils/Button";
import {TextInput} from "../../utils/TextInput";
import DateInput from "../../utils/DateInput";
import {Form} from "../../utils/Form";
import {useYupValidationResolver} from "../../hooks/useYupValidationResolver";
import moment from "jalali-moment";

import NumberInput from "../../utils/NumberInput";
import AsyncSelectInput from "../../utils/AsyncSelectInput";
import ContractItems from "./ContractItems";
import CustomModal, {Body, Container, Header, Title} from "../../utils/CustomModal";
import ErrorMessage from "../../utils/ErrorMessage";

const EditContractForm = ({editingEntity, onUpdateEntity, show, onHide}) => {

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
        ).min(1, 'حداقل یک آیتم الزامیست.')
    });

    const resolver = useYupValidationResolver(validationSchema);

    const onSubmit = async (data) => {
        if (data.startDate) {
            data.startDate = moment(new Date(data.startDate)).format('YYYY-MM-DD');
        }
        if (data.endDate) {
            data.endDate = moment(new Date(data.endDate)).format('YYYY-MM-DD');
        }
        const errorMessage = await onUpdateEntity(data);
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
                    {"ویرایش قرارداد"}
                </Title>
            </Header>
            <Body>
                <Container>
                    <Form
                        defaultValues={{
                            id: editingEntity.id,
                            contractNumber: editingEntity.contractNumber,
                            contractDescription: editingEntity.contractDescription,
                            startDate: editingEntity.startDate,
                            endDate: editingEntity.endDate,
                            customerId: editingEntity.customerId,
                            yearId: editingEntity.yearId,
                            advancePayment: editingEntity.advancePayment,
                            insuranceDeposit: editingEntity.insuranceDeposit,
                            performanceBond: editingEntity.performanceBond,
                            contractItems: editingEntity.contractItems,
                        }}
                        onSubmit={onSubmit}
                        resolver={resolver}
                    >
                        <Row>
                            <Col>
                                <Row>
                                    <Col>
                                        <TextInput name="contractNumber" label={"شماره قرارداد"}/>
                                    </Col>
                                    <Col>
                                        <DateInput name="startDate" label={"تاریخ شروع"}/>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <DateInput name="endDate" label={"تاریخ پایان"}/>
                                    </Col>
                                    <Col>
                                        <NumberInput name="advancePayment" label={"پیش پرداخت"}/>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <NumberInput name="insuranceDeposit" label={"ودیعه بیمه"}/>
                                    </Col>
                                    <Col>
                                        <NumberInput name="performanceBond" label={"ضمانت اجرا"}/>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <AsyncSelectInput
                                            name="customerId"
                                            label={"شناسه مشتری"}
                                            url={"customers/select"}
                                            value={editingEntity?.customerId}
                                        />
                                    </Col>
                                </Row>
                                <TextInput name="contractDescription" label={"توضیحات قرارداد"}/>
                            </Col>
                        </Row>
                        <ContractItems/>
                        <Button $variant="success" type={"submit"}>
                            ویرایش
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

export default EditContractForm;
