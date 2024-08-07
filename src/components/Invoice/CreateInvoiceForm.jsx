import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Modal, Row } from "react-bootstrap";
import * as Yup from "yup";
import Button from "../../utils/Button";
import DateInput from "../../utils/DateInput";
import { Form } from "../../utils/Form";
import { useYupValidationResolver } from "../../hooks/useYupValidationResolver";
import moment from "jalali-moment";
import { bodyStyle, headerStyle, titleStyle } from "../styles/styles";
import InvoiceItems from "./InvoiceItems";
import AsyncSelectInput from "../../utils/AsyncSelectInput";
import NumberInput from "../../utils/NumberInput";
import SelectInput from "../../utils/SelectInput";
import ContractFields from "./ContractFields";
import CustomModal from "../../utils/CustomModal";
import useHttp from "../contexts/useHttp";

const CreateInvoiceForm = ({ onCreateEntity, show, onHide }) => {
    const http = useHttp();
    const [isContractualSales, setIsContractualSales] = useState(false);

    const yearSelect = async () => {
        return await http.get(`/years/select`,'');
    }

    const customerSelect = async (searchQuery = '') => {
        return await http.get(`/customers/select`,searchQuery);
    }

    const contractSelect = async (searchQuery = '') => {
        return await http.get(`/contracts/select`,searchQuery);
    }

    const invoiceStatusSelect = async (searchParam='') => {
        return await http.get(`/invoice-statuses/select`,searchParam);
    }

    const validationSchema = Yup.object().shape({
        dueDate: Yup.string().required('تاریخ سررسید الزامیست.'),
        invoiceNumber: Yup.number().required('شماره فاکتور الزامیست.'),
        issuedDate: Yup.string().required('تاریخ صدور الزامیست.'),
        salesType: Yup.string().required('نوع فروش الزامیست.'),
        invoiceStatusId: Yup.number().required('وضعیت فاکتور الزامیست.'),
        contractId: isContractualSales ? Yup.number().required('شناسه قرارداد الزامیست.') : Yup.number(),
        customerId: Yup.number().required('شناسه مشتری الزامیست.'),
        advancedPayment: isContractualSales ? Yup.number().required('پیش پرداخت الزامیست.') : Yup.number(),
        insuranceDeposit: isContractualSales ? Yup.number().required('ودیعه بیمه الزامیست.') : Yup.number(),
        performanceBound: isContractualSales ? Yup.number().required('ضمانت اجرا الزامیست.') : Yup.number(),
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
        await onCreateEntity(data);
        onHide();
    };

    const handleInvoiceStatusChange = (selectedOption) => {
        const isContractual = selectedOption && selectedOption.value === 'CONTRACTUAL_SALES';
        setIsContractualSales(isContractual);
    };

    return (
        <CustomModal size={"xl"} show={show} >
            <Modal.Header style={headerStyle} className="modal-header">
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
                            salesType: 'CASH_SALES',
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
                                        <SelectInput
                                            name="salesType"
                                            label={"نوع فروش"}
                                            options={[
                                                { label: "فروش نقدی", value: "CASH_SALES" },
                                                { label: "فروش قراردادی", value: "CONTRACTUAL_SALES" },
                                            ]}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <AsyncSelectInput name="yearId" label={"سال"} apiFetchFunction={yearSelect} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <AsyncSelectInput name="customerId" label={"مشتری"} apiFetchFunction={customerSelect} />
                                    </Col>
                                    <Col>
                                        <AsyncSelectInput
                                            name="invoiceStatusId"
                                            label={"وضعیت فاکتور"}
                                            apiFetchFunction={invoiceStatusSelect}
                                            onChange={handleInvoiceStatusChange}
                                        />
                                    </Col>
                                </Row>
                                <ContractFields>
                                    <Row>
                                        <Col>
                                            <AsyncSelectInput
                                                name="contractId"
                                                label={" قرارداد"}
                                                apiFetchFunction={contractSelect}
                                            />
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
                                </ContractFields>
                            </Col>
                        </Row>
                        <InvoiceItems />
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

export default CreateInvoiceForm;
