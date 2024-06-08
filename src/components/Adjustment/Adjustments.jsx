import React, { useState, useCallback, useMemo } from 'react';
import Table from "../table/Table";
import Modal from "react-bootstrap/Modal";
import useHttp from "../../hooks/useHttp";
import EditAdjustmentForm from "./EditAdjustmentForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from "../../utils/Button";
import ButtonContainer from "../../utils/ButtonContainer";
import { SiMicrosoftexcel } from "react-icons/si";
import FileUpload from "../../utils/FileUpload";
import CreateAdjustmentForm from "./CreateAdjustmentForm";
import { saveAs } from 'file-saver';
import { toShamsi } from "../../utils/functions/toShamsi";
import { useFilters } from "../contexts/FilterContext";
import {formatNumber} from "../../utils/functions/formatNumber";



const Adjustments = ({ customerId }) => {
    const [editingAdjustment, setEditingAdjustment] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const http = useHttp();
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const { filters} = useFilters();
    const listName = 'adjustments';

    const getAllAdjustments = useCallback(async (queryParams) => {
        return await http.get(`/adjustments?${queryParams.toString()}`).then(r => r.data);
    }, [filters, http]);

    const createAdjustment = useCallback(async (data) => {
        return await http.post("/adjustments", data);
    }, [http]);

    const updateAdjustment = useCallback(async (id, data) => {
        return await http.put(`/adjustments/${id}`, data);
    }, [http]);

    const removeAdjustment = useCallback(async (id) => {
        return await http.delete(`/adjustments/${id}`);
    }, [http]);

    const handleAddAdjustment = useCallback(async (newAdjustment) => {
        try {
            const response = await createAdjustment(newAdjustment);
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
    }, [createAdjustment]);

    const handleUpdateAdjustment = useCallback(async (updatedAdjustment) => {
        try {
            const response = await updateAdjustment(updatedAdjustment.id, updatedAdjustment);
            if (response.status === 200) {
                setRefreshTrigger(prev => !prev);
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
    }, [updateAdjustment]);

    const handleDeleteAdjustment = useCallback(async (id) => {
        await removeAdjustment(id);
        setRefreshTrigger(prev => !prev);
    }, [removeAdjustment]);

    const convertToPersianCaption = (subject) => {
        switch (subject) {
            case "POSITIVE":
                return "مثبت";
            case "NEGATIVE":
                return "منفی";
            default:
                return subject;
        }
    }

    const columns = useMemo(() => [
        { key: 'id', title: 'شناسه', width: '2%', sortable: true },
        { key: 'adjustmentNumber', title: 'شماره تعدیل', width: '5%', sortable: true, searchable: true },
        {
            key: 'adjustmentDate',
            title: 'تاریخ تعدیل',
            width: '5%',
            sortable: true,
            searchable: true,
            type: 'date',
            render: (item) => toShamsi(item.adjustmentDate)
        },
        {
            key: 'adjustmentType',
            title: 'نوع تعدیل',
            width: '5%',
            sortable: true,
            searchable: true ,
            render : item => convertToPersianCaption(item.adjustmentType),
            type: 'select',
            options: [
                { value: 'POSITIVE', label: convertToPersianCaption('POSITIVE') },
                { value: 'NEGATIVE', label: convertToPersianCaption('NEGATIVE') },
            ],
        },
        { key: 'invoiceNumber', title: 'شماره فاکتور', width: '5%', sortable: true, searchable: true },
        { key: 'description', title: 'توضیحات', width: '25%', sortable: true, searchable: true },
        {
            key: 'unitPrice',
            title: 'قیمت واحد',
            width: '7%',
            sortable: true,
            searchable: true ,
            render : item => formatNumber(item.unitPrice),
        },
        {
            key: 'quantity',
            title: 'مقدار',
            width: '5%',
            sortable: true,
            searchable: true ,
            render : item => formatNumber(item.quantity),
            subtotal : true,
        },
        {
            key: 'totalPrice',
            title: 'مبلغ کل',
            width: '7%',
            sortable: true,
            searchable: true ,
            render : item => formatNumber(item.totalPrice),
            subtotal : true,
        },

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
        await http.get('/adjustments/download-all-adjustments.xlsx', { responseType: 'blob' })
            .then((response) => response.data)
            .then((blobData) => {
                saveAs(blobData, "adjustments.xlsx");
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
            });
    }, [http]);

    return (
        <div className="table-container">
            <ButtonContainer
                lastChild={<FileUpload uploadUrl={`/adjustments/import`} refreshTrigger={refreshTrigger} setRefreshTrigger={setRefreshTrigger} />}>
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
                listName={listName}
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

export default React.memo(Adjustments);
