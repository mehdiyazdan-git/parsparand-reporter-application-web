import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import {Col, Modal, Row} from "react-bootstrap";
import * as Yup from "yup";
import Button from "../../utils/Button";
import {TextInput} from "../../utils/TextInput";
import DateInput from "../../utils/DateInput";
import {Form} from "../../utils/Form";
import {useYupValidationResolver} from "../../hooks/useYupValidationResolver";
import moment from "jalali-moment";
import {bodyStyle, headerStyle, titleStyle} from "../styles/styles";
import ReportItems from "./ReportItems";
import CustomModal from "../../utils/CustomModal";
import ErrorMessage from "../../utils/ErrorMessage";
import GenerateReportExplanationButton from "./GenerateReportExplanationButton";



const CreateReportForm = ({onCreateEntity, show, onHide}) => {

    const [errorMessage, setErrorMessage] = React.useState(null);


    const validationSchema = Yup.object().shape({
        reportDate: Yup.date()
            .typeError('تاریخ گزارش باید یک تاریخ معتبر باشد.')
            .max(new Date(), 'تاریخ گزارش نمی‌تواند در آینده باشد.')
            .required('تاریخ گزارش الزامیست.'),
        reportExplanation: Yup.string()
            .trim()
            .min(10, 'توضیحات گزارش باید حداقل 10 کاراکتر باشد.')
            .max(500, 'توضیحات گزارش نباید بیشتر از 500 کاراکتر باشد.')
            .required('توضیحات گزارش الزامیست.'),
        reportItems: Yup.array().of(
            Yup.object().shape({
                quantity: Yup.number()
                    .typeError('مقدار باید عدد باشد.')
                    .positive('مقدار باید عدد مثبت باشد.')
                    .max(1000000, 'مقدار نمی‌تواند بیشتر از 1,000,000 باشد.')
                    .required('مقدار الزامیست.'),
                unitPrice: Yup.number()
                    .typeError('قیمت واحد باید عدد باشد.')
                    .positive('قیمت واحد باید عدد مثبت باشد.')
                    .max(1000000000, 'قیمت واحد نمی‌تواند بیشتر از 1,000,000,000 باشد.')
                    .required('قیمت واحد الزامیست.'),
                customerId: Yup.number()
                    .typeError('مشتری باید انتخاب شود.')
                    .positive('شناسه مشتری باید عددی مثبت باشد.')
                    .integer('شناسه مشتری باید عدد صحیح باشد.')
                    .required('انتخاب مشتری الزامیست.'),
                warehouseReceiptId: Yup.number()
                    .typeError('حواله انبار باید انتخاب شود.')
                    .positive('شناسه حواله انبار باید عددی مثبت باشد.')
                    .integer('شناسه حواله انبار باید عدد صحیح باشد.')
                    .required('انتخاب حواله انبار الزامیست.'),
            })
        )
            .min(1, 'حداقل یک آیتم گزارش باید وجود داشته باشد.')
            .required('حداقل یک آیتم گزارش الزامی است.'),
    });

    const resolver = useYupValidationResolver(validationSchema);


    const onSubmit = async (formData) => {

        if (formData.reportDate) {
            formData.reportDate = moment(new Date(formData.reportDate)).format('YYYY-MM-DD');
        }
        // console.log(formData)
        const errorMessage = await onCreateEntity(formData);
        if (errorMessage) {
            setErrorMessage(errorMessage);
        } else {
            setErrorMessage(null);
            onHide();
        }

    };

    return (
        <CustomModal size={"xl"} show={show}>
            <Modal.Header style={headerStyle} className="modal-header">
                <Modal.Title style={titleStyle}>
                    {"ایجاد گزارش جدید"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}>
                <div className="container modal-body"
                     style={{
                         fontFamily: "IRANSans",
                         fontSize: "0.8rem",
                         margin: "0"
                     }}>
                    <Form
                        defaultValues={{
                            reportDate: '',
                            reportExplanation: '',
                            reportItems: [
                                {
                                    quantity: '',
                                    unitPrice: '',
                                    customerId: '',
                                    warehouseReceiptId: '',
                                }
                            ],
                        }}
                        onSubmit={onSubmit}
                        resolver={resolver}
                    >
                        <Row>
                            <Col>
                                <Row>
                                    <Col>
                                        <DateInput name="reportDate" label={"تاریخ گزارش"}/>
                                    </Col>
                                </Row>
                                <Row>
                                    <div style={{"display": "flex", "flexDirection": "row", "alignItems": "center"}}>
                                        <Col>
                                            <TextInput name="reportExplanation" label={"توضیحات گزارش"}/>
                                        </Col>
                                        <GenerateReportExplanationButton
                                            style={{"margin": " 0 10px", display: "inline-block"}}/>
                                    </div>
                                </Row>
                            </Col>
                        </Row>
                        <ReportItems/>
                        <Button $variant="success" type={"submit"}>
                            ایجاد
                        </Button>
                        <Button onClick={onHide} $variant="warning" type="button">
                            انصراف
                        </Button>
                    </Form>
                    {errorMessage && <ErrorMessage message={errorMessage}/>}
                </div>
            </Modal.Body>
        </CustomModal>
    );
};

export default CreateReportForm;
