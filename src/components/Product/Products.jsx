import React, { useEffect, useState } from 'react';
import Table from "../table/Table";
import Modal from "react-bootstrap/Modal";
import useHttp from "../../hooks/useHttp";
import EditProductForm from "./EditProductForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from "../../utils/Button";
import ButtonContainer from "../../utils/ButtonContainer";
import { SiMicrosoftexcel } from "react-icons/si";
import FileUpload from "../../utils/FileUpload";
import CreateProductForm from "./CreateProductForm";
import { saveAs } from 'file-saver';

const Products = () => {
    const [editingProduct, setEditingProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setEditShowModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const http = useHttp();
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);

    const getAllProducts = async (queryParams) => {
        return await http.get(`/products?${queryParams.toString()}`).then(r => r.data);
    };

    const createProduct = async (data) => {
        return await http.post("/products", data);
    };

    const updateProduct = async (id, data) => {
        return await http.put(`/products/${id}`, data);
    };

    const removeProduct = async (id) => {
        return await http.delete(`/products/${id}`);
    };

    const handleAddProduct = async (newProduct) => {
        try {
            const response = await createProduct(newProduct);
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

    const handleUpdateProduct = async (updatedProduct) => {
        try {
            const response = await updateProduct(updatedProduct.id, updatedProduct);
            if (response.status === 200) {
                setRefreshTrigger(!refreshTrigger);
                setEditingProduct(null);
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

    const handleDeleteProduct = async (id) => {
        await removeProduct(id);
        setRefreshTrigger(!refreshTrigger);
    };
    const convertToPersianCaption = (caption) => {
        const persianCaptions = {
            'MAIN': 'اصلی',
            'SCRAPT': 'ضایعات',
            'RAWMATERIAL': 'مواد اولیه',
        };
        return persianCaptions[caption] || caption;
    };
    const  options = [
        { value: 2, label: 'اصلی' },
        { value: 6, label:  'ضایعات' },
        { value: 1, label: 'مواد اولیه' },
    ]

    const columns = [
        { key: 'id', title: 'شناسه', width: '5%', sortable: true },
        { key: 'productCode', title: 'کد محصول', width: '15%', sortable: true, searchable: true },
        { key: 'productName', title: 'نام محصول', width: '20%', sortable: true, searchable: true },
        { key: 'measurementIndex', title: 'شاخص اندازه‌گیری', width: '20%', sortable: true, searchable: true },
        {
            key: 'productType',
            title: 'نوع محصول',
            width: '20%',
            sortable: true,
            searchable: true,
            render: (item) => convertToPersianCaption(item.productType),
            type : 'select',
            options : options
        },
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
        await http.get('/products/download-all-products.xlsx', { responseType: 'blob' })
            .then((response) => response.data)
            .then((blobData) => {
                saveAs(blobData, "products.xlsx");
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
                            uploadUrl={`/products/import`}
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
                <CreateProductForm
                    onCreateProduct={handleAddProduct}
                    show={showModal}
                    onHide={() => setShowModal(false)}
                />
            </ButtonContainer>

            <Table
                columns={columns}
                fetchData={getAllProducts}
                onEdit={(product) => {
                    setEditingProduct(product);
                    setEditShowModal(true);
                }}
                onDelete={handleDeleteProduct}
                refreshTrigger={refreshTrigger}
            />

            {editingProduct && (
                <EditProductForm
                    product={editingProduct}
                    show={showEditModal}
                    onUpdateProduct={handleUpdateProduct}
                    onHide={() => {
                        setEditingProduct(null);
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

export default Products;
