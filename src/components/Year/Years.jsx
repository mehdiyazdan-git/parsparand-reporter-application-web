import React, { useEffect, useState } from 'react';
import Table from "../table/Table";
import Modal from "react-bootstrap/Modal";
import useHttp from "../../hooks/useHttp";
import EditYearForm from "./EditYearForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from "../../utils/Button";
import ButtonContainer from "../../utils/ButtonContainer";
import { SiMicrosoftexcel } from "react-icons/si";
import FileUpload from "../../utils/FileUpload";
import CreateYearForm from "./CreateYearForm";
import { saveAs } from 'file-saver';

const Years = () => {
    const [editingYear, setEditingYear] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const http = useHttp();
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);

    const getAllYears = async (queryParams) => {
        return await http.get(`/years?${queryParams.toString()}`).then(r => r.data);
    };

    const createYear = async (data) => {
        return await http.post("/years", data);
    };

    const updateYear = async (id, data) => {
        return await http.put(`/years/${id}`, data);
    };

    const removeYear = async (id) => {
        return await http.delete(`/years/${id}`);
    };

    const handleAddYear = async (newYear) => {
        try {
            const response = await createYear(newYear);
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

    const handleUpdateYear = async (updatedYear) => {
        try {
            const response = await updateYear(updatedYear.id, updatedYear);
            if (response.status === 200) {
                setRefreshTrigger(!refreshTrigger);
                setEditingYear(null);
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

    const handleDeleteYear = async (id) => {
        await removeYear(id);
        setRefreshTrigger(!refreshTrigger);
    };

    const columns = [
        { key: 'id', title: 'شناسه', width: '10%', sortable: true },
        { key: 'name', title: 'نام سال', width: '90%', sortable: true, searchable: true },
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
        await http.get('/years/download-all-years.xlsx', { responseType: 'blob' })
            .then((response) => response.data)
            .then((blobData) => {
                saveAs(blobData, "years.xlsx");
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
            });
    }

    return (
        <div className="table-container">
            <ButtonContainer lastChild={<FileUpload uploadUrl={`/years/import`} refreshTrigger={refreshTrigger} setRefreshTrigger={setRefreshTrigger} />}>
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
                <CreateYearForm
                    onCreateYear={handleAddYear}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                />
            </ButtonContainer>

            <Table
                columns={columns}
                fetchData={getAllYears}
                onEdit={(year) => {
                    setEditingYear(year);
                    setEditShowModal(true);
                }}
                onDelete={handleDeleteYear}
                refreshTrigger={refreshTrigger}
            />

            {editingYear && (
                <EditYearForm
                    year={editingYear}
                    show={showEditModal}
                    onUpdateYear={handleUpdateYear}
                    onHide={() => {
                        setEditingYear(null);
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

export default Years;
