import React from "react";

const TableHeader = ({ columns, filter, updateFilter }) => {

    const handleSort = (key) => {
        if (key === filter?.sort?.sortBy) {

                if (filter?.sort?.order === "desc") {
                    updateFilter({ ...filter, "sort": { "sortBy": key, "order": "asc" } });
                } else {
                    updateFilter({ ...filter, "sort": { "sortBy": key, "order": "desc" } });
                }
        } else {
            updateFilter({ ...filter, "sort": { "sortBy": key, "order": "desc" } });
        }
    };

    return (
        <thead>
        <tr>
            {columns.map((column) => (
                <th
                    key={column.key}
                    onClick={() => handleSort(column.key)}
                    style={column.key === filter?.order?.sortBy ? { cursor: "pointer" } : null}
                >
                    {column.title}
                    {column.key ===  filter?.order?.sortBy && <span>{filter?.sort?.order === "asc" ? "▲" : "▼"}</span>}
                </th>
            ))}
        </tr>
        </thead>
    );
};

export default TableHeader;
