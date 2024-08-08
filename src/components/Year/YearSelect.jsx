import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import {toast} from "react-toastify";

// Styled Components
const SelectContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 0.5rem;
    width: 100%;
    max-width: 100%;
    @media (min-width: 640px) {
        width: 100%;
        max-width: 100%;
    }
    @media (min-width: 768px) {
        width: 100%;
        max-width: 100%;
    }
    @media (min-width: 1024px) {
        width: 100%;
        max-width: 100%;
    }
    @media (min-width: 1280px) {
        width: 100%;
        max-width: 100%;
    }
`;

const CustomSelect = styled.select`
  width: 100%;
  max-width: 100%;
  height: 35px;
  overflow-y: auto;
  margin: 0;
  padding: 0 0.1rem;
  border-radius: 0.25rem;
  font-size: 0.7rem;
  line-height: 0.875rem;
  color: #334155;
  text-align: right;
  font-family: "IRANSans", sans-serif;

  background-color: rgba(255, 255, 255, 0.5);
  border: 1px #ccc solid; /* Default border */

  &:focus {
    outline: none;
    border-color: #86b7fe;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
  }

  &::placeholder {
    color: #686666;
    font-size: 0.7rem;
    font-family: "IRANSans", sans-serif;
    font-weight: bold;
    text-align: right;
  }

  /* Error Styling (applied conditionally) */
  ${props => props.error && css`
    border-color: red;
    &::placeholder {
      color: red;
    }
  `}

  /* Disabled State */
  &:disabled {
    cursor: not-allowed;
    background-color: #e5e7eb;
    border-color: #d1d5db;
    opacity: 0.5;
  }
`;


const YearSelect = ({ value, onChange }) => {
    const [years, setYears] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchYears = async () => {
            try {
                const response = await fetch("http://localhost:9090/api/years/select");
                if (!response.ok) {
                    throw new Error("Failed to fetch years.");
                }

                const data = await response.json();
                const formattedYears = data.map((year) => ({
                    value: year.name.toString(), // Use year.name as the value (string)
                    label: year.name.toString(),
                }));

                setYears(formattedYears);

                // Update selected year if a value is provided after fetching
                if (value && !formattedYears.some(year => year.value === value)) {
                    onChange(formattedYears[0]?.value); // Default to first year if invalid value provided
                }
            } catch (err) {
                console.error(err);
                toast.error("Error loading years.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchYears();
    }, []);

    // ... (isLoading conditional rendering)

    return (
        <SelectContainer>
            <CustomSelect value={value} onChange={(e) => { e.preventDefault(); onChange(e.target.value); }}>
                {years.map((year) => (
                    <option key={year.value} value={year.label}>
                        {year.label}
                    </option>
                ))}
            </CustomSelect>
        </SelectContainer>
    );
};

export default YearSelect;


