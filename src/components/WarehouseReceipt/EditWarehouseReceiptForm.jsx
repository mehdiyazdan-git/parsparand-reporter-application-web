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
import NumberInput from "../../utils/NumberInput";
import AsyncSelectInput from "../../utils/AsyncSelectInput";
import WarehouseReceiptItems from "./WarehouseReceiptItems";

const EditWarehouseReceiptForm = ({ warehouseReceipt, onUpdateWarehouseReceipt, show, onHide }) => {
    const http = useHttp();

    const yearSelect = async () => {
        return await http.get(`/years/select`);
    }

    const customerSelect = async (searchQuery = '') => {
        return await http.get(`/customers/select?searchQuery=${searchQuery}`);
    }



    const validationSchema = Yup.object().shape({
        warehouseReceiptDate: Yup.string().required('تاریخ رسید الزامیست.'),
        warehouseReceiptDescription: Yup.string().required('توضیحات الزامیست.'),
        warehouseReceiptNumber: Yup.number().required('شماره رسید الزامیست.'),
        customerId: Yup.number().required('شناسه مشتری الزامیست.'),
        yearId: Yup.number().required('سال الزامیست.'),
        warehouseReceiptItems: Yup.array().of(
            Yup.object().shape({
                productId: Yup.number().required('شناسه محصول الزامیست.'),
                quantity: Yup.number().required('مقدار الزامیست.'),
                unitPrice: Yup.number().required('قیمت واحد الزامیست.'),
            })
        )
    });

    const resolver = useYupValidationResolver(validationSchema);

    const onSubmit = async (data) => {
        if (data.warehouseReceiptDate) {
            data.warehouseReceiptDate = moment(new Date(data.warehouseReceiptDate)).format('YYYY-MM-DD');
        }
        await onUpdateWarehouseReceipt(data);
        onHide();

    };

    return (
        <Modal size={"xl"} show={show}>
            <Modal.Header style={headerStyle} className="bg-dark text-white">
                <Modal.Title style={titleStyle}>
                    {"ایجاد رسید انبار جدید"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}>
                <div className="container modal-body" style={{ fontFamily: "IRANSans", fontSize: "0.8rem", margin: "0" }}>
                    <Form
                        defaultValues={{
                            id : warehouseReceipt.id,
                            warehouseReceiptDate: warehouseReceipt.warehouseReceiptDate,
                            warehouseReceiptDescription: warehouseReceipt.warehouseReceiptDescription,
                            warehouseReceiptNumber: warehouseReceipt.warehouseReceiptNumber,
                            customerId: warehouseReceipt.customerId,
                            yearId: warehouseReceipt.yearId,
                            warehouseReceiptItems: warehouseReceipt.warehouseReceiptItems,
                        }}
                        onSubmit={onSubmit}
                        resolver={resolver}
                    >
                        <Row>
                            <Col>
                                <Row>
                                    <Col>
                                        <NumberInput name="warehouseReceiptNumber" label={"شماره رسید"} />
                                    </Col>
                                    <Col>
                                        <DateInput name="warehouseReceiptDate" label={"تاریخ رسید"} />
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
                                <TextInput name="warehouseReceiptDescription" label={"توضیحات"} />
                            </Col>
                        </Row>
                        <WarehouseReceiptItems />
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

export default EditWarehouseReceiptForm;
