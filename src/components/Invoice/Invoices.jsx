import React, { useEffect, useState } from 'react';
import Table from "../table/Table";
import Modal from "react-bootstrap/Modal";
import useHttp from "../../hooks/useHttp";
import moment from "jalali-moment";
import EditInvoiceForm from "./EditInvoiceForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from "../../utils/Button";
import ButtonContainer from "../../utils/ButtonContainer";
import { SiMicrosoftexcel } from "react-icons/si";
import FileUpload from "../../utils/FileUpload";
import CreateInvoiceForm from "./CreateInvoiceForm";
import { saveAs } from 'file-saver';

const toShamsi = (date) => {
    return date ? moment(date, 'YYYY-MM-DD').format('jYYYY/jMM/jDD') : '';
};

const Invoices = () => {
    const [editingInvoice, setEditingInvoice] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const http = useHttp();
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);

    const getAllInvoices = async (queryParams) => {
        return await http.get(`/invoices?${queryParams.toString()}`).then(r => r.data);
    };

    const createInvoice = async (data) => {
        return await http.post("/invoices", data);
    };

    const updateInvoice = async (id, data) => {
        return await http.put(`/invoices/${id}`, data);
    };

    const removeInvoice = async (id) => {
        return await http.delete(`/invoices/${id}`);
    };

    const handleAddInvoice = async (newInvoice) => {
        try {
            const response = await createInvoice(newInvoice);
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

    const handleUpdateInvoice = async (updatedInvoice) => {
        try {
            const response = await updateInvoice(updatedInvoice.id, updatedInvoice);
            if (response.status === 200) {
                setRefreshTrigger(!refreshTrigger);
                setEditingInvoice(null);
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

    const handleDeleteInvoice = async (id) => {
        await removeInvoice(id);
        setRefreshTrigger(!refreshTrigger);
    };

    const columns = [
        { key: 'id', title: 'شناسه', width: '5%', sortable: true },
        { key: 'invoiceNumber', title: 'شماره فاکتور', width: '15%', sortable: true, searchable: true },
        { key: 'issuedDate', title: 'تاریخ صدور', width: '15%', sortable: true, searchable: true, type: 'date', render: (item) => toShamsi(item.issuedDate) },
        { key: 'contractContractNumber', title: 'شماره قرارداد', width: '15%', sortable: true, searchable: true },
        { key: 'salesType', title: 'نوع فروش', width: '10%', sortable: true, searchable: true },
        { key: 'customerName', title: 'نام مشتری', width: '15%', sortable: true, searchable: true },
        { key: 'invoiceStatusName', title: 'وضعیت فاکتور', width: '10%', sortable: true, searchable: true },
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
        await http.get('/invoices/download-all-invoices.xlsx', { responseType: 'blob' })
            .then((response) => response.data)
            .then((blobData) => {
                saveAs(blobData, "invoices.xlsx");
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
            });
    }

    return (
        <div className="table-container">
            <ButtonContainer lastChild={<FileUpload uploadUrl={`/invoices/import`} refreshTrigger={refreshTrigger} setRefreshTrigger={setRefreshTrigger} />}>
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
                <CreateInvoiceForm
                    onCreateInvoice={handleAddInvoice}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                />
            </ButtonContainer>

            <Table
                columns={columns}
                fetchData={getAllInvoices}
                onEdit={(invoice) => {
                    setEditingInvoice(invoice);
                    setEditShowModal(true);
                }}
                onDelete={handleDeleteInvoice}
                refreshTrigger={refreshTrigger}
            />

            {editingInvoice && (
                <EditInvoiceForm
                    invoice={editingInvoice}
                    show={showEditModal}
                    onUpdateInvoice={handleUpdateInvoice}
                    onHide={() => {
                        setEditingInvoice(null);
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

export default Invoices;
