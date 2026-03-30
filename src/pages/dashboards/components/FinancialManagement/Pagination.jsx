import React from 'react';

const Pagination = ({ filters, pagination, transactionsCount, onPageChange }) => {
  const startIndex = (filters.page - 1) * filters.limit;
  const totalItems = pagination.totalItems || transactionsCount;
  const endIndex = Math.min(startIndex + filters.limit, totalItems);

  return (
    <div className="flex items-center justify-between mt-4 px-4 py-3 border-t border-gray-200">
      <div className="text-sm text-gray-700">
        Showing {startIndex + 1} to {endIndex} of {totalItems} transactions
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
            transactionsCount < filters.limit && filters.page >= (pagination.totalPages || 1)
          }
          className={`px-6 py-2 rounded-xl font-bold transition-all duration-300 ${
            transactionsCount < filters.limit && filters.page >= (pagination.totalPages || 1)
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
              : 'bg-orange-500 text-white shadow-md active:scale-95 cursor-pointer'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
