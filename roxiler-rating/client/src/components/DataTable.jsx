
import { useState } from "react";

function DataTable({ columns, data }) {
    const [sort, setSort] = useState({
        key: "",
        direction: "asc"
    });

    const handleSort = (key) => {
        setSort((current) => ({
            key,
            direction:
                current.key === key && current.direction === "asc"
                    ? "desc"
                    : "asc"
        }));
    };

    const sortedData = [...data].sort((a, b) => {
        if (!sort.key) return 0;

        const first = String(a[sort.key] ?? "").toLowerCase();
        const second = String(b[sort.key] ?? "").toLowerCase();

        const result = first.localeCompare(second, undefined, {
            numeric: true
        });

        return sort.direction === "asc" ? result : -result;
    });

    return (
        <table className="data-table">
            <thead>
                <tr>
                    {columns.map((column) => (
                        <th key={column.key}>
                            <button
                                type="button"
                                onClick={() => handleSort(column.key)}
                            >
                                {column.label}
                                {sort.key === column.key &&
                                    (sort.direction === "asc" ? " ↑" : " ↓")}
                            </button>
                        </th>
                    ))}
                </tr>
            </thead>

            <tbody>
                {sortedData.map((item, index) => (
                    <tr key={item.id ?? index}>
                        {columns.map((column) => (
                            <td key={column.key}>
                                {item[column.key] ?? "—"}
                            </td>
                        ))}
                    </tr>
                ))}

                {sortedData.length === 0 && (
                    <tr>
                        <td colSpan={columns.length}>
                            No records found
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

export default DataTable;
