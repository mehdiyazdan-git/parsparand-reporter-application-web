import React, {useState, useEffect, useCallback} from 'react';
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

const AsyncSelectSearch = ({url, value,name, onChange}) => {
    const {getAll} = useHttp();

    // --- State ---
    const [isLoading, setIsLoading] = useState(false);
    const [defaultOptions, setDefaultOptions] = useState([]); // Store default options


    // --- Functions ---
    const loadOptions = useCallback( async (inputValue, callback) => {
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
                if (inputValue === ""){
                    setDefaultOptions(options)
                }
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
    },[url,getAll]);

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
// --- Effects ---
    useEffect(() => {
        loadOptions("", setDefaultOptions)
    }, []); // Re-fetch if url or getAll changes
    // --- JSX ---
    return (
        <SelectContainer>
            <AsyncSelect
                cacheOptions // Enable caching for better performance
                defaultOptions={defaultOptions}
                loadOptions={loadOptions}
                name={name}
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