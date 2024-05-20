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
import AsyncSelectInput from "../../utils/AsyncSelectInput";
import NumberInput from "../../utils/NumberInput";
import useHttp from "../../hooks/useHttp";

const CreateReturnedForm = ({ onCreateReturned, show, onHide }) => {
    const http = useHttp();

    const customerSelect = async (searchQuery = '') => {
        return await http.get(`/customers/select?searchQuery=${searchQuery}`);
    }

    const validationSchema = Yup.object().shape({
        quantity: Yup.number().required('مقدار الزامیست.'),
        returnedDate: Yup.string().required('تاریخ مرجوعی الزامیست.'),
        returnedDescription: Yup.string().required('توضیحات مرجوعی الزامیست.'),
        returnedNumber: Yup.number().required('شماره مرجوعی الزامیست.'),
        unitPrice: Yup.number().required('قیمت واحد الزامیست.'),
        customerId: Yup.number().required('شناسه مشتری الزامیست.'),
    });

    const resolver = useYupValidationResolver(validationSchema);

    const onSubmit = async (data) => {
        if (data.returnedDate) {
            data.returnedDate = moment(new Date(data.returnedDate)).format('YYYY-MM-DD');
        }
        await onCreateReturned(data);
        onHide();
    };

    return (
        <Modal size={"xl"} show={show} onHide={onHide}>
            <Modal.Header style={headerStyle} closeButton>
                <Modal.Title style={titleStyle}>
                    {"ایجاد مرجوعی جدید"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}>
                <div className="container modal-body" style={{ fontFamily: "IRANSans", fontSize: "0.8rem", margin: "0" }}>
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
                                        <NumberInput name="quantity" label={"مقدار"} />
                                    </Col>
                                    <Col>
                                        <DateInput name="returnedDate" label={"تاریخ مرجوعی"} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <TextInput name="returnedDescription" label={"توضیحات مرجوعی"} />
                                    </Col>
                                    <Col>
                                        <NumberInput name="returnedNumber" label={"شماره مرجوعی"} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <NumberInput name="unitPrice" label={"قیمت واحد"} />
                                    </Col>
                                    <Col>
                                        <AsyncSelectInput name="customerId" label={"شناسه مشتری"} apiFetchFunction={customerSelect} />
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
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default CreateReturnedForm;
