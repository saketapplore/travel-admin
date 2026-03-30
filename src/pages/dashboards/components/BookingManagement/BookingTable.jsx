import React from 'react';
import CustomTable from '@/components/CustomTable';
import { getBookingStatusColor, getPaymentStatusColor, formatStatus } from '@/utils/formatters';

const BookingTable = ({
  bookings,
  loading,
  filters,
  pagination,
  onPageChange,
  onViewBooking,
  onGenerateInvoice,
  onViewDocuments
}) => {
  const columns = [
    {
      key: 'bookingType',
      header: 'Booking Type',
      accessor: 'bookingType',
      render: (value) => value || 'N/A',
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

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading bookings...</div>;
  }

  return (
    <div className="mb-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">All Bookings</h4>
      <CustomTable columns={columns} data={bookings} emptyMessage="No bookings found." />

      {bookings.length > 0 && (
        <div className="flex items-center justify-between mt-4 px-4 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-700">
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
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (filters.page > 1) {
                  onPageChange(filters.page - 1);
                }
              }}
              disabled={filters.page <= 1}
              className={`px-6 py-2 rounded-xl font-bold transition-all duration-300 ${
                filters.page <= 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                  : 'bg-orange-500 text-white shadow-md active:scale-95 cursor-pointer'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => {
                onPageChange(filters.page + 1);
              }}
              disabled={
                bookings.length < filters.limit && filters.page >= (pagination.totalPages || 1)
              }
              className={`px-6 py-2 rounded-xl font-bold transition-all duration-300 ${
                bookings.length < filters.limit && filters.page >= (pagination.totalPages || 1)
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                  : 'bg-orange-500 text-white shadow-md active:scale-95 cursor-pointer'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingTable;
