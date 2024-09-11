import React, {useContext} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Row } from "react-bootstrap";
import * as Yup from "yup";
import Button from "../../utils/Button";
import DateInput from "../../utils/DateInput";
import { Form } from "../../utils/Form";
import { useYupValidationResolver } from "../../hooks/useYupValidationResolver";
import moment from "jalali-moment";
import CustomModal, {Body, Container, Header, Title} from "../../utils/CustomModal";

import NumberInput from "../../utils/NumberInput";
import AsyncSelectInput from "../../utils/AsyncSelectInput";
import InvoiceItems from "./InvoiceItems";
import SelectInput from "../../utils/SelectInput";
import ContractFields from "./ContractFields";
import ErrorMessage from "../../utils/ErrorMessage";
import {AppContext} from "../contexts/AppProvider";

const EditInvoiceForm = ({ editingEntity, onUpdateEntity, show, onHide }) => {

    const [contractFieldsVisibility, setContractFieldsVisibility] = React.useState(false);

    const validationSchema = Yup.object().shape({
        dueDate: Yup.date()
            .transform((value, originalValue) => originalValue === '' ? null : value)
            .required('تاریخ تحویل الزامی است'),
        invoiceNumber: Yup.number().typeError('مقدار فیلد باید عدد باشد').required('مقدار فیلد الزامیست'),
        issuedDate: Yup.string()
            .transform((value, originalValue) => originalValue === '' ? null : value)
            .required('تاریخ صدور الزامی است'),
        salesType: Yup.string()
            .oneOf(['CASH_SALES', 'CONTRACTUAL_SALES'])
            .required('نوع فروش الزامی است'),
        contractId: contractFieldsVisibility && Yup.number().typeError('مقدار فیلد باید عدد باشد').notRequired(),
        customerId: Yup.number().typeError('مقدار فیلد باید عدد باشد').required('مقدار فیلد الزامیست.'),
        invoiceStatusId: Yup.number().typeError('مقدار فیلد باید عدد باشد').required('مقدار فیلد الزامیست'),
        advancedPayment: contractFieldsVisibility && Yup.number().typeError('مقدار فیلد باید عدد باشد').notRequired(),
        insuranceDeposit: contractFieldsVisibility && Yup.number().typeError('مقدار فیلد باید عدد باشد').notRequired(),
        performanceBound: contractFieldsVisibility && Yup.number().typeError('مقدار فیلد باید عدد باشد').notRequired(),
        yearId: Yup.string().required('مقدار فیلد الزامیست'),
        invoiceItems: Yup.array().of(
            Yup.object().shape({
                productId: Yup.number().typeError('مقدار فیلد باید عدد باشد').required('مقدار فیلد الزامیست'),
                quantity: Yup.number().typeError('مقدار فیلد باید عدد باشد').required('مقدار فیلد الزامیست'),
                unitPrice: Yup.number().typeError('مقدار فیلد باید عدد باشد').required('مقدار فیلد الزامیست'),
                warehouseReceiptId: Yup.number().typeError('مقدار فیلد باید عدد باشد').required('مقدار فیلد الزامیست'),
            })
        ).required('مقدار فیلد الزامیست').min(1, 'فاکتور باید حداقل یک آیتم داشته باشد.'),
    });
    const resolver = useYupValidationResolver(validationSchema);

    const {customers,contracts,invoiceStatuses} = useContext(AppContext);

    const [errorMessage, setErrorMessage] = React.useState(null);

    const onSubmit = async (data) => {
        const formattedData = {
            ...data,
            dueDate: data.dueDate ? formatDate(data.dueDate) : null,
            issuedDate: data.issuedDate ? formatDate(data.issuedDate) : null,
        };
        const errorMessage = await onUpdateEntity(formattedData);
        if (errorMessage) {
            setErrorMessage(errorMessage);
        } else {
            setErrorMessage(null);
            onHide();
        }
    };

    const formatDate = (date) => {
        if (date) {
            return moment(new Date(date)).format('YYYY-MM-DD');
        }
        return null;
    };

    return (
        <CustomModal size={"xl"} show={show}>
            <Header>
                <Title>
                    {"ویرایش فاکتور"}
                </Title>
            </Header>
            <Body>
                <Container>
                    <Form
                        defaultValues={{
                            id: editingEntity.id,
                            dueDate: editingEntity.dueDate,
                            invoiceNumber: editingEntity.invoiceNumber,
                            issuedDate: editingEntity.issuedDate,
                            salesType: editingEntity.salesType,
                            contractId: editingEntity.contractId,
                            customerId: editingEntity.customerId,
                            invoiceStatusId: editingEntity.invoiceStatusId,
                            advancedPayment: editingEntity.advancedPayment,
                            insuranceDeposit: editingEntity.insuranceDeposit,
                            performanceBound: editingEntity.performanceBound,
                            invoiceItems: editingEntity.invoiceItems,
                        }}
                        onSubmit={onSubmit}
                        resolver={resolver}
                    >
                        <Row>
                            <Col>
                                <Row>
                                    <Col>
                                        <DateInput name="dueDate" label={"تاریخ سررسید"} />
                                    </Col>
                                    <Col>
                                        <NumberInput name="invoiceNumber" label={"شماره فاکتور"} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <DateInput name="issuedDate" label={"تاریخ صدور"} />
                                    </Col>
                                    <Col>
                                        <SelectInput
                                            name="salesType"
                                            label={"نوع فروش"}
                                            options={[
                                                { label: "فروش نقدی", value: "CASH_SALES" },
                                                { label: "فروش قراردادی", value: "CONTRACTUAL_SALES" },
                                            ]}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <AsyncSelectInput
                                            name="customerId"
                                            label={"مشتری"}
                                            options={customers}
                                            value={editingEntity?.customerId}
                                        />
                                    </Col>
                                    <Col>
                                        <AsyncSelectInput
                                            name="invoiceStatusId"
                                            label={"وضعیت فاکتور"}
                                            options={invoiceStatuses}
                                            value={editingEntity?.invoiceStatusId}
                                        />
                                    </Col>
                                </Row>
                                <ContractFields onSalesTypeChange={
                                    (value) => {
                                        if (value === "CONTRACTUAL_SALES") {
                                            setContractFieldsVisibility(true);
                                        } else {
                                            setContractFieldsVisibility(false);
                                        }
                                    }
                                }>
                                    <Row>
                                        <Col>
                                            <AsyncSelectInput
                                                name="contractId"
                                                label={" قرارداد"}
                                                options={contracts}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <NumberInput name="advancedPayment" label={"پیش پرداخت"} />
                                        </Col>
                                        <Col>
                                            <NumberInput name="insuranceDeposit" label={"ودیعه بیمه"} />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className={"col-6"}>
                                            <NumberInput name="performanceBound" label={"ضمانت اجرا"} />
                                        </Col>
                                    </Row>
                                </ContractFields>
                            </Col>
                        </Row>
                        <hr/>
                        <InvoiceItems />
                        <Button $variant="success" type={"submit"}>
                            ویرایش
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

export default EditInvoiceForm;
