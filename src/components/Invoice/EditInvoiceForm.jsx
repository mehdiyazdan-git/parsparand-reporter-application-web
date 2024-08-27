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

import NumberInput from "../../utils/NumberInput";
import AsyncSelectInput from "../../utils/AsyncSelectInput";
import InvoiceItems from "./InvoiceItems";
import SelectInput from "../../utils/SelectInput";
import ContractFields from "./ContractFields";
import CustomModal from "../../utils/CustomModal";

const EditInvoiceForm = ({ editingEntity, onUpdateEntity, show, onHide }) => {

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
        const formattedData = {
            ...data,
            dueDate: data.dueDate ? formatDate(data.dueDate) : null,
            issuedDate: data.issuedDate ? formatDate(data.issuedDate) : null,
        };
        await onUpdateEntity(formattedData);
        onHide();
    };

    const formatDate = (date) => {
        if (date) {
            return moment(new Date(date)).format('YYYY-MM-DD');
        }
        return null;
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
                                        <AsyncSelectInput
                                            name="customerId"
                                            label={"شناسه مشتری"}
                                            url={"customers/select"}
                                            value={editingEntity?.customerId}
                                        />
                                    </Col>
                                </Row>
                                <ContractFields>
                                    <Row>
                                        <Col>
                                            <AsyncSelectInput
                                                name="contractId"
                                                label={" قرارداد"}
                                                url={"contracts/select"}
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
