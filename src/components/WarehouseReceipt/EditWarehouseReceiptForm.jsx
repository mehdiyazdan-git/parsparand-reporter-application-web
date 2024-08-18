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

const CustomModalBody = styled(Modal.Body)`
  max-height: 70vh; /* Adjust as needed */
  overflow-y: auto;
`;



const EditWarehouseReceiptForm = ({ editingEntity, onUpdateEntity, show, onHide }) => {

    const validationSchema = Yup.object().shape({
        warehouseReceiptDate: Yup.date()
            .typeError('تاریخ رسید الزامیست.')
            .required('تاریخ رسید الزامیست.'),

        warehouseReceiptDescription: Yup.string()
            .required('توضیحات الزامیست.')
            .min(3, 'توضیحات باید حداقل 3 کاراکتر باشد.')
            .max(255, 'توضیحات نمی‌تواند بیشتر از 255 کاراکتر باشد.'),

        warehouseReceiptNumber: Yup.number()
            .typeError('شماره رسید باید عدد باشد.')
            .integer('شماره رسید باید عدد صحیح باشد.') // Ensure it's an integer
            .positive('شماره رسید باید مثبت باشد.')
            .required('شماره رسید الزامیست.'),

        customerId: Yup.number()
            .typeError('مشتری باید به صورت عددی انتخاب شود.') // More specific error message
            .integer('شناسه مشتری باید عدد صحیح باشد.')
            .positive('شناسه مشتری باید مثبت باشد.')
            .required(' انتخاب مشتری الزامیست.'),

        warehouseReceiptItems: Yup.array().of(
            Yup.object().shape({
                productId: Yup.number()
                    .typeError('محصول باید به صورت عددی انتخاب شود.')
                    .integer('شناسه محصول باید عدد صحیح باشد.')
                    .positive('شناسه محصول باید مثبت باشد.')
                    .required(' انتخاب محصول الزامیست.'),

                quantity: Yup.number()
                    .typeError('مقدار باید عدد باشد.')
                    .integer('مقدار باید عدد صحیح باشد.')
                    .positive('مقدار باید مثبت باشد.')
                    .required('مقدار الزامیست.'),

                unitPrice: Yup.number()
                    .typeError('قیمت واحد باید عدد باشد.')
                    .positive('قیمت واحد باید مثبت باشد.')
                    .required('قیمت واحد الزامیست.'),

                // 'amount' is calculated, so it doesn't need validation here
            })
        ).min(1, 'حداقل یک قلم کالا باید وارد شود.') // Ensure at least one item is added
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
                            warehouseReceiptItems: editingEntity?.warehouseReceiptItems,
                        }}
                        onSubmit={onSubmit}
                        resolver={resolver}
                    >
                        <Row>
                            <Col>
                                <Row>
                                    <Col>
                                        <NumberInput
                                            name="warehouseReceiptNumber"
                                            label={"شماره رسید"}
                                        />
                                    </Col>
                                    <Col>
                                        <DateInput
                                            name="warehouseReceiptDate"
                                            label={"تاریخ رسید"}
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
                                <TextInput
                                    name="warehouseReceiptDescription"
                                    label={"توضیحات"}
                                />
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
