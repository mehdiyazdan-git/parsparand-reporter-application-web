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
import CustomModal from "../../utils/CustomModal";
import ErrorMessage from "../../utils/ErrorMessage";


const EditReturnedForm = ({ editingEntity, onUpdateEntity, show, onHide }) => {

    const validationSchema = Yup.object().shape({
        quantity: Yup.number()
            .typeError('مقدار باید عدد باشد.')
            .positive('مقدار باید مثبت باشد.')
            .max(1000000, 'مقدار نمی‌تواند بیشتر از 1,000,000 باشد.')
            .required('مقدار الزامیست.'),
        unitPrice: Yup.number()
            .typeError('قیمت واحد باید عدد باشد.')
            .positive('قیمت واحد باید مثبت باشد.')
            .max(1000000000, 'قیمت واحد نمی‌تواند بیشتر از 1,000,000,000 باشد.')
            .required('قیمت واحد الزامیست.'),
        returnedDate: Yup.date()
            .typeError('تاریخ باید یک تاریخ معتبر باشد.')
            .max(new Date(), 'تاریخ نمی‌تواند در آینده باشد.')
            .required('تاریخ الزامیست.'),
        returnedDescription: Yup.string()
            .trim()
            .min(3, 'توضیحات باید حداقل 3 کاراکتر باشد.')
            .max(255, 'توضیحات نمی‌تواند بیشتر از 255 کاراکتر باشد.')
            .required('توضیحات الزامیست.'),
        returnedNumber: Yup.number()
            .typeError('شماره مرجوعی باید عدد باشد.')
            .integer('شماره مرجوعی باید عدد صحیح باشد.')
            .positive('شماره مرجوعی باید مثبت باشد.')
            .max(1000000, 'شماره مرجوعی نمی‌تواند بیشتر از 1,000,000 باشد.')
            .required('شماره مرجوعی الزامیست.'),
        customerId: Yup.number()
            .typeError('مشتری باید انتخاب شود.')
            .positive('شناسه مشتری باید عددی مثبت باشد.')
            .integer('شناسه مشتری باید عدد صحیح باشد.')
            .required('انتخاب مشتری الزامیست.'),
    });

    const resolver = useYupValidationResolver(validationSchema);
    const [errorMessage, setErrorMessage] = React.useState(null);

    const onSubmit = async (data) => {
        if (data.returnedDate) {
            data.returnedDate = moment(new Date(data.returnedDate)).format('YYYY-MM-DD');
        }
        const errorMessage = await onUpdateEntity(data);
        if (errorMessage) {
            setErrorMessage(errorMessage);
        } else {
            setErrorMessage(null);
            onHide();
        }
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
                                        <AsyncSelectInput
                                            name="customerId"
                                            label={"شناسه مشتری"}
                                            url={"customers/select"}
                                            value={editingEntity?.customerId}
                                        />
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
                    {errorMessage && <ErrorMessage message={errorMessage}/>}
                </div>
            </Modal.Body>
        </CustomModal>
    );
};

export default EditReturnedForm;
