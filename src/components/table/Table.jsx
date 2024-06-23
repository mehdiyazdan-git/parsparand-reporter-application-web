import React, {useCallback, useEffect, useState} from "react";
import TableHeader from './TableHeader';
import TableSearch from './TableSearch';
import TableBody from './TableBody';
import TableFooter from './TableFooter';
import Pagination from "../pagination/Pagination";
import PropTypes from "prop-types";
import useFilter from "../contexts/useFilter";
import TableYear from "./TableYear";
import useHttp from "../../hooks/useHttp";
import useDeepCompareEffect from "../../hooks/useDeepCompareEffect";


const Table = ({
                   columns, fetchData, onEdit, onDelete, onResetPassword, refreshTrigger,
                   listName, downloadExcelFile, hasYearSelect = false, hasSubTotal = false }) => {
    const http = useHttp();
    const [data, setData] = useState([]);
    const [allData, setAllData] = useState([]);
    const { filter, updateFilter, getParams } = useFilter();

    const loadData = async (listName,excludes = [],subtotal = false) => {
        const params = getParams(listName,excludes,subtotal);
        return  await fetchData(params.toString());
    };


    useEffect(() => {
        const extractInitialFiltersFromColumns = (columns) => {
            const initialFilters = {};
            columns.forEach((column) => {
                if (column.searchable) {
                    initialFilters[column.key] = '';
                }
            });
            return initialFilters;
        };
        const getLastOption = async () => {
            await http('/years/select?searchQuery=').then(response => {
                const options = response.data.map(item => ({
                    key: item.id,
                    value: item.name
                }));
                return options[options.length - 1].key;
            });
        }

        const initialFilters = {
            page: 1,
            pageSize: 10,
            order: 'asc',
            sortBy : 'id',
            ...extractInitialFiltersFromColumns(columns),
        }
        if (columns.some(column => column.key === 'jalaliYear')) {
            if (JSON.parse(sessionStorage.getItem(`filter_${listName}`))?.jalaliYear) {
                const newFilter = {...initialFilters, jalaliYear: JSON.parse(sessionStorage.getItem(`filter_${listName}`))};
                sessionStorage.setItem(`filter_${listName}`, JSON.stringify(newFilter));
            }
            else {
                const newFilter = {...initialFilters, jalaliYear: getLastOption().label};
                sessionStorage.setItem(`filter_${listName}`, JSON.stringify(newFilter));
            }
        }
        loadData(listName,[],false).then(response => {
            setData(response.data.content);
            updateFilter(listName,{ page: response.data.pageable.pageNumber });
            updateFilter(listName,{ size: response.data.pageable.pageSize });
            updateFilter(listName,{ totalPages: response.data.totalPages });
            updateFilter(listName,{ totalElements: response.data.totalElements });

        })
        // load all data
        updateFilter(listName,initialFilters);

        loadData(listName,[],false).then(response => {
            setData(response.data.content);
            updateFilter(listName,{ page: response.data.pageable.pageNumber });
            updateFilter(listName,{ size: response.data.pageable.pageSize });
            updateFilter(listName,{ totalPages: response.data.totalPages });
            updateFilter(listName,{ totalElements: response.data.totalElements });
        })
        // load all data
        loadData(listName,[],true).then(response => {
            setAllData(response.data.content);
        })
    }, []);

    useDeepCompareEffect(() => {
        loadData().then(response => {
            setData(response.data.content);
            updateFilter(listName,{ page: response.data.pageable.pageNumber });
            updateFilter(listName,{ size: response.data.pageable.pageSize });
            updateFilter(listName,{ totalPages: response.data.totalPages });
            updateFilter(listName,{ totalElements: response.data.totalElements });
        })
        // load all data
        loadData(listName,[],true).then(response => {
            setAllData(response.data.content);
        })
    }, [filter]);

    useDeepCompareEffect(() => {
        if (refreshTrigger) {
            loadData(listName,[],false).then(response => {
                setData(response.data.content);
                updateFilter(listName,{ page: response.data.pageable.pageNumber });
                updateFilter(listName,{ size: response.data.pageable.pageSize });
                updateFilter(listName,{ totalPages: response.data.totalPages });
                updateFilter(listName,{ totalElements: response.data.totalElements });
                updateFilter(listName,{ refreshTrigger: false });
            })
            // load all data
            loadData(listName,[],true).then(response => {
                setAllData(response.data.content);
            })
        }
    }, [refreshTrigger]);


    useDeepCompareEffect(() => {
        if (filter.jalaliYear) {
            loadData(listName,[],false).then(response => {
                setData(response.data.content);
                updateFilter(listName,{ page: response.data.pageable.pageNumber });
                updateFilter(listName,{ size: response.data.pageable.pageSize });
                updateFilter(listName,{ totalPages: response.data.totalPages });
                updateFilter(listName,{ totalElements: response.data.totalElements });
            })

            http.get('years/select').then(response => {
                const year = response.data.find((item) => item.name === sessionStorage.getItem('year'))?.id || response.data[0]?.id;
                updateFilter(listName,{ year: year });
            });
            loadData(listName,[],false).then(response => {
                setData(response.data.content);
                updateFilter(listName,{ page: response.data.pageable.pageNumber });
                updateFilter(listName,{ size: response.data.pageable.pageSize });
            })
            // load all data
            loadData(listName,[],true).then(response => {
                setAllData(response.data.content);
            })
        }
    }, [filter.jalaliYear]);



    const handleSearchChange = (key,value) => {
        updateFilter(listName,{ [key]: value });
    };

    return (
        <>
            {hasYearSelect && <TableYear filter={filter} updateFilter={updateFilter}/>}
            <table className="recipient-table table-fixed-height mt-3">
                <TableHeader columns={columns} filter={filter} updateFilter={updateFilter} />
                <TableSearch columns={columns} filter={filter} updateFilter={updateFilter}  handleSearchChange={handleSearchChange}/>
                <TableBody
                    columns={columns} fetchData={fetchData} listName={listName} filter={filter}
                    refreshTrigger={refreshTrigger} getParams={getParams} updateFilter={updateFilter}
                    onEdit={onEdit} onDelete={onDelete} onResetPassword={onResetPassword} data={data} setAllData={setAllData} setData={setData}/>
                <TableFooter
                    allData={allData} columns={columns} filter={filter} updateFilter={updateFilter}
                    downloadExcelFile={downloadExcelFile} listName={listName}
                    getParams={getParams} hasSubTotal={hasSubTotal} fetchData={fetchData}  data={data}/>
            </table>
            <Pagination filter={filter} updateFilter={updateFilter} />
        </>
    );
};

Table.propTypes = {
    columns: PropTypes.array.isRequired,
    fetchData: PropTypes.func.isRequired,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    onResetPassword: PropTypes.func,
    refreshTrigger: PropTypes.func,
    listName: PropTypes.string.isRequired,
    downloadExcelFile: PropTypes.func,
    hasYearSelect: PropTypes.bool,
    hasSubTotal: PropTypes.bool,
};

Table.defaultProps = {
    onEdit: null,
    onDelete: null,
    onResetPassword: null,
    refreshTrigger: null,
    downloadExcelFile: null,
    hasYearSelect: false,
    hasSubTotal: false,
};

Table.displayName = 'Table';


export default Table;
