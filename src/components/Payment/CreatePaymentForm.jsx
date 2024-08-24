import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Modal, Row } from "react-bootstrap";
import Button from "../../utils/Button";
import { TextInput } from "../../utils/TextInput";
import DateInput from "../../utils/DateInput";
import { Form } from "../../utils/Form";
import moment from "jalali-moment";
import { bodyStyle, headerStyle, titleStyle } from "../styles/styles";
import AsyncSelectInput from "../../utils/AsyncSelectInput";
import NumberInput from "../../utils/NumberInput";
import SelectInput from "../../utils/SelectInput";
import CustomModal from "../../utils/CustomModal";
import useHttp from "../contexts/useHttp";
import * as Yup from "yup";
import {useYupValidationResolver} from "../../hooks/useYupValidationResolver";




const CreatePaymentForm = ({ onCreateEntity, show, onHide }) => {
    const http = useHttp();

    const customerSelect = async (searchQuery = '') => {
        return await http.get(`/customers/select`,{searchQuery});
    }

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
           await onCreateEntity(data);
           onHide();
           console.log(data)
       }catch (e){
           console.log(e)
       }
    };


    return (
        <CustomModal size={"xl"} show={show}>
            <Modal.Header style={headerStyle} className="modal-header">
                <Modal.Title style={titleStyle}>
                    {"ایجاد پرداخت جدید"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}>
                <div className="container modal-body" style={{ fontFamily: "IRANSans", fontSize: "0.8rem", margin: "0" }}>
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
                </div>
            </Modal.Body>
        </CustomModal>
    );
};

export default CreatePaymentForm;
