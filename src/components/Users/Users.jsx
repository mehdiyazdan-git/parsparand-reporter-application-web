import React, { useEffect, useState } from 'react';
import Table from "../table/Table";
import Modal from "react-bootstrap/Modal";
import useHttp from "../../hooks/useHttp";
import EditUserForm from "./EditUserForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from "../../utils/Button";
import ButtonContainer from "../../utils/ButtonContainer";
import { SiMicrosoftexcel } from "react-icons/si";
import FileUpload from "../../utils/FileUpload";
import CreateUserForm from "./CreateUserForm";
import { saveAs } from 'file-saver';

const Users = () => {
    const [editingUser, setEditingUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const http = useHttp();
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);

    const getAllUsers = async (queryParams) => {
        return await http.get(`/users?${queryParams.toString()}`).then(r => r.data);
    };

    const createUser = async (data) => {
        return await http.post("/users", data);
    };

    const updateUser = async (id, data) => {
        return await http.put(`/users/${id}`, data);
    };

    const removeUser = async (id) => {
        return await http.delete(`/users/${id}`);
    };

    const handleAddUser = async (newUser) => {
        try {
            const response = await createUser(newUser);
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

    const handleUpdateUser = async (updatedUser) => {
        try {
            const response = await updateUser(updatedUser.id, updatedUser);
            if (response.status === 200) {
                setRefreshTrigger(!refreshTrigger);
                setEditingUser(null);
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

    const handleDeleteUser = async (id) => {
        await removeUser(id);
        setRefreshTrigger(!refreshTrigger);
    };

    const columns = [
        { key: 'id', title: 'شناسه', width: '5%', sortable: true },
        { key: 'username', title: 'نام کاربری', width: '15%', sortable: true, searchable: true },
        { key: 'email', title: 'ایمیل', width: '20%', sortable: true, searchable: true },
        { key: 'enabled', title: 'فعال', width: '10%', sortable: true, searchable: true, render: (item) => item.enabled ? 'بله' : 'خیر' },
        { key: 'firstname', title: 'نام', width: '15%', sortable: true, searchable: true },
        { key: 'lastname', title: 'نام خانوادگی', width: '15%', sortable: true, searchable: true },
        { key: 'role', title: 'نقش', width: '10%', sortable: true, searchable: true },
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
        await http.get('/users/download-all-users.xlsx', { responseType: 'blob' })
            .then((response) => response.data)
            .then((blobData) => {
                saveAs(blobData, "users.xlsx");
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
            });
    }

    return (
        <div className="table-container">
            <ButtonContainer lastChild={<FileUpload uploadUrl={`/users/import`} refreshTrigger={refreshTrigger} setRefreshTrigger={setRefreshTrigger} />}>
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
                <CreateUserForm
                    onCreateUser={handleAddUser}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                />
            </ButtonContainer>

            <Table
                columns={columns}
                fetchData={getAllUsers}
                onEdit={(user) => {
                    setEditingUser(user);
                    setEditShowModal(true);
                }}
                onDelete={handleDeleteUser}
                refreshTrigger={refreshTrigger}
            />

            {editingUser && (
                <EditUserForm
                    user={editingUser}
                    show={showEditModal}
                    onUpdateUser={handleUpdateUser}
                    onHide={() => {
                        setEditingUser(null);
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

export default Users;
