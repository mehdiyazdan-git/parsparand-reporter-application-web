import React from 'react';
import * as Yup from "yup";
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Modal, Row } from "react-bootstrap";
import Button from "../../utils/Button";
import { TextInput } from "../../utils/TextInput";
import DateInput from "../../utils/DateInput";
import { Form } from "../../utils/Form";
import { useYupValidationResolver } from "../../hooks/useYupValidationResolver";
import moment from "jalali-moment";
import { bodyStyle, headerStyle, titleStyle } from "../styles/styles";
import useHttp from "../../hooks/useHttp";
import WarehouseReceiptItems from "./WarehouseReceiptItems";
import AsyncSelectInput from "../../utils/AsyncSelectInput";
import NumberInput from "../../utils/NumberInput";
import CustomModal from "../../utils/CustomModal";

const CreateWarehouseReceiptForm = ({ onCreateEntity, show, onHide }) => {
    const http = useHttp();

    const customerSelect = async (searchQuery) => {
        return await http.get(`/customers/select?searchQuery=${searchQuery}`);
    }



    const validationSchema = Yup.object().shape({
        warehouseReceiptDate: Yup.string().required('تاریخ رسید الزامیست.'),
        warehouseReceiptDescription: Yup.string()
            .max(255, 'توضیحات نمیتواند بیشتر از 255 کاراکتر باشد.')
            .min(3, 'توضیحات نمیتواند کمتر از 3 کاراکتر باشد.')
            .required('توضیحات الزامیست.'),
        warehouseReceiptNumber: Yup.number().required('شماره رسید الزامیست.'),
        customerId: Yup.number().required(' مشتری الزامیست.'),

        warehouseReceiptItems: Yup.array().of(
            Yup.object().shape({
                productId: Yup.number().required(' محصول الزامیست.'),
                quantity: Yup.number()
                    .typeError('مقدار باید عدد باشد.')
                    .positive('مقدار باید مثبت باشد.')
                    .required('مقدار الزامیست.'),
                unitPrice: Yup.number()
                    .typeError('قیمت واحد باید باید عدد باشد.')
                    .positive('قیمت واحد باید مثبت باشد.')
                    .required('قیمت واحد الزامیست.'),
            })
        )
    });

    const resolver = useYupValidationResolver(validationSchema);

    const onSubmit = async (data) => {
        if (data.warehouseReceiptDate) {
            data.warehouseReceiptDate = moment(new Date(data.warehouseReceiptDate)).format('YYYY-MM-DD');
        }
       await onCreateEntity(data);
        onHide();
        console.log(data);

    };

    return (
        <CustomModal size={"xl"} show={show}>
            <Modal.Header style={headerStyle} className="modal-header" >
                <Modal.Title style={titleStyle}>
                    {"ایجاد رسید انبار جدید"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}>
                <div className="container modal-body" style={{ fontFamily: "IRANSans", fontSize: "0.8rem", margin: "0" }}>
                    <Form
                        defaultValues={{
                            warehouseReceiptDate: '',
                            warehouseReceiptDescription: '',
                            warehouseReceiptNumber: '',
                            customerId: '',
                            warehouseReceiptItems: [
                                {
                                    productId: '',
                                    quantity: '',
                                    unitPrice: '',
                                    amount: '',
                                }
                            ],
                        }}
                        onSubmit={onSubmit}
                        // resolver={resolver}
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
                                       <AsyncSelectInput name="customerId" label={" مشتری"} apiFetchFunction={customerSelect} />
                                   </Col>
                               </Row>
                                <TextInput name="warehouseReceiptDescription" label={"توضیحات"} />
                            </Col>
                        </Row>
                        <WarehouseReceiptItems/>
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

export default CreateWarehouseReceiptForm;
