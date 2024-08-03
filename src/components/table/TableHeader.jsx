import React from "react";

const TableHeader = ({ columns, filter, updateSort }) => {

    const handleSort = (key) => {
        if (key === filter?.sort?.sortBy) {

            if (filter?.sort?.order === "desc") {
                updateSort({ "sortBy": key, "order": "asc" });
            } else {
                updateSort({ "sortBy": key, "order": "desc" });
            }
        } else {
            updateSort({ "sortBy": key, "order": "desc" });
        }
    };

    return (
        <thead>
        <tr>
            {columns.map((column) => (
                <th
                    key={column.key}
                    onClick={() => handleSort(column.key)}
                    style={column.key === filter?.order?.sortBy ? {cursor: "pointer"} : null}
                >
                    {column.title}
                    {column.key === filter?.order?.sortBy && <span>{filter?.sort?.order === "asc" ? "▲" : "▼"}</span>}
                </th>

            ))}
            <th width="7%">ویرایش|حذف</th>
        </tr>
        </thead>
    );
};

export default TableHeader;
