import React from 'react';
import { Controller } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { ConnectForm } from "./ConnectForm";

const NumberInput = ({ name, label,style, ...rest }) => {
    return (
        <div>
            <label style={{fontFamily:"IRANSansBold",fontSize:"0.75rem"}} className="label">{label}</label>
            <ConnectForm>
                {({ control }) => (
                    <Controller
                        control={control}
                        name={name}
                        render={({ field, fieldState: { invalid, error } }) => (
                            <>
                                <NumericFormat
                                    thousandSeparator=","
                                    value={field.value}
                                    onValueChange={(values) => {
                                        field.onChange(values.value);
                                    }}
                                    style={{
                                        border: invalid ? '1px solid red' : '1px solid #ccc',
                                        width: '100%',
                                        boxSizing: 'border-box',
                                        minHeight: '38px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                        textIndent:"0.5rem",
                                        padding:"0 0.1rem",
                                        borderRadius: "0.25rem",
                                        fontSize: "0.7rem",
                                        lineHeight: "1.0rem",
                                        color: "#334155",
                                        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",

                                        "&:focus": {
                                            outline: "none",
                                            borderColor: "#86b7fe",
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
                                                borderColor: "#86b7fe",
                                                boxShadow: "0 0 0 0.25rem rgba(13, 110, 253, 0.25)",
                                            },
                                        },
                                        "&:disabled": {
                                            cursor: "not-allowed",
                                            backgroundColor: "#e5e7eb",
                                            borderColor: "#d1d5db",
                                            opacity: 0.5,
                                        },


                                        ...style
                                    }}
                                    {...rest}
                                />
                                {invalid && error && (
                                    <div style={{
                                        color: 'red',
                                        fontSize: '0.75em', // Smaller font size
                                        marginTop: '2px' // Space between input and error message
                                    }}>
                                        {error.message}
                                    </div>
                                )}
                            </>
                        )}
                    />
                )}
            </ConnectForm>
        </div>
    );
};

export default NumberInput;
