import React, { useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Modal, Row } from "react-bootstrap";
import * as Yup from "yup";
import Button from "../../utils/Button";
import { TextInput } from "../../utils/TextInput";
import DateInput from "../../utils/DateInput";
import { Form } from "../../utils/Form";
import { useYupValidationResolver } from "../../hooks/useYupValidationResolver";
import moment from "jalali-moment";
import SelectInput from "../../utils/SelectInput";
import { useFieldArray, useFormContext } from "react-hook-form";
import { bodyStyle, headerStyle, titleStyle } from "../styles/styles";
import useHttp from "../../hooks/useHttp";

const EditWarehouseReceiptForm = ({ warehouseReceipt, onUpdateWarehouseReceipt, show, onHide }) => {
    const http = useHttp();

    const yearSelect = async (searchQuery) => {
        return await http.get(`/api/years/select?searchQuery=${searchQuery}`).then(r => r.data);
    }

    const customerSelect = async (searchQuery) => {
        return await http.get(`/api/customers/select?searchQuery=${searchQuery}`).then(r => r.data);
    }

    const productSelect = async (searchQuery) => {
        return await http.get(`/api/products/select?searchQuery=${searchQuery}`).then(r => r.data);
    }

    const validationSchema = Yup.object().shape({
        warehouseReceiptDate: Yup.string().required('تاریخ رسید الزامیست.'),
        warehouseReceiptDescription: Yup.string().required('توضیحات الزامیست.'),
        warehouseReceiptNumber: Yup.string().required('شماره رسید الزامیست.'),
        customerId: Yup.number().required('شناسه مشتری الزامیست.'),
        yearId: Yup.number().required('سال الزامیست.'),
        warehouseReceiptItems: Yup.array().of(
            Yup.object().shape({
                productId: Yup.number().required('شناسه محصول الزامیست.'),
                quantity: Yup.number().required('مقدار الزامیست.'),
                unitPrice: Yup.number().required('قیمت واحد الزامیست.'),
                amount: Yup.number().required('مجموع الزامیست.'),
            })
        )
    });

    const resolver = useYupValidationResolver(validationSchema);

    const onSubmit = (data) => {
        if (data.warehouseReceiptDate) {
            data.warehouseReceiptDate = moment(new Date(data.warehouseReceiptDate)).format('YYYY-MM-DD');
        }
        onUpdateWarehouseReceipt(data);
        onHide();
    };

    const { control, watch, setValue } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'warehouseReceiptItems',
    });

    const warehouseReceiptItems = watch('warehouseReceiptItems');

    useEffect(() => {
        warehouseReceiptItems.forEach((item, index) => {
            const quantity = item.quantity || 0;
            const unitPrice = item.unitPrice || 0;
            const amount = quantity * unitPrice;
            setValue(`warehouseReceiptItems[${index}].amount`, amount);
        });
    }, [warehouseReceiptItems, setValue]);

    const addItem = () => {
        append({
            productId: '',
            quantity: '',
            unitPrice: '',
            amount: '',
        });
    };

    const removeItem = (index) => {
        remove(index);
    };

    return (
        <Modal size={"xl"} show={show} onHide={onHide}>
            <Modal.Header style={headerStyle} closeButton>
                <Modal.Title style={titleStyle}>
                    {`رسید انبار شماره ${warehouseReceipt?.warehouseReceiptNumber}`}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={bodyStyle}>
                <div className="container modal-body" style={{ fontFamily: "IRANSans", fontSize: "0.8rem", margin: "0" }}>
                    <Form
                        defaultValues={warehouseReceipt}
                        onSubmit={onSubmit}
                        resolver={resolver}
                    >
                        <Row>
                            <Col>
                                <DateInput name="warehouseReceiptDate" label={"تاریخ رسید"} />
                                <TextInput name="warehouseReceiptDescription" label={"توضیحات"} />
                                <TextInput name="warehouseReceiptNumber" label={"شماره رسید"} />
                                <SelectInput name="customerId" label={"شناسه مشتری"} loadOptions={customerSelect} />
                                <SelectInput name="yearId" label={"سال"} loadOptions={yearSelect} />
                            </Col>
                        </Row>
                        <hr />
                        <h5>اقلام رسید انبار</h5>
                        <table className="table table-bordered">
                            <thead>
                            <tr>
                                <th>شناسه محصول</th>
                                <th>مقدار</th>
                                <th>قیمت واحد</th>
                                <th>مجموع</th>
                                <th>عملیات</th>
                            </tr>
                            </thead>
                            <tbody>
                            {fields.map((field, index) => (
                                <tr key={field.id}>
                                    <td>
                                        <SelectInput name={`warehouseReceiptItems[${index}].productId`} loadOptions={productSelect} />
                                    </td>
                                    <td>
                                        <TextInput name={`warehouseReceiptItems[${index}].quantity`} />
                                    </td>
                                    <td>
                                        <TextInput name={`warehouseReceiptItems[${index}].unitPrice`} />
                                    </td>
                                    <td>
                                        <TextInput name={`warehouseReceiptItems[${index}].amount`} disabled />
                                    </td>
                                    <td>
                                        <button type="button" className="btn btn-danger" onClick={() => removeItem(index)}>
                                            حذف
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <Button type="button" variant="primary" onClick={addItem}>
                            افزودن آیتم
                        </Button>
                        <Button variant="success" type="submit">
                            ویرایش
                        </Button>
                        <Button onClick={onHide} variant="warning" type="button">
                            انصراف
                        </Button>
                    </Form>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default EditWarehouseReceiptForm;
