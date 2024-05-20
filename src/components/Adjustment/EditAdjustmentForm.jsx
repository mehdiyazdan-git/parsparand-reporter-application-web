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
import useHttp from "../../hooks/useHttp";
import AsyncSelectInput from "../../utils/AsyncSelectInput";
import NumberInput from "../../utils/NumberInput";

const EditAdjustmentForm = ({ adjustment, onUpdateAdjustment, show, onHide }) => {
    const http = useHttp();

    const invoiceSelect = async (searchQuery = '') => {
        return await http.get(`/invoices/select?searchQuery=${searchQuery}`);
    }

    const validationSchema = Yup.object().shape({
        adjustmentType: Yup.string().required('نوع تعدیل الزامیست.'),
        description: Yup.string().required('توضیحات الزامیست.'),
        quantity: Yup.number().required('مقدار الزامیست.'),
        unitPrice: Yup.number().required('قیمت واحد الزامیست.'),
        invoiceId: Yup.number().required('شناسه فاکتور الزامیست.'),
        adjustmentDate: Yup.string().required('تاریخ تعدیل الزامیست.'),
        adjustmentNumber: Yup.number().required('شماره تعدیل الزامیست.'),
    });

    const resolver = useYupValidationResolver(validationSchema);

    const onSubmit = async (data) => {
        if (data.adjustmentDate) {
            data.adjustmentDate = moment(new Date(data.adjustmentDate)).format('YYYY-MM-DD');
        }
        await onUpdateAdjustment(data);
        onHide();
    };

    return (
        <Modal size={"xl"} show={show} onHide={onHide}>
            <Modal.Header style={headerStyle} className="bg-dark text-white" closeButton>
                <Modal.Title style={titleStyle}>
                    {"ویرایش تعدیل"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}>
                <div className="container modal-body" style={{ fontFamily: "IRANSans", fontSize: "0.8rem", margin: "0" }}>
                    <Form
                        defaultValues={{
                            id: adjustment.id,
                            adjustmentType: adjustment.adjustmentType,
                            description: adjustment.description,
                            quantity: adjustment.quantity,
                            unitPrice: adjustment.unitPrice,
                            invoiceId: adjustment.invoiceId,
                            adjustmentDate: adjustment.adjustmentDate,
                            adjustmentNumber: adjustment.adjustmentNumber,
                        }}
                        onSubmit={onSubmit}
                        resolver={resolver}
                    >
                        <Row>
                            <Col>
                                <Row>
                                    <Col>
                                        <TextInput name="adjustmentType" label={"نوع تعدیل"} />
                                    </Col>
                                    <Col>
                                        <NumberInput name="adjustmentNumber" label={"شماره تعدیل"} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <DateInput name="adjustmentDate" label={"تاریخ تعدیل"} />
                                    </Col>
                                    <Col>
                                        <NumberInput name="quantity" label={"مقدار"} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <NumberInput name="unitPrice" label={"قیمت واحد"} />
                                    </Col>
                                    <Col>
                                        <AsyncSelectInput name="invoiceId" label={"شناسه فاکتور"} apiFetchFunction={invoiceSelect} />
                                    </Col>
                                </Row>
                                <TextInput name="description" label={"توضیحات"} />
                            </Col>
                        </Row>
                        <Button $variant="success" type={"submit"}>
                            ویرایش
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

export default EditAdjustmentForm;
