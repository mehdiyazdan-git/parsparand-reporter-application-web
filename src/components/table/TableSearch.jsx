import React, {useContext} from 'react';
import SelectSearchInput from './SelectSearchInput';
import SearchCheckboxInput from './SearchCheckboxInput';
import SearchNumberInput from './SearchNumberInput';
import SearchInput from './SearchInput';
import SearchDateInput from './SearchDateInput';
import IconBxRefresh from "../assets/icons/IconBxRefresh";
import {AppContext} from "../contexts/AppProvider";
import AsyncSelectComponent from "../templates/AsyncSelectComponent";
import AsyncSelectSearchInput from "./AsyncSelectSearchInput";


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
            {columns.map((column,index) =>
                column.searchable ? (
                    column.type === 'date' ? (
                        <th key={index} width={column.width} style={{padding: '0px 0px', textAlign: 'center', margin: '0'}}>
                            <SearchDateInput
                                key={column.key}
                                width={column.width}
                                name={column.key || ''}
                                value={filters.search[column.key] ? (column.render ? column.render(filters.search[column.key]) : filters.search[column.key]) : ''}
                                onChange={(date) => handleSearchChange(column.key, date)}
                            />
                        </th>
                    ) : column.type === 'select' ? (
                        <th key={index}  width={column.width} style={{padding: '0px 0px', textAlign: 'center', margin: '0'}}>
                            <SelectSearchInput
                                key={column.key}
                                width={column.width}
                                name={column?.key || ''}
                                options={column.options}
                                fetchAPI={column.fetchAPI}
                                value={filters?.search ? filters.search[column.key] : null}
                                onChange={(value) => handleSearchChange(column.key, value)}
                            />
                        </th>
                    ) : column.type === 'async-select' ? (
                        <th key={index}  width={column.width} style={{padding: '0px 0px', textAlign: 'center', margin: '0'}}>
                            <AsyncSelectSearchInput
                                key={column.key}
                                width={column.width}
                                options={getOptions(column)}
                                name={column?.searchKey || ''}
                                value={getOptions(column)?.find((option) => option.value === filters.search[column.searchKey])}
                                onChange={(value) => handleSearchChange(column.searchKey, value?.value)}
                                resetTrigger={resetAsyncSearchSelectTrigger} // Pass the reset function to AsyncSelectSearch
                            />
                        </th>
                    ) : column.type === 'text' ? (
                        <th key={index}  width={column.width} style={{padding: '0px 0px', textAlign: 'center', margin: '0'}}>
                            <SearchInput
                                key={column.key}
                                width={column.width}
                                id={column.key}
                                name={column?.key || ''}
                                value={filters.search[column.key] ? (column.render ? column.render(filters.search[column.key]) : filters.search[column.key]) : ''}
                                onChange={(value) => handleSearchChange([column.searchKey], value)}
                            />
                        </th>
                    ) : column.type === 'checkbox' ? (
                        <th  key={index} width={column.width} style={{padding: '0px 0px', textAlign: 'center', margin: '0'}}>
                            <SearchCheckboxInput
                                key={column.key}
                                width={column.width}
                                id={column.key}
                                name={column?.key || ''}
                                checked={filters.search?.[column.key]}
                                onChange={(event) => handleSearchChange(column.key, event.target.checked)}
                                label={column.title}
                            />
                        </th>
                    ) : column.type === 'number' ? (
                       <th key={index}  width={column.width} style={{
                           backgroundColor: 'rgba(255, 255, 255, 1)',
                           borderBottom: 'none',
                           boxSizing: 'border-box',
                           width: column.width,
                           margin: "0",
                           padding: "0.1rem 0.1rem",
                           borderRadius: "0.25rem",
                           boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
                       }}>
                           <SearchNumberInput
                               key={column.key}
                               width={column.width}
                               id={column.key}
                               name={column.key}
                               value={filters.search[column.key]}
                               onChange={(value) => handleSearchChange(column.key, value)}
                           />
                       </th>
                    ) : (
                       <th key={index}  width={column.width} style={{padding: '0px 0px', textAlign: 'center', margin: '0'}}>
                           <SearchInput
                               key={column.key}
                               width={column.width}
                               id={column.key}
                               name={column?.key || ''}
                               value={filters.search?.[column.key]}
                               onChange={(event) => handleSearchChange(column.key, event.target.value)}
                           />
                       </th>
                    )
                ) : (
                    <th key={index} style={{width: `${column.width}`}}>

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
