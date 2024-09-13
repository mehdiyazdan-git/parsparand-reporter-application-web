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
import ErrorMessage from "../../utils/ErrorMessage";
import {AppContext} from "../contexts/AppProvider";




const CreatePaymentForm = ({ onCreateEntity, show, onHide }) => {
    const {customers} = useContext(AppContext);

    const [errorMessage, setErrorMessage] = React.useState(null);

    const validationSchema = Yup.object().shape({
        paymentDate: Yup.date()
            .typeError('تاریخ پرداخت باید یک تاریخ معتبر باشد.')
            .required('تاریخ پرداخت الزامی است.')
            .max(new Date(), 'تاریخ پرداخت نمی‌تواند در آینده باشد.'),

        paymentDescription: Yup.string()
            .trim()
            .min(3, 'توضیحات پرداخت باید حداقل 3 کاراکتر باشد.')
            .max(255, 'توضیحات پرداخت نباید بیشتر از 255 کاراکتر باشد.')
            .required('توضیحات پرداخت الزامی است.'),

        customerId: Yup.number()
            .typeError('لطفاً یک مشتری انتخاب کنید.')
            .integer('شناسه مشتری باید یک عدد صحیح باشد.')
            .positive('شناسه مشتری باید مثبت باشد.')
            .required('انتخاب مشتری الزامی است.'),

        paymentAmount: Yup.number()
            .typeError('مبلغ پرداخت باید یک عدد باشد.')
            .positive('مبلغ پرداخت باید بیشتر از صفر باشد.')
            .required('وارد کردن مبلغ پرداخت الزامی است.')
            .test('is-decimal', 'مبلغ پرداخت باید حداکثر دو رقم اعشار داشته باشد.',
                (value) => (value + "").match(/^\d+(\.\d{1,2})?$/)),

        paymentSubject: Yup.string()
            .oneOf(['PRODUCT', 'INSURANCEDEPOSIT', 'PERFORMANCEBOUND', 'ADVANCEDPAYMENT'],
                'لطفاً یک موضوع پرداخت معتبر انتخاب کنید.')
            .required('انتخاب موضوع پرداخت الزامی است.'),
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
                                            options={customers}
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
