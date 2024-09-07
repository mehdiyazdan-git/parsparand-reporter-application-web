
import React, {useEffect, useState} from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button, Form, Row, Col } from 'react-bootstrap';
import AsyncSelectComponent from "../components/templates/AsyncSelectComponent";

const CreateWarehouseReceiptForm = ({ onCreateEntity, show, onHide }) => {
    const [customers,setCustomers] = useState([{id : '',name:''}]);
    const [products,setProducts] = useState([{id : '',name:''}]);
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
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
                },
            ],
        },
    });

    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
        {
            control,
            name: 'warehouseReceiptItems',
        }
    );

    const onSubmit = async (data) => {
        await onCreateEntity(data);
        onHide();
    };
    useEffect(() => {
        fetch('http://localhost:3000/customers')
            .then((response) => response.json())
            .then((data) => setCustomers(data));
        fetch('http://localhost:3000/products')
            .then((response) => response.json())
            .then((data) => setProducts(data));
    }, []);

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
                <Col>
                    <Form.Group controlId="warehouseReceiptDate">
                        <Form.Label>تاریخ حواله انبار</Form.Label>
                        <Form.Control
                            type="date"
                            {...register('warehouseReceiptDate')}
                            isInvalid={!!errors.warehouseReceiptDate}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.warehouseReceiptDate?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="warehouseReceiptNumber">
                        <Form.Label>شماره حواله انبار</Form.Label>
                        <Form.Control
                            type="text"
                            {...register('warehouseReceiptNumber')}
                            isInvalid={!!errors.warehouseReceiptNumber}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.warehouseReceiptNumber?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group controlId="warehouseReceiptDescription">
                        <Form.Label>توضیحات حواله انبار</Form.Label>
                        <Form.Control
                            as="textarea"
                            {...register('warehouseReceiptDescription')}
                            isInvalid={!!errors.warehouseReceiptDescription}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.warehouseReceiptDescription?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group controlId="customerId">
                        <Form.Label>مشتری</Form.Label>
                        <AsyncSelectComponent
                            name="customerId"
                            control={control}
                            options={() => Promise.resolve(customers)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.customerId?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h5>آیتم های حواله انبار</h5>
                    {fields.map((field, index) => (
                        <Row key={field.id}>
                            <Col>
                                <Form.Group controlId={`warehouseReceiptItems.${index}.productId`}>
                                    <Form.Label>کد کالا</Form.Label>
                                    <AsyncSelectComponent
                                        name={`warehouseReceiptItems.${index}.productId`}
                                        control={control}
                                        options={() => Promise.resolve(products)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.warehouseReceiptItems?.[index]?.productId?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId={`warehouseReceiptItems.${index}.quantity`}>
                                    <Form.Label>تعداد</Form.Label>
                                    <Form.Control
                                        type="number"
                                        {...register(`warehouseReceiptItems.${index}.quantity`)}
                                        isInvalid={!!errors.warehouseReceiptItems?.[index]?.quantity}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.warehouseReceiptItems?.[index]?.quantity?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId={`warehouseReceiptItems.${index}.unitPrice`}>
                                    <Form.Label>قیمت واحد</Form.Label>
                                    <Form.Control
                                        type="number"
                                        {...register(`warehouseReceiptItems.${index}.unitPrice`)}
                                        isInvalid={!!errors.warehouseReceiptItems?.[index]?.unitPrice}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.warehouseReceiptItems?.[index]?.unitPrice?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId={`warehouseReceiptItems.${index}.amount`}>
                                    <Form.Label>مبلغ</Form.Label>
                                    <Form.Control
                                        type="number"
                                        {...register(`warehouseReceiptItems.${index}.amount`)}
                                        isInvalid={!!errors.warehouseReceiptItems?.[index]?.amount}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.warehouseReceiptItems?.[index]?.amount?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Button variant="danger" onClick={() => remove(index)}>
                                    حذف
                                </Button>
                            </Col>
                        </Row>
                    ))}
                    <Button variant="success" onClick={() => append({})}>
                        افزودن آیتم جدید
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button variant="primary" type="submit">
                        ثبت حواله انبار
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default CreateWarehouseReceiptForm;

