import React, {useCallback, useState} from "react";
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TableFooter from './TableFooter';
import Pagination from "../pagination/Pagination";
import useFilter from "../contexts/useFilter";
import TableYear from "./TableYear";
import useDeepCompareEffect from "../../hooks/useDeepCompareEffect";
import TableSearch from "./TableSearch";
import getCurrentYear from "../../utils/functions/getCurrentYear";
import useHttp from "../../hooks/useHttp";

const Table = ({
                   columns,
                   fetchData,
                   onEdit,
                   onDelete,
                   onResetPassword,
                   refreshTrigger,
                   listName,
                   downloadExcelFile,
                   hasYearSelect = false,
                   hasSubTotal = false,
               }) => {
    const [data, setData] = useState([]);
    const [allData, setAllData] = useState([]);
    const http = useHttp();

    const years = async () => {
        const response = await http.get(`/years/select`);
        return response.data.map((year) => ({
            value: year.id,
            label: year.name,
        }));
    };
    const extractInitialFiltersFromColumns = (columns) => {
        const initialFilters = {};
        columns.forEach((column) => {
            if (column.searchable) {
                initialFilters[column.key] = '';
            }
        });
        return initialFilters;
    };
    const { filter, updateFilter, getParams} = useFilter(listName, {
        page: 0,
        size: 10,
        order: 'asc',
        sortBy: 'id',
        ...extractInitialFiltersFromColumns(columns),
        jalaliYear: getCurrentYear(),
    });


    const loadData = async (excludes = [], subtotal = false) => {
        const params = getParams(listName, excludes, subtotal);
        return await fetchData(params.toString());
    };

    useDeepCompareEffect(() => {
        loadData(['page', 'pageNumber','totalPages','totalElements'], false).then(response => {
            if (response?.data?.content && response?.data?.content?.length === 0) {
               setData([])
                updateFilter(listName, {
                    ...filter,
                    totalPages: 0,
                    totalElements: 0,
                });

            }else {
                setData(response.data?.content);
                updateFilter(listName, {
                    ...filter,
                    size: response?.data?.pageable.pageSize ,
                    page: response?.data?.pageable?.pageNumber,
                    totalPages: response?.data?.totalPages || 0,
                    totalElements: response?.data?.totalElements || 0,
                });
            }
        }).catch((error) => {
            console.error(error)
        })

        loadData([], true).then(response => {
            if (response?.data?.content && response?.data?.content?.length === 0){
                setAllData([])
            }else {
                if (response?.data?.content && response?.data?.content?.length > 0) {
                    setAllData(response.data.content);
                }
            }
        }).catch((error) => {
            console.error(error)
        })
    }, [refreshTrigger]);


    useDeepCompareEffect(() => {
        loadData([], false).then(response => {
            if (response?.data?.content && response?.data?.content?.length === 0) {
                setData([])
                updateFilter(listName, {
                    ...filter,
                    totalPages: 0,
                    totalElements: 0,
                });
            }else {
                setData(response?.data?.content);
                updateFilter(listName, {
                    ...filter,
                    size: response?.data?.pageable.pageSize || 10,
                    page: response?.data?.pageable?.pageNumber || 0,
                    totalPages: response?.data?.totalPages || 0,
                    totalElements: response?.data?.totalElements || 0,
                });
            }

        });
        loadData(['page', 'pageNumber','totalPages','totalElements'], true).then(response => {
            if (response?.data?.content && response?.data?.content?.length === 0) {
                setAllData([])
            }else {
                setAllData(response?.data?.content || 0);
            }
        });
    }, [filter]);

    const handleYearChange = useCallback((year) => {
        updateFilter(listName, {
            ...filter,
            jalaliYear: year.label,
        });
    }, [filter]);


    return (
        <>
            {hasYearSelect &&  <TableYear
                jalaliYear={filter.jalaliYear}
                onChange={handleYearChange}
                listname={listName}
            />}
            <table className="recipient-table table-fixed-height mt-3">
                <TableHeader columns={columns} filter={filter} updateFilter={updateFilter} listName={listName} />
                <TableSearch columns={columns} filter={filter} updateFilter={updateFilter} listName={listName} />
                <TableBody
                    data={data}
                    columns={columns}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onResetPassword={onResetPassword}
                />
                <TableFooter
                    allData={allData}
                    columns={columns}
                    downloadExcelFile={downloadExcelFile}
                    listName={listName}
                    getParams={getParams}
                    hasSubTotal={hasSubTotal}
                    data={data}
                />
            </table>
            <Pagination filter={filter} updateFilter={updateFilter} listName={listName} />
        </>
    );
};

export default Table;
