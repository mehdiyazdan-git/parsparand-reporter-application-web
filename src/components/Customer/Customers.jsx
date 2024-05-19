import React, { useState } from 'react';
import Table from "../table/Table";
import Modal from "react-bootstrap/Modal";
import useHttp from "../../hooks/useHttp";
import EditCustomerForm from "./EditCustomerForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from "../../utils/Button";
import ButtonContainer from "../../utils/ButtonContainer";
import { SiMicrosoftexcel } from "react-icons/si";
import FileUpload from "../../utils/FileUpload";
    import CreateCustomerForm from "./CreateCustomerForm";
import { saveAs } from 'file-saver';

const Customers = () => {
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const http = useHttp();
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);

    const getAllCustomers = async (queryParams) => {
        return await http.get(`/customers?${queryParams.toString()}`).then(r => r.data);
    };

    const createCustomer = async (data) => {
        return await http.post("/customers", data);
    };

    const updateCustomer = async (id, data) => {
        return await http.put(`/customers/${id}`, data);
    };

    const removeCustomer = async (id) => {
        return await http.delete(`/customers/${id}`);
    };

    const handleAddCustomer = async (newCustomer) => {
        try {
            const response = await createCustomer(newCustomer);
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

    const handleUpdateCustomer = async (updatedCustomer) => {
        try {
            const response = await updateCustomer(updatedCustomer.id, updatedCustomer);
            if (response.status === 200) {
                setRefreshTrigger(!refreshTrigger);
                setEditingCustomer(null);
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

    const handleDeleteCustomer = async (id) => {
        await removeCustomer(id);
        setRefreshTrigger(!refreshTrigger);
    };

    const columns = [
        { key: 'id', title: 'شناسه', width: '5%', sortable: true },
        { key: 'name', title: 'نام', width: '15%', sortable: true, searchable: true },
        { key: 'phone', title: 'تلفن', width: '15%', sortable: true, searchable: true },
        { key: 'customerCode', title: 'کد مشتری', width: '15%', sortable: true, searchable: true },
        { key: 'economicCode', title: 'کد اقتصادی', width: '15%', sortable: true, searchable: true },
        { key: 'nationalCode', title: 'کد ملی', width: '15%', sortable: true, searchable: true },
        { key: 'bigCustomer', title: 'مشتری بزرگ', width: '10%', sortable: true, searchable: true, render: (item) => item.bigCustomer ? 'بله' : 'خیر' },
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
        await http.get('/customers/download-all-customers.xlsx', { responseType: 'blob' })
            .then((response) => response.data)
            .then((blobData) => {
                saveAs(blobData, "customers.xlsx");
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
            });
    }

    return (
        <div className="table-container">
            <ButtonContainer lastChild={<FileUpload uploadUrl={`/customers/import`} refreshTrigger={refreshTrigger} setRefreshTrigger={setRefreshTrigger} />}>
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
                <CreateCustomerForm
                    onCreateCustomer={handleAddCustomer}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                />
            </ButtonContainer>

            <Table
                columns={columns}
                fetchData={getAllCustomers}
                onEdit={(customer) => {
                    setEditingCustomer(customer);
                    setEditShowModal(true);
                }}
                onDelete={handleDeleteCustomer}
                refreshTrigger={refreshTrigger}
            />

            {editingCustomer && (
                <EditCustomerForm
                    customer={editingCustomer}
                    show={showEditModal}
                    onUpdateCustomer={handleUpdateCustomer}
                    onHide={() => {
                        setEditingCustomer(null);
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

export default Customers;
