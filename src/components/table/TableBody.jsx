import React, {useCallback, useState} from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import IconEdit from '../assets/icons/IconEdit';
import IconDeleteOutline from '../assets/icons/IconDeleteOutline';
import IconKey from '../assets/icons/IconKey';
import ConfirmationModal from './ConfirmationModal';
import LoadingDataErrorPage from '../../utils/LoadingDataErrorPage';

const TableBody = ({data, columns, onEdit, onDelete, onResetPassword }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    // sessionStorage.getItem('filter_data') && sessionStorage.removeItem('filter_data')

    const handleDeleteConfirm = useCallback(async () => {
        if (selectedItem) {
            try {
                const errorMessage = await onDelete(selectedItem);
                if (errorMessage) {
                    setErrorMessage(errorMessage);
                    setShowErrorModal(true);
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

    if (!data) {
        return <LoadingDataErrorPage />;
    }

    return (
        <tbody>
        {data.map((item) => (
            <tr key={item.id}>
                {columns.map((column) => (
                    <td style={{ fontSize: '0.72rem' }} key={column.key}>
                        {column.render ? column.render(item) : item[column.key]}
                    </td>
                ))}
                <td style={{
                    padding: '0px',
                    whiteSpace: 'nowrap',
                    width: '3%',
                    justifyContent: 'center',
                    textAlign: 'center'
                }}>
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
        <ConfirmationModal
            show={showConfirmationModal}
            handleClose={() => setShowConfirmationModal(false)}
            handleConfirm={handleDeleteConfirm}
            message="آیا از حذف این مورد مطمئن هستید؟"
        />
        <ErrorModal show={showErrorModal} handleClose={() => setShowErrorModal(false)} errorMessage={errorMessage} />
        </tbody>
    );
};

TableBody.propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onResetPassword: PropTypes.func,
};

export default TableBody;
