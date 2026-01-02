import React, { useState, useEffect } from 'react';
import CustomTable from '../../../components/CustomTable';
import { transactionService } from '../../../services/transactionService';

const FinancialManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Filter states
  const [filters, setFilters] = useState({
    bookingType: '',
    status: '',
    search: '',
    page: 1,
    limit: 10
  });

  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  // Fetch transactions from API
  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await transactionService.getAll({
        page: filters.page,
        limit: filters.limit,
        bookingType: filters.bookingType || undefined,
        status: filters.status || undefined,
        search: filters.search || undefined
      });

      // Handle various response structures
      const data = response?.data?.data || response?.data || {};
      const transactionsArray = Array.isArray(data) ? data : (data.transactions || data.items || []);

      // Normalize transactions data
      const normalizedTransactions = transactionsArray.map(transaction => ({
        id: transaction._id || transaction.id,
        name: transaction.userDetails?.name || 
              transaction.user?.name || 
              transaction.name || 
              transaction.userName || 
              transaction.guestName || 
              'N/A',
        transactionId: transaction.transactionId || transaction.transaction_id || transaction._id || transaction.id || 'N/A',
        status: transaction.status || transaction.paymentStatus || transaction.payment_status || transaction.bookingPaymentStatus || 'pending',
        bookingType: transaction.bookingType || transaction.booking_type || transaction.bookingDetails?.bookingType || transaction.type || 'N/A',
        totalAmount: transaction.totalAmount || transaction.total_amount || transaction.amount || transaction.bookingDetails?.totalAmount || 0,
        currency: transaction.currency || transaction.Currency || transaction.bookingDetails?.Currency || transaction.bookingDetails?.currency || 'N/A',
        bookingId: transaction.booking?._id || transaction.booking || transaction.bookingDetails?._id || transaction.bookingId || transaction.booking_id || transaction._id || 'N/A'
      }));

      setTransactions(normalizedTransactions);

      // Update pagination if available
      if (data.pagination || data.meta) {
        const paginationData = data.pagination || data.meta;
        const totalItems = paginationData.total || paginationData.totalItems || 0;
        const totalPages = paginationData.totalPages || Math.ceil(totalItems / filters.limit);
        setPagination({
          currentPage: paginationData.currentPage || paginationData.page || filters.page,
          totalPages: totalPages || 1,
          totalItems: totalItems
        });
      } else {
        // If API doesn't provide pagination metadata, estimate based on returned items
        // If we got exactly 'limit' items, assume there might be more pages
        const hasMorePages = transactionsArray.length === filters.limit;
        // Estimate total items: if we have a full page, assume at least (currentPage * limit) + 1 items
        const estimatedTotal = hasMorePages 
          ? (filters.page * filters.limit) + 1 
          : ((filters.page - 1) * filters.limit) + transactionsArray.length;
        const estimatedPages = hasMorePages 
          ? filters.page + 1 
          : filters.page;
        
        setPagination({
          currentPage: filters.page,
          totalPages: estimatedPages,
          totalItems: estimatedTotal
        });
      }

      setError('');
    } catch (error) {
      console.error('Transactions fetch error:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to load transactions. Please try again.';
      setError(errorMessage);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusLower = (status || '').toLowerCase();
    switch (statusLower) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status) => {
    if (!status) return 'N/A';
    return status.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filter changes
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
    // Scroll to top of table when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      render: (value) => (
        <span className="font-mono text-xs">{value || 'N/A'}</span>
      ),
      cellClassName: 'text-sm text-gray-700'
    },
    {
      key: 'bookingId',
      header: 'Booking Id',
      accessor: 'bookingId',
      render: (value) => (
        <span className="font-mono text-xs">{value || 'N/A'}</span>
      ),
      cellClassName: 'text-sm text-gray-700'
    },
    {
      key: 'status',
      header: 'Status',
      accessor: 'status',
      render: (value) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(value)}`}>
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Transactions</h3>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">Filters</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Booking Type</label>
            <select
              value={filters.bookingType}
              onChange={(e) => handleFilterChange('bookingType', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="FLIGHT">Flight</option>
              <option value="HOTEL">Hotel</option>
              <option value="PROPERTY">Property</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search by name..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
          {error}
        </div>
      )}

      {/* Transactions Table */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">All Transactions</h4>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading transactions...</div>
        ) : (
          <>
        <CustomTable
          columns={columns}
              data={transactions}
              emptyMessage="No transactions found."
            />

            {/* Pagination */}
            {transactions.length > 0 && (
              <div className="flex items-center justify-between mt-4 px-4 py-3 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  {(() => {
                    const startIndex = (filters.page - 1) * filters.limit;
                    const endIndex = Math.min(startIndex + filters.limit, pagination.totalItems || transactions.length);
                    const totalItems = pagination.totalItems || transactions.length;
                    return `Showing ${startIndex + 1} to ${endIndex} of ${totalItems} transactions`;
                  })()}
      </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      if (filters.page > 1) {
                        handlePageChange(filters.page - 1);
                      }
                    }}
                    disabled={filters.page <= 1}
                    className={`px-4 py-2 rounded-lg font-semibold transition duration-200 ${
                      filters.page <= 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer'
                    }`}
                  >
                    Previous
                  </button>
        <button
          onClick={() => {
                      handlePageChange(filters.page + 1);
                    }}
                    disabled={transactions.length < filters.limit && filters.page >= (pagination.totalPages || 1)}
                    className={`px-4 py-2 rounded-lg font-semibold transition duration-200 ${
                      transactions.length < filters.limit && filters.page >= (pagination.totalPages || 1)
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer'
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
    </div>
  );
};

export default FinancialManagement;
