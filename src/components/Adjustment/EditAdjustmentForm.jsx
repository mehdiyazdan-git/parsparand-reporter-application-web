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
import AsyncSelectInput from "../../utils/AsyncSelectInput";
import NumberInput from "../../utils/NumberInput";
import SelectInput from "../../utils/SelectInput";
import Subtotal from "../../utils/Subtotal";
import useFilter from "../contexts/useFilter";
import CustomModal from "../../utils/CustomModal";



const EditAdjustmentForm = ({ editingEntity, onUpdateEntity, show, onHide }) => {
    const http = useHttp();

    const {filter} = useFilter();

    const invoiceSelect = async (searchQuery) => {
        return await http.get(`/invoices/select?searchQuery=${searchQuery}&jalaliYear=${filter?.jalaliYear && filter.jalaliYear.label}`);
    }

    const validationSchema = Yup.object().shape({
        adjustmentType: Yup.string().required('نوع تعدیل الزامیست.'),
        description: Yup.string().required('توضیحات الزامیست.'),
        quantity: Yup.number().required('مقدار الزامیست.'),
        unitPrice: Yup.number().required('قیمت واحد الزامیست.'),
        invoiceId: Yup.number().required('شناسه فاکتور الزامیست.'),
        adjustmentDate: Yup.string().required('تاریخ تعدیل الزامیست.'),
        adjustmentNumber: Yup.number().required('شماره تعدیل الزامیست.'),
    });

    const resolver = useYupValidationResolver(validationSchema);

    const onSubmit = async (data) => {
        if (data.adjustmentDate) {
            data.adjustmentDate = moment(new Date(data.adjustmentDate)).format('YYYY-MM-DD');
        }
        await onUpdateEntity(data);
        onHide();
    };

    return (
        <CustomModal size={"xl"} show={show} onHide={onHide}>
            <Modal.Header style={headerStyle} className="modal-header" >
                <Modal.Title style={titleStyle}>
                    {"ویرایش تعدیل"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}>
                <div className="container modal-body" style={{ fontFamily: "IRANSans", fontSize: "0.8rem", margin: "0" }}>
                    <Form
                        defaultValues={{
                            id: editingEntity.id,
                            adjustmentType: editingEntity.adjustmentType,
                            description: editingEntity.description,
                            quantity: editingEntity.quantity,
                            unitPrice: editingEntity.unitPrice,
                            invoiceId: editingEntity.invoiceId,
                            adjustmentDate: editingEntity.adjustmentDate,
                            adjustmentNumber: editingEntity.adjustmentNumber,
                        }}
                        onSubmit={onSubmit}
                        resolver={resolver}
                    >
                        <Row>
                            <Col>
                                <Row>
                                    <Col>
                                        <NumberInput name="adjustmentNumber" label={"شماره سند تعدیل"} />
                                    </Col>
                                    <Col>
                                        <SelectInput
                                            name="adjustmentType"
                                            label={"نوع تعدیل"}
                                            options={[
                                                { label: "مثبت", value: "POSITIVE" },
                                                { label: "منفی", value: "NEGATIVE" },
                                            ]}
                                        />
                                    </Col>

                                </Row>
                                <Row>
                                    <Col>
                                        <AsyncSelectInput name="invoiceId" label={"شناسه فاکتور"} apiFetchFunction={invoiceSelect} />
                                    </Col>
                                    <Col>
                                        <DateInput name="adjustmentDate" label={"تاریخ تعدیل"} />
                                    </Col>
                                </Row>
                                <TextInput name="description" label={"توضیحات"} />
                                <hr/>
                                <Row className={"justify-content-center align-items-center mb-2"}>
                                    <Col>
                                        <NumberInput name="unitPrice" label={"قیمت واحد"} />
                                    </Col>
                                    <Col>
                                        <NumberInput name="quantity" label={"مقدار"} />
                                    </Col>
                                    <Col>
                                        <Subtotal label={"مبلغ کل"} />
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
                </div>
            </Modal.Body>
        </CustomModal>
    );
};

export default EditAdjustmentForm;
