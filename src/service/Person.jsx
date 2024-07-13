import {memo} from "react";


export function createColumn(table, columnDef, depth, parent = undefined) {
    const defaultColumn = table._getDefaultColumnDef();

    const resolvedColumnDef = {
        ...defaultColumn,
        ...columnDef,
    };

    const accessorKey = resolvedColumnDef.accessorKey;

    let id =
        resolvedColumnDef.id ??
        (accessorKey ? accessorKey.replace('.', '_') : undefined) ??
        (typeof resolvedColumnDef.header === 'string'
            ? resolvedColumnDef.header
            : undefined);

    let accessorFn;

    if (resolvedColumnDef.accessorFn) {
        accessorFn = resolvedColumnDef.accessorFn;
    } else if (accessorKey) {
        if (accessorKey.includes('.')) {
            accessorFn = (originalRow) => {
                let result = originalRow;

                for (const key of accessorKey.split('.')) {
                    result = result?.[key];
                    if (process.env.NODE_ENV !== 'production' && result === undefined) {
                        console.warn(
                            `"${key}" in deeply nested key "${accessorKey}" returned undefined.`
                        );
                    }
                }

                return result;
            };
        } else {
            accessorFn = (originalRow) => originalRow[resolvedColumnDef.accessorKey];
        }
    }

    if (!id) {
        if (process.env.NODE_ENV !== 'production') {
            throw new Error(
                resolvedColumnDef.accessorFn
                    ? `Columns require an id when using an accessorFn`
                    : `Columns require an id when using a non-string header`
            );
        }
        throw new Error();
    }

    let column = {
        id: `${String(id)}`,
        accessorFn,
        parent,
        depth,
        columnDef: resolvedColumnDef,
        columns: [],
        getFlatColumns: memo(
            () => [true],
            () => {
                return [
                    column,
                    ...column.columns?.flatMap((d) => d.getFlatColumns()),
                ];
            },
            getMemoOptions(table.options, 'debugColumns', 'column.getFlatColumns')
        ),
        getLeafColumns: memo(
            () => [table._getOrderColumnsFn()],
            (orderColumns) => {
                if (column.columns?.length) {
                    let leafColumns = column.columns.flatMap((column) =>
                        column.getLeafColumns()
                    );

                    return orderColumns(leafColumns);
                }

                return [column];
            },
            getMemoOptions(table.options, 'debugColumns', 'column.getLeafColumns')
        ),
    };

    for (const feature of table._features) {
        feature.createColumn?.(column, table);
    }

    return column;
}

export function getMemoOptions(tableOptions, debugLevel, key, onChange) {
    return {
        debug: () => tableOptions?.debugAll ?? tableOptions[debugLevel],
        key: process.env.NODE_ENV === 'development' && key,
        onChange,
    };
}

