import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";
import React from "react";

const ErrorModal = ({show, handleClose, errorMessage}) => (
    <Modal show={show} onHide={handleClose} centered>
        <Modal.Body
            className="text-center"
            style={{fontFamily: 'IRANSans', fontSize: '0.8rem', padding: '20px', fontWeight: 'bold'}}
        >
            <div className="text-danger">{errorMessage}</div>
            <button className="btn btn-primary btn-sm mt-4" onClick={handleClose}>
                بستن
            </button>
        </Modal.Body>
    </Modal>
);
export default ErrorModal;

ErrorModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    errorMessage: PropTypes.string.isRequired,
};