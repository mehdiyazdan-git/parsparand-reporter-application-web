import React, {useEffect, useState} from 'react';
import Table from "../table/Table";
import Modal from "react-bootstrap/Modal";
import useHttp from "../../hooks/useHttp";
import EditWarehouseReceiptForm from "./EditWarehouseReceiptForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from "../../utils/Button";
import ButtonContainer from "../../utils/ButtonContainer";
import {SiMicrosoftexcel} from "react-icons/si";
import FileUpload from "../../utils/FileUpload";
import CreateWarehouseReceiptForm from "./CreateWarehouseReceiptForm";
import {saveAs} from 'file-saver';
import {toShamsi} from "../../utils/functions/toShamsi";
import {useFilters} from "../contexts/FilterContext";
import {formatNumber} from "../../utils/functions/formatNumber";


const WarehouseReceipts = ({shouldNotDisplayCustomerName}) => {
    const [editingWarehouseReceipt, setEditingWarehouseReceipt] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const http = useHttp();
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const { filters,getParams } = useFilters();
    const listName = 'warehouseReceipts';
    const getAllWarehouseReceipts = async () => {
        return await http.get(`/warehouse-receipts?${getParams(listName)}`).then(r => r.data);
    };

    const createWarehouseReceipt = async (data) => {
        return await http.post("/warehouse-receipts", data);
    };

    const updateWarehouseReceipt = async (id, data) => {
        return await http.put(`/warehouse-receipts/${id}`, data);
    };

    const removeWarehouseReceipt = async (id) => {
        return await http.delete(`/warehouse-receipts/${id}`);
    };

    const handleAddWarehouseReceipt = async (newWarehouseReceipt) => {
        try {
            const response = await createWarehouseReceipt(newWarehouseReceipt);
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

    const handleUpdateWarehouseReceipt = async (updatedWarehouseReceipt) => {
        try {
            const response = await updateWarehouseReceipt(updatedWarehouseReceipt.id, updatedWarehouseReceipt);
            if (response.status === 200) {
                setRefreshTrigger(!refreshTrigger);
                setEditingWarehouseReceipt(null);
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

    const handleDeleteWarehouseReceipt = async (id) => {
        await removeWarehouseReceipt(id);
        setRefreshTrigger(!refreshTrigger);
    };

    const columns = [
        { key: 'id', title: 'شناسه', width: '3%', sortable: true },
        { key: 'warehouseReceiptNumber', title: 'شماره حواله', width: '5%', sortable: true, searchable: true },
        { key: 'warehouseReceiptDate', title: 'تاریخ رسید', width: '7%', sortable: true, searchable: true, type: 'date', render: (item) => toShamsi(item.warehouseReceiptDate) },
        { key: 'warehouseReceiptDescription', title: 'توضیحات', width: '40%', sortable: true, searchable: true },
        { key: 'customerName', title: 'مشتری', width: '15%', sortable: true, searchable: true, display:shouldNotDisplayCustomerName },
        { key: 'totalQuantity', title: 'تعداد کل', width: '7%', sortable: true, searchable: true,type: 'number',subtotal : true , render: (item) => formatNumber(item.totalQuantity) },
        { key: 'totalPrice', title: 'مبلغ کل', width: '10%', sortable: true, searchable: true,type: 'number', subtotal : true , render: (item) => formatNumber(item.totalPrice) },
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
        await http.get(`/warehouse-receipts/download-all-warehouse-receipts.xlsx?${getParams(listName)}`, { responseType: 'blob' })
            .then((response) => response.data)
            .then((blobData) => {
                saveAs(blobData, "warehouse_receipts.xlsx");
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
            });
    }

    return (
        <div className="table-container">
            <ButtonContainer
                lastChild={
                    <FileUpload
                        uploadUrl={`/warehouse-receipts/import`}
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
                <CreateWarehouseReceiptForm
                    onCreateWarehouseReceipt={handleAddWarehouseReceipt}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                />
            </ButtonContainer>

            <Table
                columns={columns}
                fetchData={getAllWarehouseReceipts}
                onEdit={(warehouseReceipt) => {
                    setEditingWarehouseReceipt(warehouseReceipt);
                    setEditShowModal(true);
                }}
                onDelete={handleDeleteWarehouseReceipt}
                refreshTrigger={refreshTrigger}
                listName={listName}
                subTotal={true}
                downloadExcelFile={downloadExcelFile}
            />

            {editingWarehouseReceipt && (
                <EditWarehouseReceiptForm
                    warehouseReceipt={editingWarehouseReceipt}
                    show={showEditModal}
                    onUpdateWarehouseReceipt={handleUpdateWarehouseReceipt}
                    onHide={() => {
                        setEditingWarehouseReceipt(null);
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

export default WarehouseReceipts;
