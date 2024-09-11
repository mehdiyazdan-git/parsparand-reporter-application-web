import React, {useContext} from 'react';
import SelectSearchInput from './SelectSearchInput';
import SearchCheckboxInput from './SearchCheckboxInput';
import SearchNumberInput from './SearchNumberInput';
import SearchInput from './SearchInput';
import SearchDateInput from './SearchDateInput';
import IconBxRefresh from "../assets/icons/IconBxRefresh";
import {AppContext} from "../contexts/AppProvider";
import AsyncSelectComponent from "../templates/AsyncSelectComponent";


const TableSearch = function ({columns, updateSearchParams, filters, resetFilter}) {

    const [resetAsyncSearchSelectTrigger, setResetAsyncSearchSelectTrigger] = React.useState(0);

    const data = useContext(AppContext);

    const getOptions = (column) => {
        if (column.url) {
          const dataKey = column.url.split("/")[0];
          return data[dataKey];
        }
    }

    const handleSearchChange = (name, value) => {
        updateSearchParams({[name]: value});
    };
    const handleReset = () => {
        resetFilter();
        columns.forEach(column => {
            if (column.type === 'async-select') {
                setResetAsyncSearchSelectTrigger(prevState => ++prevState);
            }
        });
    };
    return (
        <tr className="table-header-row">
            {columns.map((column) =>
                column.searchable ? (
                    column.type === 'date' ? (
                        <SearchDateInput
                            key={column.key}
                            width={column.width}
                            name={column.key || ''}
                            value={filters.search[column.key] ? (column.render ? column.render(filters.search[column.key]) : filters.search[column.key]) : ''}
                            onChange={(date) => handleSearchChange(column.key, date)}
                        />
                    ) : column.type === 'select' ? (
                        <SelectSearchInput
                            key={column.key}
                            width={column.width}
                            name={column?.key || ''}
                            options={column.options}
                            fetchAPI={column.fetchAPI}
                            value={filters?.search ? filters.search[column.key] : null}
                            onChange={(value) => handleSearchChange(column.key, value)}
                        />
                    ) : column.type === 'async-select' ? (
                        <AsyncSelectComponent
                            width={column.width}
                            options={getOptions(column)}
                            name={column?.searchKey || ''}
                            value={getOptions(column)?.find((option) => option.value === filters.search[column.searchKey])}
                            onChange={(value) => handleSearchChange(column.searchKey, value?.value)}
                            resetTrigger={resetAsyncSearchSelectTrigger} // Pass the reset function to AsyncSelectSearch
                        />
                    ) : column.type === 'text' ? (
                        <SearchInput
                            key={column.key}
                            width={column.width}
                            id={column.key}
                            name={column?.key || ''}
                            value={filters.search[column.key] ? (column.render ? column.render(filters.search[column.key]) : filters.search[column.key]) : ''}
                            onChange={(value) => handleSearchChange([column.searchKey], value)}
                        />
                    ) : column.type === 'checkbox' ? (
                        <SearchCheckboxInput
                            key={column.key}
                            width={column.width}
                            id={column.key}
                            name={column?.key || ''}
                            checked={filters.search?.[column.key]}
                            onChange={(event) => handleSearchChange(column.key, event.target.checked)}
                            label={column.title}
                        />
                    ) : column.type === 'number' ? (
                        <SearchNumberInput
                            key={column.key}
                            width={column.width}
                            id={column.key}
                            name={column.key}
                            value={filters.search[column.key]}
                            onChange={(value) => handleSearchChange(column.key, value)}
                        />
                    ) : (
                        <SearchInput
                            key={column.key}
                            width={column.width}
                            id={column.key}
                            name={column?.key || ''}
                            value={filters.search?.[column.key]}
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
