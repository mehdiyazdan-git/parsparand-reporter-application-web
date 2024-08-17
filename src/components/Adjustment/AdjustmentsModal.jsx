import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import IconEdit from "../assets/icons/IconEdit";
import Button from "../../utils/Button";
import Adjustments from "./Adjustments";
import styled from 'styled-components';


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

    const handleClose = (e) => {
        e.preventDefault();
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
                    <button
                        className='btn btn-sm btn-warning'
                        onClick={e=>handleClose(e)}>
                        بستن
                    </button>
                </Modal.Footer>
            </CustomModal>
        </>
    );
};

export default AdjustmentsModal;
