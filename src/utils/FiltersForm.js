import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import AsyncSelectInput from "./AsyncSelectInput";
import {Form} from "./Form";
import DateInput from "./DateInput";
import SelectInput from "./SelectInput";
import CheckboxInput from "./CheckboxInput";
import NumberInput from "./NumberInput";
import {TextInput} from "./TextInput";

const FiltersForm = ({ columns }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        register,
        watch,
        reset,
        setValue
    } = useForm();

    // Function to parse search parameters from URL
    const getSearchParams = () => {
        const searchParams = new URLSearchParams(location.search);
        return columns.reduce((acc, column) => {
            if (column.searchable) {
                acc[column.key] = searchParams.get(column.key) || '';
            }
            return acc;
        }, {});
    };

    // Initialize the form with URL search parameters or default values
    useEffect(() => {
        const searchParams = getSearchParams();
        Object.keys(searchParams).forEach(key => {
            setValue(key, searchParams[key]);
        });
    }, [setValue, location.search]);

    // Watch for changes in all searchable fields
    const watchedValues = watch(Object.keys(getSearchParams()));

    useEffect(() => {
        // Function to update the URL with the search params
        const updateSearchParams = () => {
            const searchParams = new URLSearchParams();

            Object.keys(watchedValues).forEach(key => {
                if (watchedValues[key]) {
                    searchParams.append(key, watchedValues[key]);
                }
            });

            // Update the URL with the new search params
            navigate(`${location.pathname}?${searchParams.toString()}`);
        };

        updateSearchParams();
    }, [watchedValues, navigate, location.pathname]);

    // Function to handle search parameter change
    const handleSearchChange = (key, value) => {
        setValue(key, value);
    };

    // Function to reset filters
    const onReset = () => {
        reset(getSearchParams());
        navigate(location.pathname);
    };

    return (
        <div className={'filters-form m-1 p-1 bg-white rounded shadow-sm'}>
            <Form>
                {columns.map((column) =>
                    column.searchable ? (
                        column.type === 'date' ? (
                            <DateInput
                                key={column.key}
                                width={column.width}
                                name={column.key || ''}
                            />
                        ) : column.type === 'select' ? (
                            <SelectInput
                                key={column.key}
                                width={column.width}
                                name={column?.key || ''}
                                options={column.options}
                            />
                        ) : column.type === 'async-select' ? (
                            <AsyncSelectInput
                                key={column.key}
                                width={column.width}
                                name={column.key}
                                apiFetchFunction={column.apiFetchFunction}
                                defaultValue={location.search[column.key]}
                                onChange={(value) => handleSearchChange(column.key, value)}
                            />
                        ) : column.type === 'checkbox' ? (
                            <CheckboxInput
                                width={column.width}
                                name={column?.key || ''}
                            />
                        ) : column.type === 'number' ? (
                            <NumberInput
                                width={column.width}
                                name={column.key}
                            />
                        ) : (
                            <TextInput
                                width={column.width}
                                name={column?.key || ''}
                            />
                        )

                    ) : (
                        <th className={'align-content-md-stretch'} key={column.key} style={{width:`${column.width}`}}></th>
                    )
                )}
                <button type="button" onClick={onReset}>Reset Filters</button>
            </Form>
        </div>
    );
};

export default FiltersForm;
