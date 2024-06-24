import React, {useEffect, useMemo, useState} from "react";
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TableFooter from './TableFooter';
import Pagination from "../pagination/Pagination";
import PropTypes from "prop-types";
import useFilter from "../contexts/useFilter";
import TableYear from "./TableYear";
import useHttp from "../../hooks/useHttp";
import useDeepCompareEffect from "../../hooks/useDeepCompareEffect";
import TableSearch from "./TableSearch";


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

    const extractFormEntries = (columns) => {
        if (!columns){
            return {};
        }
        return Object
            .fromEntries(columns.filter(column => column.searchable)
                .map(column => [column.key, '']));
    }

    const [searchObject,setSearchObject] = useState(extractFormEntries(columns));

    const handleSearchChange = (event) => {
        const { name, value } = event.target;
        setSearchObject(prevState => ({
            ...prevState,
            [name]: value,}

        ));
        return Object
            .fromEntries(columns.filter(column => column.searchable)
                .map(column => [column.key, '']));
    }
    const handleResetSearch = () => {
        setSearchObject(extractFormEntries(columns));
    }
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
        await http('/years/select?').then(response => {
            const options = response.data.map(item => ({
                key: item.id,
                value: item.name
            }));
            return options[options.length - 1];
        });
    }
    function deepMerge(obj1, obj2) {
        const result = { ...obj1 };

        for (let key in obj2) {
            if (obj2.hasOwnProperty(key)) {
                if (obj2[key] instanceof Object && obj1[key] instanceof Object) {
                    result[key] = deepMerge(obj1[key], obj2[key]);
                } else {
                    result[key] = obj2[key];
                }
            }
        }

        return result;
    }

    const initialFilters = {
        page: 0,
        pageSize: 10,
        order: 'asc',
        sortBy : 'id',
        ...extractInitialFiltersFromColumns(columns),
        jalaliYear :
            filter?.jalaliYear
                ? filter.jalaliYear
                ? getLastOption().then(res => res.label)
            : null
                : null
    }

    useEffect(() => {
        updateFilter(listName,deepMerge(initialFilters,filter));
        loadData(listName,[],false).then(response => {
            setData(response.data.content);
            updateFilter(listName,{
                ...filter,
                page: response.data.pageable.page,
                pageSize: response.data.pageable.pageSize,
                totalPages: response.data.totalPages ,
                totalElements: response.data.totalElements ,
            });

        })
        // load all data
        loadData(listName,['totalPages','totalElements','page','order','orderBy'],true)
            .then(response => {
            setAllData(response.data.content);
        })
    }, []);

    useDeepCompareEffect(() => {
        loadData().then(response => {
            setData(response.data.content);
            updateFilter(listName,{
                ...filter,
                page: response.data.pageable.page,
                pageSize: response.data.pageable.pageSize,
                totalPages: response.data.totalPages ,
                totalElements: response.data.totalElements ,
            });
        })
        // load all data
        loadData(listName,[],true).then(response => {
            setAllData(response.data.content);
        })
    }, [filter]);

    return (
        <>
            {hasYearSelect && <TableYear filter={filter} updateFilter={updateFilter}/>}
            <table className="recipient-table table-fixed-height mt-3">
                <TableHeader columns={columns} filter={filter} updateFilter={updateFilter} />
                <TableSearch columns={columns} filter={filter} updateFilter={updateFilter}  handleSearchChange={handleSearchChange}/>
                <TableBody columns={columns} onEdit={onEdit} onDelete={onDelete} onResetPassword={onResetPassword} data={data}/>
                <TableFooter
                    allData={allData} columns={columns} filter={filter} updateFilter={updateFilter}
                    downloadExcelFile={downloadExcelFile} listName={listName}
                    getParams={getParams} hasSubTotal={hasSubTotal} fetchData={fetchData}  data={data}
                />
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
