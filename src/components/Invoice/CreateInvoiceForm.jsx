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

/***
 validation rules for create invoice form:
  - advancedPayment and insuranceDeposit and performanceBound and contractId are optional
    * they rendered only if salesType is CONTRACTUAL_SALES
  - yearId, customerId, invoiceStatusId and contractId are type of async-select
  - issueDate and dueDate are type of date and the input field is datepicker of type react-multi-date-picker'
   *   the output of this component is a string in format of 'YYYY-MM-DD'
  - invoiceNumber is type of number
  - salesType is type of select
  - invoiceItems is type of array of objects and each object has productId, quantity and unitPrice
  - productId, quantity and unitPrice are type of number
  - warehouseReceiptId is type of async-select
  - the form should have at least one item in invoiceItems
 ***/

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

const CreateInvoiceForm = ({onCreateEntity, show, onHide}) => {

    const {years} = useContext(AppContext);

    const defaultValues = useMemo(() => ({
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
        yearId: years[0].value,
        invoiceItems: [
            {
                productId: '',
                quantity: '',
                unitPrice: '',
                warehouseReceiptId: '',
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
    const salesTypeOptions = [
        {label: "فروش نقدی", value: "CASH_SALES"},
        {label: "فروش قراردادی", value: "CONTRACTUAL_SALES"},
    ]


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
        if (data.dueDate) {
            data.dueDate = moment(new Date(data.dueDate)).format('YYYY-MM-DD');
        }
        if (data.issuedDate) {
            data.issuedDate = moment(new Date(data.issuedDate)).format('YYYY-MM-DD');
        }
        data['yearId'] = getYearId(data.issuedDate) || getYearId(new Date());
        console.log(data)
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
                                                url={"contracts/select"}
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
