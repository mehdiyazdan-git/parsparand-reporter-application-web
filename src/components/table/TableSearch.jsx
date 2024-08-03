import React, {memo} from 'react';
import SelectSearchInput from '../../utils/SelectSearchInput';
import SearchCheckboxInput from './SearchCheckboxInput';
import SearchNumberInput from './SearchNumberInput';
import SearchInput from './SearchInput';
import SearchDateInput from './SearchDateInput';
import IconBxRefresh from "../assets/icons/IconBxRefresh";
import AsyncSelectSearch from "./AsyncSelectSearch";
import {useFilter} from "../contexts/useFilter";

const TableSearch = function ({columns,updateSearch,filter,resetFilter}) {

    const handleSearchChange = (name, value) => {
        updateSearch({[name]: value});

    };
    const handleReset = () => {
        resetFilter();
    }
    return (
        <tr className="table-header-row">
            {columns.map((column) =>
                column.searchable ? (
                    column.type === 'date' ? (
                        <SearchDateInput
                            key={column.key}
                            width={column.width}
                            name={column.key || ''}
                            value={filter.search[column.key] ? (column.render ? column.render(filter.search[column.key]) : filter.search[column.key]) : ''}
                            onChange={(date) => handleSearchChange(column.key, date)}/>
                    ) : column.type === 'select' ? (
                        <SelectSearchInput
                            key={column.key}
                            width={column.width}
                            name={column?.key || ''}
                            options={column.options}
                            fetchAPI={column.fetchAPI}
                            value={filter?.search ? filter.search[column.key] : null}
                            onChange={(value) => handleSearchChange(column.key, value)}
                        />
                    ) : column.type === 'async-select' ? (
                        <AsyncSelectSearch
                            key={column.key}
                            width={column.width}
                            name={column.key}
                            labelKey={'name'}
                            valueKey={'id'}
                            apiEndpoint={column.apiEndpoint}
                            value={filter?.search ? filter.search[column.key] : null}
                            onChange={(value) => handleSearchChange(column.key, value)}
                        />
                    ) : column.type === 'text' ? (
                        <SearchInput
                            key={column.key}
                            width={column.width}
                            id={column.key}
                            name={column?.key || ''}
                            value={filter.search[column.key] ? (column.render ? column.render(filter.search[column.key]) : filter.search[column.key]) : ''}
                            onChange={(value) => handleSearchChange([column.searchKey], value)}
                        />
                    ) : column.type === 'checkbox' ? (
                        <SearchCheckboxInput
                            key={column.key}
                            width={column.width}
                            id={column.key}
                            name={column?.key || ''}
                            checked={filter.search?.[column.key]}
                            onChange={(event) => handleSearchChange(column.key, event.target.checked)}
                            label={column.title}
                        />
                    ) : column.type === 'number' ? (
                        <SearchNumberInput
                            key={column.key}
                            width={column.width}
                            id={column.key}
                            name={column.key}
                            value={filter.search[column.key]}
                            onChange={(value) => handleSearchChange(column.key, value)}
                        />
                    ) : (
                        <SearchInput
                            key={column.key}
                            width={column.width}
                            id={column.key}
                            name={column?.key || ''}
                            value={filter.search?.[column.key]}
                            onChange={(event) => handleSearchChange(column.key, event.target.value)}
                        />
                    )
                ) : (
                    <th key={column.key} style={{width: `${column.width}`}}>

                    </th>
                )
            )}
            <th width="5%">
                <IconBxRefresh id={'reset-filter'} onClick={handleReset} fontSize={'1.5rem'}/>

            </th>
        </tr>
    );
}

export default TableSearch
