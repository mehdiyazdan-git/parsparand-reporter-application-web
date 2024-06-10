import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import IconEdit from "../assets/icons/IconEdit";
import Button from "../../utils/Button";
import Adjustments from "./Adjustments";
import {useFilters} from "../contexts/FilterContext";

const AdjustmentsModal = ({customerId}) => {
    const listName = "adjustments";
    const { filters,setFilter} = useFilters();
    const [showModal, setShowModal] = useState(false);

    const handleShow = () => {
        if (!filters[listName]?.search?.customerId || filters[listName]?.search?.customerId !== customerId){
            const newSearch = {...filters[listName]?.search, customerId: customerId};
            setFilter(listName, "search",newSearch);
        }
        setShowModal(true);
    };

    const handleClose = () => {
        const keys = Object.keys(filters[listName]?.search);
        keys.forEach(key => {
            if (key === "customerId"){
                delete filters[listName]?.search[key];
            }
        });
        const newSearch = {...filters[listName]?.search, page: 0};
        setFilter(listName, "search",newSearch);
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
