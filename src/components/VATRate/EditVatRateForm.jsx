import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Modal, Row } from "react-bootstrap";
import * as Yup from "yup";
import Button from "../../utils/Button";
import { Form } from "../../utils/Form";
import { useYupValidationResolver } from "../../hooks/useYupValidationResolver";
import { bodyStyle, headerStyle, titleStyle } from "../styles/styles";
import ErrorMessage from "../../utils/ErrorMessage";
import NumberInput from "../../utils/NumberInput";
import DateInput from "../../utils/DateInput";

const EditVatRateForm = ({ editingEntity, onUpdateEntity, show, onHide }) => {
    // Define validation schema for VAT rate form
    const validationSchema = Yup.object().shape({
        rate: Yup.number()
            .required('نرخ مالیات بر ارزش افزوده الزامیست.')
            .min(0, 'نرخ مالیات نمی‌تواند کمتر از صفر باشد.')
            .max(100, 'نرخ مالیات نمی‌تواند بیشتر از 100 باشد.'),
        effectiveFrom: Yup.date()
            .required('تاریخ اجرای نرخ الزامیست.')
            .typeError('تاریخ اجرای نرخ باید یک تاریخ معتبر باشد.')
    });

    // Use custom resolver for form validation
    const resolver = useYupValidationResolver(validationSchema);

    const [errorMessage, setErrorMessage] = React.useState(null);

    // Handle form submission
    const onSubmit = async (data) => {
        const errorMessage = await onUpdateEntity(data);
        if (errorMessage) {
            setErrorMessage(errorMessage);
        } else {
            setErrorMessage(null);
            onHide();
        }
    };

    return (
        <Modal size={"xl"} show={show}>
            <Modal.Header style={headerStyle} className="modal-header">
                <Modal.Title style={titleStyle}>
                    {"ویرایش نرخ مالیات بر ارزش افزوده"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}>
                <div className="container modal-body" style={{ fontFamily: "IRANSans", fontSize: "0.8rem", margin: "0" }}>
                    <Form
                        defaultValues={{
                            id: editingEntity.id,
                            rate: editingEntity.rate,
                            effectiveFrom: editingEntity.effectiveFrom,
                        }}
                        onSubmit={onSubmit}
                        resolver={resolver}
                    >
                        <Row>
                            <Col>
                                <NumberInput name="rate" label={"نرخ مالیات بر ارزش افزوده"} min={0} max={100} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <DateInput name="effectiveFrom" label={"تاریخ اجرای نرخ"} />
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
        </Modal>
    );
};

export default EditVatRateForm;
