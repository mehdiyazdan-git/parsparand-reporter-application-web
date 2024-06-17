import React, { useState } from 'react';
import Table from "../table/Table";
import Modal from "react-bootstrap/Modal";
import useHttp from "../../hooks/useHttp";
import EditInvoiceStatusForm from "./EditInvoiceStatusForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from "../../utils/Button";
import ButtonContainer from "../../utils/ButtonContainer";
import { SiMicrosoftexcel } from "react-icons/si";
import FileUpload from "../../utils/FileUpload";
import CreateInvoiceStatusForm from "./CreateInvoiceStatusForm";
import { saveAs } from 'file-saver';
import useFilter from "../contexts/useFilter";

const InvoiceStatuses = () => {
    const [editingInvoiceStatus, setEditingInvoiceStatus] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const http = useHttp();
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const listName = "invoiceStatuses";

    const getAllInvoiceStatuses = async (queryParams) => {
        return await http.get(`/invoice-statuses?${queryParams.toString()}`).then(r => r.data);
    };

    const createInvoiceStatus = async (data) => {
        return await http.post("/invoice-statuses", data);
    };

    const updateInvoiceStatus = async (id, data) => {
        return await http.put(`/invoice-statuses/${id}`, data);
    };

    const removeInvoiceStatus = async (id) => {
        return await http.delete(`/invoice-statuses/${id}`);
    };

    const handleAddInvoiceStatus = async (newInvoiceStatus) => {
        try {
            const response = await createInvoiceStatus(newInvoiceStatus);
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

    const handleUpdateInvoiceStatus = async (updatedInvoiceStatus) => {
        try {
            const response = await updateInvoiceStatus(updatedInvoiceStatus.id, updatedInvoiceStatus);
            if (response.status === 200) {
                setRefreshTrigger(!refreshTrigger);
                setEditingInvoiceStatus(null);
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

    const handleDeleteInvoiceStatus = async (id) => {
        await removeInvoiceStatus(id);
        setRefreshTrigger(!refreshTrigger);
    };

    const columns = [
        { key: 'id', title: 'شناسه', width: '10%', sortable: true },
        { key: 'name', title: 'نام وضعیت', width: '80%', sortable: true, searchable: true },
    ];
    let searchFields = {};
    columns.forEach(column => {
        if (column.searchable && column.key) {
            if (column.type === 'date' || column.type === 'select' || column.type === 'async-select' || column.type === 'checkbox' || column.type === 'number')   {
                searchFields[column.key] = '';
            }
        }
    });
    const { filter, updateFilter, getParams,getJalaliYear } = useFilter(listName, {
        ...searchFields,
        page: 0,
        size: 5,
        sortBy: "id",
        order: "asc",
        totalPages: 0,
        totalElements: 0,
    });
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
        await http.get('/invoice-statuses/download-all-invoice-statuses.xlsx', { responseType: 'blob' })
            .then((response) => response.data)
            .then((blobData) => {
                saveAs(blobData, "invoice-statuses.xlsx");
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
            });
    }

    return (
        <div className="table-container">
            <ButtonContainer lastChild={<FileUpload uploadUrl={`/invoice-statuses/import`} refreshTrigger={refreshTrigger} setRefreshTrigger={setRefreshTrigger} />}>
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
                <CreateInvoiceStatusForm
                    onCreateInvoiceStatus={handleAddInvoiceStatus}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                />
            </ButtonContainer>

            <Table
                columns={columns}
                fetchData={getAllInvoiceStatuses}
                onEdit={(invoiceStatus) => {
                    setEditingInvoiceStatus(invoiceStatus);
                    setEditShowModal(true);
                }}
                onDelete={handleDeleteInvoiceStatus}
                refreshTrigger={refreshTrigger}
                listName={listName}
                updateFilter={updateFilter}
                filter={filter}
                getParams={getParams}
                getJalaliYear={getJalaliYear}
            />

            {editingInvoiceStatus && (
                <EditInvoiceStatusForm
                    invoiceStatus={editingInvoiceStatus}
                    show={showEditModal}
                    onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
                    onHide={() => {
                        setEditingInvoiceStatus(null);
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

export default InvoiceStatuses;
