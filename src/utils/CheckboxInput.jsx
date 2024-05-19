import React from 'react';
import { Controller } from 'react-hook-form';
import { ConnectForm } from './ConnectForm';

const CheckboxInput = ({ name, label,disabled =false }) => {
    return (
        <ConnectForm>
            {({ control }) => (
                <Controller
                    name={name}
                    control={control}
                    defaultValue={false}  // Default to unchecked
                    render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                        <div>
                            <label className="label">
                                <input
                                    type="checkbox"
                                    ref={ref}
                                    checked={value}
                                    onChange={e => onChange(e.target.checked)}
                                    disabled={disabled}
                                />
                                {label}
                            </label>
                            {error && <p className="text-danger">{error.message}</p>}
                        </div>
                    )}
                />
            )}
        </ConnectForm>
    );
};

export default CheckboxInput;
