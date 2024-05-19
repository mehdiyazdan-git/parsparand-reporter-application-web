import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Modal, Row } from "react-bootstrap";
import * as Yup from "yup";
import Button from "../../utils/Button";
import { TextInput } from "../../utils/TextInput";
import { Form } from "../../utils/Form";
import { useYupValidationResolver } from "../../hooks/useYupValidationResolver";
import { bodyStyle, headerStyle, titleStyle } from "../styles/styles";
import CheckboxInput from "../../utils/CheckboxInput";

const CreateCustomerForm = ({ onCreateCustomer, show, onHide }) => {
    const validationSchema = Yup.object().shape({
        monthlyReport: Yup.bool().required('گزارش ماهانه الزامیست.'),
        customerCode: Yup.string().required('کد مشتری الزامیست.'),
        economicCode: Yup.string().required('کد اقتصادی الزامیست.'),
        name: Yup.string().required('نام الزامیست.'),
        nationalCode: Yup.string().required('کد ملی الزامیست.'),
        phone: Yup.string().required('تلفن الزامیست.'),
    });

    const resolver = useYupValidationResolver(validationSchema);

    const onSubmit = async (data) => {
        await onCreateCustomer(data);
        onHide();
    };

    return (
        <Modal size={"xl"} show={show} onHide={onHide}>
            <Modal.Header style={headerStyle} closeButton>
                <Modal.Title style={titleStyle}>
                    {"ایجاد مشتری جدید"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}>
                <div className="container modal-body" style={{ fontFamily: "IRANSans", fontSize: "0.8rem", margin: "0" }}>
                    <Form
                        defaultValues={{
                            monthlyReport: false,
                            customerCode: '',
                            economicCode: '',
                            name: '',
                            nationalCode: '',
                            phone: '',
                        }}
                        onSubmit={onSubmit}
                        resolver={resolver}
                    >
                        <Row>
                            <Col>
                                <Row>
                                    <Col>
                                        <CheckboxInput name="monthlyReport" label={"گزارش ماهانه"} />
                                    </Col>
                                    <Col>
                                        <TextInput name="customerCode" label={"کد مشتری"} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <TextInput name="economicCode" label={"کد اقتصادی"} />
                                    </Col>
                                    <Col>
                                        <TextInput name="name" label={"نام"} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <TextInput name="nationalCode" label={"کد ملی"} />
                                    </Col>
                                    <Col>
                                        <TextInput name="phone" label={"تلفن"} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Button variant="success" type={"submit"}>
                            ایجاد
                        </Button>
                        <Button onClick={onHide} variant="warning" type="button">
                            انصراف
                        </Button>
                    </Form>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default CreateCustomerForm;
