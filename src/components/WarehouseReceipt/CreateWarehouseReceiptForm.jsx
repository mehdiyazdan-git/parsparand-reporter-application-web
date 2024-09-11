import React, {useContext} from 'react';
import * as Yup from "yup";
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Row } from "react-bootstrap";
import Button from "../../utils/Button";
import { TextInput } from "../../utils/TextInput";
import DateInput from "../../utils/DateInput";
import { Form } from "../../utils/Form";
import { useYupValidationResolver } from "../../hooks/useYupValidationResolver";
import moment from "jalali-moment";
import CustomModal, {Body, Container, Header, Title} from "../../utils/CustomModal";

import WarehouseReceiptItems from "./WarehouseReceiptItems";
import AsyncSelectInput from "../../utils/AsyncSelectInput";
import NumberInput from "../../utils/NumberInput";
import ErrorMessage from "../../utils/ErrorMessage";
import GenerateDescriptionButton from "./GenerateWarehouseDescriptionButton";
import {AppContext} from "../contexts/AppProvider";


const CreateWarehouseReceiptForm = ({ onCreateEntity, show, onHide }) => {

    const validationSchema = Yup.object().shape({
        warehouseReceiptDate: Yup.date()
            .typeError('تاریخ حواله الزامیست.')
            .required('تاریخ حواله الزامیست.'),

        warehouseReceiptDescription: Yup.string()
            .required('توضیحات الزامیست.')
            .min(3, 'توضیحات باید حداقل 3 کاراکتر باشد.')
            .max(255, 'توضیحات نمی‌تواند بیشتر از 255 کاراکتر باشد.'),

        warehouseReceiptNumber: Yup.number()
            .typeError('شماره حواله الزامیست.')
            .integer('شماره حواله باید عدد صحیح باشد.')
            .positive('شماره حواله باید مثبت باشد.')
            .required('شماره حواله الزامیست.'),

        customerId: Yup.number()
            .typeError('انتخاب مشتری الزامیست.')
            .required(' انتخاب مشتری الزامیست.'),

        warehouseReceiptItems: Yup.array().of(
            Yup.object().shape({
                productId: Yup.number()
                    .typeError(' انتخاب محصول الزامیست.')
                    .required(' انتخاب محصول الزامیست.'),

                quantity: Yup.number()
                    .typeError('مقدار باید عدد باشد.')
                    .integer('مقدار باید عدد صحیح باشد.')
                    .positive('مقدار باید مثبت باشد.')
                    .required('مقدار الزامیست.'),

                unitPrice: Yup.number()
                    .typeError('قیمت واحد باید عدد باشد.')
                    .positive('قیمت واحد باید مثبت باشد.')
                    .required('قیمت واحد الزامیست.'),

                // 'amount' is calculated, so it doesn't need validation here
            })
        ).min(1, 'حداقل یک قلم کالا باید وارد شود.') // Ensure at least one item is added
    });

    const resolver = useYupValidationResolver(validationSchema);

    const [errorMessage, setErrorMessage] = React.useState(null);

    const {customers} = useContext(AppContext);

    const onSubmit = async (data) => {
        if (data.warehouseReceiptDate) {
            data.warehouseReceiptDate = moment(new Date(data.warehouseReceiptDate)).format('YYYY-MM-DD');
        }
        const errorMessage = await onCreateEntity(data);
        if (errorMessage) {
            setErrorMessage(errorMessage);
        } else {
            setErrorMessage(null);
            onHide();
        }
    };
    const handleClose = () => {
        setErrorMessage(null);
        onHide();
    }

    return (
        <CustomModal size={"xl"} show={show}>
            <Header>
                <Title>
                    {"ایجاد رسید انبار جدید"}
                </Title>
            </Header>
            <Body>
                <Container>
                    <Form
                        defaultValues={{
                            warehouseReceiptDate: '',
                            warehouseReceiptDescription: '',
                            warehouseReceiptNumber: '',
                            customerId: '',
                            warehouseReceiptItems: [
                                {
                                    productId: '',
                                    quantity: '',
                                    unitPrice: '',
                                    amount: '',
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
                                        <NumberInput name="warehouseReceiptNumber" label={"شماره رسید"} />
                                    </Col>
                                    <Col>
                                        <DateInput name="warehouseReceiptDate" label={"تاریخ رسید"} />
                                    </Col>
                                </Row>
                               <Row>
                                   <Col>
                                       <AsyncSelectInput
                                           name="customerId"
                                           label={"شناسه مشتری"}
                                           options={customers}
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
                            ایجاد
                        </Button>
                        <Button onClick={handleClose} $variant="warning" type="button">
                            انصراف
                        </Button>
                    </Form>
                    {errorMessage && <ErrorMessage message={errorMessage}/>}
                </Container>
            </Body>
        </CustomModal>
    );
};

export default CreateWarehouseReceiptForm;
