import React, {useContext, useMemo} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import {Col, Row} from "react-bootstrap";
import * as Yup from "yup";
import Button from "../../utils/Button";
import DateInput from "../../utils/DateInput";
import {Form} from "../../utils/Form";
import {useYupValidationResolver} from "../../hooks/useYupValidationResolver";
import moment from "jalali-moment";
import InvoiceItems from "./InvoiceItems";
import AsyncSelectInput from "../../utils/AsyncSelectInput";
import NumberInput from "../../utils/NumberInput";
import SelectInput from "../../utils/SelectInput";
import ContractFields from "./ContractFields";
import CustomModal, {Body, Container, Header, Title} from "../../utils/CustomModal";
import {AppContext} from "../contexts/AppProvider";
import ErrorMessage from "../../utils/ErrorMessage";

const CreateInvoiceForm = ({onCreateEntity, show, onHide}) => {

    const {years} = useContext(AppContext);

    const defaultValues = useMemo(() => ({
        dueDate: '', // jalali date like 1403/03/21
        invoiceNumber: '', // required positive rounded integer number
        issuedDate: '', // jalali date like 1403/03/21
        salesType: '', // should be in ['CASH_SALES', 'CONTRACTUAL_SALES']
        contractId: '', // not required, but if provided, it should be a valid contract id
        customerId: '', // required, it should be a valid customer id
        invoiceStatusId: '', // required, it should be a valid invoice status id
        advancedPayment: '', // positive rounded integer number
        insuranceDeposit: '', // positive rounded integer number
        performanceBound: '', // positive rounded integer number
        yearId: '', // not required, but if provided, it should be a valid year id
        invoiceItems: [
            {
                productId: '', // not required, but if provided, it should be a valid product id
                quantity: '', // required positive rounded integer number
                unitPrice: '', // required positive rounded integer or non-integer number
                warehouseReceiptId: '', // required, it should be a valid warehouse receipt id
            },
        ],
    }), []);

// ^ The empty dependency array means this object will only be created once
// when the component mounts, and will not change unless the component is remounted.

    const [contractFieldsVisibility, setContractFieldsVisibility] = React.useState(false);

    const [errorMessage, setErrorMessage] = React.useState(null);



    const validationSchema = Yup.object().shape({
        dueDate: Yup.date()
            .transform((value, originalValue) => originalValue === '' ? null : value)
            .required('تاریخ سررسید الزامی است')
            .min(Yup.ref('issuedDate'), 'تاریخ سررسید نمی‌تواند قبل از تاریخ صدور باشد.'), // Due date must be after issued date
        invoiceNumber: Yup.number()
            .typeError('شماره فاکتور باید عدد باشد')
            .required('شماره فاکتور الزامیست')
            .positive('شماره فاکتور باید مثبت باشد')
            .integer('شماره فاکتور باید عدد صحیح باشد'),
        issuedDate: Yup.date() // Use Yup.date for date validation
            .transform((value, originalValue) => originalValue === '' ? null : value)
            .required('تاریخ صدور الزامی است')
            .max(new Date(), 'تاریخ صدور نمی‌تواند در آینده باشد.'), // Issued date cannot be in the future
        salesType: Yup.string()
            .required('نوع فروش الزامی است') // salesType must be either 'CASH_SALES' or 'CONTRACTUAL_SALES'
            .oneOf(['CASH_SALES', 'CONTRACTUAL_SALES'], 'نوع فروش باید از نوع نقدی یا قراردادی باشد'),
        contractId: contractFieldsVisibility && Yup.number()
            .when('salesType', {
                is: 'CONTRACTUAL_SALES',
                then: Yup.number().typeError('شناسه قرارداد باید عدد باشد').required('شناسه قرارداد الزامیست'),
                otherwise: Yup.number().nullable().notRequired(), // Allow null if not contractual sales
            }),
        customerId: Yup.number()
            .typeError('شناسه مشتری باید عدد باشد')
            .required('شناسه مشتری الزامیست')
            .positive('شناسه مشتری باید مثبت باشد')
            .integer('شناسه مشتری باید عدد صحیح باشد'),
        invoiceStatusId: Yup.number()
            .typeError('شناسه وضعیت فاکتور باید عدد باشد')
            .required('شناسه وضعیت فاکتور الزامیست')
            .positive('شناسه وضعیت فاکتور باید مثبت باشد')
            .integer('شناسه وضعیت فاکتور باید عدد صحیح باشد'),
        advancedPayment: contractFieldsVisibility && Yup.number()
            .when('salesType', {
                is: 'CONTRACTUAL_SALES',
                then: Yup.number()
                    .typeError('پیش پرداخت باید عدد باشد')
                    .min(0, 'پیش پرداخت نمی‌تواند منفی باشد')
                    .integer('پیش پرداخت باید عدد صحیح باشد'),
                otherwise: Yup.number().nullable().notRequired(),
            }),
        insuranceDeposit: contractFieldsVisibility && Yup.number()
            .when('salesType', {
                is: 'CONTRACTUAL_SALES',
                then: Yup.number()
                    .typeError('ودیعه بیمه باید عدد باشد')
                    .min(0, 'ودیعه بیمه نمی‌تواند منفی باشد')
                    .integer('ودیعه بیمه باید عدد صحیح باشد'),
                otherwise: Yup.number().nullable().notRequired(),
            }),
        performanceBound: contractFieldsVisibility && Yup.number()
            .when('salesType', {
                is: 'CONTRACTUAL_SALES',
                then: Yup.number()
                    .typeError('ضمانت اجرا باید عدد باشد')
                    .min(0, 'ضمانت اجرا نمی‌تواند منفی باشد')
                    .integer('ضمانت اجرا باید عدد صحیح باشد'),
                otherwise: Yup.number().nullable().notRequired(),
            }),
        invoiceItems: Yup.array()
            .of(
                Yup.object().shape({
                    productId: Yup.number()
                        .typeError('شناسه محصول باید عدد باشد')
                        .required('شناسه محصول الزامیست')
                        .positive('شناسه محصول باید مثبت باشد')
                        .integer('شناسه محصول باید عدد صحیح باشد'),

                    quantity: Yup.number()
                        .typeError('مقدار باید عدد باشد')
                        .required('مقدار الزامیست')
                        .positive('مقدار باید مثبت باشد')
                        .integer('مقدار باید عدد صحیح باشد'),

                    unitPrice: Yup.number()
                        .typeError('قیمت واحد باید عدد باشد')
                        .required('قیمت واحد الزامیست')
                        .positive('قیمت واحد باید مثبت باشد'),

                    warehouseReceiptId: Yup.number()
                        .typeError('شناسه رسید انبار باید عدد باشد')
                        .required('شناسه رسید انبار الزامیست')
                        .positive('شناسه رسید انبار باید مثبت باشد')
                        .integer('شناسه رسید انبار باید عدد صحیح باشد'),
                })
            )
            .required('آیتم‌های فاکتور الزامیست')
            .min(1, 'فاکتور باید حداقل یک آیتم داشته باشد.'),
    });
    const salesTypeOptions = [
        {label: "فروش نقدی", value: "CASH_SALES"},
        {label: "فروش قراردادی", value: "CONTRACTUAL_SALES"},
    ]


    const {customers,invoiceStatuses,contracts} = useContext(AppContext);
    const resolver = useYupValidationResolver(validationSchema);

    const getYearId = (date) => {

        const jalaliYear = parseInt(new Intl.DateTimeFormat('fa-IR')
            .format(new Date(date)).substring(0, 4), 10);

        const yearId = years.find(option => option.label === jalaliYear)?.value;
        if (yearId){
            return yearId;
        }else {
            return years[0].value
        }
    };

    const onSubmit = async (data) => {
        console.log(data)
        if (data.dueDate) {
            data.dueDate = moment(new Date(data.dueDate)).format('YYYY-MM-DD');
        }
        if (data.issuedDate) {
            data.issuedDate = moment(new Date(data.issuedDate)).format('YYYY-MM-DD');
        }
        data['yearId'] = getYearId(data.issuedDate) || getYearId(new Date());

       const errorMessage = await onCreateEntity(data);
        if (errorMessage) {
            setErrorMessage(errorMessage);
        } else {
            setErrorMessage(null);
            onHide();
        }
    };

    return (
        <CustomModal size={"xl"} show={show}>
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
                                        <DateInput name="dueDate" label={"تاریخ سررسید"}/>
                                    </Col>
                                    <Col>
                                        <NumberInput name="invoiceNumber" label={"شماره فاکتور"}/>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <DateInput name="issuedDate" label={"تاریخ صدور"}/>
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
                                            options={customers}
                                        />
                                    </Col>
                                    <Col>
                                        <AsyncSelectInput
                                            name="invoiceStatusId"
                                            label={"وضعیت فاکتور"}
                                            options={invoiceStatuses}
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
                                            <NumberInput name="advancedPayment" label={"پیش پرداخت"}/>
                                        </Col>
                                        <Col>
                                            <NumberInput name="insuranceDeposit" label={"ودیعه بیمه"}/>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <NumberInput name="performanceBound" label={"ضمانت اجرا"}/>
                                        </Col>
                                    </Row>
                                </ContractFields>
                            </Col>
                        </Row>
                        <InvoiceItems/>
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

export default CreateInvoiceForm;
