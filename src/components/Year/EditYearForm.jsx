import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Modal, Row } from "react-bootstrap";
import * as Yup from "yup";
import Button from "../../utils/Button";
import { TextInput } from "../../utils/TextInput";
import { Form } from "../../utils/Form";
import { useYupValidationResolver } from "../../hooks/useYupValidationResolver";
import { bodyStyle, headerStyle, titleStyle } from "../styles/styles";

const EditYearForm = ({ year, onUpdateYear, show, onHide }) => {
    const validationSchema = Yup.object().shape({
        name: Yup.number().required('نام سال الزامیست.').typeError('نام سال باید عدد باشد.'),
    });

    const resolver = useYupValidationResolver(validationSchema);

    const onSubmit = async (data) => {
        await onUpdateYear(data);
        onHide();
    };

    return (
        <Modal size={"xl"} show={show} onHide={onHide}>
            <Modal.Header style={headerStyle} className="bg-dark text-white" closeButton>
                <Modal.Title style={titleStyle}>
                    {"ویرایش سال"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}>
                <div className="container modal-body" style={{ fontFamily: "IRANSans", fontSize: "0.8rem", margin: "0" }}>
                    <Form
                        defaultValues={{
                            id: year.id,
                            name: year.name,
                        }}
                        onSubmit={onSubmit}
                        resolver={resolver}
                    >
                        <Row>
                            <Col>
                                <TextInput name="name" label={"نام سال"} />
                            </Col>
                        </Row>
                        <Button variant="success" type={"submit"}>
                            ویرایش
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

export default EditYearForm;
