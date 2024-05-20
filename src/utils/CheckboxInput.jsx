import React from 'react';
import { Controller } from 'react-hook-form';
import { ConnectForm } from './ConnectForm';
import styled from 'styled-components';

// Styled components
const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #62b2f7;
  border-radius: 4px;
  width: 100%;
  min-height: 40px;
  margin-top: 1rem;
`;

const CheckboxLabel = styled.label`
    display: flex;
    align-items: center;
    cursor: pointer;
    min-height: 40px;
`;

const CheckboxInputStyled = styled.input`
    margin: 0.5rem;
    cursor: pointer;
    &:disabled {
        cursor: not-allowed;
    }
`;

const ErrorMessage = styled.p`
    color: red;
    font-size: 0.875rem;
    margin-top: 0.25rem;
`;

const CheckboxInput = ({ name, label, disabled = false }) => {
    return (
        <ConnectForm>
            {({ control }) => (
                <Controller
                    name={name}
                    control={control}
                    defaultValue={false} // Default to unchecked
                    render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                        <CheckboxWrapper>
                            <CheckboxLabel>
                                <CheckboxInputStyled
                                    type="checkbox"
                                    ref={ref}
                                    checked={value}
                                    onChange={e => onChange(e.target.checked)}
                                    disabled={disabled}
                                    className={error ? 'is-invalid' : ''}
                                />
                                {label}
                            </CheckboxLabel>
                            {error && <ErrorMessage>{error.message}</ErrorMessage>}
                        </CheckboxWrapper>
                    )}
                />
            )}
        </ConnectForm>
    );
};

export default CheckboxInput;
