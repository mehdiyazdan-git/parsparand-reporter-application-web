import React, {useEffect, useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import IconEdit from "../assets/icons/IconEdit";
import Button from "../../utils/Button";
import WarehouseReceipts from "./WarehouseReceipts"; // Renamed import
import { useFilters } from "../contexts/FilterContext";

const WarehouseReceiptsModal = ({ customerId }) => { // Renamed component
    const listName = "warehouseReceipts"; // Updated list name
    const { filters, addFilterToSearch, setPagination,getFilter,createFilter } = useFilters();
    const [showModal, setShowModal] = useState(false);

    const handleShow = () => {
        if (!getFilter("warehouseReceipts")){
            createFilter("warehouseReceipts")
        }
        addFilterToSearch("warehouseReceipts", "notInvoiced", true);
        addFilterToSearch("warehouseReceipts", "customerId", customerId);
        setPagination("warehouseReceipts", 0 , filters[listName]?.pageSize);
        setShowModal(true);
    };

    const handleClose = () => {
        const keys = Object.keys(filters[listName]?.search);
        keys.forEach(key => {
            if (key === "customerId") {
                delete filters[listName]?.search[key];
            }
            if (key === "notInvoiced"){
                delete filters[listName]?.search[key];
            }
        });
        delete filters[listName]?.search["notInvoiced"];
        setPagination(listName, 0 , filters[listName]?.pageSize);
        setShowModal(false);
    };

    useEffect(() => {

    })

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
