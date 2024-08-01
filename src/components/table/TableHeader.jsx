import React from 'react';
import Th from './Th';
import {useFilter} from "../contexts/useFilter";

const TableHeader = ({ columns, entityName,filter,updateSort  }) => {
    return (
        <thead>
        <tr className="table-header-row p-0 m-0">
            {columns.map((column, index) => (
                <Th
                    key={index}
                    columnKey={column.key}
                    columnTitle={column.title}
                    width={column.width}
                    entityName={entityName}
                    filter={filter}
                    updateSort={updateSort}
                />
            ))}
            <th width="7%">ویرایش|حذف</th>
        </tr>
        </thead>
    );
};

export default TableHeader;
