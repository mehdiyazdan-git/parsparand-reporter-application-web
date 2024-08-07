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
    const http = useHttp();
    const entityName = "contract-invoice-modal";
    const {  updateFieldsFilter } = useFilter(entityName);
    const [showModal, setShowModal] = useState(false);
    const [contracts, setContracts] = useState([]);
    const getAllContracts = async () => {
        try {
            const response = await http.get(`/http://localhost:9090/api/contracts?page=0&size=1000`,'');
            return response.data.content;
        }catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        const fetchContracts = async () => {
            const contracts = await getAllContracts();
            setContracts(contracts);
        };
        fetchContracts();
    }, []);

    const handleShow = () => {

        updateFieldsFilter({
            search : {contractNumber: contractNumber},
            pageable : {
                page: 0,
                size: 10,
            },
           sort : {
               sortBy: 'id',
               order: 'asc',
           },
        });
        setShowModal(true);
    };

    const handleClose = () => {
        updateFieldsFilter({
            search : {contractNumber: ''},
            pageable : {
                page: 0,
                size: 10,
            },
            sort : {
                sortBy: 'id',
                order: 'asc',
            },
        });
        setShowModal(false);
    };

    return (
        <>
            <IconEdit color="green" fontSize={"1rem"} type={"button"} onClick={handleShow} />
            <CustomModal show={showModal} centered>
                <ModalBody>
                    <Invoices
                        contractNumber={contractNumber}
                        parent_list_name={entityName}
                    />
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

