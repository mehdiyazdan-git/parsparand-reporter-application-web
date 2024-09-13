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
import ErrorMessage from "../../utils/ErrorMessage";

const EditCustomerForm = ({ editingEntity, onUpdateEntity, show, onHide }) => {
    const validationSchema = Yup.object().shape({
        customerCode: Yup.string()
            .trim()
            .matches(/^[A-Za-z0-9-]+$/, 'کد مشتری باید شامل حروف، اعداد و خط تیره باشد.')
            .min(3, 'کد مشتری باید حداقل 3 کاراکتر باشد.')
            .max(20, 'کد مشتری نباید بیشتر از 20 کاراکتر باشد.')
            .required('کد مشتری الزامیست.'),
        bigCustomer: Yup.boolean(),
        economicCode: Yup.string()
            .matches(/^\d{12}$/, 'کد اقتصادی باید 12 رقم باشد.')
            .nullable(),
        name: Yup.string()
            .trim()
            .min(2, 'نام باید حداقل 2 کاراکتر باشد.')
            .max(255, 'نام نباید بیشتر از 255 کاراکتر باشد.')
            .required('نام الزامیست.'),
        nationalCode: Yup.string()
            .matches(/^\d{10}$/, 'کد ملی باید 10 رقم باشد.')
            .nullable(),
        phone: Yup.string()
            .matches(/^[0-9]{11}$/, 'شماره تلفن باید 11 رقم باشد.')
            .nullable(),
    });

    const resolver = useYupValidationResolver(validationSchema);

    const [errorMessage, setErrorMessage] = React.useState(null);

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
                    {errorMessage && <ErrorMessage message={errorMessage}/>}
                </Container>
            </Body>
        </CustomModal>
    );
};

export default EditCustomerForm;
