import React from 'react';
import { useFinancialManagement } from './useFinancialManagement';
import TransactionFilters from './TransactionFilters';
import TransactionTable from './TransactionTable';
import Pagination from './Pagination';

const FinancialManagement = () => {
  const {
    transactions,
    loading,
    error,
    filters,
    pagination,
    handleFilterChange,
    handlePageChange
  } = useFinancialManagement();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Transactions</h3>
      </div>

      <TransactionFilters filters={filters} onFilterChange={handleFilterChange} />

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm text-left">
          {error}
        </div>
      )}

      <div className="mb-6">
        <TransactionTable 
          transactions={transactions} 
          loading={loading} 
          filters={filters}
          onSearch={(searchTerm) => handleFilterChange('search', searchTerm)}
        />

        {!loading && transactions.length > 0 && (
          <Pagination
            filters={filters}
            pagination={pagination}
            transactionsCount={transactions.length}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default FinancialManagement;
