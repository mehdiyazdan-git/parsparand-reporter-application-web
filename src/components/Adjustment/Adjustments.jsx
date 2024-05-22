import React, { useState } from 'react';
import Table from "../table/Table";
import Modal from "react-bootstrap/Modal";
import useHttp from "../../hooks/useHttp";
import moment from "jalali-moment";
import EditAdjustmentForm from "./EditAdjustmentForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from "../../utils/Button";
import ButtonContainer from "../../utils/ButtonContainer";
import { SiMicrosoftexcel } from "react-icons/si";
import FileUpload from "../../utils/FileUpload";
import CreateAdjustmentForm from "./CreateAdjustmentForm";
import { saveAs } from 'file-saver';
import {toShamsi} from "../../utils/functions/toShamsi";


const Adjustments = () => {
    const [editingAdjustment, setEditingAdjustment] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const http = useHttp();
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);

    const getAllAdjustments = async (queryParams) => {
        return await http.get(`/adjustments?${queryParams.toString()}`).then(r => r.data);
    };

    const createAdjustment = async (data) => {
        return await http.post("/adjustments", data);
    };

    const updateAdjustment = async (id, data) => {
        return await http.put(`/adjustments/${id}`, data);
    };

    const removeAdjustment = async (id) => {
        return await http.delete(`/adjustments/${id}`);
    };

    const handleAddAdjustment = async (newAdjustment) => {
        try {
            const response = await createAdjustment(newAdjustment);
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

    const handleUpdateAdjustment = async (updatedAdjustment) => {
        try {
            const response = await updateAdjustment(updatedAdjustment.id, updatedAdjustment);
            if (response.status === 200) {
                setRefreshTrigger(!refreshTrigger);
                setEditingAdjustment(null);
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

    const handleDeleteAdjustment = async (id) => {
        await removeAdjustment(id);
        setRefreshTrigger(!refreshTrigger);
    };

    const columns = [
        { key: 'id', title: 'شناسه', width: '5%', sortable: true },
        { key: 'adjustmentNumber', title: 'شماره تعدیل', width: '15%', sortable: true, searchable: true },
        {
            key: 'adjustmentDate',
            title: 'تاریخ تعدیل',
            width: '15%',
            sortable: true,
            searchable: true,
            type: 'date',
            render: (item) => toShamsi(item.adjustmentDate) },
        { key: 'description', title: 'توضیحات', width: '25%', sortable: true, searchable: true },
        { key: 'unitPrice', title: 'قیمت واحد', width: '10%', sortable: true, searchable: true },
        { key: 'quantity', title: 'مقدار', width: '10%', sortable: true, searchable: true },
        { key: 'adjustmentType', title: 'نوع تعدیل', width: '10%', sortable: true, searchable: true },
        { key: 'invoiceNumber', title: 'شماره فاکتور', width: '10%', sortable: true, searchable: true },
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
        await http.get('/adjustments/download-all-adjustments.xlsx', { responseType: 'blob' })
            .then((response) => response.data)
            .then((blobData) => {
                saveAs(blobData, "adjustments.xlsx");
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
            });
    }

    return (
        <div className="table-container">
            <ButtonContainer lastChild={<FileUpload uploadUrl={`/adjustments/import`} refreshTrigger={refreshTrigger} setRefreshTrigger={setRefreshTrigger} />}>
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
                <CreateAdjustmentForm
                    onCreateAdjustment={handleAddAdjustment}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                />
            </ButtonContainer>

            <Table
                columns={columns}
                fetchData={getAllAdjustments}
                onEdit={(adjustment) => {
                    setEditingAdjustment(adjustment);
                    setEditShowModal(true);
                }}
                onDelete={handleDeleteAdjustment}
                refreshTrigger={refreshTrigger}
            />

            {editingAdjustment && (
                <EditAdjustmentForm
                    adjustment={editingAdjustment}
                    show={showEditModal}
                    onUpdateAdjustment={handleUpdateAdjustment}
                    onHide={() => {
                        setEditingAdjustment(null);
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

export default Adjustments;

