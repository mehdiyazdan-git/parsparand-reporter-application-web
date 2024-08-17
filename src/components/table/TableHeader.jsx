import React from "react";

const TableHeader = ({ columns, filter, updateSorting }) => {

    const handleSort = (key) => {
        if (key === filter?.sorting?.sortBy) {

            if (filter?.sorting?.order === 'desc') {
                updateSorting({ 'sortBy': key, 'order': 'asc' });
            } else {
                updateSorting({ 'sortBy': key, 'order': 'desc' });
            }
        } else {
            updateSorting({ 'sortBy': key, 'order': 'desc' });
        }
    };

    return (
        <thead>
        <tr>
            {columns.map((column) => (
                <th
                    key={column.key}
                    onClick={() => handleSort(column.key)}
                    style={column.key === filter?.sorting?.sortBy ? {cursor: "pointer"} : null}
                >
                    {column.title}
                    {column.key === filter?.sorting?.sortBy && <span>{filter?.sorting?.order === "asc" ? "▲" : "▼"}</span>}
                </th>

            ))}
            <th width="7%">ویرایش|حذف</th>
        </tr>
        </thead>
    );
};

export default TableHeader;