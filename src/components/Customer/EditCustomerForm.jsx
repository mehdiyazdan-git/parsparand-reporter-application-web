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

const EditCustomerForm = ({ editingEntity, onUpdateEntity, show, onHide }) => {
    const validationSchema = Yup.object().shape({
        customerCode: Yup.string().required('کد مشتری الزامیست.'),
        name: Yup.string()
            .min(2, 'نام باید حداقل 2 کاراکتر باشد.')
            .max(255, 'نام باید حداکثر 50 کاراکتر باشد.')
            .required('نام الزامیست.'),
    });

    const resolver = useYupValidationResolver(validationSchema);

    const onSubmit = async (data) => {
        await onUpdateEntity(data);
        onHide();
    };

    return (
         <CustomModal size={"xl"} show={show} >
            <Header>
                <Title>
                    {"ایجاد فاکتور جدید"}
                </Title>
            </Header>
            <Body>
                <Container>
                    <Form
                        defaultValues={{
                            id: editingEntity.id,
                            bigCustomer: editingEntity.bigCustomer,
                            customerCode: editingEntity.customerCode,
                            economicCode: editingEntity.economicCode,
                            name: editingEntity.name,
                            nationalCode: editingEntity.nationalCode,
                            phone: editingEntity.phone,
                        }}
                        onSubmit={onSubmit}
                        resolver={resolver}
                    >
                        <Row>
                            <Col>
                                <Row>
                                    <Col>
                                        <CheckboxInput name="bigCustomer" label={"مشتری عمده"} />
                                    </Col>
                                    <Col>
                                        <TextInput name="customerCode" label={"کد مشتری"} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <TextInput name="economicCode" label={"کد اقتصادی"} />
                                    </Col>
                                    <Col>
                                        <TextInput name="name" label={"نام"} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <TextInput name="nationalCode" label={"کد ملی"} />
                                    </Col>
                                    <Col>
                                        <TextInput name="phone" label={"تلفن"} />
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
                </Container>
            </Body>
        </CustomModal>
    );
};

export default EditCustomerForm;
