import React, {useMemo, useState} from 'react';
import { Controller } from 'react-hook-form';
import { ConnectForm } from './ConnectForm';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export function TextInput({ name,backgroundColor,field, label,labelStyle, type, ...rest }) {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const isInFieldArray = useMemo(() => (
        field?.name?.includes('[') && field?.name?.includes(']')
    ), [field?.name]);

    return (
        <ConnectForm>
            {({ control, setValue }) => (
                <Controller
                    name={name}
                    control={control}
                    defaultValue=""
                    render={({
                                 field: controlledField, // Rename to avoid shadowing
                                 fieldState
                             }) => {
                        const hasError = fieldState.error;
                        return (
                            <div style={{ marginBottom: '1rem' }}>
                                <label className="label" style={{ fontFamily: "IRANSansBold", fontSize: "0.75rem" }}>{label}</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        {...(field || controlledField)} // Use 'field' if available, otherwise 'controlledField'
                                        {...rest}
                                        type={type === 'password' && !showPassword ? 'password' : 'text'}
                                        className={`input ${hasError ? 'red-placeholder' : ''}`}
                                        onChange={(e) => {
                                            if (!isInFieldArray) {
                                                setValue(name, e.target.value);
                                            } else {
                                                field.onChange(e); // Pass the entire event object for field arrays
                                            }
                                        }}
                                        style={{
                                            border: hasError ? '1px solid red' : '1px solid #ccc',
                                            color: hasError ? 'red' : '#000',
                                            width: '100%',
                                            boxSizing: 'border-box',
                                            minHeight: '35px',
                                            backgroundColor: backgroundColor ? backgroundColor : 'rgba(255, 255, 255, 0.5)',
                                            fontSize: '0.7rem',
                                            paddingRight: type === 'password' ? '40px' : '10px',
                                            paddingLeft: '10px',
                                            textOverflow : "ellipsis",
                                            whiteSpace : "nowrap",
                                            overflow: "hidden",
                                            textIndent:"0.5rem",
                                            padding:"0 0.1rem",
                                            borderRadius: "0.25rem",
                                            lineHeight: "1.0rem",
                                            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",

                                            "&:focus": {
                                            outline: "none",
                                            borderColor: 'rgba(255, 255, 255, 0.5)',
                                            boxShadow: "0 0 0 0.25rem rgba(13, 110, 253, 0.25)",
                                        },
                                            "&::placeholder": {
                                            color: "#6b7280",
                                            opacity: "1",
                                            textIndent:"0.5rem",
                                        },
                                            "&:-webkit-autofill": {
                                            boxShadow: "0 0 0 1000px rgba(255, 255, 255, 0.5) inset",

                                            "&:focus": {
                                            borderColor: 'rgba(255, 255, 255, 0.5)',
                                            boxShadow: "0 0 0 0.25rem rgba(13, 110, 253, 0.25)",
                                        },
                                        },
                                            "&:disabled": {
                                            cursor: "not-allowed",
                                            backgroundColor: "#e5e7eb",
                                            borderColor: "#d1d5db",
                                            opacity: 0.5,
                                        },
                                        }}
                                    />
                                    {type === 'password' && (
                                        <button
                                            type={"button"}
                                            onClick={togglePasswordVisibility}
                                            tabIndex={-1}
                                            style={{
                                                position: 'absolute',
                                                top: '0',
                                                right: '1px',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '35px',
                                                backgroundColor: backgroundColor ? backgroundColor : 'rgba(255, 255, 255, 0.1)',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: 0,
                                                zIndex: 2,
                                            }}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    )}
                                </div>
                                {hasError && <p style={{ color: 'red', fontSize: '0.6rem' }}>{fieldState.error.message}</p>}
                            </div>
                        );
                    }}
                />
            )}
        </ConnectForm>
    );
}
