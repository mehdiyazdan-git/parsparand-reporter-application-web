import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import IconEdit from "../assets/icons/IconEdit";
import Button from "../../utils/Button";
import Adjustments from "./Adjustments";
import useFilter from "../contexts/useFilter";



const AdjustmentsModal = ({customerId}) => {
    const listName = "adjustments";
    const { filter,updateFilter} = useFilter();
    const [showModal, setShowModal] = useState(false);

    const handleShow = () => {
        if (!filter[listName]?.search?.customerId || filter[listName]?.search?.customerId !== customerId){
            const newSearch = {...filter[listName]?.search, customerId: customerId};
            updateFilter(listName, "search",newSearch);
        }
        setShowModal(true);
    };

    const handleClose = () => {
        const keys = Object.keys(filter[listName]?.search);
        keys.forEach(key => {
            if (key === "customerId"){
                delete filter[listName]?.search[key];
            }
        });
        const newSearch = {...filter[listName]?.search, page: 0};
        updateFilter(listName, "search",newSearch);
        setShowModal(false);
    };
    return (
        <>
            <IconEdit color="green" fontSize={"1rem"} type={"button"} onClick={handleShow} />
            <Modal show={showModal} centered size={"xl"}>
                <Modal.Body>
                    <Adjustments customerId={customerId} />
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

export default AdjustmentsModal;
