import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import IconEdit from "../assets/icons/IconEdit";
import Button from "../../utils/Button";
import WarehouseReceipts from "./WarehouseReceipts";
import styled from 'styled-components';

const ModalBody = styled(Modal.Body)`
    max-height: 70vh; /* Adjust as needed */
`;

const CustomModal = styled(Modal)`
    display: flex;
    justify-content: center;
    align-items: center;

    .modal-dialog {
        width: auto;
        max-width: 90%; /* Adjust as needed */
       
    }

    .modal-content {
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px); /* This applies the glass effect */
        -webkit-backdrop-filter: blur(10px); /* For Safari support */
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        
    }
`;

const WarehouseReceiptsModal = ({ customerId }) => {
    const entityName = "not-invoiced-modal";

    const [showModal, setShowModal] = useState(false);

    const handleShow = () => {
        setShowModal(true);
    };

    const handleClose = (e) => {
        e.preventDefault()
        setShowModal(false);
    };

    return (
        <>
            <IconEdit color="green" fontSize={"1rem"} type={"button"} onClick={handleShow} />
            <CustomModal show={showModal} centered onHide={handleClose}>
                <ModalBody>
                    <WarehouseReceipts customerId={customerId} />
                </ModalBody>
                <Modal.Footer>
                    <Button $variant="warning" onClick={e=>handleClose(e)}>
                        بستن
                    </Button>
                </Modal.Footer>
            </CustomModal>
        </>
    );
};

export default WarehouseReceiptsModal;
