import { useState, useCallback } from 'react';

const useModalManager = () => {
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [editingEntity, setEditingEntity] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const openCreateModal = useCallback(() => {
        setShowModal(true);
    }, []);

    const closeCreateModal = useCallback(() => {
        setShowModal(false);
    }, []);

    const openEditModal = useCallback((entity) => {
        setEditingEntity(entity);
        setShowEditModal(true);
    }, []);

    const closeEditModal = useCallback(() => {
        setEditingEntity(null);
        setShowEditModal(false);
    }, []);

    const openErrorModal = useCallback((message) => {
        setErrorMessage(message);
        setShowErrorModal(true);
    }, []);

    const closeErrorModal = useCallback(() => {
        setErrorMessage('');
        setShowErrorModal(false);
    }, []);

    return {
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
    };
};

export default useModalManager;
