import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import IconEdit from "../assets/icons/IconEdit";
import Button from "../../utils/Button";
import Invoices from "./Invoices";
import useFilter from "../contexts/useFilter";



const InvoicesModal = ({contractNumber}) => {
    const [tempFilters, setTempFilters] = useState({});
    const listName = "invoices";
    const { filters,setFilter,setPagination,addFilter,clearFilter,addFilterToSearch} = useFilter();
    const [showModal, setShowModal] = useState(false);


    const handleShow = () => {
        const jalaliYear = filters[listName]?.search?.years;
        if (filters[listName]?.search?.contractNumber && filters[listName]?.search?.jalaliYear){
            clearFilter(listName,"contractNumber");
            setTempFilters({...filters, years : jalaliYear})
            setPagination(listName, 0 , filters[listName]?.pageSize);
            setFilter(listName, "search",{...filters, years : jalaliYear});
        }
        if (!filters[listName]?.search?.jalaliYear){
            const jalaliYear = filters[listName]?.search?.years;
            addFilter(listName, "jalaliYear", jalaliYear);
        }
        if (!filters[listName]?.search?.contractNumber && !filters[listName]?.search?.jalaliYear){
            const jalaliYear = filters[listName]?.search?.years;
            addFilter(listName, "jalaliYear", jalaliYear);
            addFilterToSearch(listName, "contractNumber", contractNumber);
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
        clearFilter(listName,"contractNumber");
        addFilter(listName, "jalaliYear", contractNumber);
        setPagination(listName, 0 , filters[listName]?.pageSize);
        addFilter(listName, "jalaliYear", tempFilters.years);
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
//const addFilterToSearch = (listName, filter, value) => {
//     setFilters((prevFilters) => {
//         const newFilters = {...prevFilters};
//         newFilters[listName].search[filter] = value;
//         sessionStorage.setItem('filters', JSON.stringify(newFilters));
//         return newFilters;
//     });
// }
// const addFilter = (listName, filter, value) => {
//     setFilters((prevFilters) => {
//         const newFilters = {...prevFilters};
//         newFilters[listName][filter] = value;
//         sessionStorage.setItem('filters', JSON.stringify(newFilters));
//         return newFilters;
//     });
// }
//
// // Function to clear all filters for a list
// const clearFilters = (listName) => {
//     setFilters((prevFilters) => {
//         const newFilters = {...prevFilters};
//         delete newFilters[listName];
//         sessionStorage.setItem('filters', JSON.stringify(newFilters));
//         return newFilters;
//     });
// };
//const clearFilter = (listName,filter) => {
//     setFilters((prevFilters) => {
//         const newFilters = {...prevFilters};
//         newFilters[listName][filter] = null;
//         sessionStorage.setItem('filters', JSON.stringify(newFilters));
//         return newFilters;
//     });
// }

//{
//     "years": {
//         "jalaliYear": {
//             "label": 1403,
//             "value": 4
//         }
//     },
//     "clientSummaryList": {
//         "search": {
//             "customerId": 75
//         }
//     },
//     "warehouseReceipts": {
//         "search": {
//             "notInvoiced": true,
//             "customerId": 75
//         },
//         "page": 0,
//         "pageSize": 10,
//         "totalPages": 11,
//         "totalElements": 106
//     }
// }
