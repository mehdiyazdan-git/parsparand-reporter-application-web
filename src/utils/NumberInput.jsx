import React, { useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { ConnectForm } from './ConnectForm';

const NumberInput = ({ name, label, style, field, ...rest }) => {
    const labelStyle = useMemo(
        () => ({ fontFamily: 'IRANSansBold', fontSize: '0.75rem' }),
        []
    );

    const isInFieldArray = useMemo(
        () => field?.name?.includes('[') && field?.name?.includes(']'),
        [field?.name]
    );

    return (
        <div>
            <label style={labelStyle} className="label">
                {label}
            </label>
            <ConnectForm>
                {({ control, setValue, values }) => (
                    <Controller
                        control={control}
                        name={name}
                        render={({ field, fieldState: { invalid, error } }) => (
                            <>
                                <NumericFormat
                                    placeholder={error ? error.message : ''} // Display error message as placeholder
                                    thousandSeparator=","
                                    value={field.value}
                                    onValueChange={({ value }) => {
                                        if (!isInFieldArray) {
                                            setValue(name, value);
                                        } else {
                                            field.onChange(value);
                                        }
                                    }}
                                    className={` ${
                                        error ? 'red-placeholder error-message' : '' // Apply red-placeholder class on error
                                    }`}
                                    style={{
                                        ...style,
                                        border: error ? '1px solid red' : '',
                                        fontFamily: 'IRANSans',
                                        fontSize: '0.8rem',
                                        padding: '0.5rem',
                                        margin: '0',
                                        width: '100%',
                                        borderRadius: '0.25rem',
                                        borderColor: 'rgb(209, 213, 219)',
                                        background : 'rgba(255, 255, 255, 0.4)'
                                        }}
                                    {...rest}
                                />
                            </>
                        )}
                    />
                )}
            </ConnectForm>
        </div>
    );
};

export default NumberInput;