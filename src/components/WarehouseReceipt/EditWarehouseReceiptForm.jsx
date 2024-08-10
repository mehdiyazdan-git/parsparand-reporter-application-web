import React, {useCallback} from 'react';
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

import NumberInput from "../../utils/NumberInput";
import AsyncSelectInput from "../../utils/AsyncSelectInput";
import WarehouseReceiptItems from "./WarehouseReceiptItems";
import styled from 'styled-components';
import CustomModal from "../../utils/CustomModal";
import useHttp from "../contexts/useHttp";

const CustomModalBody = styled(Modal.Body)`
  max-height: 70vh; /* Adjust as needed */
  overflow-y: auto;
`;



const EditWarehouseReceiptForm = ({ editingEntity, onUpdateEntity, show, onHide }) => {
    const {methods} = useHttp();

    const yearSelect = useCallback( async (inputValue) => {
        return await methods.get({
            'url' : 'years/select',
            'params' : { 'searchQuery' : inputValue},
            'headers' : { 'Accept' : 'application/json' }
        });
    },[methods]);

    const customerSelect = useCallback( async (inputValue) => {
        return await methods.get({
            'url' : 'customers/select',
            'params' : { 'searchQuery' : inputValue},
            'headers' : { 'Accept' : 'application/json' }
        });
    },[methods]);

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
        await onUpdateEntity(data);
        onHide();
    };

    return (
        <CustomModal size={"xl"} show={show} onHide={onHide}>
            <Modal.Header style={headerStyle} className="modal-header">
                <Modal.Title style={titleStyle}>
                    {"ایجاد رسید انبار جدید"}
                </Modal.Title>
            </Modal.Header>
            <CustomModalBody style={bodyStyle}>
                <div className="container modal-body" style={{ fontFamily: "IRANSans", fontSize: "0.8rem", margin: "0" }}>
                    <Form
                        defaultValues={{
                            id: editingEntity?.id,
                            warehouseReceiptDate: editingEntity?.warehouseReceiptDate,
                            warehouseReceiptDescription: editingEntity?.warehouseReceiptDescription,
                            warehouseReceiptNumber: editingEntity?.warehouseReceiptNumber,
                            customerId: editingEntity?.customerId,
                            yearId: editingEntity?.yearId,
                            warehouseReceiptItems: editingEntity?.warehouseReceiptItems,
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
            </CustomModalBody>
        </CustomModal>
    );
};

export default EditWarehouseReceiptForm;
