import React, { useState, useCallback } from 'react';
import useModalManager from '../hooks/useModalManager';
import ButtonContainer from './ButtonContainer';
import FileUpload from './FileUpload';
import Button from './Button';
import Table from '../components/table/Table';
import { SiMicrosoftexcel } from 'react-icons/si';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import useDeepCompareEffect from "../hooks/useDeepCompareEffect";
import { generateInitialFilters } from "../components/contexts/generateInitialFilters";
import {BASE_URL} from "../config/config";
import useHttp from "../components/contexts/useHttp";
import AsyncSelectSearch from "../components/table/AsyncSelectSearch";


const ErrorModal = ({ show, handleClose, errorMessage }) => (
    <Modal show={show} onHide={handleClose} centered>
        <Modal.Body
            className="text-center"
            style={{ fontFamily: 'IRANSans', fontSize: '0.8rem', padding: '20px', fontWeight: 'bold' }}
        >
            <div className="text-danger">{errorMessage}</div>
            <button className="btn btn-primary btn-sm mt-4" onClick={handleClose}>
                بستن
            </button>
        </Modal.Body>
    </Modal>
);

ErrorModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    errorMessage: PropTypes.string.isRequired,
};

const CrudComponent = ({
                           entityName,
                           columns,
                           createForm,
                           editForm,
                           hasYearSelect = false,
                           hasSubTotal = false,
                       }) => {
    const {
        showModal,
        showEditModal,
        showErrorModal,
        errorMessage,
        openCreateModal,
        closeCreateModal,
        openEditModal,
        closeEditModal,
        openErrorModal,
        editingEntity,
        closeErrorModal,
    } = useModalManager();

    const { get, post, put, del, error, setError } = useHttp();
    const [data, setData] = useState(null);
    const storageKey = `filter-${entityName}`;

    const [filter, setFilter] = useState(() => {
        const initialFilter = generateInitialFilters(columns);
        const storedFilter = sessionStorage.getItem(storageKey);
        return storedFilter ? JSON.parse(storedFilter) : initialFilter;
    });

    const onEdit = (entity) => {
        openEditModal(entity);
    };

    useDeepCompareEffect(() => {
        sessionStorage.setItem(storageKey, JSON.stringify(filter));
        findAll(getParams());
    }, [filter]);

    const updateSearch = (newSearch) => {
        setFilter({
            ...filter,
            search: { ...filter.search, ...newSearch },
            pageable: { ...filter.pageable, page: 0 },
        });
    };

    const updatePageable = (newFilter) => {
        setFilter({ ...filter, pageable: { ...filter.pageable, ...newFilter } });
    };

    const updateSort = (newSort) => {
        setFilter({ ...filter, sort: { ...filter.sort, ...newSort } });
    };

    const resetFilter = () => {
        setFilter(generateInitialFilters(columns));
    };

    const getParams = useCallback(() => {
        const params = new URLSearchParams();
        filter.search &&
        Object.keys(filter.search).forEach((key) => {
            params.append(key, filter.search[key]);
        });
        params.append('page', filter.pageable.page);
        params.append('size', filter.pageable.size);
        params.append('sortBy', `${filter.sort.sortBy}`);
        params.append('order', `${filter.sort.order}`);
        return params;
    }, [filter]);

    const findAll = useCallback(
        async (params) => {
            try {
                const data = await get(`${entityName}`, params);
                setData(data);
            } catch (error) {
                openErrorModal(error.message);
            }
        },
        [get, entityName, openErrorModal]
    );

    const handleCreate = useCallback(
        async (data) => {
            try {
                await post(`${entityName}`, data);
                await findAll(getParams());
            } catch (error) {
                openErrorModal(error.message);
            }
        },
        [post, entityName, findAll, getParams, openErrorModal]
    );

    const handleUpdate = useCallback(
        async (data) => {
            try {
                await put(`${entityName}`, data);
                await findAll(getParams());
            } catch (error) {
                openErrorModal(error.message);
            }
        },
        [put, entityName, findAll, getParams, openErrorModal]
    );

    const handleDelete = useCallback(
        async (id) => {
            try {
                await del(`${entityName}`, id);
                await findAll(getParams());
            } catch (error) {
                openErrorModal(error.message);
            }
        },
        [del, entityName, findAll, getParams, openErrorModal]
    );
    const [selectedCustomer, setSelectedCustomer] = useState('');

    const handleCustomerChange = (newValue) => {
        setSelectedCustomer(newValue);
        // Do something with the selected customer (e.g., update state)
    };

    const handleDownload = useCallback(
        (params, isExport) => {
            fetch(`${BASE_URL}/${entityName}/export?${params.toString()}`, {
                method: 'GET',
                redirect: 'follow',
            })
                .then((response) => response.blob())
                .then((blob) => {
                    const url = window.URL.createObjectURL(new Blob([blob]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `${entityName}.xlsx`);
                    document.body.appendChild(link);
                    link.click();
                });
        },
        [entityName]
    );

    return (
        <div className="table-container">
            <ButtonContainer
                lastChild={
                    <FileUpload uploadUrl={`/${entityName}/import`} refreshTrigger={null} />
                }
            >
                <Button $variant="primary" onClick={openCreateModal}>
                    جدید
                </Button>
                <AsyncSelectSearch
                    url="customers/select"
                    value={selectedCustomer}
                    onChange={handleCustomerChange}
                />
                <SiMicrosoftexcel
                    onClick={() => handleDownload(getParams(), false)}
                    size={"2.2rem"}
                    className={"m-1"}
                    color={"#41941a"}
                    type="button"
                />

                {createForm &&
                    React.cloneElement(createForm, {
                        onCreateEntity: handleCreate,
                        show: showModal,
                        onHide: closeCreateModal,
                    })}
            </ButtonContainer>

            <Table
                data={data}
                columns={columns}
                hasSubTotal={hasSubTotal}
                hasYearSelect={hasYearSelect}
                postEntity={handleCreate}
                onUpdateEntity={handleUpdate}
                onEdit={onEdit}
                onDelete={handleDelete}
                filter={filter}
                resetFilter={resetFilter}
                updateSearch={updateSearch}
                updatePageable={updatePageable}
                updateSort={updateSort}
                getParams={getParams}
            />

            {editingEntity &&
                editForm &&
                React.cloneElement(editForm, {
                    editingEntity: editingEntity,
                    show: showEditModal,
                    onUpdateEntity: handleUpdate,
                    onHide: closeEditModal,
                })}
            <ErrorModal
                show={showErrorModal}
                handleClose={closeErrorModal}
                errorMessage={errorMessage}
            />
        </div>
    );
};

export default CrudComponent;
