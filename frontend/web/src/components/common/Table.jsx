import { useState } from "react";

export default function Table({ columns = [], data = [] }) {
  const [expandedRow, setExpandedRow] = useState(null);

  return (
    <div
      className="
      overflow-x-auto
      rounded-lg
      border border-[var(--color-brand-100)]
      bg-[var(--color-surface)]
      shadow-sm
    "
    >
      <table className="min-w-full table-fixed text-center">
        <colgroup>
          {columns.map((col) => (
            <col key={col.key} style={{ width: col.width }} />
          ))}
        </colgroup>

        {/* HEADER */}
        <thead
          className="
          bg-[var(--color-brand-50)]
          border-b border-[var(--color-brand-100)]
        "
        >
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="
                  px-4 py-3
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-[var(--color-primary)]
                  text-center
                  align-middle
                "
              >
                <div className="table-header-text">{col.title}</div>
              </th>
            ))}
          </tr>
        </thead>

        {/* BODY */}
        <tbody className="divide-y divide-[var(--color-brand-100)]">
          {data.map((row, rowIdx) => {
            const isExpanded = expandedRow === rowIdx;

            return (
              <tr
                key={row.id || rowIdx}
                onClick={() => setExpandedRow(isExpanded ? null : rowIdx)}
                className="hover:bg-[color-mix(in_srgb,var(--color-brand-50)_50%,transparent)] transition-colors"
              >
                {columns.map((col) => {
                  const value = row[col.key];

                  return (
                    <td
                      key={col.key}
                      className="
                        px-4 py-3
                        align-middle
                        text-[var(--color-on-surface)]
                        text-center
                      "
                    >
                      {col.render ? (
                        col.render(value, row)
                      ) : typeof value === "string" ? (
                        <div
                          className={`table-cell-text ${
                            isExpanded ? "expanded" : ""
                          }`}
                        >
                          {value}
                        </div>
                      ) : (
                        value ?? "-"
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
