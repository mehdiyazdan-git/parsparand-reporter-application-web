import React, {useEffect, useState} from 'react';
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

const WarehouseReceiptsModal = ({customerId}) => {

        const [filterOptions,setFilterOptions] = useState( {
            storageKey: "not-invoiced-modal",
            filter: {
                search: {
                    customerId,
                    notInvoiced: true
                }
            },
            pagination: {
                page: 0,
                size: 5
            },
            sorting: {
                sortBy: "id",
                order: "asc"
            }
        })

        const [showModal, setShowModal] = useState(false);

        const handleShow = (e) => {
            setShowModal(true);
        };

        const handleClose = (e) => {
            setShowModal(false);
        };

        useEffect(() => {
            setFilterOptions(prevState => ({
                ...prevState,
                filter: {
                    ...prevState.filter,
                    search: {
                        ...prevState.filter.search,
                        customerId,
                        notInvoiced: true
                    }
                }
            }));
        }, [customerId, setFilterOptions]);

        return (
            <>
                <IconEdit color="green" fontSize={"1rem"} type={"button"} onClick={handleShow}/>
                <CustomModal show={showModal} centered>
                    <ModalBody>
                        <WarehouseReceipts filterOptions={filterOptions}/>
                    </ModalBody>
                    <Modal.Footer>
                        <Button $variant="warning" onClick={e => handleClose(e)}>
                            بستن
                        </Button>
                    </Modal.Footer>
                </CustomModal>
            </>
        );
    }
;

export default WarehouseReceiptsModal;
