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
import useHttp from "./useHttp";


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
                           resourcePath,
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
        editingEntity,
        errorMessage,
        openCreateModal,
        closeCreateModal,
        openEditModal,
        closeEditModal,
        openErrorModal,
        closeErrorModal
    } = useModalManager();

    const [data, setData] = useState(null);
    const {getAll, post, put, del} = useHttp();

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
    } = useFilter(resourcePath,initialFilters);



    const getParams = (filters) => {
        return {
            ...filters.search,
            ...filters.pagination,
            ...filters.sorting
        }
    }
    const params = {...getParams(filters)};

    const fetchData = async () => {
        try {
            const response = await  getAll(encodeURI(resourcePath), {...params})
            setData(response.data)
        } catch (err) {
            console.error("Error fetching data:", err);
            openErrorModal(err.message || "An error occurred while fetching data");
            return null;
        }
    }

    useDeepCompareEffect(() => {
        fetchData();
    }, [filters]);
    



    // // CRUD operations

    const handleExportToExcel = async (url, exportAll = false) => {
        const params = { ...getParams(filters) }
        if (exportAll) {
            params['pagination'] = {
                size: 1000000,
                page: 0
            }
        }
        try {
            await getAll(resourcePath, params); // Use getAll for export
        } catch (err) {
            console.error("Error exporting data:", err);
            openErrorModal(err?.message || "An error occurred while exporting data");
        }
    }

    const handleCreateEntity = async (formData) => {
        try {
            const response = await post(resourcePath, formData); // Use post from useHttp
            if (response?.status === 201) {
                closeEditModal();
                await fetchData().then(data => setData(data));
            }
        } catch (err) {
            console.error("Error creating entity:", err);
            openErrorModal(err?.message || "An error occurred while creating the entity");
        }
    };

    const handleUpdateEntity = async (formData) => {
        try {
            const pathVariable = formData?.id || ''; // Assuming 'id' is the primary key
            const response = await put(`${encodeURI(resourcePath)}/${encodeURIComponent(pathVariable)}`, formData); // Use put from useHttp
            if (response?.status === 200) {
                closeEditModal();
                await fetchData().then(data => setData(data));
            }
        } catch (err) {
            console.error("Error updating entity:", err);
            openErrorModal(err?.message || "An error occurred while updating the entity");
        }
    };

    const handleDeleteEntity = async (id) => {
        try {
            const response = await del(`${encodeURI(resourcePath)}/${id}`); // Use del from useHttp
            if (response?.status === 204) {
                await fetchData().then(data => setData(data));
            }
        } catch (err) {
            console.error("Error deleting entity:", err);
            openErrorModal(err?.message || "An error occurred while deleting the entity");
        }
    };


    return(
        <div className="table-container">
            <ButtonContainer
                lastChild={<FileUpload uploadUrl={`/${resourcePath}/import`}/>}
            >
                <Button $variant="primary" onClick={openCreateModal}>
                    جدید
                </Button>

                <SiMicrosoftexcel
                    onClick={() => handleExportToExcel(`${encodeURI(resourcePath)}/download-all-${encodeURI(resourcePath)}.xlsx`,false)}
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
                filter={filters}
                resetFilter={resetFilters}
                handleEditButtonClick={openEditModal}
                updateSearchParams={updateSearchParams}
                updatePagination={updatePagination}
                updateSorting={updateSorting}
                params={params}
                onDeleteEntity={handleDeleteEntity}
                onDownloadExcelFile={handleExportToExcel}
                resourcePath={resourcePath}
            />

            {editingEntity && editForm && React.cloneElement(editForm, {
                editingEntity,
                show: showEditModal,
                onUpdateEntity: handleUpdateEntity,
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
    resourcePath: PropTypes.string.isRequired,
    columns: PropTypes.array.isRequired,
    createForm: PropTypes.element,
    editForm: PropTypes.element,
    hasYearSelect: PropTypes.bool,
    hasSubTotal: PropTypes.bool,
};

export default CrudComponent;
