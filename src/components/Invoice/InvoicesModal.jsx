import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import IconEdit from "../assets/icons/IconEdit";
import Button from "../../utils/Button";
import Invoices from "./Invoices";
import {useFilters} from "../contexts/FilterContext";

const InvoicesModal = ({contractNumber}) => {
    const listName = "invoices";
    const { filters,setFilter,setPagination} = useFilters();
    const [showModal, setShowModal] = useState(false);

    const handleShow = () => {
        if (!filters[listName]?.search?.contractNumber || filters[listName]?.search?.contractNumber !== contractNumber){
            const newSearch = {...filters[listName]?.search, contractNumber: contractNumber};
            setFilter(listName, "search",newSearch);
        }
        setPagination(listName, 0 , filters[listName]?.pageSize);
        setShowModal(true);
    };

    const handleClose = () => {
        const keys = Object.keys(filters[listName]?.search);
        keys.forEach(key => {
            if (key === "contractNumber"){
                delete filters[listName]?.search[key];
            }
        });
        // setFilter(listName, "search",{...filters[listName]?.search, page: 0});
        setPagination(listName, 0 , filters[listName]?.pageSize);
        setShowModal(false);
    };
    return (
        <>
            <IconEdit color="green" fontSize={"1rem"} type={"button"} onClick={handleShow} />
            <Modal show={showModal} centered size={"xl"}>
                <Modal.Body>
                    <Invoices contractNumber={contractNumber} />
                </Modal.Body>
                <Modal.Footer>
                    <Button $variant="warning" type={"button"} onClick={handleClose}>
                        بستن
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default InvoicesModal;
