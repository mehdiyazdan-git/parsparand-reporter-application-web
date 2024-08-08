import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { SiMicrosoftexcel } from 'react-icons/si';
import Modal from 'react-bootstrap/Modal';

import useModalManager from '../hooks/useModalManager';
import useDeepCompareEffect from '../hooks/useDeepCompareEffect';
import useHttp from '../components/contexts/useHttp';
import ButtonContainer from './ButtonContainer';
import FileUpload from './FileUpload';
import Button from './Button';
import Table from '../components/table/Table';
import YearSelect from '../components/Year/YearSelect';
import { generateInitialFilters } from '../components/contexts/generateInitialFilters';
import { BASE_URL } from '../config/config';

// ErrorModal Component
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



// CrudComponent
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

    const { get, post, put, del } = useHttp();
    const storageKey = `filter-${entityName}`;
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [yearsData, setYearsData] = useState([]);
    ;



    // Initialize filter with stored values or defaults
    function initializeFilter() {
        const storedFilter = JSON.parse(sessionStorage.getItem(storageKey));
        return storedFilter ?? {
            ...generateInitialFilters(columns),
            jalaliYear: new Intl.DateTimeFormat('fa-IR').format(new Date()).substring(0, 4),
        };
    }
    const [filter, setFilter] = useState(initializeFilter)
    // Event handlers for filter updates
    const updateSearch = (newSearch) => {
        setFilter((prev) => ({
            ...prev,
            search: { ...prev.search, ...newSearch },
            pageable: { ...prev.pageable, page: 0 },
        }));
    };

    const updatePageable = (newPageable) => {
        setFilter((prev) => ({ ...prev, pageable: { ...prev.pageable, ...newPageable } }));
    };

    const updateSort = (newSort) => {
        setFilter((prev) => ({ ...prev, sort: { ...prev.sort, ...newSort } }));
    };

    const resetFilter = () => {
        setFilter(generateInitialFilters(columns));
    };

    const getParams = () => {
        const params = new URLSearchParams();
        Object.keys(filter.search).forEach((key) => {
            params.append(key, filter.search[key]);
        });
        params.append('page', filter.pageable.page);
        params.append('size', filter.pageable.size);
        params.append('sortBy', filter.sort.sortBy);
        params.append('order', filter.sort.order);
        return params;
    }

    // CRUD operations
    const findAll = useCallback(
        async (params) => {
            try {
                const result = await get(entityName, params);
                setData(result);
            } catch (error) {
                openErrorModal(error.message);
            }
        },
        [get, entityName, openErrorModal]
    );

    const handleCreate = useCallback(
        async (newData) => {
            try {
                await post(entityName, newData);
                await findAll(getParams());
            } catch (error) {
                openErrorModal(error.message);
            }
        },
        [post, entityName, findAll, getParams, openErrorModal]
    );

    const handleUpdate = useCallback(
        async (updatedData) => {
            try {
                await put(entityName, updatedData);
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
                await del(entityName, id);
                await findAll(getParams());
            } catch (error) {
                openErrorModal(error.message);
            }
        },
        [del, entityName, findAll, getParams, openErrorModal]
    );

    const handleDownload = useCallback(
        async (params) => {
            try {
                const response = await fetch(`${BASE_URL}/${entityName}/export?${params.toString()}`);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${entityName}.xlsx`);
                document.body.appendChild(link);
                link.click();
            } catch (error) {
                openErrorModal(error.message);
            }
        },
        [entityName, openErrorModal]
    );





    useEffect(() => {
        const fetchYears =async () => {
            setIsLoading(true);
            try {
                const [yearsResponse] = await Promise.all([
                    fetch(`${BASE_URL}/${entityName}/select`),
                    findAll(getParams()),
                ]);
                const years = await yearsResponse.json();
                setYearsData(years.map((year) => ({ value: year.name.toString(), label: year.name.toString() })));
            } catch (error) {
                openErrorModal("An error occurred while fetching data.");
            } finally {
                setIsLoading(false);
            }
        }
        const fetchPageData = async (params) => {
            return await get(`${entityName}`, params);
        };
         if (sessionStorage.getItem(storageKey)) {
             const storedFilter = JSON.parse(sessionStorage.getItem(storageKey));
              setFilter(storedFilter || {...generateInitialFilters(columns)});
         }
        fetchYears().then(() => {});
        fetchPageData(getParams()).then((data) => setData(data))
    }, []);



    useDeepCompareEffect(() => {
        sessionStorage.setItem(storageKey, JSON.stringify(filter));
        const fetchPageData = async (params) => {
            return await get(entityName, params);
        };
        fetchPageData(getParams()).then((data) => setData(data));
    }, [filter]);

    return (
        <div className="table-container">
            <ButtonContainer
                lastChild={<FileUpload uploadUrl={`/${entityName}/import`} />}
            >
                <Button $variant="primary" onClick={openCreateModal}>
                    جدید
                </Button>
                {hasYearSelect && (
                    <YearSelect
                        value={filter.search.jalaliYear}
                        onChange={(value) => updateSearch({ 'jalaliYear': parseInt(value,10) })}
                    />
                )}
                <SiMicrosoftexcel
                    onClick={() => handleDownload(getParams())}
                    size="2.2rem"
                    className="m-1"
                    color="#41941a"
                    type="button"
                />
                {createForm && React.cloneElement(createForm, {
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
                onEdit={openEditModal}
                onDelete={handleDelete}
                filter={filter}
                resetFilter={resetFilter}
                updateSearch={updateSearch}
                updatePageable={updatePageable}
                updateSort={updateSort}
                getParams={getParams}
            />

            {editingEntity && editForm && React.cloneElement(editForm, {
                editingEntity,
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

CrudComponent.propTypes = {
    entityName: PropTypes.string.isRequired,
    columns: PropTypes.array.isRequired,
    createForm: PropTypes.element,
    editForm: PropTypes.element,
    hasYearSelect: PropTypes.bool,
    hasSubTotal: PropTypes.bool,
};

export default CrudComponent;
