import React, {memo} from 'react';
import SelectSearchInput from '../../utils/SelectSearchInput';
import SearchCheckboxInput from './SearchCheckboxInput';
import SearchNumberInput from './SearchNumberInput';
import SearchInput from './SearchInput';
import SearchDateInput from './SearchDateInput';
import IconBxRefresh from "../assets/icons/IconBxRefresh";
import AsyncSelectSearch from "./AsyncSelectSearch";


const TableSearch = function ({columns, filter, updateFilter, entityName, resetFilter}) {

    const handleSearchChange = (name, value) => {
        updateFilter({[name]: value, page: 0});
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
                            value={filter[column.key] ? (column.render ? column.render(filter[column.key]) : filter[column.key]) : ''}
                            onChange={(date) => handleSearchChange(column.key, date)}/>
                    ) : column.type === 'select' ? (
                        <SelectSearchInput
                            key={column.key}
                            width={column.width}
                            name={column?.key || ''}
                            options={column.options}
                            fetchAPI={column.fetchAPI}
                            value={filter[column.key]?.value}
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
                            value={filter?.[column.searchKey]}
                            onChange={(value) => handleSearchChange([column.searchKey], value)}
                        />
                    ) : column.type === 'checkbox' ? (
                        <SearchCheckboxInput
                            key={column.key}
                            width={column.width}
                            id={column.key}
                            name={column?.key || ''}
                            checked={filter?.[column.key]}
                            onChange={(event) => handleSearchChange(column.key, event.target.checked)}
                            label={column.title}
                        />
                    ) : column.type === 'number' ? (
                        <SearchNumberInput
                            key={column.key}
                            width={column.width}
                            id={column.key}
                            name={column.key}
                            value={filter[column.key]}
                            onChange={(value) => handleSearchChange(column.key, value)}
                        />
                    ) : (
                        <SearchInput
                            key={column.key}
                            width={column.width}
                            id={column.key}
                            name={column?.key || ''}
                            value={filter?.[column.key]}
                            onChange={(event) => handleSearchChange(column.key, event.target.value)}
                        />
                    )
                ) : (
                    <th key={column.key} style={{width: `${column.width}`}}>

                    </th>
                )
            )}
            <th width="5%">
                <IconBxRefresh id={'reset-filter'} onClick={() => resetFilter()} fontSize={'1.5rem'}/>

            </th>
        </tr>
    );
}

export default memo(TableSearch)
