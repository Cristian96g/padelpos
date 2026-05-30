export function DesktopDataTable({ columns, rows, getRowKey, renderExpandedRow, expandedRowId, onToggleRow }) {
  const gridTemplateColumns = columns.map((column) => column.width ?? "minmax(0,1fr)").join(" ");

  return (
    <div className="overflow-hidden rounded-[24px] border border-line">
      <div
        className="grid gap-3 border-b border-line bg-white/5 px-4 py-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-muted"
        style={{ gridTemplateColumns }}
      >
        {columns.map((column) => (
          <span key={column.key}>{column.label}</span>
        ))}
      </div>

      <div className="divide-y divide-line">
        {rows.map((row) => {
          const rowId = getRowKey(row);
          const isExpanded = expandedRowId === rowId;

          return (
            <div key={rowId}>
              <button
                type="button"
                onClick={onToggleRow ? () => onToggleRow(isExpanded ? null : rowId) : undefined}
                className="grid w-full gap-3 px-4 py-3 text-left transition-colors duration-200 hover:bg-white/[0.04]"
                style={{ gridTemplateColumns }}
              >
                {columns.map((column) => (
                  <div key={column.key} className={column.cellClassName}>
                    {column.render(row, { isExpanded })}
                  </div>
                ))}
              </button>

              {isExpanded && renderExpandedRow ? (
                <div className="bg-white/[0.03] px-4 pb-4 pt-1">
                  {renderExpandedRow(row)}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
