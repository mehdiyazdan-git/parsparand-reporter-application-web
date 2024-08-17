import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {SiMicrosoftexcel} from 'react-icons/si';

import useModalManager from '../../hooks/useModalManager';
import ButtonContainer from '../../utils/ButtonContainer';
import FileUpload from '../../utils/FileUpload';
import Button from '../../utils/Button';
import Table from '../table/Table';
import useFilter from "./useFilter";
import useDeepCompareEffect from "../../hooks/useDeepCompareEffect";
import ErrorModal from "./ErrorModal";
import axios from "axios";
import {BASE_URL} from "../../config/config";


const filterSchema = {
    'search': {},
    'pagination': {
        size: 10,
        page: 0
    },
    'sorting': {
        sortBy: 'id',
        order: 'asc'
    },
}

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
        closeEditModal,
        openErrorModal,
        editingEntity,
        closeErrorModal,
    } = useModalManager();

    const [data, setData] = useState(null);

    const getInitialFilters = (columns) => {
        const search = {};
        columns.forEach(column => {
            if (column.searchable) {
                search[column.key] = '';
            }
        })
        return {...filterSchema, search};
    };

    const initialFilters = getInitialFilters(columns);

    const {
        filters,
        updateSearchParams,
        updatePagination,
        updateSorting,
        resetFilters,
    } = useFilter(entityName,initialFilters);


    const getParams = (filters) => {
        return {
            ...filters.search,
            ...filters.pagination,
            ...filters.sorting
        }
    }
    const fetchData = async (url = encodeURI(BASE_URL) + "/" + encodeURI(entityName), params = getParams(filters)) => {
        const response = await axios.get(url, {params});
        return response.data;
    }

    useDeepCompareEffect(() => {
        fetchData(encodeURI(BASE_URL) + "/" + encodeURI(entityName), getParams(filters)).then(data => setData(data));
    }, [entityName, filters, fetchData]);
    



    // // CRUD operations

    const handleExportToExcel = async (url, exportAll = false) => {
        const params = {...getParams(filters)}
            if (exportAll) {
                params['pagination'] = {
                    size: 1000000,
                    page: 0
                }
            }
            await axios.get(encodeURI(BASE_URL) + "/" + encodeURI(entityName), {
                params
            })
    }

    const handleCreateEntity = async (entity) => {
        try {
            const url = `/${entityName}`
            const response =  await axios.post(url,entity,{});
                        if (response.status === 201){
                            closeEditModal();
                            await fetchData().then(data => setData(data));
                        }
        } catch (error) {
            openErrorModal(error.message);
        }
    };

    const handleUpdateEntity = async (entity) => {
        try {
           const response = await  axios.put(`/${entityName}/${editingEntity.id}`, entity);
           if (response.status === 200){
               closeEditModal();
               await fetchData().then(data => setData(data));
           }
        } catch (error) {
            openErrorModal(error.message);
        }
    };

    const handleDeleteEntity = async (id) => {
        try {
           const response = await axios.delete(`/${entityName}/${id}`);
           if (response.status === 204){
               await fetchData().then(data => setData(data));
           }
        } catch (error) {
            openErrorModal(error.message);
        }
    };


    return(
        <div className="table-container">
            <ButtonContainer
                lastChild={<FileUpload uploadUrl={`/${entityName}/import`}/>}
            >
                <Button $variant="primary" onClick={openCreateModal}>
                    جدید
                </Button>

                <SiMicrosoftexcel
                    onClick={() => handleExportToExcel(`${entityName}/download-all-${entityName}.xlsx`,
                        {contentType : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}
                    )}
                    size="2.2rem"
                    className="m-1"
                    color="#41941a"
                    type="button"
                />
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
                onEdit={handleUpdateEntity}
                onDelete={handleDeleteEntity}
                filter={filters}
                resetFilter={resetFilters}
                updateSearchParams={updateSearchParams}
                updatePagination={updatePagination}
                updateSorting={updateSorting}
                getParams={getParams}
                onDownloadExcelFile={handleExportToExcel}
                entityName={entityName}
            />

            {editingEntity && editForm && React.cloneElement(editForm, {
                editingEntity,
                show: showEditModal,
                onUpdateEntity: '',
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
