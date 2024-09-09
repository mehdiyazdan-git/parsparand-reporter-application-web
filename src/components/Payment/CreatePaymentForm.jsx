import React, {useContext} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Row } from "react-bootstrap";
import Button from "../../utils/Button";
import { TextInput } from "../../utils/TextInput";
import DateInput from "../../utils/DateInput";
import { Form } from "../../utils/Form";
import moment from "jalali-moment";
import AsyncSelectInput from "../../utils/AsyncSelectInput";
import NumberInput from "../../utils/NumberInput";
import SelectInput from "../../utils/SelectInput";
import * as Yup from "yup";
import {useYupValidationResolver} from "../../hooks/useYupValidationResolver";
import CustomModal, {Body, Container, Header, Title} from "../../utils/CustomModal";
import {AppContext} from "../contexts/AppProvider";
import ErrorMessage from "../../utils/ErrorMessage";




const CreatePaymentForm = ({ onCreateEntity, show, onHide }) => {

    const [errorMessage, setErrorMessage] = React.useState(null);

    const { customers, products, warehouseReceipts, invoices, contracts } = useContext(AppContext);

    const validationSchema = Yup.object().shape({
        paymentDate: Yup.string().required('تاریخ پرداخت الزامیست.'),
        paymentDescription: Yup.string()
            .max(255, 'توضیحات پرداخت نباید بیشتر از 255 کاراکتر باشد.')
            .typeError('توضیحات پرداخت باید باید متن باشد.')
            .required('توضیحات پرداخت الزامیست.'),
        customerId: Yup.number().required('مشتری الزامیست.'),
        paymentAmount: Yup.number()
            .typeError('مبلغ پرداخت باید باید عدد باشد.')
            .positive('مبلغ پرداخت باید عدد مثبت باشد.')
            .required('مبلغ پرداخت الزامیست.'),
    });

    const resolver = useYupValidationResolver(validationSchema);

    const onSubmit = async (data) => {
       try {
           if (data.paymentDate) {
               data.paymentDate = moment(new Date(data.paymentDate)).format('YYYY-MM-DD');
           }
           const errorMessage = await onCreateEntity(data);
           if (errorMessage) {
               setErrorMessage(errorMessage);
           } else {
               setErrorMessage(null);
               onHide();
           }
       }catch (e){
           console.log(e)
       }
    };


    return (
        <CustomModal size={"xl"} show={show} onHide={onHide}>
            <Header>
                <Title>{"ایجاد پرداخت جدید"}</Title>
            </Header>
            <Body>
                <Container>
                    <Form
                        defaultValues={{
                            paymentDate: '',
                            paymentDescription: '',
                            customerId: '',
                            paymentAmount: '',
                            paymentSubject: '',
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

export default CreatePaymentForm;
