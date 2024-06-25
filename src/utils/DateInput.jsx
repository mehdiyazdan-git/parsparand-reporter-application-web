import React from 'react';
import { Controller } from 'react-hook-form';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { ConnectForm } from "./ConnectForm";
import "../App.css"

const DateInput = ({ name, label, ...rest }) => {
    return (
        <div className={"container-fluid p-0 m-0"}>
            <label className="label" style={{fontFamily:"IRANSansBold",fontSize:"0.75rem"}}>{label}</label>
            <ConnectForm>
                {({ control, setValue }) => (
                    <Controller
                        control={control}
                        name={name}
                        render={(
                                {
                                    field,
                                    fieldState: { invalid, error } }) => (
                            <div>
                                <DatePicker
                                    value={field?.value ? new Date(field?.value) : ''}
                                    name={field.name}
                                    editable={true}
                                    type={"search"}
                                    calendar={persian}
                                    locale={persian_fa}
                                    onChange={(date, { input, isTyping }) => {
                                        setValue(field.name, date?.isValid ? date.toDate() : "");
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
                                        textAlign: 'right'  // Align the text according to your needs
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
