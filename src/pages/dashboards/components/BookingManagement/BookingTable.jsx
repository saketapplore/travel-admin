import React, { useState, useEffect, useRef } from 'react';
import CustomTable from '@/components/CustomTable';
import { getBookingStatusColor, getPaymentStatusColor, formatStatus } from '@/utils/formatters';
import { Search, X as XIcon } from 'lucide-react';

const BookingTable = ({
  bookings,
  loading,
  filters,
  pagination,
  onPageChange,
  onViewBooking,
  onGenerateInvoice,
  onViewDocuments,
  onSearch
}) => {
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const debounceRef = useRef(null);

  // Debounce search — waits 500ms after user stops typing, then fires
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (onSearch && searchInput !== (filters.search || '')) {
        onSearch(searchInput);
      }
    }, 500);
    return () => clearTimeout(debounceRef.current);
  }, [searchInput]);

  const handleClear = () => {
    setSearchInput('');
    if (onSearch) onSearch('');
  };

  const columns = [
    {
      key: 'bookingType',
      header: 'Booking Type',
      accessor: 'bookingType',
      render: (value, row) => {
        if (value === 'DOMESTIC_RETURN') {
          const route = row.flightDetails?.Origin && row.flightDetails?.Destination
            ? ` (${row.flightDetails.Origin} ↔ ${row.flightDetails.Destination})`
            : '';
          return (
            <span className="inline-flex items-center gap-1">
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                Return Flight
              </span>
              {route && <span className="text-xs text-gray-500">{route}</span>}
            </span>
          );
        }
        if (value === 'FLIGHT') {
          return (
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              Flight
            </span>
          );
        }
        if (value === 'HOTEL') {
          return (
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
              Hotel
            </span>
          );
        }
        return value || 'N/A';
      },
      cellClassName: 'text-sm text-gray-700 font-medium'
    },
    {
      key: 'status',
      header: 'Status',
      accessor: 'status',
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
      key: 'username',
      header: 'Username',
      accessor: 'username',
      render: (value) => value || 'N/A',
      cellClassName: 'text-sm font-medium text-gray-900'
    },
    {
      key: 'userEmail',
      header: 'User Email',
      accessor: 'userEmail',
      render: (value) => value || 'N/A',
      cellClassName: 'text-sm text-gray-500'
    },
    {
      key: 'country',
      header: 'Country',
      accessor: 'country',
      render: (value) => value || 'N/A',
      cellClassName: 'text-sm text-gray-500'
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
    },
    {
      key: '_id',
      header: 'MongoDB ID',
      accessor: '_id',
      render: (value) => <span className="font-mono text-xs">{value || 'N/A'}</span>,
      cellClassName: 'text-sm text-gray-700'
    },
    {
      key: 'bookingId',
      header: 'Booking ID',
      accessor: 'bookingId',
      render: (value) => <span className="font-mono text-xs">{value || 'N/A'}</span>,
      cellClassName: 'text-sm text-gray-700'
    },
    {
      key: 'transactionId',
      header: 'Transaction ID',
      accessor: 'transactionId',
      render: (value) => <span className="font-mono text-xs">{value || 'N/A'}</span>,
      cellClassName: 'text-sm text-gray-700'
    },
    {
      key: 'paymentStatus',
      header: 'Payment Status',
      accessor: 'paymentStatus',
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
      key: 'traceId',
      header: 'Trace ID',
      accessor: 'traceId',
      render: (value) => <span className="font-mono text-xs">{value || 'N/A'}</span>,
      cellClassName: 'text-sm text-gray-700'
    },
    {
      key: 'actions',
      header: 'Actions',
      accessor: (row) => row,
      cellClassName: 'text-sm font-medium space-x-2',
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          {/* View Documents Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDocuments(row);
            }}
            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
            title="View User Documents"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (row.invoiceUrl) {
                window.open(row.invoiceUrl, '_blank', 'noopener,noreferrer');
              } else {
                onGenerateInvoice(row);
              }
            }}
            className="p-2 text-orange-600 hover:text-orange-900 hover:bg-orange-50 rounded-lg transition-colors"
            title={row.invoiceUrl ? "View Invoice" : "Generate & Download Invoice"}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="mb-6">
      {/* Search Bar + Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <h4 className="text-lg font-semibold text-gray-800">All Bookings</h4>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by MongoDB ID, name, order..."
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
        <div className="text-center py-8 text-gray-500">Loading bookings...</div>
      ) : (
        <>
          <CustomTable columns={columns} data={bookings} emptyMessage="No bookings found." />

      {bookings.length > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between mt-4 px-4 py-3 border-t border-gray-200 gap-4">
          <div className="text-sm text-gray-700 whitespace-nowrap">
            {(() => {
              const startIndex = (filters.page - 1) * filters.limit;
              const endIndex = Math.min(
                startIndex + filters.limit,
                pagination.totalItems || bookings.length
              );
              const totalItems = pagination.totalItems || bookings.length;
              return `Showing ${startIndex + 1} to ${endIndex} of ${totalItems} bookings`;
            })()}
          </div>
          <div className="flex flex-wrap justify-center items-center gap-2">
            <button
              onClick={() => {
                if (filters.page > 1) {
                  onPageChange(filters.page - 1);
                }
              }}
              disabled={filters.page <= 1}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                filters.page <= 1
                  ? 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm cursor-pointer'
              }`}
            >
              Previous
            </button>
            
            <div className="flex flex-wrap items-center gap-1.5 custom-scrollbar max-w-full justify-center">
              {(() => {
                const totalPages = pagination.totalPages || 1;
                const maxVisiblePages = 10;
                const startPage = Math.floor((filters.page - 1) / maxVisiblePages) * maxVisiblePages + 1;
                const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);
                
                return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`min-w-[36px] h-9 px-2.5 rounded-lg flex items-center justify-center text-sm font-medium transition-colors border ${
                      filters.page === page
                        ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {page}
                  </button>
                ));
              })()}
              {pagination.totalPages > (Math.floor((filters.page - 1) / 10) * 10 + 10) && (
                <span className="text-gray-500 font-medium px-2">...</span>
              )}
            </div>

            <button
              onClick={() => {
                onPageChange(filters.page + 1);
              }}
              disabled={bookings.length < filters.limit && filters.page >= (pagination.totalPages || 1)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                bookings.length < filters.limit && filters.page >= (pagination.totalPages || 1)
                  ? 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm cursor-pointer'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};

export default BookingTable;
