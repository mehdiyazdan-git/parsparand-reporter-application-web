import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Modal, Row } from "react-bootstrap";
import * as Yup from "yup";
import Button from "../../utils/Button";
import { TextInput } from "../../utils/TextInput";
import { Form } from "../../utils/Form";
import { useYupValidationResolver } from "../../hooks/useYupValidationResolver";
import { bodyStyle, headerStyle, titleStyle } from "../styles/styles";
import SelectInput from "../../utils/SelectInput";

const CreateProductForm = ({ onCreateProduct, show, onHide }) => {
    const validationSchema = Yup.object().shape({
        measurementIndex: Yup.string().required('شاخص اندازه‌گیری الزامیست.'),
        productCode: Yup.string().required('کد محصول الزامیست.'),
        productName: Yup.string().required('نام محصول الزامیست.'),
        productType: Yup.string().required('نوع محصول الزامیست.'),
    });

    const resolver = useYupValidationResolver(validationSchema);

    const onSubmit = async (data) => {
        await onCreateProduct(data);
        onHide();
    };

    const productTypeOptions = [
        { value: 'MAIN', label: 'اصلی' },
        { value: 'SCRAPT', label: 'ضایعات' },
        { value: 'RAWMATERIAL', label: 'مواد اولیه' }
    ];

    return (
        <Modal size={"xl"} show={show} onHide={onHide}>
            <Modal.Header style={headerStyle} closeButton>
                <Modal.Title style={titleStyle}>
                    {"ایجاد محصول جدید"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}>
                <div className="container modal-body" style={{ fontFamily: "IRANSans", fontSize: "0.8rem", margin: "0" }}>
                    <Form
                        defaultValues={{
                            measurementIndex: '',
                            productCode: '',
                            productName: '',
                            productType: '',
                        }}
                        onSubmit={onSubmit}
                        resolver={resolver}
                    >
                        <Row>
                            <Col>
                                <Row>
                                    <Col>
                                        <TextInput name="measurementIndex" label={"شاخص اندازه‌گیری"} />
                                    </Col>
                                    <Col>
                                        <TextInput name="productCode" label={"کد محصول"} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <TextInput name="productName" label={"نام محصول"} />
                                    </Col>
                                    <Col>
                                        <SelectInput name="productType" label={"نوع محصول"} options={productTypeOptions} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Button variant="success" type={"submit"}>
                            ایجاد
                        </Button>
                        <Button onClick={onHide} variant="warning" type="button">
                            انصراف
                        </Button>
                    </Form>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default CreateProductForm;
