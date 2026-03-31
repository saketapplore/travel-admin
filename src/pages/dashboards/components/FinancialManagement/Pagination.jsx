import React from 'react';

const Pagination = ({ filters, pagination, transactionsCount, onPageChange }) => {
  const startIndex = (filters.page - 1) * filters.limit;
  const totalItems = pagination.totalItems || transactionsCount;
  const endIndex = Math.min(startIndex + filters.limit, totalItems);

  const totalPages = pagination.totalPages || 1;
  const maxVisiblePages = 10;
  const startPage = Math.floor((filters.page - 1) / maxVisiblePages) * maxVisiblePages + 1;
  const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between mt-4 px-4 py-3 border-t border-gray-200 gap-4">
      <div className="text-sm text-gray-700 whitespace-nowrap">
        Showing {startIndex + 1} to {endIndex} of {totalItems} transactions
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

        <div className="flex items-center gap-1.5 custom-scrollbar max-w-full justify-center">
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
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
          ))}
          
          {totalPages > endPage && (
            <span className="text-gray-500 font-medium px-2">...</span>
          )}
        </div>

        <button
          onClick={() => {
            onPageChange(filters.page + 1);
          }}
          disabled={transactionsCount < filters.limit && filters.page >= totalPages}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
            transactionsCount < filters.limit && filters.page >= totalPages
              ? 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm cursor-pointer'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
