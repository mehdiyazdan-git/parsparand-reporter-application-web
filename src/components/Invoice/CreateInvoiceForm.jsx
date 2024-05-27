import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import {Col, Modal, Row} from "react-bootstrap";
import * as Yup from "yup";
import Button from "../../utils/Button";
import DateInput from "../../utils/DateInput";
import {Form} from "../../utils/Form";
import {useYupValidationResolver} from "../../hooks/useYupValidationResolver";
import moment from "jalali-moment";
import {bodyStyle, headerStyle, titleStyle} from "../styles/styles";
import useHttp from "../../hooks/useHttp";
import InvoiceItems from "./InvoiceItems";
import AsyncSelectInput from "../../utils/AsyncSelectInput";
import NumberInput from "../../utils/NumberInput";
import SelectInput from "../../utils/SelectInput";
import ContractFields from "./ContractFields";


const CreateInvoiceForm = ({ onCreateInvoice,show, onHide }) => {
    const http = useHttp();



    const customerSelect = async (searchQuery = '') => {
        return await http.get(`/customers/select?searchQuery=${searchQuery}`);
    }

    const contractSelect = async (searchQuery = '') => {
        return await http.get(`/contracts/select?searchQuery=${searchQuery}`);
    }

    const invoiceStatusSelect = async (searchParam='') => {
        return await http.get(`/invoice-statuses/select?searchParam=${searchParam}`);
    }

    const validationSchema = Yup.object().shape({
        // dueDate: Yup.string().required('تاریخ سررسید الزامیست.'),
        // invoiceNumber: Yup.number().required('شماره فاکتور الزامیست.'),
        // issuedDate: Yup.string().required('تاریخ صدور الزامیست.'),
        // salesType: Yup.string().required('نوع فروش الزامیست.'),
        // invoiceStatusId: Yup.number().required('وضعیت فاکتور الزامیست.'),
        // customerId: Yup.number().required('شناسه مشتری الزامیست.'),
        // contractId: isContractualSales ? Yup.number().required('شناسه قرارداد الزامیست.') : Yup.number(),
        // advancedPayment: isContractualSales ? Yup.number().required('پیش پرداخت الزامیست.') : Yup.number(),
        // insuranceDeposit: isContractualSales ? Yup.number().required('ودیعه بیمه الزامیست.') : Yup.number(),
        // performanceBound: isContractualSales ? Yup.number().required('ضمانت اجرا الزامیست.') : Yup.number(),
        // invoiceItems: Yup.array().of(
        //     Yup.object().shape({
        //         productId: Yup.number().required('شناسه محصول الزامیست.'),
        //         quantity: Yup.number().required('مقدار الزامیست.'),
        //         unitPrice: Yup.number().required('قیمت واحد الزامیست.'),
        //         warehouseReceiptId: Yup.number().required('شناسه رسید انبار الزامیست.'),
        //     })
        // )
    });

    const resolver = useYupValidationResolver(validationSchema);

    const yearSelect = async () => {
        try {
            const response = await http.get(`/years/select`);
            return response.data;
        } catch (error) {
            console.error(error);
            return [];
        }
    }
    const getYearId = async () => {
        try {
            const data = await yearSelect();
            const year = data.find((item) => item.name === Number(moment(new Date()).format('jYYYY')));
            return year.id;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    const onSubmit = async (data) => {
        if (data.dueDate) {
            data.dueDate = moment(new Date(data.dueDate)).format('YYYY-MM-DD');
        }
        if (data.issuedDate) {
            data.issuedDate = moment(new Date(data.issuedDate)).format('YYYY-MM-DD');
        }
        data.yearId = await getYearId();
        await onCreateInvoice(data);
        onHide();
        console.log(data);
    };


    return (
        <Modal size={"xl"} show={show} centered>
            <Modal.Header style={headerStyle} >
                <Modal.Title style={titleStyle}>
                    {"ایجاد فاکتور جدید"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}>
                <div className="container modal-body" style={{ fontFamily: "IRANSans", fontSize: "0.8rem", margin: "0" }}>
                    <Form
                        defaultValues={{
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
                                        <AsyncSelectInput name="customerId" label={"مشتری"} apiFetchFunction={customerSelect} />
                                    </Col>
                                    <Col>
                                        <AsyncSelectInput
                                            name="invoiceStatusId"
                                            label={"وضعیت فاکتور"}
                                            apiFetchFunction={invoiceStatusSelect}
                                        />
                                    </Col>
                                </Row>
                                <ContractFields>
                                    <Row>
                                        <Col>
                                            <AsyncSelectInput
                                                name="contractId"
                                                label={" قرارداد"}
                                                apiFetchFunction={contractSelect}
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
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default CreateInvoiceForm;
