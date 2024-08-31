import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Row } from "react-bootstrap";
import * as Yup from "yup";
import Button from "../../utils/Button";
import { TextInput } from "../../utils/TextInput";
import DateInput from "../../utils/DateInput";
import { Form } from "../../utils/Form";
import { useYupValidationResolver } from "../../hooks/useYupValidationResolver";
import moment from "jalali-moment";
import CustomModal, {Body, Container, Header, Title} from "../../utils/CustomModal";
import AsyncSelectInput from "../../utils/AsyncSelectInput";
import NumberInput from "../../utils/NumberInput";
import SelectInput from "../../utils/SelectInput";

const EditPaymentForm = ({ editingEntity, onUpdateEntity, show, onHide }) => {


    const validationSchema = Yup.object().shape({
        paymentDate: Yup.string().required('تاریخ پرداخت الزامیست.'),
        paymentDescription: Yup.string().required('توضیحات پرداخت الزامیست.'),
        customerId: Yup.number().required('شناسه مشتری الزامیست.'),
        paymentAmount: Yup.number().required('مبلغ پرداخت الزامیست.'),
        paymentSubject: Yup.string().required('موضوع پرداخت الزامیست.'),
    });

    const resolver = useYupValidationResolver(validationSchema);

    const onSubmit = async (data) => {
        if (data.paymentDate) {
            data.paymentDate = moment(new Date(data.paymentDate)).format('YYYY-MM-DD');
        }
        await onUpdateEntity(data);
        onHide();
    };

    return (
        <CustomModal size={"xl"} show={show} onHide={onHide}>
            <Header>
                <Title>{"فرم ویرایش پرداخت"}</Title>
            </Header>
            <Body>
                <Container>
                    <Form
                        defaultValues={{
                            id: editingEntity.id,
                            paymentDate: editingEntity.paymentDate,
                            paymentDescription: editingEntity.paymentDescription,
                            customerId: editingEntity.customerId,
                            paymentAmount: editingEntity.paymentAmount,
                            paymentSubject: editingEntity.paymentSubject,
                        }}
                        onSubmit={onSubmit}
                        resolver={resolver}
                    >
                        <Row>
                            <Col>
                                <Row>
                                    <Col>
                                        <DateInput name="paymentDate" label={"تاریخ پرداخت"} />
                                    </Col>
                                    <Col>
                                        <TextInput name="paymentDescription" label={"توضیحات پرداخت"} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <AsyncSelectInput
                                            name="customerId"
                                            label={"شناسه مشتری"}
                                            url={"customers/select"}
                                            value={editingEntity?.customerId}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <NumberInput name="paymentAmount" label={"مبلغ پرداخت"} />
                                    </Col>
                                    <Col>
                                        <SelectInput
                                            name="paymentSubject"
                                            label={"موضوع پرداخت"}
                                            options ={[
                                                {value: "PRODUCT", label: 'محصول'},
                                                {value: "INSURANCEDEPOSIT", label: 'سپرده بیمه'},
                                                {value: "PERFORMANCEBOUND", label: 'حسن انجام کار'},
                                                {value: "ADVANCEDPAYMENT", label: 'پیش پرداخت'},
                                            ]}
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
                </Container>
            </Body>
        </CustomModal>
    );
};

export default EditPaymentForm;
