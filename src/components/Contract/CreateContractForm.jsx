import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Modal, Row } from "react-bootstrap";
import * as Yup from "yup";
import Button from "../../utils/Button";
import { TextInput } from "../../utils/TextInput";
import DateInput from "../../utils/DateInput";
import { Form } from "../../utils/Form";
import { useYupValidationResolver } from "../../hooks/useYupValidationResolver";
import moment from "jalali-moment";
import { bodyStyle, headerStyle, titleStyle } from "../styles/styles";

import ContractItems from "./ContractItems";
import AsyncSelectInput from "../../utils/AsyncSelectInput";
import NumberInput from "../../utils/NumberInput";
import CustomModal from "../../utils/CustomModal";
import useHttp from "../contexts/useHttp";

const CreateContractForm = ({ onCreateEntity, show, onHide }) => {
    const http = useHttp();

    const yearSelect = async () => {
        return await http.get(`/years/select`,{});
    }

    const customerSelect = async (searchQuery) => {
        return await http.get(`/customers/select`,{searchQuery});
    }

    const validationSchema = Yup.object().shape({
        contractNumber: Yup.string().required('شماره قرارداد الزامیست.'),
        contractDescription: Yup.string().required('توضیحات قرارداد الزامیست.'),
        startDate: Yup.string().required('تاریخ شروع الزامیست.'),
        endDate: Yup.string().required('تاریخ پایان الزامیست.'),
        customerId: Yup.number().required('شناسه مشتری الزامیست.'),
        yearId: Yup.number().required('سال الزامیست.'),
        advancePayment: Yup.number().required('پیش پرداخت الزامیست.'),
        insuranceDeposit: Yup.number().required('ودیعه بیمه الزامیست.'),
        performanceBond: Yup.number().required('ضمانت اجرا الزامیست.'),
        contractItems: Yup.array().of(
            Yup.object().shape({
                productId: Yup.number().required('شناسه محصول الزامیست.'),
                quantity: Yup.number().required('مقدار الزامیست.'),
                unitPrice: Yup.number().required('قیمت واحد الزامیست.'),
            })
        )
    });

    const resolver = useYupValidationResolver(validationSchema);

    const onSubmit = async (data) => {
        if (data.startDate) {
            data.startDate = moment(new Date(data.startDate)).format('YYYY-MM-DD');
        }
        if (data.endDate) {
            data.endDate = moment(new Date(data.endDate)).format('YYYY-MM-DD');
        }
        await onCreateEntity(data);
        onHide();
    };

    return (
        <CustomModal size={"xl"} show={show} >
            <Modal.Header className="modal-header" style={headerStyle} >
                <Modal.Title style={titleStyle}>
                    {"ایجاد قرارداد جدید"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}>
                <div className="container modal-body" style={{ fontFamily: "IRANSans", fontSize: "0.8rem", margin: "0" }}>
                    <Form
                        defaultValues={{
                            contractNumber: '',
                            contractDescription: '',
                            startDate: '',
                            endDate: '',
                            customerId: '',
                            yearId: '',
                            advancePayment: '',
                            insuranceDeposit: '',
                            performanceBond: '',
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
                                        <AsyncSelectInput name="customerId" label={"شناسه مشتری"} apiFetchFunction={customerSelect} />
                                    </Col>
                                    <Col>
                                        <AsyncSelectInput name="yearId" label={"سال"} apiFetchFunction={yearSelect} />
                                    </Col>
                                </Row>
                                <TextInput name="contractDescription" label={"توضیحات قرارداد"} />
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
                </div>
            </Modal.Body>
        </CustomModal>
    );
};

export default CreateContractForm;
