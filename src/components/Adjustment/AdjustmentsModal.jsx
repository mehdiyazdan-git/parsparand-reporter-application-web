import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import IconEdit from "../assets/icons/IconEdit";
import Button from "../../utils/Button";
import Adjustments from "./Adjustments";
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
    
`;

const AdjustmentsModal = ({ customerId }) => {

    const [showModal, setShowModal] = useState(false);
    const handleShow = () => {
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
    };

    return (
        <>
            <IconEdit color="green" fontSize={"1rem"} type={"button"} onClick={handleShow} />
            <CustomModal show={showModal} centered onHide={handleClose}>
                <ModalBody>
                    <Adjustments customerId={customerId} />
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

export default AdjustmentsModal;
