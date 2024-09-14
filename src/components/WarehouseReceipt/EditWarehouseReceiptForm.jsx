import React, {useContext} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import {Col, Row} from "react-bootstrap";
import * as Yup from "yup";
import Button from "../../utils/Button";
import {TextInput} from "../../utils/TextInput";
import DateInput from "../../utils/DateInput";
import {Form} from "../../utils/Form";
import {useYupValidationResolver} from "../../hooks/useYupValidationResolver";
import moment from "jalali-moment";
import NumberInput from "../../utils/NumberInput";
import AsyncSelectInput from "../../utils/AsyncSelectInput";
import WarehouseReceiptItems from "./WarehouseReceiptItems";
import CustomModal, {Body, Container, Header, Title} from "../../utils/CustomModal";
import ErrorMessage from "../../utils/ErrorMessage";
import GenerateDescriptionButton from "./GenerateWarehouseDescriptionButton";
import {AppContext} from "../contexts/AppProvider";

const EditWarehouseReceiptForm = ({editingEntity, onUpdateEntity, show, onHide}) => {

    const validationSchema = Yup.object().shape({
        warehouseReceiptDate: Yup.date()
            .typeError('تاریخ رسید باید یک تاریخ معتبر باشد.')
            .required('تاریخ رسید الزامی است.')
            .max(
                moment().endOf('day').toDate(), // Set max to the end of today
                'تاریخ رسید نمی‌تواند در آینده باشد.'
            ),

        warehouseReceiptDescription: Yup.string()
            .trim()
            .required('توضیحات الزامی است.')
            .min(3, 'توضیحات باید حداقل 3 کاراکتر باشد.')
            .max(255, 'توضیحات نمی‌تواند بیشتر از 255 کاراکتر باشد.'),

        warehouseReceiptNumber: Yup.number()
            .typeError('شماره رسید باید یک عدد باشد.')
            .integer('شماره رسید باید عدد صحیح باشد.')
            .positive('شماره رسید باید مثبت باشد.')
            .required('شماره رسید الزامی است.'),

        customerId: Yup.number()
            .typeError('لطفاً یک مشتری انتخاب کنید.')
            .integer('شناسه مشتری باید یک عدد صحیح باشد.')
            .positive('شناسه مشتری باید مثبت باشد.')
            .required('انتخاب مشتری الزامی است.'),

        warehouseReceiptItems: Yup.array().of(
            Yup.object().shape({
                productId: Yup.number()
                    .typeError('لطفاً یک محصول انتخاب کنید.')
                    .integer('شناسه محصول باید یک عدد صحیح باشد.')
                    .positive('شناسه محصول باید مثبت باشد.')
                    .required('انتخاب محصول الزامی است.'),

                quantity: Yup.number()
                    .typeError('مقدار باید یک عدد باشد.')
                    .integer('مقدار باید عدد صحیح باشد.')
                    .positive('مقدار باید مثبت باشد.')
                    .required('وارد کردن مقدار الزامی است.'),

                unitPrice: Yup.number()
                    .typeError('قیمت واحد باید یک عدد باشد.')
                    .positive('قیمت واحد باید مثبت باشد.')
                    .test('is-decimal', 'قیمت واحد باید حداکثر دو رقم اعشار داشته باشد.',
                        (value) => (value + "").match(/^\d+(\.\d{1,2})?$/))
                    .required('وارد کردن قیمت واحد الزامی است.'),

            })
        ).min(1, 'حداقل یک قلم کالا باید وارد شود.')
    });

    const resolver = useYupValidationResolver(validationSchema);

    const [errorMessage, setErrorMessage] = React.useState(null);

    const {customers} = useContext(AppContext);

    const onSubmit = async (data) => {
        if (data.warehouseReceiptDate) {
            data.warehouseReceiptDate = moment(new Date(data.warehouseReceiptDate)).format('YYYY-MM-DD');
        }
        const errorMessage = await onUpdateEntity(data);
        if (errorMessage) {
            setErrorMessage(errorMessage);
        } else {
            setErrorMessage(null);
            onHide();
        }
    };

    return (
        <CustomModal size={"xl"} show={show} onHide={onHide}>
            <Header>
                <Title>{"ویرایش رسید انبار"}</Title>
            </Header>
            <Body>
                <Container>
                    <Form
                        defaultValues={{
                            id: editingEntity?.id,
                            warehouseReceiptDate: editingEntity?.warehouseReceiptDate,
                            warehouseReceiptDescription: editingEntity?.warehouseReceiptDescription,
                            warehouseReceiptNumber: editingEntity?.warehouseReceiptNumber,
                            customerId: editingEntity?.customerId,
                            warehouseReceiptItems: editingEntity?.warehouseReceiptItems,
                        }}
                        onSubmit={onSubmit}
                        resolver={resolver}
                    >
                        <Row>
                            <Col>
                                <Row>
                                    <Col>
                                        <NumberInput
                                            name="warehouseReceiptNumber"
                                            label={"شماره رسید"}
                                        />
                                    </Col>
                                    <Col>
                                        <DateInput
                                            name="warehouseReceiptDate"
                                            label={"تاریخ رسید"}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <AsyncSelectInput
                                            name="customerId"
                                            label={"شناسه مشتری"}
                                            options={customers}
                                            value={editingEntity?.customerId}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <div style={{"display": "flex", "flexDirection": "row", "alignItems": "center"}}>

                                        <Col>
                                            <TextInput name="warehouseReceiptDescription" label={`توضیحات `} />
                                        </Col>
                                        <GenerateDescriptionButton style={{"margin": " 0 10px",display: "inline-block"}}/>
                                    </div>
                                </Row>
                            </Col>
                        </Row>
                        <WarehouseReceiptItems/>
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

export default EditWarehouseReceiptForm;
