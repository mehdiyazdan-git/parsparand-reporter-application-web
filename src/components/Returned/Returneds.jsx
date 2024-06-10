import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Table from "../table/Table";
import Modal from "react-bootstrap/Modal";
import useHttp from "../../hooks/useHttp";
import EditReturnedForm from "./EditReturnedForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from "../../utils/Button";
import ButtonContainer from "../../utils/ButtonContainer";
import { SiMicrosoftexcel } from "react-icons/si";
import FileUpload from "../../utils/FileUpload";
import CreateReturnedForm from "./CreateReturnedForm";
import { saveAs } from 'file-saver';
import { toShamsi } from "../../utils/functions/toShamsi";
import { useFilters } from "../contexts/FilterContext";

const Returneds = () => {
    const [editingReturned, setEditingReturned] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const http = useHttp();
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const { filters } = useFilters();
    const listName = 'returneds';

    const getAllReturneds = useCallback(async (queryParams) => {
        if (filters.years?.jalaliYear && filters.years.jalaliYear.label) {
            queryParams.append('jalaliYear', `${filters.years.jalaliYear.label}`);
        }
        return await http.get(`/returneds?${queryParams.toString()}`).then(r => r.data);
    }, [filters, http]);

    // useEffect(() => {
    //     setRefreshTrigger(prev => !prev);
    // }, [filters]);

    const createReturned = useCallback(async (data) => {
        return await http.post("/returneds", data);
    }, [http]);

    const updateReturned = useCallback(async (id, data) => {
        return await http.put(`/returneds/${id}`, data);
    }, [http]);

    const removeReturned = useCallback(async (id) => {
        return await http.delete(`/returneds/${id}`);
    }, [http]);

    const handleAddReturned = useCallback(async (newReturned) => {
        try {
            const response = await createReturned(newReturned);
            if (response.status === 201) {
                setRefreshTrigger(prev => !prev);
                setShowModal(false);
            }
        } catch (error) {
            if (error.response){
                setErrorMessage(error.response.data)
                setShowErrorModal(true)
            }else {
                console.error(error);
            }
        }
    }, [createReturned]);

    const handleUpdateReturned = useCallback(async (updatedReturned) => {
        try {
            const response = await updateReturned(updatedReturned.id, updatedReturned);
            if (response.status === 200) {
                setRefreshTrigger(prev => !prev);
                setEditingReturned(null);
                setEditShowModal(false);
            } else {
                setErrorMessage(response.data);
                setShowErrorModal(true);
            }
        } catch (error) {
            setErrorMessage(error.response.data);
            setShowErrorModal(true);
        }
    }, [updateReturned]);

    const handleDeleteReturned = useCallback(async (id) => {
        await removeReturned(id);
        setRefreshTrigger(prev => !prev);
    }, [removeReturned]);

    const columns = useMemo(() => [
        { key: 'id', title: 'شناسه', width: '5%', sortable: true },
        { key: 'returnedNumber', title: 'شماره مرجوعی', width: '15%', sortable: true, searchable: true },
        { key: 'returnedDate', title: 'تاریخ مرجوعی', width: '15%', sortable: true, searchable: true, type: 'date', render: (item) => toShamsi(item.returnedDate) },
        { key: 'returnedDescription', title: 'توضیحات', width: '25%', sortable: true, searchable: true },
        { key: 'quantity', title: 'مقدار', width: '10%', sortable: true, searchable: true },
        { key: 'unitPrice', title: 'قیمت واحد', width: '10%', sortable: true, searchable: true },
        { key: 'customerName', title: 'نام مشتری', width: '15%', sortable: true, searchable: true },
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
        await http.get('/returneds/download-all-returneds.xlsx', { responseType: 'blob' })
            .then((response) => response.data)
            .then((blobData) => {
                saveAs(blobData, "returneds.xlsx");
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
            });
    }, [http]);

    return (
        <div className="table-container">
            <ButtonContainer lastChild={<FileUpload uploadUrl={`/returneds/import`} refreshTrigger={refreshTrigger} setRefreshTrigger={setRefreshTrigger} />}>
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
                <CreateReturnedForm
                    onCreateReturned={handleAddReturned}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                />
            </ButtonContainer>

            <Table
                columns={columns}
                fetchData={getAllReturneds}
                onEdit={(returned) => {
                    setEditingReturned(returned);
                    setEditShowModal(true);
                }}
                onDelete={handleDeleteReturned}
                refreshTrigger={refreshTrigger}
                listName={listName}
            />

            {editingReturned && (
                <EditReturnedForm
                    returned={editingReturned}
                    show={showEditModal}
                    onUpdateReturned={handleUpdateReturned}
                    onHide={() => {
                        setEditingReturned(null);
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

export default React.memo(Returneds);
