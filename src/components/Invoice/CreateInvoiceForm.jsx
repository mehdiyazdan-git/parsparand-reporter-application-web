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
import InvoiceItems from "./InvoiceItems";
import AsyncSelectInput from "../../utils/AsyncSelectInput";
import NumberInput from "../../utils/NumberInput";

const CreateInvoiceForm = ({ onCreateInvoice, show, onHide }) => {
    const http = useHttp();

    const yearSelect = async () => {
        return await http.get(`/years/select`);
    }

    const customerSelect = async (searchQuery = '') => {
        return await http.get(`/customers/select?searchQuery=${searchQuery}`);
    }

    const contractSelect = async (searchQuery = '') => {
        return await http.get(`/contracts/select?searchQuery=${searchQuery}`);
    }

    const invoiceStatusSelect = async () => {
        return await http.get(`/invoice-status/select`);
    }

    const validationSchema = Yup.object().shape({
        dueDate: Yup.string().required('تاریخ سررسید الزامیست.'),
        invoiceNumber: Yup.number().required('شماره فاکتور الزامیست.'),
        issuedDate: Yup.string().required('تاریخ صدور الزامیست.'),
        salesType: Yup.string().required('نوع فروش الزامیست.'),
        contractId: Yup.number().required('شناسه قرارداد الزامیست.'),
        customerId: Yup.number().required('شناسه مشتری الزامیست.'),
        invoiceStatusId: Yup.number().required('وضعیت فاکتور الزامیست.'),
        advancedPayment: Yup.number().required('پیش پرداخت الزامیست.'),
        insuranceDeposit: Yup.number().required('ودیعه بیمه الزامیست.'),
        performanceBound: Yup.number().required('ضمانت اجرا الزامیست.'),
        yearId: Yup.number().required('سال الزامیست.'),
        invoiceItems: Yup.array().of(
            Yup.object().shape({
                productId: Yup.number().required('شناسه محصول الزامیست.'),
                quantity: Yup.number().required('مقدار الزامیست.'),
                unitPrice: Yup.number().required('قیمت واحد الزامیست.'),
                warehouseReceiptId: Yup.number().required('شناسه رسید انبار الزامیست.'),
            })
        )
    });

    const resolver = useYupValidationResolver(validationSchema);

    const onSubmit = async (data) => {
        if (data.dueDate) {
            data.dueDate = moment(new Date(data.dueDate)).format('YYYY-MM-DD');
        }
        if (data.issuedDate) {
            data.issuedDate = moment(new Date(data.issuedDate)).format('YYYY-MM-DD');
        }
        await onCreateInvoice(data);
        onHide();
    };

    return (
        <Modal size={"xl"} show={show} onHide={onHide}>
            <Modal.Header style={headerStyle} closeButton>
                <Modal.Title style={titleStyle}>
                    {"ایجاد فاکتور جدید"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}>
                <div className="container modal-body" style={{ fontFamily: "IRANSans", fontSize: "0.8rem", margin: "0" }}>
                    <Form
                        defaultValues={{
                            dueDate: '',
                            invoiceNumber: '',
                            issuedDate: '',
                            salesType: '',
                            contractId: '',
                            customerId: '',
                            invoiceStatusId: '',
                            advancedPayment: '',
                            insuranceDeposit: '',
                            performanceBound: '',
                            yearId: '',
                            invoiceItems: [
                                {
                                    productId: '',
                                    quantity: '',
                                    unitPrice: '',
                                    warehouseReceiptId: '',
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
                                        <DateInput name="dueDate" label={"تاریخ سررسید"} />
                                    </Col>
                                    <Col>
                                        <NumberInput name="invoiceNumber" label={"شماره فاکتور"} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <DateInput name="issuedDate" label={"تاریخ صدور"} />
                                    </Col>
                                    <Col>
                                        <TextInput name="salesType" label={"نوع فروش"} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <AsyncSelectInput name="contractId" label={"شناسه قرارداد"} apiFetchFunction={contractSelect} />
                                    </Col>
                                    <Col>
                                        <AsyncSelectInput name="customerId" label={"شناسه مشتری"} apiFetchFunction={customerSelect} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <AsyncSelectInput name="invoiceStatusId" label={"وضعیت فاکتور"} apiFetchFunction={invoiceStatusSelect} />
                                    </Col>
                                    <Col>
                                        <AsyncSelectInput name="yearId" label={"سال"} apiFetchFunction={yearSelect} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <NumberInput name="advancedPayment" label={"پیش پرداخت"} />
                                    </Col>
                                    <Col>
                                        <NumberInput name="insuranceDeposit" label={"ودیعه بیمه"} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <NumberInput name="performanceBound" label={"ضمانت اجرا"} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <InvoiceItems />
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

export default CreateInvoiceForm;
