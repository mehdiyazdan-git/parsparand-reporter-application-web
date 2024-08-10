import React, {useEffect, useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import IconEdit from "../assets/icons/IconEdit";
import Button from "../../utils/Button";
import Invoices from "./Invoices";

import styled from 'styled-components';
import {useFilter} from "../contexts/useFilter";
import useHttp from "../contexts/useHttp";

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

const InvoicesModal = ({ contractNumber }) => {
    const [showModal, setShowModal] = useState(false);
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const options = {
        storageKey : 'invoices_filtered_by_contractNo',
        filters : {
            search: {'contractNumber' : contractNumber}, // should be added to filter.search
            excludes : ['jalaliYear'] // should be deleted from filter.search
        },
    }

    return (
        <>
            <IconEdit
                color="green"
                fontSize={"1rem"}
                type={"button"}
                onClick={handleShow}
                aria-label="Edit Invoices"  // Add aria-label for accessibility
            />

            <CustomModal
                show={showModal}
                centered
                aria-labelledby="invoices-modal-title" // Add aria-labelledby for accessibility
                aria-modal="true"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="invoices-modal-title">Invoices</Modal.Title> {/* Add title for accessibility */}
                </Modal.Header> {/* Add Modal.Header */}
                <ModalBody>
                    <Invoices
                        options={options}
                    />
                    {/* You can add error handling here if needed */}
                </ModalBody>
                <Modal.Footer>
                    <Button $variant="warning" type={"button"} onClick={handleClose}>
                        بستن
                    </Button>
                </Modal.Footer>
            </CustomModal>
        </>
    );
};

export default InvoicesModal;

