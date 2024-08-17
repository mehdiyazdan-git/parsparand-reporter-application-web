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
import { bodyStyle, titleStyle } from "../styles/styles";
import AsyncSelectInput from "../../utils/AsyncSelectInput";
import ReportItems from "./ReportItems";
import "../../App.css";
import CustomModal from "../../utils/CustomModal";
import useHttp from "../contexts/useHttp";

const EditReportForm = ({ editingEntity, onUpdateEntity, show, onHide }) => {
    const {getAll} = useHttp();

    const yearSelect = async (inputValue) => {
        return await getAll('years/select', {'searchParams':inputValue});
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

    const onSubmit = async (data) => {
        if (data.reportDate) {
            data.reportDate = moment(new Date(data.reportDate)).format('YYYY-MM-DD');
        }
        await onUpdateEntity(data);
        onHide();
    };

    return (
        <CustomModal size={"xl"} show={show}>
            <Modal.Header  className="modal-header">
                <Modal.Title style={titleStyle}>
                    {"ویرایش گزارش"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}>
                <div className="container modal-body" style={{ fontFamily: "IRANSans", fontSize: "0.8rem", margin: "0" }}>
                    <Form
                        defaultValues={{
                            id: editingEntity.id,
                            reportDate: editingEntity.reportDate,
                            reportExplanation: editingEntity.reportExplanation,
                            yearId: editingEntity.yearId,
                            reportItems: editingEntity.reportItems,
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
                                    <Col className={"mb-1"}>
                                        <AsyncSelectInput name="yearId" label={"سال"} apiFetchFunction={yearSelect} />
                                    </Col>
                                </Row>
                                <TextInput name="reportExplanation" label={"توضیحات گزارش"} />
                            </Col>
                        </Row>
                        <ReportItems />
                        <Button $variant="success" type={"submit"}>
                            ویرایش
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

export default EditReportForm;
