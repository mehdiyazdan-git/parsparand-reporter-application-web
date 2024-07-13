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
import CustomModal from "../../utils/CustomModal";


const EditReturnedForm = ({ editingEntity, onUpdateEntity, show, onHide }) => {
    const http = useHttp();

    const customerSelect = async (searchQuery = '') => {
        return await http.get(`/customers/select?searchQuery=${searchQuery}`);
    }

    const validationSchema = Yup.object().shape({
        quantity: Yup.number()
            .typeError('مقدار باید عدد باشد.')
            .positive('مقدار باید مثبت باشد.')
            .required('مقدار الزامیست.'),
        unitPrice: Yup.number()
            .typeError('قیمت واحد باید عدد باشد.')
            .positive('قیمت واحد باید مثبت باشد.')
            .required('قیمت واحد الزامیست.'),
        returnedDate: Yup.string().required('تاریخ الزامیست.'),
        returnedDescription: Yup.string()
            .max(255, 'توضیحات نمیتواند بیشتر از 255 کاراکتر باشد.')
            .min(3, 'توضیحات نمیتواند کمتر از 3 کاراکتر باشد.')
            .required('توضیحات  الزامیست.'),
        returnedNumber: Yup.number()
            .typeError('شماره مرجوعی باید عدد باشد.')
            .integer('شماره مرجوی باید عدد صحیح باشد.')
            .required('شماره  الزامیست.'),
        customerId: Yup.number().required(' مشتری الزامیست.'),
    });

    const resolver = useYupValidationResolver(validationSchema);

    const onSubmit = async (data) => {
        if (data.returnedDate) {
            data.returnedDate = moment(new Date(data.returnedDate)).format('YYYY-MM-DD');
        }
        await onUpdateEntity(data);
        onHide();
        console.log(data)
    };

    return (
        <CustomModal size={"xl"} show={show}>
            <Modal.Header style={headerStyle} className="modal-header" >
                <Modal.Title style={titleStyle}>
                    {"ویرایش مرجوعی"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}>
                <div className="container modal-body" style={{ fontFamily: "IRANSans", fontSize: "0.8rem", margin: "0" }}>
                    <Form
                        defaultValues={{
                            id: editingEntity.id,
                            quantity: editingEntity.quantity,
                            returnedDate: editingEntity.returnedDate,
                            returnedDescription: editingEntity.returnedDescription,
                            returnedNumber: editingEntity.returnedNumber,
                            unitPrice: editingEntity.unitPrice,
                            customerId: editingEntity.customerId,
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

export default EditReturnedForm;
