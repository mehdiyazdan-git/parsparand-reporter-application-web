import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Modal, Row } from "react-bootstrap";
import * as Yup from "yup";
import Button from "../../utils/Button";
import { TextInput } from "../../utils/TextInput";
import { Form } from "../../utils/Form";
import { useYupValidationResolver } from "../../hooks/useYupValidationResolver";
import { bodyStyle, headerStyle, titleStyle } from "../styles/styles";
import CheckboxInput from "../../utils/CheckboxInput";
import CustomModal from "../../utils/CustomModal";

const EditUserForm = ({ editingEntity, onUpdateEntity, show, onHide }) => {
    const validationSchema = Yup.object().shape({
        email: Yup.string().email('ایمیل معتبر نیست').required('ایمیل الزامیست.'),
        enabled: Yup.boolean().required('فعال بودن الزامیست.'),
        firstname: Yup.string().required('نام الزامیست.'),
        lastname: Yup.string().required('نام خانوادگی الزامیست.'),
        password: Yup.string().required('رمز عبور الزامیست.'),
        role: Yup.string().required('نقش الزامیست.'),
        username: Yup.string().required('نام کاربری الزامیست.'),
    });

    const resolver = useYupValidationResolver(validationSchema);

    const onSubmit = async (data) => {
        await onUpdateEntity(data);
        onHide();
    };

    return (
        <CustomModal size={"xl"} show={show}>
            <Modal.Header style={headerStyle} className="modal-header" >
                <Modal.Title style={titleStyle}>
                    {"ویرایش کاربر"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}>
                <div className="container modal-body" style={{ fontFamily: "IRANSans", fontSize: "0.8rem", margin: "0" }}>
                    <Form
                        defaultValues={{
                            id: editingEntity.id,
                            email: editingEntity.email,
                            enabled: editingEntity.enabled,
                            firstname: editingEntity.firstname,
                            lastname: editingEntity.lastname,
                            password: editingEntity.password,
                            role: editingEntity.role,
                            username: editingEntity.username,
                        }}
                        onSubmit={onSubmit}
                        resolver={resolver}
                    >
                        <Row>
                            <Col>
                                <Row>
                                    <Col>
                                        <TextInput name="email" label={"ایمیل"} />
                                    </Col>
                                    <Col>
                                        <CheckboxInput name="enabled" label={"فعال"} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <TextInput name="firstname" label={"نام"} />
                                    </Col>
                                    <Col>
                                        <TextInput name="lastname" label={"نام خانوادگی"} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <TextInput name="password" label={"رمز عبور"} type="password" />
                                    </Col>
                                    <Col>
                                        <TextInput name="role" label={"نقش"} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <TextInput name="username" label={"نام کاربری"} />
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

export default EditUserForm;
