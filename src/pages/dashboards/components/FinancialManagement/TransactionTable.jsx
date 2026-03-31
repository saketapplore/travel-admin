import React, { useState, useEffect, useRef } from 'react';
import CustomTable from '../../../../components/CustomTable';
import { Search, X as XIcon } from 'lucide-react';
import { getPaymentStatusColor, getBookingStatusColor, formatStatus } from '../../../../utils/formatters';

const TransactionTable = ({ transactions, loading, filters, onSearch }) => {
  const [searchInput, setSearchInput] = useState(filters?.search || '');
  const debounceRef = useRef(null);

  // Debounce search — waits 500ms after user stops typing, then fires
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (onSearch && searchInput !== (filters?.search || '')) {
        onSearch(searchInput);
      }
    }, 500);
    return () => clearTimeout(debounceRef.current);
  }, [searchInput, filters?.search, onSearch]);

  const handleClear = () => {
    setSearchInput('');
    if (onSearch) onSearch('');
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      accessor: 'name',
      cellClassName: 'text-sm font-medium text-gray-900'
    },
    {
      key: 'transactionId',
      header: 'Transaction Id',
      accessor: 'transactionId',
      render: (value) => <span className="font-mono text-xs">{value || 'N/A'}</span>,
      cellClassName: 'text-sm text-gray-700'
    },
    {
      key: 'bookingId',
      header: 'Booking Id',
      accessor: 'bookingId',
      render: (value) => <span className="font-mono text-xs">{value || 'N/A'}</span>,
      cellClassName: 'text-sm text-gray-700'
    },
    {
      key: 'status',
      header: 'Payment Status',
      accessor: 'status',
      render: (value) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(value)}`}
        >
          {formatStatus(value)}
        </span>
      ),
      cellClassName: 'text-sm'
    },
    {
      key: 'bookingStatus',
      header: 'Booking Status',
      accessor: 'bookingStatus',
      render: (value) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getBookingStatusColor(value)}`}
        >
          {formatStatus(value)}
        </span>
      ),
      cellClassName: 'text-sm'
    },
    {
      key: 'bookingType',
      header: 'Booking Type',
      accessor: 'bookingType',
      render: (value) => value || 'N/A',
      cellClassName: 'text-sm text-gray-700'
    },
    {
      key: 'totalAmount',
      header: 'Total Amount',
      accessor: 'totalAmount',
      render: (value) => value || 0,
      cellClassName: 'text-sm text-gray-700 font-medium'
    },
    {
      key: 'currency',
      header: 'Currency',
      accessor: 'currency',
      render: (value) => value || 'N/A',
      cellClassName: 'text-sm text-gray-500'
    }
  ];

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <h4 className="text-lg font-semibold text-gray-800">All Transactions</h4>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by ID, name, status..."
            className="w-full pl-10 pr-9 py-2.5 text-sm border border-gray-200 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all placeholder:text-gray-400"
          />
          {searchInput && (
            <button
              onClick={handleClear}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
            >
              <XIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading transactions...</div>
      ) : (
        <CustomTable columns={columns} data={transactions} emptyMessage="No transactions found." />
      )}
    </div>
  );
};

export default TransactionTable;
