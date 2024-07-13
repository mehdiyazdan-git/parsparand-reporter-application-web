import React from 'react';
import { saveAs } from 'file-saver';
import { useCrudService } from '../service/useCrudService';
import useModalManager from '../hooks/useModalManager';
import useData from '../hooks/useData';
import ButtonContainer from './ButtonContainer';
import FileUpload from './FileUpload';
import Button from './Button';
import Table from '../components/table/Table';
import { SiMicrosoftexcel } from 'react-icons/si';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import {useDataContext} from "../components/contexts/DataContext";
import useDeepCompareEffect from "../hooks/useDeepCompareEffect";


const ErrorModal = ({ show, handleClose, errorMessage }) => (
    <Modal show={show} onHide={handleClose} centered>
        <Modal.Body
            className="text-center"
            style={{ fontFamily: 'IRANSans', fontSize: '0.8rem', padding: '20px', fontWeight: 'bold' }}>
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
    errorMessage: PropTypes.string.isRequired
};

const CrudComponent = (
                        {
                            entityName,
                            columns,
                            createForm,
                            editForm,
                            hasYearSelect = false,
                            hasSubTotal = false,
                            url
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

    const initialFilter = (columns) => {
        const filter = {};
        columns.forEach((column) => {
            if (column.searchable) {
                filter[column.key] = '';
            }
        });
        return filter;
    }

    const {

        loading,
        error,
        fetchData,
        filter,
        getParams,
        refreshTrigger,
        updateFilter,
        handleSizeChange,
        goToFirstPage,
        goToPrevPage,
        goToNextPage,
        goToLastPage
    } = useData(entityName, {...initialFilter(columns), page: 0, size: 10, sortBy: 'id', order: 'asc',});

    const { create, update, remove, download } = useCrudService(entityName);

    const handleAddEntity = async (newEntity) => {
        try {
            const response = await create(newEntity);
            if (response.status === 201) {
                 fetchData()
                closeCreateModal();
            }
        } catch (error) {
            openErrorModal(error.response.data);
        }
    }

    const handleUpdateEntity =async (updatedEntity) => {
        try {
            const response = await update(updatedEntity.id, updatedEntity);
            if (response.status === 200) {
                 fetchData()
                closeEditModal();
            } else {
                openErrorModal(response.data);
            }
        } catch (error) {
            openErrorModal(error.response.data);
        }
    }

    const handleDeleteEntity = async (id) => {
        await remove(id);
        fetchData()
    }

    const handleDownload = async (params, isTotal = false) => {
        await download(params)
            .then((response) => response.data)
            .then((blobData) => {
                saveAs(blobData, `${entityName}.xlsx`);
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
            });
    };
    const {dataState} = useDataContext();

    useDeepCompareEffect(() => {
        console.log(dataState?.content)
    }, [dataState]);

    return (
        <div className="table-container">
            <ButtonContainer
                lastChild={
                    <FileUpload
                        uploadUrl={`/${entityName}/import`}
                        refreshTrigger={fetchData}
                    />
                }
            >
                <Button
                    $variant="primary"
                    onClick={openCreateModal}
                >
                    جدید
                </Button>
                <SiMicrosoftexcel
                    onClick={() => handleDownload(getParams(), false)}
                    size={"2.2rem"}
                    className={"m-1"}
                    color={"#41941a"}
                    type="button"
                />
                {createForm && React.cloneElement(createForm, {
                    onCreateEntity: handleAddEntity,
                    show: showModal,
                    onHide: closeCreateModal
                })}
            </ButtonContainer>

            <Table
                columns={columns}
                url={url}
                data={dataState}
                filter={filter}
                updateFilter={updateFilter}
                onEdit={openEditModal}
                onDelete={handleDeleteEntity}
                entityName={entityName}
                downloadExcelFile={handleDownload}
                refreshTrigger={refreshTrigger}
                hasYearSelect={hasYearSelect}
                hasSubTotal={hasSubTotal}
                handleSizeChange={handleSizeChange}
                goToFirstPage={goToFirstPage}
                goToPrevPage={goToPrevPage}
                goToNextPage={goToNextPage}
                goToLastPage={goToLastPage}
            />

            {editingEntity && editForm && React.cloneElement(editForm, {
                editingEntity: editingEntity,
                show: showEditModal,
                onUpdateEntity: handleUpdateEntity,
                onHide: closeEditModal
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
    columns: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        width: PropTypes.string,
        sortable: PropTypes.bool,
        searchable: PropTypes.bool,
        type: PropTypes.string,
        options: PropTypes.array,
        fetchAPI: PropTypes.func,
        render: PropTypes.func
    })).isRequired,
    createForm: PropTypes.element.isRequired,
    editForm: PropTypes.element.isRequired,
    hasYearSelect: PropTypes.bool,
    hasSubTotal: PropTypes.bool
};

export default React.memo(CrudComponent);
