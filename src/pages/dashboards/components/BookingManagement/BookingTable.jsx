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

  const typeConfig = {
    HOTEL:           { label: 'Hotel',         cls: 'bg-amber-100 text-amber-800' },
    FLIGHT:          { label: 'Flight',         cls: 'bg-blue-100 text-blue-800' },
    DOMESTIC_RETURN: { label: 'Return Flight',  cls: 'bg-purple-100 text-purple-800' },
    PROPERTY:        { label: 'Stay',           cls: 'bg-green-100 text-green-800' },
  };

  const columns = [
    {
      key: 'type',
      header: 'Type',
      accessor: 'bookingType',
      render: (value) => {
        const cfg = typeConfig[value] || { label: value || 'N/A', cls: 'bg-gray-100 text-gray-700' };
        return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${cfg.cls}`}>{cfg.label}</span>;
      },
    },
    {
      key: 'guest',
      header: 'Guest',
      accessor: '_id',
      render: (_, row) => {
        const name = row.userName || row.user?.name ||
          (row.leadPassenger?.firstName
            ? `${row.leadPassenger.firstName} ${row.leadPassenger.lastName || ''}`.trim()
            : null) ||
          row.guestName || 'N/A';
        const email = row.userEmail || row.user?.email || row.guestEmail || '';
        return (
          <div className="min-w-[130px]">
            <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
            {email && <p className="text-xs text-gray-400 truncate">{email}</p>}
          </div>
        );
      },
    },
    {
      key: 'property',
      header: 'Property / Route',
      accessor: '_id',
      render: (_, row) => {
        const name =
          row.propertyName ||
          row.hotelDetails?.HotelName ||
          (row.flightDetails?.Origin && row.flightDetails?.Destination
            ? `${row.flightDetails.Origin} → ${row.flightDetails.Destination}`
            : null);
        return <span className="text-sm text-gray-700 min-w-[140px] block truncate">{name || 'N/A'}</span>;
      },
    },
    {
      key: 'bookingId',
      header: 'Booking ID',
      accessor: 'bookingId',
      render: (value) => <span className="font-mono text-xs text-gray-600">{value || '—'}</span>,
    },
    {
      key: 'amount',
      header: 'Amount',
      accessor: 'totalAmount',
      render: (value, row) => (
        <span className="text-sm font-semibold text-gray-800">
          ₹{Number(value || 0).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      accessor: 'status',
      render: (value) => (
        <span className={`px-2 py-0.5 inline-flex text-xs font-semibold rounded-full ${getBookingStatusColor(value)}`}>
          {formatStatus(value)}
        </span>
      ),
    },
    {
      key: 'paymentStatus',
      header: 'Payment',
      accessor: 'paymentStatus',
      render: (value) => (
        <span className={`px-2 py-0.5 inline-flex text-xs font-semibold rounded-full ${getPaymentStatusColor(value)}`}>
          {formatStatus(value)}
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      accessor: 'createdAt',
      render: (value) => (
        <span className="text-xs text-gray-500 whitespace-nowrap">
          {value ? new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      accessor: (row) => row,
      render: (_, row) => (
        <button
          onClick={(e) => { e.stopPropagation(); onViewBooking(row); }}
          className="px-3 py-1.5 text-xs font-semibold text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors whitespace-nowrap"
        >
          View Details
        </button>
      ),
    },
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
