import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const VATRateCRUD = () => {
    const [vatRates, setVatRates] = useState([]);
    const [formData, setFormData] = useState({ id: '', rate: '', effectiveFrom: '' });
    const [isEditing, setIsEditing] = useState(false);

    const BASE_URL = 'http://localhost:9090/api/vat-rates';

    // Fetch all VAT rates
    const fetchVatRates = async () => {
        try {
            const response = await axios.get(BASE_URL);
            setVatRates(response.data);
        } catch (error) {
            console.error('Error fetching VAT rates:', error);
        }
    };

    // Create a new VAT rate
    const createVatRate = async () => {
        try {
            const response = await axios.post(BASE_URL, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setVatRates([...vatRates, response.data]);
            resetForm();
        } catch (error) {
            console.error('Error creating VAT rate:', error);
        }
    };

    // Update an existing VAT rate
    const updateVatRate = async () => {
        try {
            const response = await axios.put(`${BASE_URL}/${formData.id}`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setVatRates(
                vatRates.map((rate) =>
                    rate.id === formData.id ? response.data : rate
                )
            );
            resetForm();
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating VAT rate:', error);
        }
    };

    // Delete a VAT rate
    const deleteVatRate = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/${id}`);
            setVatRates(vatRates.filter((rate) => rate.id !== id));
        } catch (error) {
            console.error('Error deleting VAT rate:', error);
        }
    };

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        if (isEditing) {
            updateVatRate();
        } else {
            createVatRate();
        }
    };

    // Handle input change
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    // Reset form
    const resetForm = () => {
        setFormData({ id: '', rate: '', effectiveFrom: '' });
        setIsEditing(false);
    };

    // Handle edit
    const handleEdit = (rate) => {
        setFormData(rate);
        setIsEditing(true);
    };

    useEffect(() => {
        fetchVatRates();
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="mb-4">VAT Rates</h1>
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="row g-3">
                    <div className="col-md-4">
                        <input
                            type="number"
                            className="form-control"
                            name="rate"
                            value={formData.rate}
                            placeholder="Rate"
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="col-md-4">
                        <input
                            type="date"
                            className="form-control"
                            name="effectiveFrom"
                            value={formData.effectiveFrom}
                            placeholder="Effective From"
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="col-md-4">
                        <button type="submit" className="btn btn-primary me-2">
                            {isEditing ? 'Update' : 'Create'} VAT Rate
                        </button>
                        {isEditing && (
                            <button onClick={resetForm} className="btn btn-secondary">
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            </form>

            <h2 className="mb-3">All VAT Rates</h2>
            <table className="table table-striped table-hover">
                <thead>
                <tr>
                    <th>Rate</th>
                    <th>Effective From</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {vatRates.map((rate) => (
                    <tr key={rate.id}>
                        <td>{rate.rate}</td>
                        <td>{rate.effectiveFrom}</td>
                        <td>
                            <button
                                onClick={() => handleEdit(rate)}
                                className="btn btn-sm btn-warning me-2"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => deleteVatRate(rate.id)}
                                className="btn btn-sm btn-danger"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default VATRateCRUD;