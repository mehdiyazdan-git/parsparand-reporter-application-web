import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import IconEdit from "../assets/icons/IconEdit";
import Button from "../../utils/Button";
import Invoices from "./Invoices";

import styled from 'styled-components';

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


    const [filterOptions,setFilterOptions] = useState({
        storageKey : 'invoices_filtered_by_contractNo',
        filter : {
            search: {'contractNumber' : contractNumber}
            ,
            pagination: {
                page: 0,
                size: 5
            },
            sorting: {
                sortBy: "id",
                order: "asc"
            }
        },
    });
    const [showModal, setShowModal] = useState(false);

    const handleShow = (e) => {
        setShowModal(true);
    };

    const handleClose = (e) => {
        setShowModal(false);
    };




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
                <Modal.Header>
                    <Modal.Title
                        id="invoices-modal-title"
                        style={{
                            fontFamily : 'IRANSansBold',
                            fontSize : '0.85rem'

                        }}
                    >
                        {`فاکتور های قرارداد ${contractNumber}`}
                    </Modal.Title>
                </Modal.Header>
                <ModalBody>
                    <Invoices
                        filterOptions={filterOptions}
                    />
                    {/* You can add error handling here if needed */}
                </ModalBody>
                <Modal.Footer>
                    <Button $variant="warning" type={"button"} onClick={e=>handleClose(e)}>
                        بستن
                    </Button>
                </Modal.Footer>
            </CustomModal>
        </>
    );
};

export default InvoicesModal;

