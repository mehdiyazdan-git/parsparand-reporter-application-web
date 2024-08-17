import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import styled from 'styled-components';
import { toast } from "react-toastify";
import useHttp from "../contexts/useHttp";

// Styled Components (You can adjust these as needed to match your design)
const SelectContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 0.1rem;
    width: 100%;
`;

const AsyncSelectSearch = ({ url, value, onChange }) => {
    const { getAll } = useHttp();

    // --- State ---
    const [isLoading, setIsLoading] = useState(false);

    // --- Functions ---
    const loadOptions = async (inputValue, callback) => {
        setIsLoading(true);
        try {
            const response = await getAll(
                encodeURI(url),
                { searchQuery: inputValue }
            );
            if (response && response.data) {
                const options = response.data.map(item => ({
                    value: item.id,
                    label: item.name,
                }));
                callback(options);
            } else {
                callback([]);
            }
        } catch (err) {
            console.error(err);
            toast.error("Error loading options.");
            callback([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (newValue) => {
        // Handle changes in the input value (for filtering/searching)
        return newValue;
    };

    // --- JSX ---
    return (
        <SelectContainer>
            <AsyncSelect
                cacheOptions // Enable caching for better performance
                defaultOptions // Load initial options on component mount
                loadOptions={loadOptions}
                onInputChange={handleInputChange}
                onChange={onChange}
                value={value}
                isLoading={isLoading}
                placeholder="Search for a customer..."
                noOptionsMessage={() => "No customers found"}
                // Add other props like isClearable, styles, etc. as needed
            />
        </SelectContainer>
    );
};

export default AsyncSelectSearch;
