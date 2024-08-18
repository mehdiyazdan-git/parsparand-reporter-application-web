import React, { useMemo } from 'react';
import { Controller } from 'react-hook-form';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { ConnectForm } from "./ConnectForm";
import "../App.css"

const DateInput = ({ name, label, field, ...rest }) => {
    const isInFieldArray = useMemo(() => (
        field?.name?.includes('[') && field?.name?.includes(']')
    ), [field?.name]);

    return (
        <div className={"container-fluid p-0 m-0"}>
            <label className="label" style={{ fontFamily: "IRANSansBold", fontSize: "0.75rem" }}>{label}</label>
            <ConnectForm>
                {({ control, setValue }) => (
                    <Controller
                        control={control}
                        name={name}
                        render={({
                                     field: controlledField, // Rename to avoid shadowing
                                     fieldState: { invalid, error }
                                 }) => (
                            <div>
                                <DatePicker
                                    value={(field?.value || controlledField.value) ? new Date(field?.value || controlledField.value) : ''}
                                    name={field?.name || controlledField.name}
                                    editable={true}
                                    type={"search"}
                                    calendar={persian}
                                    locale={persian_fa}
                                    onChange={(date, { input, isTyping }) => {
                                        const newValue = date?.isValid ? date.toDate() : "";
                                        if (!isInFieldArray) {
                                            setValue(name, newValue);
                                        } else {
                                            field.onChange(newValue);
                                        }
                                    }}
                                    inputClass={invalid ? "date-picker-input red-placeholder" : "table-search-input"}
                                    style={{
                                        border: invalid ? '1px solid red' : '1px solid #ccc',
                                        width: '100%',
                                        boxSizing: 'border-box',
                                        minHeight: '40px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.5)'
                                    }}
                                    containerStyle={{
                                        width: '100%',
                                    }}
                                    {...rest}
                                />
                                {invalid && error && (
                                    <div style={{
                                        color: 'red',
                                        fontSize: '0.75em',
                                        marginTop: '2px',
                                        textAlign: 'right'
                                    }}>
                                        {error.message}
                                    </div>
                                )}
                            </div>
                        )}
                    />
                )}
            </ConnectForm>
        </div>
    );
};

export default DateInput;