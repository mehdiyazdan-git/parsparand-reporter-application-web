import React, { useEffect, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';

const NumberInput = ({ name, label, register }) => {
    const inputRef = useRef(null);

    return (
        <input
            ref={inputRef}
            {...register(name, { valueAsNumber: true })}
            className="form-control"
        />
    );
};

const DateInput = ({ name, label, register }) => {
    const inputRef = useRef(null);

    return (
        <input
            ref={inputRef}
            {...register(name)}
            className="form-control"
        />
    );
};

const SelectInput = ({ name, label, register, options }) => {
    const inputRef = useRef(null);

    return (
        <select
            ref={inputRef}
            {...register(name)}
            className="form-control"
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

const CheckboxInput = ({ name, label, register }) => {
    const inputRef = useRef(null);

    return (
        <input
            ref={inputRef}
            type="checkbox"
            {...register(name)}
            className="form-control"
        />
    );
};

const RadioInput = ({ name, label, register, options }) => {
    const inputRef = useRef(null);

    return (
        <div>
            {options.map((option) => (
                <div key={option.value}>
                    <input
                        ref={inputRef}
                        type="radio"
                        {...register(name)}
                        value={option.value}
                        className="form-control"
                    />
                    {option.label}
                </div>
            ))}
        </div>
    );
};

const TableHeaderFilterRow = ({ columns, filter, updateFilter }) => {
    const {
        register,
        control,
        handleSubmit,
        formState: { dirtyFields },
    } = useForm({
        mode: 'onChange',
        defaultValues: filter,
    });

    const values = useWatch({
        control,
    });

    useEffect(() => {
        const dirtyValues = Object.entries(dirtyFields).reduce(
            (acc, [key, isDirty]) => {
                if (isDirty) {
                    acc[key] = values[key];
                }
                return acc;
            },
            {}
        );

        if (Object.keys(dirtyValues).length > 0) {
            updateFilter(dirtyValues);
        }
    }, [values, dirtyFields, updateFilter]);

    return (
        <>
            {columns.map((column) => (
                <th className="p-0 m-0" key={column.key}>
                    <TextInput name={column.key} control={control} register={register} />
                </th>
            ))}
        </>
    );
};

const TextInput = ({ name, control, register }) => {
    const inputRef = useRef(null);

    return (
        <input
            ref={inputRef}
            {...register(name)}
            className="form-control"
        />
    );
};

export default TableHeaderFilterRow;
