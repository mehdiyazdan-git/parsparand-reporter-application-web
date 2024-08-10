import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import IconEdit from "../assets/icons/IconEdit";
import Payments from "./Payments";
import Button from "../../utils/Button";
import styled from 'styled-components';
import {useFilter} from "../contexts/useFilter";

const ModalBody = styled(Modal.Body)`
  max-height: 70vh; /* Adjust as needed */
  overflow-y: auto;
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

const PaymentsModal = ({ customerId }) => {
    const listName = "payments-modal";
    const { filter, updateSearch } = useFilter(listName);
    const [showModal, setShowModal] = useState(false);

    const handleShow = () => {
        if (!filter?.customerId || filter?.customerId !== customerId) {
            updateSearch('customerId',customerId);
        }
        setShowModal(true);
    };

    const handleClose = () => {
        updateSearch({ customerId: null });
        setShowModal(false);
    };

    return (
        <>
            <IconEdit color="green" fontSize={"1rem"} type={"button"} onClick={handleShow} />
            <CustomModal show={showModal} centered onHide={handleClose}>
                <ModalBody>
                    <Payments customerId={customerId} />
                </ModalBody>
                <Modal.Footer>
                    <Button $variant="warning" onClick={handleClose}>
                        بستن
                    </Button>
                </Modal.Footer>
            </CustomModal>
        </>
    );
};

export default PaymentsModal;
