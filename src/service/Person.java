public class IsExoticComponent {
    public static boolean isExoticComponent(Object component) {
        return (
            typeof component === "object" &&
            typeof component.$$typeof === "symbol" &&
            Arrays.asList("react.memo", "react.forward_ref").contains(component.$$typeof.description)
        );
    }
}
getAllColumns: memo(() -> [table.getColumnDefs()],
        columnDefs -> {
            const recurseColumns = (
                columnDefs: ColumnDef<TData, unknown>[],
                parent?: Column<TData, unknown>,
                depth = 0
            ): Column<TData, unknown>[] => {
                return columnDefs.map(columnDef -> {
                    const column = createColumn(table, columnDef, depth, parent)

                    const groupingColumnDef = columnDef as GroupColumnDef<
                        TData,
                        unknown
                    >

                    column.columns = groupingColumnDef.columns
                        ? recurseColumns(groupingColumnDef.columns, column, depth + 1)
                        : []

                    return column
                })
            }

            return recurseColumns(columnDefs)
        },
        getMemoOptions(options, "debugColumns", "getAllColumns")
    )
