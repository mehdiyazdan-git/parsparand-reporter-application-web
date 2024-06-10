import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import IconEdit from "../assets/icons/IconEdit";
import Button from "../../utils/Button";
import WarehouseReceipts from "./WarehouseReceipts"; // Renamed import
import { useFilters } from "../contexts/FilterContext";

const WarehouseReceiptsModal = ({ customerId }) => { // Renamed component
    const listName = "warehouseReceipts"; // Updated list name
    const { filters, setFilter, setPagination } = useFilters();
    const [showModal, setShowModal] = useState(false);

    const handleShow = () => {
        if (!filters[listName]?.search?.notInvoiced && filters[listName]?.search?.notInvoiced === true) {
            setFilter(listName, "search", { notInvoiced: true });
        }
        if (!filters[listName]?.search?.customerId || filters[listName]?.search?.customerId !== customerId) {
            const newSearch = { ...filters[listName]?.search, customerId: customerId };
            setFilter(listName, "search", newSearch);
        }
        setPagination(listName, 0 , filters[listName]?.pageSize);
        setShowModal(true);
    };

    const handleClose = () => {
        const keys = Object.keys(filters[listName]?.search);
        keys.forEach(key => {
            if (key === "customerId") {
                delete filters[listName]?.search[key];
            }
        });
        delete filters[listName]?.search["notInvoiced"];
        setPagination(listName, 0 , filters[listName]?.pageSize);
        setShowModal(false);
    };

    return (
        <>
            <IconEdit color="green" fontSize={"1rem"} type={"button"} onClick={handleShow} />
            <Modal show={showModal} centered size={"xl"}>
                <Modal.Body>
                    <WarehouseReceipts customerId={customerId} shouldNotDisplayCustomerName={false}/> {/* Updated component */}
                </Modal.Body>
                <Modal.Footer>
                    <Button $variant="warning" onClick={handleClose}>
                        بستن
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default WarehouseReceiptsModal; // Renamed export
