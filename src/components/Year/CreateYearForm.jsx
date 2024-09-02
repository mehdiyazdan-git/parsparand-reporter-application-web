import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Row } from "react-bootstrap";
import * as Yup from "yup";
import Button from "../../utils/Button";
import { TextInput } from "../../utils/TextInput";
import { Form } from "../../utils/Form";
import { useYupValidationResolver } from "../../hooks/useYupValidationResolver";
import CustomModal, {Body, Container, Header, Title} from "../../utils/CustomModal";

const CreateYearForm = ({ onCreateYear, show, onHide }) => {
    const validationSchema = Yup.object().shape({
        name: Yup.number().required('نام سال الزامیست.').typeError('نام سال باید عدد باشد.'),
    });

    const resolver = useYupValidationResolver(validationSchema);

    const onSubmit = async (data) => {
        await onCreateYear(data);
        onHide();
    };

    return (
        <CustomModal size={"xl"} show={show} >
            <Header>
                <Title>
                    {"ایجاد سال جدید"}
                </Title>
            </Header>
            <Body>
                <Container>
                    <Form
                        defaultValues={{
                            name: '',
                        }}
                        onSubmit={onSubmit}
                        resolver={resolver}
                    >
                        <Row>
                            <Col>
                                <TextInput name="name" label={"نام سال"} />
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

export default CreateYearForm;
