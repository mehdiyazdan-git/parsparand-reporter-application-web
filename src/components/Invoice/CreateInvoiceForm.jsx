import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Row } from "react-bootstrap";
import * as Yup from "yup";
import Button from "../../utils/Button";
import DateInput from "../../utils/DateInput";
import { Form } from "../../utils/Form";
import { useYupValidationResolver } from "../../hooks/useYupValidationResolver";
import moment from "jalali-moment";
import InvoiceItems from "./InvoiceItems";
import AsyncSelectInput from "../../utils/AsyncSelectInput";
import NumberInput from "../../utils/NumberInput";
import SelectInput from "../../utils/SelectInput";
import ContractFields from "./ContractFields";
import CustomModal, {Body, Container, Header, Title} from "../../utils/CustomModal";

const defaultValues = {
    dueDate: '',
    invoiceNumber: '',
    issuedDate: '',
    salesType: 'CASH_SALES',
    contractId: '',
    customerId: '',
    invoiceStatusId: '',
    advancedPayment: '',
    insuranceDeposit: '',
    performanceBound: '',
    yearId: '',
    invoiceItems: [
        {
            productId: '',
            quantity: '',
            unitPrice: '',
            warehouseReceiptId: '',
        }
    ],
}

const CreateInvoiceForm = ({ onCreateEntity, show, onHide }) => {

    const [isContractualSales, setIsContractualSales] = useState(false);

    const validationSchema = Yup.object().shape({
        dueDate: Yup.string().required('تاریخ سررسید الزامیست.'),
        invoiceNumber: Yup.number()
                .typeError('شماره فاکتور باید عدد باشد.')
                .positive('شماره فاکتور باید عدد مثبت باشد.')
            .required('شماره فاکتور الزامیست.'),
        issuedDate: Yup.string().required('تاریخ صدور الزامیست.'),
        salesType: Yup.string()
            .typeError('نوع فروش الزامیست.')
            .required('نوع فروش الزامیست.'),
        invoiceStatusId: Yup.number()
            .typeError('وضعیت فاکتور الزامیست.')
            .required('وضعیت فاکتور الزامیست.'),
        contractId: isContractualSales ? Yup.number().required('شناسه قرارداد الزامیست.') : Yup.number(),
        customerId: Yup.number()
            .typeError('شناسه مشتری الزامیست.')
            .required('شناسه مشتری الزامیست.'),
        advancedPayment: isContractualSales ? Yup.number().required('پیش پرداخت الزامیست.') : Yup.number(),
        insuranceDeposit: isContractualSales ? Yup.number().required('ودیعه بیمه الزامیست.') : Yup.number(),
        performanceBound: isContractualSales ? Yup.number().required('ضمانت اجرا الزامیست.') : Yup.number(),
        yearId: Yup.number().required('سال الزامیست.'),
        invoiceItems: Yup.array().of(
            Yup.object().shape({
                productId: Yup.number()
                    .typeError(' محصول الزامیست.')
                    .required(' محصول الزامیست.'),
                quantity: Yup.number()
                    .typeError('تعداد باید عدد باشد.')
                    .positive('تعداد باید عدد مثبت باشد.')
                    .required('تعداد الزامیست.'),
                unitPrice: Yup.number()
                        .typeError('قیمت واحد باید عدد باشد.')
                        .positive('قیمت واحد باید عدد مثبت باشد.')
                    .required('قیمت واحد الزامیست.'),
                warehouseReceiptId: Yup.number()
                    .typeError(' رسید انبار الزامیست.')
                    .required(' رسید انبار الزامیست.'),
            })
        )
    });
    const salesTypeOptions = [
        { label: "فروش نقدی", value: "CASH_SALES" },
        { label: "فروش قراردادی", value: "CONTRACTUAL_SALES" },
    ]

    const resolver = useYupValidationResolver(validationSchema);

    const onSubmit = async (data) => {
        if (data.dueDate) {
            data.dueDate = moment(new Date(data.dueDate)).format('YYYY-MM-DD');
        }
        if (data.issuedDate) {
            data.issuedDate = moment(new Date(data.issuedDate)).format('YYYY-MM-DD');
        }
        await onCreateEntity(data);
        onHide();
    };

    return (
        <CustomModal size={"xl"} show={show} >
            <Header>
                <Title>
                    {"ایجاد فاکتور جدید"}
                </Title>
            </Header>
            <Body>
                <Container>
                    <Form
                        defaultValues={defaultValues}
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
                                            options={salesTypeOptions}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <AsyncSelectInput
                                            name="customerId"
                                            label={"مشتری"}
                                            url={"customers/select"}
                                        />
                                    </Col>
                                    <Col>
                                        <AsyncSelectInput
                                            name="invoiceStatusId"
                                            label={"وضعیت فاکتور"}
                                            url={"invoice-statuses/select"}
                                        />
                                    </Col>
                                </Row>
                                <ContractFields>
                                    <Row>
                                        <Col>
                                            <AsyncSelectInput
                                                name="contractId"
                                                label={" قرارداد"}
                                                url={"contracts/select"}
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
                                        <Col>
                                            <NumberInput name="performanceBound" label={"ضمانت اجرا"} />
                                        </Col>
                                    </Row>
                                </ContractFields>
                            </Col>
                        </Row>
                        <InvoiceItems />
                        <Button $variant="success" type={"submit"}>
                            ایجاد
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

export default CreateInvoiceForm;
