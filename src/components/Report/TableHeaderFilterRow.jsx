import React, {forwardRef, useEffect, useRef} from 'react';
import {useController, useForm, useFormContext, useWatch} from "react-hook-form";

const NumberInput = forwardRef(({name, label, register, control, className}, ref) => {
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    return (
        <input
            ref={inputRef}
            {...register(name, {valueAsNumber: true})}
            className="form-control"
        />
    );
});
const DateInput = forwardRef(({name, label, register, control, className}, ref) => {
    const inputRef = useRef(null);
    const methods = useForm({mode: "onChange"});
    const {value} = useWatch({control});

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    return (
        <input
            ref={inputRef}
            {...register(name)}
            className="form-control"
        />
    );
});
const SelectInput = forwardRef(({name, label, register, control, className, options}, ref) => {
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

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
});

const CheckboxInput = forwardRef(({name, label, register, control, className}, ref) => {
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    return (
        <input
            ref={inputRef}
            type="checkbox"
            {...register(name)}
            className="form-control"
        />
    );
});

const RadioInput = forwardRef(({name, label, register, control, className, options}, ref) => {
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

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
    });

    const TextInput = forwardRef(({name, label, register, control, className}, ref) => {
        const inputRef = useRef(null);

        useEffect(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, []);

        return (
            <td>
                <input
                    ref={inputRef}
                    {...register(name)}
                    className="form-control"
                />
            </td>
        )
    });


const TableHeaderFilterRow = ({columns, filter, updateFilter}) => {
    const {
        register, control
        , handleSubmit,
        formState,
    } = useForm({
        mode: "onChange",
        defaultValues: filter
    });

    const values = useWatch({
        control: control
    });
    const onSubmit = (data) => {
        console.log(data);
    }

    useEffect(() => {
        const dirtyFields = formState.dirtyFields;
        const dirtyValues = Object.entries(dirtyFields).reduce((acc, [key, isDirty]) => {
            if (isDirty) {
                acc[key] = values[key];
            }
            return acc;
        }, {});

        if (Object.keys(dirtyValues).length > 0) {
            updateFilter(dirtyValues);
        }
    }, [values, formState.dirtyFields, updateFilter]);

    return (
           <>
               {columns.map((column) => (
                   <th className={'p-0 m-0'} key={column.key}>
                       <TextInput name={column.key} control={control} key={column.key} register={register} />
                   </th>
               ))}
           </>

    );

};


export default TableHeaderFilterRow;


