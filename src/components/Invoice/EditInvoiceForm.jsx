import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Modal, Row } from "react-bootstrap";
import * as Yup from "yup";
import Button from "../../utils/Button";
import DateInput from "../../utils/DateInput";
import { Form } from "../../utils/Form";
import { useYupValidationResolver } from "../../hooks/useYupValidationResolver";
import moment from "jalali-moment";
import { bodyStyle, headerStyle, titleStyle } from "../styles/styles";
import useHttp from "../../hooks/useHttp";
import NumberInput from "../../utils/NumberInput";
import AsyncSelectInput from "../../utils/AsyncSelectInput";
import InvoiceItems from "./InvoiceItems";
import SelectInput from "../../utils/SelectInput";
import ContractFields from "./ContractFields";
import CustomModal from "../../utils/CustomModal";
import {useOptions} from "../contexts/OptionsContext";

const EditInvoiceForm = ({ editingEntity, onUpdateEntity, show, onHide }) => {
    const http = useHttp();
    const {customerOptions} = useOptions();

    const yearSelect = async () => {
        return await http.get(`/years/select`);
    }

    // const customerSelect = async (searchQuery = '') => {
    //     return await http.get(`/customers/select?searchQuery=${searchQuery}`);
    // }

    const contractSelect = async (searchQuery = '') => {
        return await http.get(`/contracts/select?searchQuery=${searchQuery}`);
    }

    const validationSchema = Yup.object().shape({
        dueDate: Yup.string().required('تاریخ سررسید الزامیست.'),
        invoiceNumber: Yup.number().required('شماره فاکتور الزامیست.'),
        issuedDate: Yup.string().required('تاریخ صدور الزامیست.'),
        salesType: Yup.string().required('نوع فروش الزامیست.'),
        customerId: Yup.number().required('شناسه مشتری الزامیست.'),
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
        await onUpdateEntity(data);
        onHide();
    };

    return (
        <CustomModal size={"xl"} show={show}>
            <Modal.Header style={headerStyle} className="modal-header" >
                <Modal.Title style={titleStyle}>
                    {"ویرایش فاکتور"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}>
                <div className="container modal-body" style={{ fontFamily: "IRANSans", fontSize: "0.8rem", margin: "0" }}>
                    <Form
                        defaultValues={{
                            id: editingEntity.id,
                            dueDate: editingEntity.dueDate,
                            invoiceNumber: editingEntity.invoiceNumber,
                            issuedDate: editingEntity.issuedDate,
                            salesType: editingEntity.salesType,
                            contractId: editingEntity.contractId,
                            customerId: editingEntity.customerId,
                            invoiceStatusId: editingEntity.invoiceStatusId,
                            advancedPayment: editingEntity.advancedPayment,
                            insuranceDeposit: editingEntity.insuranceDeposit,
                            performanceBound: editingEntity.performanceBound,
                            yearId: async() => await yearSelect().then(r => {
                                return r.find(y => y.name === moment.jYear());
                            }) ,
                            invoiceItems: editingEntity.invoiceItems,
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
                                        <AsyncSelectInput name="customerId" label={"مشتری"} apiFetchFunction={customerOptions} />
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
                                        <Col className={"col-6"}>
                                            <NumberInput name="performanceBound" label={"ضمانت اجرا"} />
                                        </Col>
                                    </Row>
                                </ContractFields>
                            </Col>
                        </Row>
                        <hr/>
                        <InvoiceItems />
                        <Button $variant="success" type={"submit"}>
                            ویرایش
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

export default EditInvoiceForm;
