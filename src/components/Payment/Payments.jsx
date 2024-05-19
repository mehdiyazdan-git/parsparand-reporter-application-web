import React, { useState } from 'react';
import Table from "../table/Table";
import Modal from "react-bootstrap/Modal";
import useHttp from "../../hooks/useHttp";
import moment from "jalali-moment";
import EditPaymentForm from "./EditPaymentForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from "../../utils/Button";
import ButtonContainer from "../../utils/ButtonContainer";
import { SiMicrosoftexcel } from "react-icons/si";
import FileUpload from "../../utils/FileUpload";
import CreatePaymentForm from "./CreatePaymentForm";
import { saveAs } from 'file-saver';
import {formatNumber} from "../../utils/functions/formatNumber";

const toShamsi = (date) => {
    return date ? moment(date, 'YYYY-MM-DD').format('jYYYY/jMM/jDD') : '';
};

const Payments = () => {
    const [editingPayment, setEditingPayment] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const http = useHttp();
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);

    const getAllPayments = async (queryParams) => {
        return await http.get(`/payments?${queryParams.toString()}`).then(r => {
            console.log(r.data)
           return  r.data
        });
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
                setRefreshTrigger(!refreshTrigger);
                setShowModal(false);
            } else {
                setErrorMessage(response.data);
                setShowErrorModal(true);
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
                setRefreshTrigger(!refreshTrigger);
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
        setRefreshTrigger(!refreshTrigger);
    };

    const columns = [
        { key: 'id', title: 'شناسه', width: '5%', sortable: true },
        { key: 'paymentDescryption', title: 'توضیحات', width: '20%', sortable: true, searchable: true },
        { key: 'paymentDate', title: 'تاریخ', width: '15%', sortable: true, searchable: true, type: 'date', render: (item) => toShamsi(item.paymentDate) },
        { key: 'paymentAmount', title: 'مبلغ', width: '15%', sortable: true, searchable: true, render: item => formatNumber(item.paymentAmount) },
        { key: 'paymentSubject', title: 'موضوع', width: '15%', sortable: true, searchable: true },
        { key: 'customerName', title: 'نام مشتری', width: '15%', sortable: true, searchable: true },
        { key: 'yearName', title: 'سال', width: '10%', sortable: true, searchable: true },
    ];

    const ErrorModal = ({ show, handleClose, errorMessage }) => {
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
    };

    async function downloadExcelFile() {
        await http.get('/payments/download-all-payments.xlsx', { responseType: 'blob' })
            .then((response) => response.data)
            .then((blobData) => {
                saveAs(blobData, "payments.xlsx");
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
            });
    }

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
                    variant="primary"
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

export default Payments;
