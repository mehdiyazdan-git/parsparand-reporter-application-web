import React, { useEffect, useState } from 'react';
import Table from "../table/Table";
import Modal from "react-bootstrap/Modal";
import useHttp from "../../hooks/useHttp";
import moment from "jalali-moment";
import EditReportForm from "./EditReportForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from "../../utils/Button";
import ButtonContainer from "../../utils/ButtonContainer";
import { SiMicrosoftexcel } from "react-icons/si";
import FileUpload from "../../utils/FileUpload";
import CreateReportForm from "./CreateReportForm";
import { saveAs } from 'file-saver';

const toShamsi = (date) => {
    return date ? moment(date, 'YYYY-MM-DD').format('jYYYY/jMM/jDD') : '';
};

const Reports = () => {
    const [editingReport, setEditingReport] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const http = useHttp();
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);

    const getAllReports = async (queryParams) => {
        return await http.get(`/reports?${queryParams.toString()}`).then(r => r.data);
    };

    const createReport = async (data) => {
        return await http.post("/reports", data);
    };

    const updateReport = async (id, data) => {
        return await http.put(`/reports/${id}`, data);
    };

    const removeReport = async (id) => {
        return await http.delete(`/reports/${id}`);
    };

    const handleAddReport = async (newReport) => {
        try {
            const response = await createReport(newReport);
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

    const handleUpdateReport = async (updatedReport) => {
        try {
            const response = await updateReport(updatedReport.id, updatedReport);
            if (response.status === 200) {
                setRefreshTrigger(!refreshTrigger);
                setEditingReport(null);
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

    const handleDeleteReport = async (id) => {
        await removeReport(id);
        setRefreshTrigger(!refreshTrigger);
    };

    const columns = [
        { key: 'id', title: 'شناسه', width: '5%', sortable: true },
        { key: 'date', title: 'تاریخ', width: '15%', sortable: true, searchable: true, type: 'date', render: (item) => toShamsi(item.date) },
        { key: 'explanation', title: 'توضیحات', width: '25%', sortable: true, searchable: true },
        { key: 'yearName', title: 'سال', width: '15%', sortable: true, searchable: true },
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
        await http.get('/reports/download-all-reports.xlsx', { responseType: 'blob' })
            .then((response) => response.data)
            .then((blobData) => {
                saveAs(blobData, "reports.xlsx");
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
            });
    }

    return (
        <div className="table-container">
            <ButtonContainer lastChild={<FileUpload uploadUrl={`/reports/import`} refreshTrigger={refreshTrigger} setRefreshTrigger={setRefreshTrigger} />}>
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
                <CreateReportForm
                    onCreateReport={handleAddReport}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                />
            </ButtonContainer>

            <Table
                columns={columns}
                fetchData={getAllReports}
                onEdit={(report) => {
                    setEditingReport(report);
                    setEditShowModal(true);
                }}
                onDelete={handleDeleteReport}
                refreshTrigger={refreshTrigger}
            />

            {editingReport && (
                <EditReportForm
                    report={editingReport}
                    show={showEditModal}
                    onUpdateReport={handleUpdateReport}
                    onHide={() => {
                        setEditingReport(null);
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

export default Reports;
