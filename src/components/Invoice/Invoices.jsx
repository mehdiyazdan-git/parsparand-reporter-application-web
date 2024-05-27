import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Table from "../table/Table";
import Modal from "react-bootstrap/Modal";
import useHttp from "../../hooks/useHttp";
import EditInvoiceForm from "./EditInvoiceForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from "../../utils/Button";
import ButtonContainer from "../../utils/ButtonContainer";
import { SiMicrosoftexcel } from "react-icons/si";
import FileUpload from "../../utils/FileUpload";
import CreateInvoiceForm from "./CreateInvoiceForm";
import { saveAs } from 'file-saver';
import { toShamsi } from "../../utils/functions/toShamsi";
import { useFilters } from "../contexts/FilterContext";

const Invoices = () => {
    const [editingInvoice, setEditingInvoice] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const http = useHttp();
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const { filters , getParams } = useFilters();
    const listName = 'invoices';

    const getAllInvoices = useCallback(async (queryParams) => {
        if (filters.years?.jalaliYear && filters.years.jalaliYear.label) {
            queryParams.append('jalaliYear', `${filters.years.jalaliYear.label}`);
        }
        return await http.get(`/invoices?${queryParams.toString()}`).then(r => r.data);
    }, [filters, http]);

    useEffect(() => {
        setRefreshTrigger(prev => !prev);
    }, [filters]);

    const createInvoice = useCallback(async (data) => {
        return await http.post("/invoices", data);
    }, [http]);

    const updateInvoice = useCallback(async (id, data) => {
        return await http.put(`/invoices/${id}`, data);
    }, [http]);

    const removeInvoice = useCallback(async (id) => {
        return await http.delete(`/invoices/${id}`);
    }, [http]);

    const handleAddInvoice = useCallback(async (newInvoice) => {
        try {
            const response = await createInvoice(newInvoice);
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
    }, [createInvoice]);

    const handleUpdateInvoice = useCallback(async (updatedInvoice) => {
        try {
            const response = await updateInvoice(updatedInvoice.id, updatedInvoice);
            if (response.status === 200) {
                setRefreshTrigger(prev => !prev);
                setEditingInvoice(null);
                setEditShowModal(false);
            }
        } catch (error) {
            setErrorMessage(error.response.data);
            setShowErrorModal(true);
        }
    }, [updateInvoice]);

    const handleDeleteInvoice = useCallback(async (id) => {
        await removeInvoice(id);
        setRefreshTrigger(prev => !prev);
    }, [removeInvoice]);

    const convertInvoiceStatusIdToCaption = (invoiceStatusId) => {
        const statuses = {
            1: 'سند حسابداری',
            2: 'تایید شده',
            3: 'رد شده',
            4: 'تایید شده توسط مدیر',
            5: 'تایید شده توسط مدیر عامل',
        }
        return statuses[invoiceStatusId] || 'نامشخص';
    }
    const convertSalesTypeToPersianCaption = (salesType) => {
        const types = {
            'CASH_SALES': 'فروش نقدی',
            'CONTRACTUAL_SALES': 'فروش قراردادی',
        }
        return types[salesType] || 'نامشخص';
    }

    const columns = useMemo(() => [
        { key: 'id', title: 'شناسه', width: '5%', sortable: true },
        { key: 'invoiceNumber', title: 'شماره فاکتور', width: '5%', sortable: true, searchable: true },
        { key: 'issuedDate', title: 'تاریخ صدور', width: '5%', sortable: true, searchable: true, type: 'date', render: (item) => toShamsi(item.issuedDate) },
        {
            key: 'salesType',
            title: 'نوع فروش',
            width: '7%',
            sortable: true,
            searchable: true,
            render : (item) => convertSalesTypeToPersianCaption(item.salesType),
            type: 'select',
            options: [{
                value: 'CASH_SALES',
                label: 'فروش نقدی',
            }, {
                value: 'CONTRACTUAL_SALES',
                label: 'فروش قراردادی',
            }]
        },
        { key: 'customerName', title: 'نام مشتری', width: '20%', sortable: true, searchable: true },
        {
            key: 'invoiceStatusId',
            title: 'وضعیت فاکتور',
            width: '5%',
            sortable: true,
            searchable: true,
            render: (item) => convertInvoiceStatusIdToCaption(item.invoiceStatusId),
            type: 'select',
            options: [{
                value: 1,
                label: 'سند حسابداری',
            }, {
                value: 2,
                label: 'تایید شده',
            }, {
                value: 3,
                label: 'رد شده',
            }, {
                value: 4,
                label: 'تایید شده توسط مدیر',
            }, {
                value: 5,
                label: 'تایید شده توسط مدیر عامل',
            },
            ]
        }
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

    const downloadExcelFile = useCallback(async () => {

        await http.get(`/invoices/download-all-invoices.xlsx?${getParams(listName)}`, { responseType: 'blob' })
            .then((response) => response.data)
            .then((blobData) => {
                saveAs(blobData, "invoices.xlsx");
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
            });
    }, [filters, http]);

    return (
        <div className="table-container">
            <ButtonContainer lastChild={
                    <FileUpload
                        uploadUrl={`/invoices/import`}
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
                listName={listName}
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

export default React.memo(Invoices);
