import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Row } from "react-bootstrap";
import * as Yup from "yup";
import Button from "../../utils/Button";
import { TextInput } from "../../utils/TextInput";
import { Form } from "../../utils/Form";
import { useYupValidationResolver } from "../../hooks/useYupValidationResolver";
import CheckboxInput from "../../utils/CheckboxInput";
import CustomModal, {Body, Container, Header, Title} from "../../utils/CustomModal";

const CreateUserForm = ({ onCreateUser, show, onHide }) => {
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
        await onCreateUser(data);
        onHide();
    };

    return (
        <CustomModal size={"xl"} show={show} >
            <Header>
                <Title>
                    {"ایجاد کاربر جدید"}
                </Title>
            </Header>
            <Body>
                <Container>
                    <Form
                        defaultValues={{
                            email: '',
                            enabled: false,
                            firstname: '',
                            lastname: '',
                            password: '',
                            role: '',
                            username: '',
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
                            ایجاد
                        </Button>
                        <Button onClick={onHide} $variant="warning" type="button">
                            انصراف
                        </Button>
                    </Form>
                </Container>
            </Body>
        </CustomModal>
    );
};

export default CreateUserForm;
