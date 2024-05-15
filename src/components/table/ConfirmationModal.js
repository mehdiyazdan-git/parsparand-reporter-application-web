import Modal from "react-bootstrap/Modal";

const ConfirmationModal = ({ show, handleClose, handleConfirm }) => {
    const handleConfirmClick = () => {
        handleConfirm();
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Body className="text-center" style={{fontFamily:"IRANSans"}}>
                <div>آیا مطمئن به حذف این آیتم هستید؟</div>
                <button className="btn btn-warning btn-sm mb-5 mt-4" onClick={handleClose}>
                    لغو
                </button>
                <button className="btn btn-danger btn-sm mb-5 mt-4 mx-2" onClick={handleConfirmClick}>
                    حذف
                </button>
            </Modal.Body>
        </Modal>
    );
};

export default ConfirmationModal;
