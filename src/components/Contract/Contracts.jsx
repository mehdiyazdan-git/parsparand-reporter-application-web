import React, { useState, useCallback, useMemo } from 'react';
import Table from "../table/Table";
import Modal from "react-bootstrap/Modal";
import useHttp from "../../hooks/useHttp";
import EditContractForm from "./EditContractForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from "../../utils/Button";
import ButtonContainer from "../../utils/ButtonContainer";
import { SiMicrosoftexcel } from "react-icons/si";
import FileUpload from "../../utils/FileUpload";
import CreateContractForm from "./CreateContractForm";
import { saveAs } from 'file-saver';
import { toShamsi } from "../../utils/functions/toShamsi";
import {formatNumber} from "../../utils/functions/formatNumber";
import useFilter from "../contexts/useFilter";

const Contracts = () => {
    const [editingContract, setEditingContract] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const http = useHttp();
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const listName = 'contracts';

    const getAllContracts = async (queryParams) => {
        return await http.get(`/contracts?${queryParams.toString()}`).then(r => r.data);
    }

    const createContract = useCallback(async (data) => {
        return await http.post("/contracts", data);
    }, [http]);

    const updateContract = useCallback(async (id, data) => {
        return await http.put(`/contracts/${id}`, data);
    }, [http]);

    const removeContract = useCallback(async (id) => {
        return await http.delete(`/contracts/${id}`);
    }, [http]);

    const handleAddContract = useCallback(async (newContract) => {
        try {
            const response = await createContract(newContract);
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
    }, [createContract]);

    const handleUpdateContract = useCallback(async (updatedContract) => {
        try {
            const response = await updateContract(updatedContract.id, updatedContract);
            if (response.status === 200) {
                setRefreshTrigger(prev => !prev);
                setEditingContract(null);
                setEditShowModal(false);
            } else {
                setErrorMessage(response.data);
                setShowErrorModal(true);
            }
        } catch (error) {
            setErrorMessage(error.response.data);
            setShowErrorModal(true);
        }
    }, [updateContract]);

    const handleDeleteContract = useCallback(async (id) => {
        await removeContract(id);
        setRefreshTrigger(prev => !prev);
    }, [removeContract]);

    const columns = useMemo(() => [
        { key: 'id', title: 'شناسه', width: '3%', sortable: true },
        { key: 'contractNumber', title: 'شماره قرارداد', width: '7%', sortable: true, searchable: true },
        { key: 'contractDescription', title: 'توضیحات قرارداد', width: '25%', sortable: true, searchable: true },
        { key: 'startDate', title: 'تاریخ شروع', width: '5%', sortable: true, searchable: true, type: 'date', render: (item) => toShamsi(item.startDate) },
        { key: 'endDate', title: 'تاریخ پایان', width: '5%', sortable: true, searchable: true, type: 'date', render: (item) => toShamsi(item.endDate) },
        { key: 'customerName', title: 'شناسه مشتری', width: '15%', sortable: true, searchable: true },
        { key: 'totalQuantity', title: 'تعداد کل', width: '7%', sortable: true, searchable: true,type: 'number',subtotal:true, render: (item) => formatNumber(item.totalQuantity) },
        { key: 'totalPrice', title: 'مبلغ کل', width: '10%', sortable: true, searchable: true,type: 'number',subtotal:true, render: (item) => formatNumber(item.totalPrice) },
    ], []);

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
        await http.get(`/contracts/download-all-contracts.xlsx?${getParams(listName)}&exportAll=${exportAll}`, { responseType: 'blob' })
            .then((response) => response.data)
            .then((blobData) => {
                saveAs(blobData, "contracts.xlsx");
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
            });
    }, [http]);

    return (
        <div className="table-container">
            <ButtonContainer lastChild={<FileUpload uploadUrl={`/contracts/import`} refreshTrigger={refreshTrigger} setRefreshTrigger={setRefreshTrigger} />}>
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
                <CreateContractForm
                    onCreateContract={handleAddContract}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                />
            </ButtonContainer>

            <Table
                columns={columns}
                fetchData={getAllContracts}
                onEdit={(contract) => {
                    setEditingContract(contract);
                    setEditShowModal(true);
                }}
                onDelete={handleDeleteContract}
                refreshTrigger={refreshTrigger}
                listName={listName}
                updateFilter={updateFilter}
                filter={filter}
                getParams={getParams}
                getJalaliYear={getJalaliYear}
                downloadExcelFile={downloadExcelFile}
                hasSubTotal={true}
                hasYearSelect={true}
            />

            {editingContract && (
                <EditContractForm
                    contract={editingContract}
                    show={showEditModal}
                    onUpdateContract={handleUpdateContract}
                    onHide={() => {
                        setEditingContract(null);
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

export default React.memo(Contracts);
