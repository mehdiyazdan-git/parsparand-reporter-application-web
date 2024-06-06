import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { ConnectForm } from './ConnectForm';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export function TextInput({ name,backgroundColor, label,labelStyle, type, ...rest }) {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <ConnectForm>
            {({ control }) => (
                <Controller
                    name={name}
                    control={control}
                    defaultValue=""
                    render={({ field, fieldState }) => {
                        const hasError = fieldState.error;
                        return (
                            <div style={{ marginBottom: '1rem' }}>
                                <label className="label" style={{fontFamily:"IRANSansBold",fontSize:"0.75rem"}}>{label}</label>
                                <div style={{ position: 'relative'}}>
                                    <input
                                        {...field}
                                        {...rest}
                                        type={type === 'password' && !showPassword ? 'password' : 'text'}
                                        className={`input ${hasError ? 'red-placeholder' : ''}`}
                                        style={{
                                            border: hasError ? '1px solid red' : '1px solid #73b5fe',
                                            borderRadius: '4px',
                                            color: hasError ? 'red' : '#000',
                                            width: '100%',
                                            boxSizing: 'border-box',
                                            minHeight: '40px',
                                            backgroundColor: backgroundColor ? backgroundColor : 'rgba(255, 255, 255, 0.1)',
                                            fontSize: '0.8rem',
                                            paddingRight: type === 'password' ? '40px' : '10px',
                                            paddingLeft: '10px',
                                            textOverflow : "ellipsis",
                                            whiteSpace : "nowrap",
                                            overflow: "hidden",
                                        }}
                                    />
                                    {type === 'password' && (
                                        <button
                                            type={"button"}
                                            onClick={togglePasswordVisibility}
                                            style={{
                                                position: 'absolute',
                                                top: '0',
                                                right: '1px',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '40px',
                                                backgroundColor: backgroundColor ? backgroundColor : 'rgba(255, 255, 255, 0.1)',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: 0,
                                                zIndex: 2,
                                            }}
                                            tabIndex={-1}
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
