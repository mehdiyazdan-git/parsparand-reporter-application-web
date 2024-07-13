import React from 'react';
import Th from './Th';

const TableHeader = ({ columns, filter, updateFilter, entityName }) => {
    return (
        <thead>
        <tr className="table-header-row p-0 m-0">
            {columns.map((column, index) => (
                <Th
                    key={index}
                    columnKey={column.key}
                    columnTitle={column.title}
                    width={column.width}
                    filter={filter}
                    updateFilter={updateFilter}
                    entityName={entityName}
                />
            ))}
            <th width="7%">ویرایش|حذف</th>
        </tr>
        </thead>
    );
};

export default TableHeader;
