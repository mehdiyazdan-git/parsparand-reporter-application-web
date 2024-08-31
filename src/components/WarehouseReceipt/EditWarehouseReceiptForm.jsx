import React from 'react';
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

const EditWarehouseReceiptForm = ({editingEntity, onUpdateEntity, show, onHide}) => {

    const validationSchema = Yup.object().shape({
        warehouseReceiptDate: Yup.date().required("تاریخ رسید انبار الزامی است"),
        warehouseReceiptDescription: Yup.string().required("توضیحات رسید انبار الزامی است"),
        warehouseReceiptNumber: Yup.number().typeError("شماره رسید انبار الزامی است").required("شماره رسید انبار الزامی است"),
        customerId: Yup.number().typeError("نام مشتری الزامی است").required("نام مشتری الزامی است"),
        warehouseReceiptItems: Yup.array().of(
            Yup.object().shape({
                quantity: Yup.number().typeError("مقدار الزامی است").required("مقدار الزامی است"),
                unitPrice: Yup.number().typeError("قیمت واحد الزامی است").required("قیمت واحد الزامی است"),
                productId: Yup.number().typeError("نام محصول الزامی است").required("نام محصول الزامی است"),
            })
        ).length(1, "حداقل یک آیتم کالا الزامی است")
    });

    const resolver = useYupValidationResolver(validationSchema);

    const onSubmit = async (data) => {
        if (data.warehouseReceiptDate) {
            data.warehouseReceiptDate = moment(new Date(data.warehouseReceiptDate)).format('YYYY-MM-DD');
        }
        console.log(data);
        await onUpdateEntity(data);
        onHide();
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
                                            url={"customers/select"}
                                            value={editingEntity?.customerId}
                                        />
                                    </Col>
                                </Row>
                                <TextInput
                                    name="warehouseReceiptDescription"
                                    label={"توضیحات"}
                                />
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
                </Container>
            </Body>
        </CustomModal>
    );
};

export default EditWarehouseReceiptForm;
