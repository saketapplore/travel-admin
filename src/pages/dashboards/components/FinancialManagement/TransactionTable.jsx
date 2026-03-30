import React from 'react';
import CustomTable from '../../../../components/CustomTable';

const TransactionTable = ({ transactions, loading }) => {
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
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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
      header: 'Status',
      accessor: 'status',
      render: (value) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(value)}`}
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

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading transactions...</div>;
  }

  return (
    <CustomTable columns={columns} data={transactions} emptyMessage="No transactions found." />
  );
};

export default TransactionTable;
