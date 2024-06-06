import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Table from "../table/Table";
import Modal from "react-bootstrap/Modal";
import useHttp from "../../hooks/useHttp";
import EditReportForm from "./EditReportForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from "../../utils/Button";
import ButtonContainer from "../../utils/ButtonContainer";
import { SiMicrosoftexcel } from "react-icons/si";
import FileUpload from "../../utils/FileUpload";
import CreateReportForm from "./CreateReportForm";
import { saveAs } from 'file-saver';
import { toShamsi } from "../../utils/functions/toShamsi";
import { useFilters } from "../contexts/FilterContext";
import {formatNumber} from "../../utils/functions/formatNumber";

const Reports = () => {
    const [editingReport, setEditingReport] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const http = useHttp();
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const { filters, getParams , setFilter } = useFilters();
    const listName = 'reports';

    const getAllReports = useCallback(async (queryParams) => {
        if (filters.years?.jalaliYear && filters.years.jalaliYear.label) {
            queryParams.append('jalaliYear', `${filters.years.jalaliYear.label}`);
        }
        console.log(queryParams.toString())
        return await http.get(`/reports?${queryParams.toString()}`).then(r => r.data);
    }, [filters]);

    // useEffect(() => {
    //     setRefreshTrigger(prev => !prev);
    // }, [filters]);

    const createReport = useCallback(async (data) => {
        return await http.post("/reports", data);
    }, [http]);

    const updateReport = useCallback(async (id, data) => {
        return await http.put(`/reports/${id}`, data);
    }, [http]);

    const removeReport = useCallback(async (id) => {
        return await http.delete(`/reports/${id}`);
    }, [http]);

    const handleAddReport = useCallback(async (newReport) => {
        try {
            const response = await createReport(newReport);
            if (response.status === 201) {
                setRefreshTrigger(prev => !prev);
                setShowModal(false);
            } else {
                setErrorMessage(response.data);
                setShowErrorModal(true);
            }
        } catch (error) {
            setErrorMessage(error.response.data);
            setShowErrorModal(true);
        }
    }, [createReport]);

    const handleUpdateReport = useCallback(async (updatedReport) => {
        try {
            const response = await updateReport(updatedReport.id, updatedReport);
            if (response.status === 200) {
                setRefreshTrigger(prev => !prev);
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
    }, [updateReport]);

    const handleDeleteReport = useCallback(async (id) => {
        await removeReport(id);
        setRefreshTrigger(prev => !prev);
    }, [removeReport]);

    const columns = useMemo(() => [
        { key: 'id', title: 'شناسه', width: '5%', sortable: true, searchable: true },
        { key: 'reportDate', title: 'تاریخ', width: '10%', sortable: true, searchable: true, type: 'date', render: (item) => toShamsi(item.reportDate) },
        { key: 'reportExplanation', title: 'توضیحات', width: '40%', sortable: true, searchable: true },
        { key: 'totalQuantity', title: 'تعداد کل', width: '7%', sortable: true, searchable: true,type: 'number', subtotal:true, render: (item) => formatNumber(item.totalQuantity) },
        { key: 'totalPrice', title: 'مبلغ کل', width: '10%', sortable: true, searchable: true,type: 'number', subtotal :true , render: (item) => formatNumber(item.totalPrice) },

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

    const downloadExcelFile = useCallback(async (exportAll) => {
        await http.get(`/reports/download-all-reports.xlsx?${getParams(listName)}&exportAll=${exportAll}`, { responseType: 'blob' })
            .then((response) => response.data)
            .then((blobData) => {
                saveAs(blobData, "reports.xlsx");
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
            });
    }, [http]);

    return (
        <div className="table-container">
            <ButtonContainer
                lastChild={
                    <FileUpload
                        uploadUrl={`/reports/import`}
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
                listName={listName}
                subTotal={true}
                downloadExcelFile={downloadExcelFile}
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

export default React.memo(Reports);
