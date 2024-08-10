import React, {useCallback, useEffect, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import { SiMicrosoftexcel } from 'react-icons/si';
import Modal from 'react-bootstrap/Modal';

import useModalManager from '../../hooks/useModalManager';
import useDeepCompareEffect from '../../hooks/useDeepCompareEffect';
import useHttp from './useHttp';
import ButtonContainer from '../../utils/ButtonContainer';
import FileUpload from '../../utils/FileUpload';
import Button from '../../utils/Button';
import Table from '../table/Table';
import { generateInitialFilters } from './generateInitialFilters';
import { BASE_URL } from '../../config/config';

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
                           url,
                           entityName,
                           columns,
                           createForm,
                           editForm,
                           hasYearSelect = false,
                           hasSubTotal = false,
                           options
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

    const { methods } = useHttp();
    const [data, setData] = useState(null);
    const [storageKey,setStorageKey] = useState(`filter_${entityName}`);
    const [filter, setFilter] = useState(generateInitialFilters(columns));

    const getParams = useCallback(() => {
        const params = {}
        Object.keys(filter.search).forEach((key) => {
            params[key] = filter.search[key];
        });
        params['page'] = filter.pageable.page;
        params['size'] = filter.pageable.size;
        params['order'] = filter.sort.order;
        params['sortBy'] = filter.sort.sortBy;

        return params;
    },[filter?.pageable?.page, filter?.pageable?.size, filter?.search, filter?.sort?.order, filter?.sort?.sortBy])




    const updateSearch = (newSearch) => {
        setFilter({
            ...filter,
            search: { ...filter.search, ...newSearch },
            pageable: { ...filter.pageable, page: 0 },
        });
    };

    const updatePageable = (newPageable) => {
        setFilter({ ...filter, pageable: { ...filter.pageable, ...newPageable } });
    };

    const updateSort = (newSort) => {
        setFilter({ ...filter, sort: { ...filter.sort, ...newSort } });
    };

    const resetFilter = () => {
        setFilter(generateInitialFilters(columns));
    };



    // CRUD operations
    const findAll = useCallback(
        async (params) => {
            try {
                const res =  methods.get({
                    url: `${entityName}`, // Adjust the URL as needed
                    params,
                });
                if (res && res?.data)
                setData(res.data);
            } catch (err) {
                setData({
                    content : [],
                    pageable : {
                        pageNumber : 0,
                        pageSize : 10,
                    },
                    totalElements : 0,
                    totalPages : 0,
                })
                openErrorModal(err.message || 'An error occurred while fetching data.');
            }
        },
        [methods, entityName, openErrorModal]
    );

    const handleCreate = useCallback(
        async (newData) => {
            try {
                await methods.post({
                    url: `${entityName}`,
                    body: newData,
                });
                await findAll(getParams());
            } catch (err) {
                openErrorModal(err.message || 'An error occurred while creating data.');
            }
        },
        [methods, entityName, findAll, getParams, openErrorModal]
    );

    const handleUpdate = useCallback(
        async (updatedData) => {
            try {
                await methods.update({
                    url: `${entityName}/${updatedData.id}`, // Assuming 'id' is the identifier
                    body: updatedData,
                });
                await findAll(getParams());
            } catch (err) {
                openErrorModal(err.message || 'An error occurred while updating data.');
            }
        },
        [methods, entityName, findAll, getParams, openErrorModal]
    );

    const handleDelete = useCallback(
        async (id) => {
            try {
                await methods.remove({
                    url: `${entityName}/${id}`,
                });
                await findAll(getParams());
            } catch (err) {
                openErrorModal(err.message || 'An error occurred while deleting data.');
            }
        },
        [methods, entityName, findAll, getParams, openErrorModal]
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
        if (options && typeof options === 'object') {
            if (options?.storageKey) {
                setStorageKey(options?.storageKey);
            }
            const initialFilters = generateInitialFilters(columns, options);
            setFilter(initialFilters);
            sessionStorage.setItem(storageKey, JSON.stringify(initialFilters));
        } else {
            const initialFilters = generateInitialFilters(columns);
            setFilter(initialFilters);
            sessionStorage.setItem(storageKey, JSON.stringify(initialFilters));
        }

        methods.get({
            url : `${entityName}`,
            params : getParams(),
            headers : {}
        }).then(res => {
            if (res && res?.data) {
                setData(res.data)
            }else {
                setData({
                    'content' : [],
                    'pageable' : {
                        'pageNumber': 0,
                        'pageSize': 10,
                    },
                    'totalPages' : 0,
                    'totalElements' : 0
                })
            }
        })
    }, []);



    useDeepCompareEffect(() => {
        sessionStorage.setItem(storageKey, JSON.stringify(filter));
        methods.get({
            url : `${entityName}`,
            params : getParams(),
            headers : {},
        }).then((res) => {
            if (res && res?.data){
                setData(res.data)
            }else {
                setData({
                    'content' : [],
                    'pageable' : {
                        'pageNumber' : 0,
                        'pageSize' : 10,
                    },
                    'totalPages' : 0,
                    'totalElements' : 0,
                })
            }
        });
    }, [filter,storageKey]);

    return (
        <div className="table-container">
            <ButtonContainer
                lastChild={<FileUpload uploadUrl={`/${entityName}/import`} />}
            >
                <Button $variant="primary" onClick={openCreateModal}>
                    جدید
                </Button>

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
