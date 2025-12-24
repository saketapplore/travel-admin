import React from 'react';

/**
 * CustomTable - A reusable, flexible table component
 * 
 * @param {Array} columns - Array of column configuration objects
 *   Each column object should have:
 *   - key: unique identifier for the column
 *   - header: header text to display
 *   - accessor: function or string to access data from row object
 *   - render: (optional) custom render function for cell content
 *   - headerClassName: (optional) custom className for header cell
 *   - cellClassName: (optional) custom className for body cell
 *   - width: (optional) column width
 * 
 * @param {Array} data - Array of data objects to display in rows
 * @param {String} emptyMessage - Message to display when data is empty
 * @param {String} tableClassName - Custom className for the table element
 * @param {String} theadClassName - Custom className for thead element
 * @param {String} tbodyClassName - Custom className for tbody element
 * @param {String} rowClassName - Custom className for tr elements (can be function: (row, index) => string)
 * @param {String} containerClassName - Custom className for the overflow container
 * @param {Boolean} showHeader - Whether to show table header (default: true)
 * @param {Function} onRowClick - Optional callback when row is clicked
 */
const CustomTable = ({
  columns = [],
  data = [],
  emptyMessage = 'No data available',
  tableClassName = 'w-full',
  theadClassName = '',
  tbodyClassName = 'bg-white divide-y divide-gray-200',
  rowClassName = 'hover:bg-gray-50',
  containerClassName = 'overflow-x-auto',
  showHeader = true,
  onRowClick = null,
  minWidth = null
}) => {
  // Get value from row using accessor (can be string path or function)
  const getValue = (row, accessor) => {
    if (typeof accessor === 'function') {
      return accessor(row);
    }
    if (typeof accessor === 'string') {
      return accessor.split('.').reduce((obj, key) => obj?.[key], row);
    }
    return null;
  };

  // Get row className (can be string or function)
  const getRowClassName = (row, index) => {
    if (typeof rowClassName === 'function') {
      return rowClassName(row, index);
    }
    return rowClassName;
  };

  // Handle row click
  const handleRowClick = (row, index) => {
    if (onRowClick) {
      onRowClick(row, index);
    }
  };

  return (
    <div className={containerClassName}>
      <table className={tableClassName} style={minWidth ? { minWidth } : {}}>
        {showHeader && (
          <thead className={theadClassName}>
            <tr className="bg-gray-50 border-b">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.headerClassName || ''
                  }`}
                  style={column.width ? { width: column.width } : {}}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className={tbodyClassName}>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-8 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className={getRowClassName(row, rowIndex)}
                onClick={() => handleRowClick(row, rowIndex)}
                style={onRowClick ? { cursor: 'pointer' } : {}}
              >
                {columns.map((column) => {
                  const value = getValue(row, column.accessor);
                  const cellContent = column.render
                    ? column.render(value, row, rowIndex)
                    : value;

                  return (
                    <td
                      key={column.key}
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        column.cellClassName || ''
                      }`}
                    >
                      {cellContent}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;

