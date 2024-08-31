import React, {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import useModalManager from '../../hooks/useModalManager';
import ButtonContainer from '../../utils/ButtonContainer';
import FileUpload from '../../utils/FileUpload';
import Button from '../../utils/Button';
import Table from '../table/Table';
import useFilter from './useFilter';
import ErrorModal from './ErrorModal';
import useHttp from './useHttp';
import axios from "axios";
import {BASE_URL} from "../../config/config";


const CrudComponent = ({
                           resourcePath,
                           columns,
                           filterOptions,
                           createForm,
                           editForm,
                           hasYearSelect = false,
                           hasSubTotal = false,
                       }) => {
    const [data, setData] = useState(null);
    const {getAll, post, put, del} = useHttp();
    const {
        showModal,
        showEditModal,
        showErrorModal,
        editingEntity,
        errorMessage,
        openCreateModal,
        closeCreateModal,
        openEditModal,
        closeEditModal,
        openErrorModal,
        closeErrorModal,
    } = useModalManager();

    const filterSchema = {
        search: {},
        pagination: {
            size: 10,
            page: 0,
        },
        sorting: {
            sortBy: 'id',
            order: 'asc',
        },
    };
    const getInitialFilters = (columns) => {
        const search = {};
        columns.forEach((column) => {
            if (column.searchable) {
                if (column.searchKey) {
                    search[column.searchKey] = '';
                } else {
                    search[column.key] = '';
                }
            }
        });
        return {...filterSchema, search};
    };

    const initialFilters = getInitialFilters(columns);

    const {
        filters,
        updateSearchParams,
        updatePagination,
        updateSorting,
        resetFilters,
    } = useFilter(
        filterOptions?.storageKey || resourcePath,
        initialFilters,
    );

    const getParams = (filters) => {
        return Object.entries(filters).reduce((params, [key, value]) => {
            if (typeof value === 'object') {
                Object.assign(params, value);
            } else {
                params[key] = value;
            }
            return params;
        }, {});
    };

    const fetchData = useCallback(async () => {
        try {
            const response = await getAll(encodeURI(resourcePath), getParams(filters));
            setData(response.data);
        } catch (err) {
            console.error('Error fetching data:', err);
            openErrorModal(err?.message || 'An error occurred while fetching data');
        }
    }, [filters, openErrorModal, resourcePath]);

    useEffect(() => {
        if (filterOptions?.filter?.search) {
            Object.keys(filterOptions?.filter?.search).forEach((key) => {
                if (filters?.search[key] !== filterOptions?.filter?.search[key]) {
                    updateSearchParams({[key]: filterOptions?.filter?.search[key]});
                }
            })
            updatePagination({page : 0,size : 5})
            updateSorting({sortBy : 'id',order : 'asc'})
        }
        fetchData();
    }, [filterOptions?.filter?.search]);


    useEffect(() => {
        fetchData();
    }, [fetchData]); // Use fetchData as a dependency

    const handleExportToExcel = async (exportAll = false) => {

        const url = `${BASE_URL}/${encodeURI(resourcePath)}/download-all-${encodeURI(resourcePath)}.xlsx`;

        const params = getParams(filters);
        if (exportAll) {
            params.size = 1000000;
            params.page = 0;
        }
        try {
            await axios.get(url, {
                params: params,
                responseType: 'blob', // Important
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `download-all-${encodeURI(resourcePath)}.xlsx`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
        } catch (err) {
            console.error('Error exporting data:', err);
            openErrorModal(err?.message || 'An error occurred while exporting data');
        }
    };

    const handleCreateEntity = async (formData) => {
        try {
            const response = await post(encodeURI(resourcePath), formData);
            if (response?.status === 201) {
                await fetchData();
                closeCreateModal();
            }
        } catch (err) {
            console.error('Error creating entity:', err);
            openErrorModal(err?.response?.data || 'An error occurred while creating the entity');
        }
    };

    const handleUpdateEntity = async (formData) => {
        try {
            const pathVariable = formData?.id || '';
            const response = await put(`${encodeURI(resourcePath)}/${encodeURIComponent(pathVariable)}`, formData);
            if (response?.status === 200) {
                await fetchData();
                closeEditModal();
            }
        } catch (err) {
            console.error('Error updating entity:', err);
            openErrorModal(err?.response?.data || `An error occurred while updating the entity: ${err.response?.status}`);
        }
    };

    const handleDeleteEntity = async (id) => {
        try {
            const response = await del(`${encodeURI(resourcePath)}/${id}`);
            if (response?.status === 204) {
                await fetchData();
            }
        } catch (err) {
            console.error('Error deleting entity:', err);
            openErrorModal(err?.response?.data || 'An error occurred while deleting the entity');
        }
    };

    const onSuccess = async () => {
        await fetchData();
    };

    return (
        <div className="table-container">
            <ButtonContainer
                lastChild={<FileUpload uploadUrl={`/${resourcePath}/upload`} onSuccess={onSuccess}/>}
            >
                <Button $variant="primary" onClick={openCreateModal}>
                    جدید
                </Button>
                {/*<DownloadFile*/}
                {/*    exportAll={false}*/}
                {/*    fileName={resourcePath}*/}
                {/*    params={getParams(filters)}*/}
                {/*/>*/}
                {createForm && React.cloneElement(createForm, {
                    onCreateEntity: handleCreateEntity,
                    show: showModal,
                    onHide: closeCreateModal,
                })}
            </ButtonContainer>

            <Table
                data={data}
                columns={columns}
                hasSubTotal={hasSubTotal}
                hasYearSelect={hasYearSelect}
                filters={filters}
                params={getParams(filters)}
                resetFilter={resetFilters}
                handleEditButtonClick={openEditModal}
                updateSearchParams={updateSearchParams}
                updatePagination={updatePagination}
                updateSorting={updateSorting}
                onDownloadExcelFile={handleExportToExcel}
                onDeleteEntity={handleDeleteEntity}
                resourcePath={resourcePath}
            />

            {
                editingEntity && editForm && React.cloneElement(editForm, {
                    editingEntity,
                    show: showEditModal,
                    onUpdateEntity: handleUpdateEntity,
                    onHide: closeEditModal,
                })
            }

            <ErrorModal
                show={showErrorModal}
                handleClose={closeErrorModal}
                errorMessage={errorMessage}
            />
        </div>
    )
        ;
};

CrudComponent.propTypes = {
    resourcePath: PropTypes.string.isRequired,
    columns: PropTypes.array.isRequired,
    createForm: PropTypes.element,
    editForm: PropTypes.element,
    hasYearSelect: PropTypes.bool,
    hasSubTotal: PropTypes.bool,
};

export default CrudComponent;
