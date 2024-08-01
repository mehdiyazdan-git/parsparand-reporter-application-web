import React, {useEffect} from 'react';
import useModalManager from '../hooks/useModalManager';
import ButtonContainer from './ButtonContainer';
import FileUpload from './FileUpload';
import Button from './Button';
import Table from '../components/table/Table';
import { SiMicrosoftexcel } from 'react-icons/si';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import {generateInitialFilters} from "../components/contexts/generateInitialFilters";
import {useFilter} from "../components/contexts/useFilter";
import {filterToSearchParams} from "../components/contexts/filterToSearchParams";
import {useHttp} from "../components/contexts/useHttp";
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

    const [data,setData] = React.useState(null);
    const {filter, updateSearch,updatePageable,updateSort,getParams} = useFilter(entityName, {...generateInitialFilters(columns)});

    const params = filterToSearchParams(filter);
    const { findAll, postEntity, updateEntity, deleteEntity } = useHttp(entityName);



    const handleDelete = (id) => {
        deleteEntity(id).then(() => {
            findAll(params).then((res) => {
                setData(res.data);
            })
        })
    };

    const handleUpdate = (id, data) => {
        updateEntity(id, data).then(() => {
            findAll(params).then((res) => {
                setData(res.data);
            })
        })
    }
    const handleCreate = (data) => {
        postEntity(data).then(() => {
            findAll(params).then((res) => {
                setData(res.data);
            })
        })
    }
    const handleDownload = (params, isExport) => {
        findAll(params, isExport).then((res) => {
            setData(res.data);
        })
    }

    useDeepCompareEffect(() => {
        findAll(params).then((res) => {
            setData(prevState => {
                return {
                    ...prevState,
                    data: res.data
                }
            })
            })
        }, [filter,entityName])


    return (
        <div className="table-container">
            <ButtonContainer
                lastChild={
                    <FileUpload
                        uploadUrl={`/${entityName}/import`}
                        refreshTrigger={null}
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
                    onClick={() => handleDownload(params, false)}
                    size={"2.2rem"}
                    className={"m-1"}
                    color={"#41941a"}
                    type="button"
                />
                {createForm && React.cloneElement(createForm, {
                    onCreateEntity: handleCreate,
                    show: showModal,
                    onHide: closeCreateModal
                })}
            </ButtonContainer>

            <Table
                data={data}
                columns={columns}
                hasSubTotal={hasSubTotal}
                hasYearSelect={hasYearSelect}
                postEntity={postEntity}
                updateEntity={updateEntity}
                deleteEntity={handleDelete}
                filter={filter}
                updateSearch={updateSearch}
                updatePageable={updatePageable}
                updateSort={updateSort}
                getParams={getParams}
            />

            {editingEntity && editForm && React.cloneElement(editForm, {
                editingEntity: editingEntity,
                show: showEditModal,
                onUpdateEntity: handleUpdate,
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
