
import IconEdit from '../assets/icons/IconEdit';
import IconDeleteOutline from '../assets/icons/IconDeleteOutline';
import Pagination from '../pagination/Pagination';
import ConfirmationModal from './ConfirmationModal';
import useDeepCompareEffect from "../../hooks/useDeepCompareEffect";
import {useMemo, useState} from "react";
import Th from "./Th";
import SearchDateInput from "./SearchDateInput";
import SearchInput from "./SearchInput";
import SelectSearchInput from "../../utils/SelectSearchInput";
import Modal from "react-bootstrap/Modal";
import {useNavigate} from "react-router-dom";
import IconKey from "../assets/icons/IconKey";
import LoadingDataErrorPage from "../../utils/LoadingDataErrorPage";
import AsyncSelectInput from "../../utils/AsyncSelectInput";
import "../../App.css"

const Table = ({ columns, fetchData, onEdit, onDelete, refreshTrigger,onResetPassword }) => {

    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const navigate = useNavigate();

    const initialSearchState = useMemo(() => columns.reduce((acc, column) => {
        if (column.searchable) {
            acc[column.key] = '';
        }
        return acc;
    }, {}), [columns]);
    const [search, setSearch] = useState(initialSearchState);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        sessionStorage.setItem('currentPage', newPage);
    };

    const handlePageSizeChange = (newPageSize) => {
        setPageSize(newPageSize);
        sessionStorage.setItem('pageSize', newPageSize);
    };



    const ErrorModal = ({ show, handleClose, errorMessage }) => {
        return (
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Body
                    className="text-center"
                    style={{ fontFamily: "IRANSans",fontSize: "0.8rem", padding: "20px",fontWeight: "bold"}}>
                    <div className="text-danger">{errorMessage}</div>
                    <button className="btn btn-primary btn-sm mt-4" onClick={handleClose}>
                        بستن
                    </button>
                </Modal.Body>
            </Modal>
        );
    };

    const handleDeleteConfirm = async () => {
        if (selectedItem) {
            try {
                const errorMessage = await onDelete(selectedItem);
                if (errorMessage) {
                    setErrorMessage(errorMessage);
                    setShowErrorModal(true); // Show the error modal
                } else {
                    setShowConfirmationModal(false);
                    setSelectedItem(null);
                    setErrorMessage('');
                }
            } catch (error) {
                if (error.response){
                    setErrorMessage(error.response.data);
                    setShowErrorModal(true);
                }
            }
        }
    };

    useDeepCompareEffect(() => {
        const load = async () => {
            try {
                const queryParams = new URLSearchParams({
                    page: currentPage.toString(),
                    size: pageSize.toString(),
                    sortBy: sortBy,
                    order: sortOrder,
                    ...search,
                });
                const response = await fetchData(queryParams);
                if (response.content){
                    setData(response.content);
                    setTotalPages(response.totalPages);
                    setTotalElements(response.totalElements);
                    setErrorMessage('');
                    setShowErrorModal(false);
                }
            } catch (error) {
                console.log("table is reporting an error:", error);
                if (error.response){
                   if (error.response.status > 400){
                       navigate('server-error');
                   }
                    navigate('server-error');
                }
            }
        };
        load();
    }, [currentPage, pageSize, search, sortBy, sortOrder, refreshTrigger]);

    if (!data){
        return <LoadingDataErrorPage/>
    }

    return (
        <>
            <table className="recipient-table table-fixed-height mt-3">
                <thead>
                <tr className="table-header-row">
                    {columns.map((column) => (
                        <Th
                            key={column.key}
                            width={column.width}
                            sortBy={sortBy}
                            sortOrder={sortOrder}
                            setSortBy={setSortBy}
                            setSortOrder={setSortOrder}
                            sortKey={column.key}
                        >
                            {column.title}
                        </Th>
                    ))}
                    <th width="7%">{"ویرایش|حذف"}</th>
                </tr>
                <tr className="table-header-row">
                    {columns.map((column) =>
                        column.searchable ? (
                            column.type === 'date' ? (
                                <SearchDateInput
                                    key={column.key}
                                    width={column.width}
                                    value={search[column.key] ? (column.render ? column.render(search[column.key]) : search[column.key]) : ''}
                                    onChange={(date) => setSearch({...search, [column.key]: date})}
                                />
                            ) : column.type === 'select' ? (
                                <SelectSearchInput
                                    key={column.key}
                                    width={column.width}
                                    name={column.key}
                                    options={column.options}
                                    value={search[column.key]}
                                    onChange={(value) => setSearch({...search, [column.key]: value})}
                                />
                            ) : column.type === 'async-select' ? (
                                <AsyncSelectInput
                                    key={column.key}
                                    width={column.width}
                                    name={column.key}
                                    apiFetchFunction={column.apiFetchFunction}
                                    defaultValue={search[column.key]}
                                    onChange={(value) => setSearch({...search, [column.key]: value})}
                                />
                            ) : (
                                <SearchInput
                                    key={column.key}
                                    width={column.width}
                                    id={column.key}
                                    name={column.key}
                                    value={search[column.key]}
                                    onChange={(event) => setSearch({...search, [column.key]: event.target.value})}
                                />
                            )
                        ) : (
                            <th key={column.key} width={column.width}></th>
                        )
                    )}
                    <th width="5%"></th>
                </tr>
                </thead>
                <tbody>
                {data.map((item) => (
                    <tr key={item.id}>
                        {columns.map((column) => (
                            <td key={column.key}>{column.render ? column.render(item) : item[column.key]}</td>
                        ))}
                        <td style={{padding: '0px'}}>
                            {onResetPassword && <IconKey style={{margin: '0px 10px', cursor: 'pointer'}} fontSize={'1rem'} color="orange"
                                       onClick={() => onResetPassword(item)}/>}
                            <IconEdit style={{margin: '0px 10px', cursor: 'pointer'}} fontSize={'1rem'} color="green"
                                      onClick={() => onEdit(item)}/>
                            <IconDeleteOutline
                                style={{cursor: 'pointer'}}
                                size={'1.5rem'}
                                onClick={() => {
                                    setSelectedItem(item.id);
                                    setShowConfirmationModal(true);
                                }}
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={totalElements}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
            />
            <ConfirmationModal
                show={showConfirmationModal}
                handleClose={() => setShowConfirmationModal(false)}
                handleConfirm={handleDeleteConfirm}
                errorMessage={errorMessage}
            />
            <ErrorModal
                show={showErrorModal}
                handleClose={() => setShowErrorModal(false)}
                errorMessage={errorMessage}
            />
        </>
    );
};

export default Table;
