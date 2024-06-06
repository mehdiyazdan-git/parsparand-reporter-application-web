import React from 'react';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import IconEdit from "../assets/icons/IconEdit";
import Payments from "./Payments";
import Button from "../../utils/Button";

const PaymentsModal = ({showModal,handleShow,handleClose,customerId}) => {
    return (
        <>
            <IconEdit color="green" fontSize={"1rem"} type={"button"} onClick={handleShow} />
            <Modal show={showModal} centered  size={"xl"}>
                <Modal.Body>
                    <Payments customerId={customerId} />
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

export default PaymentsModal;
