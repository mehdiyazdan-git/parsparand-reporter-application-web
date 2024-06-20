import React, {useCallback, useEffect, useMemo, useState} from "react";
import IconEdit from '../assets/icons/IconEdit';
import IconDeleteOutline from '../assets/icons/IconDeleteOutline';
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
import Pagination from "../pagination/Pagination";
import YearSelect from "../Year/YearSelect";
import useHttp from "../../hooks/useHttp";
import PropTypes from "prop-types";
import useFilter from "../contexts/useFilter";
import TableHeaderFilterRow from "../Report/TableHeaderFilterRow";




const Table = ({ columns, fetchData, onEdit, onDelete, onResetPassword,refreshTrigger,listName, downloadExcelFile,hasYearSelect = false,hasSubTotal = false }) => {
    const [data, setData] = useState([]);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [allData, setAllData] = useState([]);
    const {filter,updateFilter,getParams} = useFilter(listName);
    const http = useHttp();

    const handleSearchChange = (name, value) => {
        updateFilter({ [name]: value });
        updateFilter({ page: 0 })
    };
    const setupFilter = useCallback((listName, columns) => {
        if (!filter){
            if (Array.isArray(columns) && columns.length > 0) {
                const newFilter = columns.reduce((acc, column) => {
                    if (column.searchable) {
                        acc[column.name] = '';
                    }
                    return acc;
                }, {});
                const assign = Object.assign(newFilter, { page: 0, pageSize: 10, sort: '', order: '' });
                updateFilter(assign)
            }
        }
    }, []);
    const years = async () => {
        return await http.get('years/select')
            .then(response =>
                response.data.map((item) => ({
                    label: item.name,
                    value: item.id,
                })));
            }

    useEffect(() => {
        if (!filter){
            setupFilter(listName,columns)
        }
    }, []);
    useEffect(() => {
        columns.forEach(col => {
            updateFilter({[col.key]: ''})
            if (sessionStorage.getItem('jalaliYear')){
                updateFilter({'jalaliYear': Number(JSON.parse(sessionStorage.getItem('jalaliYear')))})
            }else {
                const yearPromise = async () =>  await years().then(items => items[0].value);
                updateFilter({'jalaliYear': yearPromise().then(res => res)})
            }
        });
    },[columns])

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
    // useDeepCompareEffect(() => {
    //     const loadAllData = async () => {
    //         try {
    //             const response = await fetchData(getParams(listName,[],true).toString());
    //             console.log("all data:", response)
    //             if (response?.data?.content) {
    //                 setAllData(response.data.content);
    //             }
    //         } catch (error) {
    //             console.log("table is reporting an error:", error);
    //         }
    //     };
    //     loadAllData();
    // }, [filter,refreshTrigger]);
    //
    // useDeepCompareEffect(() => {
    //     const load = async () => {
    //         const params = getParams(listName,[],false);
    //         return await fetchData(params.toString());
    //     };
    //     load().then(response => {
    //         console.log("table data:", response)
    //         setData(response.data.content);
    //         updateFilter({page: response.data.pageable.pageNumber})
    //         updateFilter({size: response.data.pageable.pageSize})
    //         updateFilter({totalPages: response.data.totalPages})
    //         updateFilter({totalElements: response.data.totalElements})
    //     }).catch(error => {
    //         console.log("table is reporting an error:", error);
    //     });
    // }, [filter,refreshTrigger,getParams]);

    // Fetch all data once to calculate overall subtotals
    useDeepCompareEffect(() => {
        const loadAllData = async () => {
            try {
                const response = await fetchData(getParams(listName,[],true).toString());
                console.log("all data:", response)
                if (response?.data?.content) {
                    setAllData(response.data.content);
                }
            } catch (error) {
                console.log("table is reporting an error:", error);
            }
        };
        loadAllData();
    }, [filter,refreshTrigger]);

    useDeepCompareEffect(() => {
        const load = async () => {
            const params = getParams(listName,[],false);
            return await fetchData(params.toString());
        };
        load().then(response => {
            console.log("table data:", response)
            setData(response.data.content);
            updateFilter({page: response.data.pageable.pageNumber})
            updateFilter({size: response.data.pageable.pageSize})
            updateFilter({totalPages: response.data.totalPages})
            updateFilter({totalElements: response.data.totalElements})
        }).catch(error => {
            console.log("table is reporting an error:", error);
        });
    }, [filter,refreshTrigger,getParams]);


    // Calculate subtotals
    const subtotals = useMemo(() => {
        return columns.reduce((acc, column) => {
            if (column.subtotal) {
                acc[column.key] = data.reduce((sum, item) => sum + (item[column.key] || 0), 0);
            }
            return acc;
        }, {});
    }, [data]);


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
    const subtotalcolumnsCount = columns.filter(column => column.subtotal).length;
    const dynamicColspan = columns.length - subtotalcolumnsCount;

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
            { hasYearSelect && <div className="col-3 mt-3">
                <YearSelect onChange={handleSearchChange}
                            value={() => {
                    return filter?.jalaliYear
                        ? years().then(years => years.find(year => year.label === filter.jalaliYear))
                        :  years()[0]
                }}/>
            </div> }
            <table className="recipient-table table-fixed-height mt-3">
                <thead>
                <tr className="table-header-row p-0 m-0">
                    {columns.map((column,index) => (
                        <Th
                            key={index}
                            columnKey={column.key}
                            width={column.width}
                            filter={filter}
                            updateFilter={updateFilter}
                        >
                            {column.title}
                        </Th>
                    ))}
                    <th width="7%">{"ویرایش|حذف"}</th>
                </tr>
                    <tr>
                        <TableHeaderFilterRow
                            columns={columns}
                            filter={filter}
                            updateFilter={updateFilter}
                        />
                    </tr>
                </thead>
                {/*<tr className="table-header-row">*/}
                {/*    {columns.map((column) =>*/}
                {/*        column.searchable ? (*/}
                {/*            column.type === 'date' ? (*/}
                {/*                <SearchDateInput*/}
                {/*                    key={column.key}*/}
                {/*                    width={column.width}*/}
                {/*                    name={column.key || ''}*/}
                {/*                    value={filter[column.key] ? (column.render ? column.render(filter[column.key]) : filter[column.key]) : ''}*/}
                {/*                    onChange={(date) => handleSearchChange(column.key, date)}*/}
                {/*                />*/}
                {/*            ) : column.type === 'select' ? (*/}
                {/*                <SelectSearchInput*/}
                {/*                    key={column.key}*/}
                {/*                    width={column.width}*/}
                {/*                    name={column?.key || ''}*/}
                {/*                    options={column.options}*/}
                {/*                    value={filter[column?.key]}*/}
                {/*                    onChange={(value) => handleSearchChange(column.key, value)}*/}
                {/*                />*/}
                {/*            ) : column.type === 'async-select' ? (*/}
                {/*                <AsyncSelectInput*/}
                {/*                    key={column.key}*/}
                {/*                    width={column.width}*/}
                {/*                    name={column.key}*/}
                {/*                    apiFetchFunction={column.apiFetchFunction}*/}
                {/*                    defaultValue={filter[column.key]}*/}
                {/*                    onChange={(value) => handleSearchChange(column.key, value)}*/}
                {/*                />*/}
                {/*            ) : column.type === 'checkbox' ? (*/}
                {/*                <SearchCheckboxInput*/}
                {/*                    key={column.key}*/}
                {/*                    width={column.width}*/}
                {/*                    id={column.key}*/}
                {/*                    name={column?.key || ''}*/}
                {/*                    checked={filter?.[column.key]}*/}
                {/*                    onChange={(event) => handleSearchChange(column.key, event.target.checked)}*/}
                {/*                    label={column.title}*/}
                {/*                />*/}
                {/*            ) : column.type === 'number' ? (*/}
                {/*                <SearchNumberInput*/}
                {/*                    key={column.key}*/}
                {/*                    width={column.width}*/}
                {/*                    id={column.key}*/}
                {/*                    name={column.key}*/}
                {/*                    value={filter[column.key]}*/}
                {/*                    onChange={(value) => handleSearchChange(column.key, value)}*/}
                {/*                />*/}
                {/*            ) : (*/}
                {/*                <SearchInput*/}
                {/*                    key={column.key}*/}
                {/*                    width={column.width}*/}
                {/*                    id={column.key}*/}
                {/*                    name={column?.key || ''}*/}
                {/*                    // value={filter?.[column.key]}*/}
                {/*                    value={filter?.[column.key]}*/}
                {/*                    onChange={(event) => handleSearchChange(column.key, event.target.value)}*/}
                {/*                />*/}
                {/*            )*/}

                {/*        ) : (*/}
                {/*            <th key={column.key} style={{width:`${column.width}`}}></th>*/}
                {/*        )*/}
                {/*    )}*/}
                {/*    <th width="5%"></th>*/}
                {/*</tr>*/}
                <tbody>
                {data.map((item) => (
                    <tr key={item.id}>
                        {columns.map((column) => (
                            <td style={{fontSize:"0.72rem"}} key={column.key}>{column.render ? column.render(item) : item[column.key]}</td>
                        ))}
                        <td style={{ padding: '0px', whiteSpace: 'nowrap', width: '3%', justifyContent: 'center', textAlign: 'center' }}>
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
                { hasSubTotal &&  <tfoot className="table-footer">
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
                            onClick={() => downloadExcelFile(getParams(listName), false)}
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
                </tfoot>}
            </table>
            <Pagination
                filter={filter}
                updateFilter={updateFilter}
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
Table.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        width: PropTypes.string,
        sortable: PropTypes.bool,
        searchable: PropTypes.bool,
        type: PropTypes.oneOf(['date', 'string', 'number', 'select', 'async-select', 'checkbox']),
        render: PropTypes.func,
        options: PropTypes.array,
        apiFetchFunction: PropTypes.func,
        subtotal: PropTypes.bool
    })).isRequired,
    fetchData: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onResetPassword: PropTypes.func,
    refreshTrigger: PropTypes.bool.isRequired,
    listName: PropTypes.string.isRequired,
    downloadExcelFile: PropTypes.func.isRequired,
    hasYearSelect: PropTypes.bool,
    hasSubTotal: PropTypes.bool
};
export default Table;
