import React, { useState, useMemo } from 'react';
import Table from "../table/Table";
import Modal from "react-bootstrap/Modal";
import useHttp from "../../hooks/useHttp";
import EditPaymentForm from "./EditPaymentForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from "../../utils/Button";
import ButtonContainer from "../../utils/ButtonContainer";
import { SiMicrosoftexcel } from "react-icons/si";
import FileUpload from "../../utils/FileUpload";
import CreatePaymentForm from "./CreatePaymentForm";
import { saveAs } from 'file-saver';
import { formatNumber } from "../../utils/functions/formatNumber";
import { toShamsi } from "../../utils/functions/toShamsi";

const Payments = ({ customerId }) => {
    const [editingPayment, setEditingPayment] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const http = useHttp();
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const listName = 'payments';


    const getAllPayments = async (queryParams) => {
        return await http.get(`/payments?${queryParams}`)
    };

    const createPayment = async (data) => {
        return await http.post("/payments", data);
    };

    const updatePayment = async (id, data) => {
        return await http.put(`/payments/${id}`, data);
    };

    const removePayment = async (id) => {
        return await http.delete(`/payments/${id}`);
    };

    const handleAddPayment = async (newPayment) => {
        try {
            const response = await createPayment(newPayment);
            if (response.status === 201) {
                setRefreshTrigger(prev => !prev);
                setShowModal(false);
            }
        } catch (error) {
            setErrorMessage(error.response.data);
            setShowErrorModal(true);
        }
    };

    const handleUpdatePayment = async (updatedPayment) => {
        try {
            const response = await updatePayment(updatedPayment.id, updatedPayment);
            if (response.status === 200) {
                setRefreshTrigger(prev => !prev);
                setEditingPayment(null);
                setEditShowModal(false);
            } else {
                setErrorMessage(response.data);
                setShowErrorModal(true);
            }
        } catch (error) {
            setErrorMessage(error.response.data);
            setShowErrorModal(true);
        }
    };

    const handleDeletePayment = async (id) => {
        await removePayment(id);
        setRefreshTrigger(prev => !prev);
    };

    const convertToPersianSubject = (subject) => {
        switch (subject) {
            case "PRODUCT":
                return "محصول";
            case "INSURANCEDEPOSIT":
                return "سپرده بیمه";
            case "PERFORMANCEBOUND":
                return "حسن انجام کار";
            case "ADVANCEDPAYMENT":
                return "پیش پرداخت";
            default:
                return subject;
        }
    };

    const columns = useMemo(() => [
        { key: 'id', title: 'شناسه', width: '5%', sortable: true },
        { key: 'paymentDescription', title: 'توضیحات', width: '14rem', sortable: true, searchable: true },
        { key: 'paymentDate', title: 'تاریخ', width: '11%', sortable: true, searchable: true, type: 'date', render: (item) => toShamsi(item.paymentDate) },
        {
            key: 'paymentSubject',
            title: 'موضوع',
            width: '15%',
            sortable: true,
            searchable: true,
            render : item => convertToPersianSubject(item.paymentSubject),
            type : 'select',
            options : [
                    { value: "PRODUCT", label: 'محصول' },
                    { value: "INSURANCEDEPOSIT", label: 'سپرده بیمه' },
                    { value: "PERFORMANCEBOUND", label: 'حسن انجام کار' },
                    { value: "ADVANCEDPAYMENT", label: 'پیش پرداخت' },
                ]
        },
        { key: 'customerName', title: 'نام مشتری', width: '15%', sortable: true, searchable: true },
        { key: 'paymentAmount', title: 'مبلغ', width: '12%', sortable: true, searchable: true,subtotal :true , render: item => formatNumber(item.paymentAmount) },
    ], []);


    const ErrorModal = useMemo(() => ({ show, handleClose, errorMessage }) => {
        return (
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Body
                    className="text-center"
                    style={{ fontFamily: "IRANSans", fontSize: "0.8rem", padding: "20px", fontWeight: "bold" }}>
                    <div className="text-danger">{errorMessage}</div>
                    <button className="btn btn-primary btn-sm mt-4" onClick={handleClose}>
                        بستن
                    </button>
                </Modal.Body>
            </Modal>
        );
    }, []);

    const downloadExcelFile = async (queryParams,exportAll) => {
        console.log(queryParams, `exportAll=${exportAll}`);
        await http.get(`/payments/download-all-payments.xlsx?${queryParams}&exportAll=${exportAll}`, { responseType: 'blob' })
            .then((response) => response.data)
            .then((blobData) => {
                saveAs(blobData, "payments.xlsx");
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
            });
    };


    return (
        <div className="table-container">
            <ButtonContainer
                lastChild={
                    <FileUpload
                        uploadUrl={`/payments/import`}
                        refreshTrigger={refreshTrigger}
                        setRefreshTrigger={setRefreshTrigger}
                    />
                }
            >
                <Button
                    $variant="primary"
                    onClick={() => setShowModal(true)}
                >
                    جدید
                </Button>
                <SiMicrosoftexcel
                    onClick={downloadExcelFile}
                    size={"2.2rem"}
                    className={"m-1"}
                    color={"#41941a"}
                    type="button"
                />
                <CreatePaymentForm
                    onCreatePayment={handleAddPayment}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                />
            </ButtonContainer>

            <Table
                columns={columns}
                fetchData={getAllPayments}
                onEdit={(payment) => {
                    setEditingPayment(payment);
                    setEditShowModal(true);
                }}
                onDelete={handleDeletePayment}
                refreshTrigger={refreshTrigger}
                listName={listName}
                downloadExcelFile={downloadExcelFile}
                hasSubTotal={true}
                hasYearSelect={true}
            />

            {editingPayment && (
                <EditPaymentForm
                    payment={editingPayment}
                    show={showEditModal}
                    onUpdatePayment={handleUpdatePayment}
                    onHide={() => {
                        setEditingPayment(null);
                        setEditShowModal(false);
                    }}
                />
            )}

            <ErrorModal
                show={showErrorModal}
                handleClose={() => setShowErrorModal(false)}
                errorMessage={errorMessage}
            />
        </div>
    );
};

export default React.memo(Payments);
