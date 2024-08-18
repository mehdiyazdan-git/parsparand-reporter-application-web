import React, {useMemo} from 'react';
import { Controller } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { ConnectForm } from './ConnectForm';
import getInputStyles from "../components/styles/inputStyles";

const NumberInput = ({ name, label, style,field, ...rest }) => {
    const labelStyle = useMemo(()=>(
        {fontFamily: 'IRANSansBold', fontSize: '0.75rem'}),[]
    )
    const isInFieldArray = useMemo(()=>(
        field?.name?.includes('[') && field?.name?.includes(']')),[field?.name]);
    return (
        <div>
            <label style={labelStyle} className="label">{label}</label>
            <ConnectForm>
                {({ control,setValue,values }) => (
                    <Controller
                        control={control}
                        name={name}
                        render={({
                                     field,
                                     fieldState: { invalid, error } }) => (
                            <>
                                <NumericFormat
                                    placeholder={error ? error.message : ''}
                                    thousandSeparator=","
                                    value={field.value}
                                    onValueChange={({value}) => {
                                        if (!isInFieldArray) {
                                            setValue(name, value);
                                        } else {
                                            field.onChange(value);
                                        }
                                    }}
                                    style={getInputStyles(invalid,error)}
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