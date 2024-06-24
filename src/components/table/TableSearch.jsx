import React from 'react';
import PropTypes from 'prop-types';
import SelectSearchInput from '../../utils/SelectSearchInput';
import AsyncSelectInput from '../../utils/AsyncSelectInput';
import SearchCheckboxInput from './SearchCheckboxInput';
import SearchNumberInput from './SearchNumberInput';
import SearchInput from './SearchInput';
import SearchDateInput from './SearchDateInput';

const TableSearch = ({ columns, filter,updateFilter,listName }) => {

    const handleSearchChange = (name, value) => {
        updateFilter(listName, { [name]: value });
    };


  return  (
        <tr className="table-header-row">
            {columns.map((column) =>
                column.searchable ? (
                    column.type === 'date' ? (
                        <SearchDateInput
                            key={column.key}
                            width={column.width}
                            name={column.key || ''}
                            value={filter[column.key] ? (column.render ? column.render(filter[column.key]) : filter[column.key]) : ''}
                            onChange={(date) => handleSearchChange(column.key, date)}
                        />
                    ) : column.type === 'select' ? (
                        <SelectSearchInput
                            key={column.key}
                            width={column.width}
                            name={column?.key || ''}
                            options={column.options}
                            value={filter[column?.key]}
                            onChange={(value) => handleSearchChange(column.key, value)}
                        />
                    ) : column.type === 'async-select' ? (
                        <AsyncSelectInput
                            key={column.key}
                            width={column.width}
                            name={column.key}
                            apiFetchFunction={column.apiFetchFunction}
                            defaultValue={filter[column.key]}
                            onChange={(value) => handleSearchChange(column.key, value)}
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
                    <th key={column.key} style={{width: `${column.width}`}}></th>
                )
            )}
            <th width="5%"></th>
        </tr>
    );
}
TableSearch.propTypes = {
    columns: PropTypes.array.isRequired,
    filter: PropTypes.object.isRequired,
    handleSearchChange: PropTypes.func.isRequired
};

export default TableSearch;
