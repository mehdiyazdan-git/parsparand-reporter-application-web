import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Modal, Row } from "react-bootstrap";
import * as Yup from "yup";
import Button from "../../utils/Button";
import { TextInput } from "../../utils/TextInput";
import DateInput from "../../utils/DateInput";
import { Form } from "../../utils/Form";
import { useYupValidationResolver } from "../../hooks/useYupValidationResolver";
import moment from "jalali-moment";
import { bodyStyle, headerStyle, titleStyle } from "../styles/styles";
import useHttp from "../../hooks/useHttp";
import ReportItems from "./ReportItems";


const CreateReportForm = ({ onCreateReport, show, onHide }) => {
    const http = useHttp();

    const yearSelect = async () => {
        return await http.get(`/years/select`);
    }

    const validationSchema = Yup.object().shape({
        reportDate: Yup.string().required('تاریخ گزارش الزامیست.'),
        reportExplanation: Yup.string().required('توضیحات گزارش الزامیست.'),
        yearId: Yup.number().required('سال الزامیست.'),
        reportItems: Yup.array().of(
            Yup.object().shape({
                quantity: Yup.number().required('مقدار الزامیست.'),
                unitPrice: Yup.number().required('قیمت واحد الزامیست.'),
                customerId: Yup.number().required('شناسه مشتری الزامیست.'),
                warehouseReceiptId: Yup.number().required('شناسه رسید انبار الزامیست.'),
            })
        )
    });

    const resolver = useYupValidationResolver(validationSchema);
    const getYearId = async () => {
        try {
            const data = await yearSelect().then((res) => res.data);
            const year = data.find((item) => item.name === Number(moment(new Date()).format('jYYYY')));
            return year.id;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    const onSubmit = async (data) => {
        data.yearId = await getYearId();
        if (data.reportDate) {
            data.reportDate = moment(new Date(data.reportDate)).format('YYYY-MM-DD');
            const data = await yearSelect().then((res) => res.data);
            data.yearId = data.find((item) => item.name === Number(moment(new Date(data.reportDate)).format('jYYYY'))).id;
        }
        await onCreateReport(data);
        onHide();
    };

    return (
        <Modal size={"xl"} show={show}>
            <Modal.Header style={headerStyle} className="modal-header">
                <Modal.Title style={titleStyle}>
                    {"ایجاد گزارش جدید"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}>
                <div className="container modal-body" style={{ fontFamily: "IRANSans", fontSize: "0.8rem", margin: "0" }}>
                    <Form
                        defaultValues={{
                            reportDate: '',
                            reportExplanation: '',
                            yearId: '',
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
                                        <DateInput name="reportDate" label={"تاریخ گزارش"} />
                                    </Col>
                                </Row>
                                <TextInput name="reportExplanation" label={"توضیحات گزارش"} />
                            </Col>
                        </Row>
                        <ReportItems />
                        <Button $variant="success" type={"submit"}>
                            ایجاد
                        </Button>
                        <Button onClick={onHide} $variant="warning" type="button">
                            انصراف
                        </Button>
                    </Form>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default CreateReportForm;
