import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Row } from "react-bootstrap";
import * as Yup from "yup";
import Button from "../../utils/Button";
import { TextInput } from "../../utils/TextInput";
import { Form } from "../../utils/Form";
import { useYupValidationResolver } from "../../hooks/useYupValidationResolver";
import CustomModal, {Body, Container, Header, Title} from "../../utils/CustomModal";
import SelectInput from "../../utils/SelectInput";
import ErrorMessage from "../../utils/ErrorMessage";

const CreateProductForm = ({ onCreateEntity, show, onHide }) => {
    const validationSchema = Yup.object().shape({
        measurementIndex: Yup.string().required('شاخص اندازه‌گیری الزامیست.'),
        productCode: Yup.string().required('کد محصول الزامیست.'),
        productName: Yup.string().required('نام محصول الزامیست.'),
        productType: Yup.string().required('نوع محصول الزامیست.'),
    });

    const resolver = useYupValidationResolver(validationSchema);

    const [errorMessage, setErrorMessage] = React.useState(null);

    const onSubmit = async (data) => {
        const errorMessage = await onCreateEntity(data);
        if (errorMessage) {
            setErrorMessage(errorMessage);
        } else {
            setErrorMessage(null);
            onHide();
        }
    };

    const productTypeOptions = [
        { value: 'MAIN', label: 'اصلی' },
        { value: 'SCRAPT', label: 'ضایعات' },
        { value: 'RAWMATERIAL', label: 'مواد اولیه' }
    ];

    return (
        <CustomModal size={"xl"} show={show} >
            <Header>
                <Title>
                    {"ایجاد محصول جدید"}
                </Title>
            </Header>
            <Body>
                <Container>
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
                        <Button $variant="success" type={"submit"}>
                            ایجاد
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

export default CreateProductForm;
