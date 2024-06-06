import React, {useCallback, useEffect, useMemo, useState} from "react";
import { useFilters } from "../contexts/FilterContext";
import IconEdit from '../assets/icons/IconEdit';
import IconDeleteOutline from '../assets/icons/IconDeleteOutline';
import Pagination from '../pagination/Pagination';
import ConfirmationModal from './ConfirmationModal';
import useDeepCompareEffect from "../../hooks/useDeepCompareEffect";
import Th from "./Th";
import SearchDateInput from "./SearchDateInput";
import SearchInput from "./SearchInput";
import SelectSearchInput from "../../utils/SelectSearchInput";
import IconKey from "../assets/icons/IconKey";
import LoadingDataErrorPage from "../../utils/LoadingDataErrorPage";
import AsyncSelectInput from "../../utils/AsyncSelectInput";
import "../../App.css";
import SearchCheckboxInput from "./SearchCheckboxInput";
import SearchNumberInput from "./SearchNumberInput";
import { formatNumber } from "../../utils/functions/formatNumber";
import { SiMicrosoftexcel } from "react-icons/si";
import Tooltip from "../../utils/Tooltip";
import {Modal} from "react-bootstrap";

const Table = ({ columns, fetchData, onEdit, onDelete, onResetPassword, listName, downloadExcelFile }) => {
    const { filters, setFilter} = useFilters();
    const [data, setData] = useState([]);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [allData, setAllData] = useState([]);

    const initialSearchState = useMemo(() => columns.reduce((acc, column) => {
        if (column.searchable) {
            acc[column.key] = '';
        }
        return acc;
    }, {}), [columns]);

    const [search, setSearch] = useState(initialSearchState);

    const handleSortChange = useCallback((sortKey, sortOrder) => {
        setFilter(listName, 'sortBy', sortKey);
        setFilter(listName, 'order', sortOrder);
    }, [listName, setFilter]);

    const handleSearchChange = useCallback((key, value) => {
        const newSearch = { ...search, [key]: value };
        setSearch(newSearch);
        setFilter(listName, 'search', newSearch);
        setFilter(listName, 'page', 0);
    }, [search, setFilter, listName]);

    const handleDeleteConfirm = useCallback(async () => {
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
                if (error.response) {
                    setErrorMessage(error.response.data);
                    setShowErrorModal(true);
                }
            }
        }
    }, [selectedItem, onDelete]);

    // Fetch all data once to calculate overall subtotals
    useEffect(() => {
        const loadAllData = async () => {
            try {
                const queryParams = new URLSearchParams({
                    page: 0,
                    size: 1000000, // Large number to get all data
                    sortBy: '',
                    order: '',
                    ...filters[listName]?.search,
                });
                const response = await fetchData(queryParams);
                if (response.content) {
                    setAllData(response.content);
                }
            } catch (error) {
                console.log("table is reporting an error:", error);
            }
        };
        loadAllData();
    }, [filters[listName]?.search?.customerId]);

    useDeepCompareEffect(() => {
        const load = async () => {
            try {
                const queryParams = new URLSearchParams({
                    page: filters[listName]?.page || 0,
                    size: filters[listName]?.pageSize || 10,
                    sortBy: filters[listName]?.sortBy || '',
                    order: filters[listName]?.order || '',
                    ...filters[listName]?.search,
                });
                const response = await fetchData(queryParams);
                if (response.content) {
                    setData(response.content);
                    setFilter(listName, 'page', response.pageable.pageNumber);
                    setFilter(listName, 'pageSize', response.pageable.pageSize);
                    setFilter(listName, 'totalPages', response.totalPages);
                    setFilter(listName, 'totalElements', response.totalElements);
                    setErrorMessage('');
                    setShowErrorModal(false);
                }
            } catch (error) {
                console.log("table is reporting an error:", error);
            }
        };
        load();
    }, [ filters[listName]?.search, filters[listName]?.page, filters[listName]?.pageSize, filters[listName]?.sortBy, filters[listName]?.order]);

    // Calculate subtotals
    const subtotals = useMemo(() => {
        return columns.reduce((acc, column) => {
            if (column.subtotal) {
                acc[column.key] = data.reduce((sum, item) => sum + (item[column.key] || 0), 0);
            }
            return acc;
        }, {});
    }, [columns, data]);

    // Calculate overall subtotals for all data
    const overallSubtotals = useMemo(() => {
        return columns.reduce((acc, column) => {
            if (column.subtotal) {
                acc[column.key] = allData.reduce((sum, item) => sum + (item[column.key] || 0), 0);
            }
            return acc;
        }, {});
    }, [columns, allData]);

    // Calculate dynamic colspan
    const subtotalColumnsCount = columns.filter(column => column.subtotal).length;
    const dynamicColspan = columns.length - subtotalColumnsCount;

    const ErrorModal = ({ show, handleClose, errorMessage }) => (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Body
                className="text-center"
                style={{ fontFamily: "IRANSans", fontSize: "0.8rem", padding: "20px", fontWeight: "bold" }}>
                <div className="text-danger">{errorMessage}</div>
                <button className="btn btn-primary btn-sm mt-4" onClick={handleClose}>
                    بستن
                </button>
            </Modal.Body>
        </Modal>
    );

    if (!data) {
        return <LoadingDataErrorPage />;
    }

    return (
        <>
            <table className="recipient-table table-fixed-height mt-3">
                <thead>
                <tr className="table-header-row p-0 m-0">
                    {columns.map((column) => (
                        <Th
                            key={column.key}
                            width={column.width}
                            sortBy={filters[listName]?.sortBy}
                            sortOrder={filters[listName]?.order}
                            setSortBy={(sortKey) => handleSortChange(sortKey, filters[listName]?.order)}
                            setSortOrder={(sortOrder) => handleSortChange(filters[listName]?.sortBy, sortOrder)}
                            sortKey={column.key}
                            listName={listName}
                            setFilter={setFilter}
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
                                    onChange={(date) => handleSearchChange(column.key, date)}
                                />
                            ) : column.type === 'select' ? (
                                <SelectSearchInput
                                    key={column.key}
                                    width={column.width}
                                    name={column.key}
                                    options={column.options}
                                    value={search[column.key]}
                                    onChange={(value) => handleSearchChange(column.key, value)}
                                />
                            ) : column.type === 'async-select' ? (
                                <AsyncSelectInput
                                    key={column.key}
                                    width={column.width}
                                    name={column.key}
                                    apiFetchFunction={column.apiFetchFunction}
                                    defaultValue={search[column.key]}
                                    onChange={(value) => handleSearchChange(column.key, value)}
                                />
                            ) : column.type === 'checkbox' ? (
                                <SearchCheckboxInput
                                    key={column.key}
                                    width={column.width}
                                    id={column.key}
                                    name={column.key}
                                    checked={search[column.key]}
                                    onChange={(event) => handleSearchChange(column.key, event.target.checked)}
                                    label={column.title}
                                />
                            ) : column.type === 'number' ? (
                                <SearchNumberInput
                                    key={column.key}
                                    width={column.width}
                                    id={column.key}
                                    name={column.key}
                                    value={search[column.key]}
                                    onChange={(value) => handleSearchChange(column.key, value)}
                                />
                            ) : (
                                <SearchInput
                                    key={column.key}
                                    width={column.width}
                                    id={column.key}
                                    name={column.key}
                                    value={search[column.key]}
                                    onChange={(event) => handleSearchChange(column.key, event.target.value)}
                                />
                            )

                        ) : (
                            <th key={column.key} style={{width:`${column.width}`}}></th>
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
                        <td style={{ padding: '0px', whiteSpace: 'nowrap', width: '3%', justifyContent: 'flex-end', }}>
                            {onResetPassword && (
                                <IconKey
                                    style={{ margin: '0px 10px', cursor: 'pointer' }}
                                    fontSize={'1rem'}
                                    color="orange"
                                    onClick={() => onResetPassword(item)}
                                />
                            )}
                            <IconEdit
                                style={{ margin: '0px 10px', cursor: 'pointer' }}
                                fontSize={'1rem'}
                                color="green"
                                onClick={() => onEdit(item)}
                            />
                            <IconDeleteOutline
                                style={{ cursor: 'pointer' }}
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
                <tfoot className="table-footer">
                <tr>
                    <td colSpan={dynamicColspan} className="subtotal-label">جمع صفحه</td>
                    {columns.map((column) => (
                        column.subtotal ? (
                            <td className="subtotal-col" key={column.key}>
                                {formatNumber(subtotals[column.key])}
                            </td>
                        ) : null
                    ))}
                    <td>
                        <SiMicrosoftexcel
                            data-tooltip-id="export-current-page-to-excel-button"
                            onClick={() => downloadExcelFile(false)}
                            size={"1.3rem"}
                            className={"mx-1"}
                            color={"#41941a"}
                            type="button"
                        />
                    </td>
                </tr>
                <tr>
                    <td colSpan={dynamicColspan} className="subtotal-label">جمع کل</td>
                    {columns.map((column) => (
                        column.subtotal ? (
                            <td className="subtotal-col" key={column.key}>
                                {formatNumber(overallSubtotals[column.key])}
                            </td>
                        ) : null
                    ))}
                    <td>
                        <SiMicrosoftexcel
                            data-tooltip-id="export-total-query-to-excel-button"
                            onClick={() => downloadExcelFile(true)}
                            size={"1.3rem"}
                            className={"mx-1"}
                            color={"#41941a"}
                            type="button"
                        />
                    </td>
                </tr>
                </tfoot>
            </table>
            <Pagination listName={listName} />
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
            <Tooltip
                id="export-current-page-to-excel-button"
                color={"green"}
                content="صفحه جاری"
                place="left"
            />
            <Tooltip
                id="export-total-query-to-excel-button"
                color={"green"}
                content="کل صفحات"
                place="left"
            />
        </>
    );
};

export default Table;
