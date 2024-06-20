import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import IconEdit from "../assets/icons/IconEdit";
import Payments from "./Payments";
import Button from "../../utils/Button";
import useFilter from "../contexts/useFilter";


const PaymentsModal = ({customerId}) => {
    const listName = "payments";
    const { filter,updateFilter} = useFilter(listName);
    const [showModal, setShowModal] = useState(false);

    const handleShow = () => {
        if (!filter?.customerId || filter?.customerId !== customerId){
            updateFilter({'customerId': customerId});
        }
        setShowModal(true);
    };

    const handleClose = (entityName) => {
        const keys = Object.keys(sessionStorage.getItem(`filter_${entityName}`));
        keys.forEach(key => {
            if (key === "customerId"){
                delete filter[listName]?.search[key];
            }
        });
        setShowModal(false);
    };
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
