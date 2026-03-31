import { useState, useEffect, useCallback } from 'react';
import { transactionService } from '../../../../services/transactionService';

export const useFinancialManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    bookingType: '',
    status: '',
    bookingStatus: '',
    search: '',
    page: 1,
    limit: 10
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await transactionService.getAll({
        page: filters.page,
        limit: filters.limit,
        bookingType: filters.bookingType || undefined,
        status: filters.status || undefined,
        bookingStatus: filters.bookingStatus || undefined,
        search: filters.search || undefined
      });

      const data = response?.data?.data || response?.data || {};
      const transactionsArray = Array.isArray(data) ? data : data.transactions || data.items || [];

      const normalizedTransactions = transactionsArray.map((transaction) => ({
        id: transaction._id || transaction.id,
        name:
          transaction.userDetails?.name ||
          transaction.user?.name ||
          transaction.name ||
          transaction.userName ||
          transaction.guestName ||
          'N/A',
        transactionId:
          transaction.transactionId ||
          transaction.transaction_id ||
          transaction._id ||
          transaction.id ||
          'N/A',
        status:
          transaction.status ||
          transaction.paymentStatus ||
          transaction.payment_status ||
          transaction.bookingPaymentStatus ||
          'pending',
        bookingType:
          transaction.bookingType ||
          transaction.booking_type ||
          transaction.bookingDetails?.bookingType ||
          transaction.type ||
          'N/A',
        totalAmount:
          transaction.totalAmount ||
          transaction.total_amount ||
          transaction.amount ||
          transaction.bookingDetails?.totalAmount ||
          0,
        currency:
          transaction.currency ||
          transaction.Currency ||
          transaction.bookingDetails?.Currency ||
          transaction.bookingDetails?.currency ||
          'N/A',
        bookingId:
          transaction.booking?._id ||
          transaction.booking ||
          transaction.bookingDetails?._id ||
          transaction.bookingId ||
          transaction.booking_id ||
          transaction._id ||
          'N/A',
        bookingStatus:
          transaction.bookingDetails?.status ||
          transaction.bookingDetails?.hotelStatus ||
          transaction.bookingDetails?.bookingStatus ||
          transaction.booking?.status ||
          transaction.booking_status ||
          'N/A'
      }));

      setTransactions(normalizedTransactions);

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
        const hasMorePages = transactionsArray.length === filters.limit;
        const estimatedTotal = hasMorePages
          ? filters.page * filters.limit + 1
          : (filters.page - 1) * filters.limit + transactionsArray.length;
        const estimatedPages = hasMorePages ? filters.page + 1 : filters.page;

        setPagination({
          currentPage: filters.page,
          totalPages: estimatedPages,
          totalItems: estimatedTotal
        });
      }

      setError('');
    } catch (err) {
      console.error('Transactions fetch error:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to load transactions. Please try again.';
      setError(errorMessage);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    transactions,
    loading,
    error,
    filters,
    pagination,
    handleFilterChange,
    handlePageChange,
    fetchTransactions
  };
};
