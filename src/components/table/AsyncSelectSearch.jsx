import React, {useState, useEffect} from 'react';
import AsyncSelect from 'react-select/async';
import styled from 'styled-components';
import {toast} from "react-toastify";
import useHttp from "../contexts/useHttp";
import {getCustomSelectStyles} from "../../utils/customStyles";

const SelectContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 0.1rem;
    width: 100%;
`;

const AsyncSelectSearch = ({url, value, onChange}) => {
    const {getAll} = useHttp();

    // --- State ---
    const [isLoading, setIsLoading] = useState(false);
    const [defaultOptions, setDefaultOptions] = useState([]); // Store default options

    // --- Effects ---
    useEffect(() => {
        // Fetch default options on component mount
        const fetchDefaultOptions = async () => {
            setIsLoading(true);
            try {
                const response = await getAll(encodeURI(url));
                if (response && response.data) {
                    const options = response.data.map(item => ({
                        value: item.id,
                        label: item.name,
                    }));
                    setDefaultOptions(options);
                }
            } catch (err) {
                console.error(err);
                toast.error("Error loading default options.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDefaultOptions();
    }, []); // Re-fetch if url or getAll changes

    // --- Functions ---
    const loadOptions = async (inputValue, callback) => {
        setIsLoading(true);
        try {
            const response = await getAll(
                encodeURI(url),
                {searchQuery: inputValue}
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
        return newValue;
    };
    const ClearIndicator = props => {
        const {getStyles, innerProps: {ref, ...restInnerProps},} = props;
        return (
            <div
                {...restInnerProps}
                ref={ref}
                style={getStyles('clearIndicator', props)}
            >
                <div style={{padding: '0 5px'}}>
                    <strong>X</strong>
                </div>
            </div>
        );
    };

    // --- JSX ---
    return (
        <SelectContainer>
            <AsyncSelect
                cacheOptions // Enable caching for better performance
                defaultOptions={defaultOptions}
                loadOptions={loadOptions}
                onInputChange={handleInputChange}
                onChange={onChange}
                value={value}
                isLoading={isLoading}
                placeholder="جستجو..."
                noOptionsMessage={() => "هیچ موردی یافت نشد."}
                styles={getCustomSelectStyles()}
                components={{ ClearIndicator }}
                isClearable={true}
            />
        </SelectContainer>
    );
};

export default AsyncSelectSearch;
