import React, { useState } from 'react';
import CustomTable from '../../../components/CustomTable';

const FinancialManagement = () => {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      bookingId: 'BK001',
      type: 'Property Booking',
      guestName: 'John Smith',
      propertyName: 'Sunset Villa',
      amount: 1500,
      paymentMethod: 'Credit Card',
      paymentStatus: 'Paid',
      transactionDate: '2024-01-15',
      gstAmount: 270,
      totalAmount: 1770,
      invoiceNumber: 'INV-2024-001'
    },
    {
      id: 2,
      type: 'Hotel Booking',
      guestName: 'Sarah Johnson',
      propertyName: 'Ocean View Resort',
      amount: 2800,
      paymentMethod: 'Bank Transfer',
      paymentStatus: 'Pending',
      transactionDate: '2024-01-18',
      gstAmount: 504,
      totalAmount: 3304,
      invoiceNumber: 'INV-2024-002'
    },
    {
      id: 3,
      type: 'Flight Booking',
      guestName: 'Michael Brown',
      propertyName: 'Mountain Retreat',
      amount: 2100,
      paymentMethod: 'Credit Card',
      paymentStatus: 'Paid',
      transactionDate: '2024-01-20',
      gstAmount: 378,
      totalAmount: 2478,
      invoiceNumber: 'INV-2024-003'
    },
    {
      id: 4,
      type: 'Property Booking',
      guestName: 'Emily Davis',
      propertyName: 'Sunset Villa',
      amount: 400,
      paymentMethod: 'UPI',
      paymentStatus: 'Partial',
      transactionDate: '2024-01-22',
      gstAmount: 72,
      totalAmount: 472,
      invoiceNumber: 'INV-2024-004'
    },
    {
      id: 5,
      type: 'Hotel Booking',
      guestName: 'David Wilson',
      propertyName: 'Beach House',
      amount: 3500,
      paymentMethod: 'Credit Card',
      paymentStatus: 'Paid',
      transactionDate: '2024-01-25',
      gstAmount: 630,
      totalAmount: 4130,
      invoiceNumber: 'INV-2024-005'
    }
  ]);
  const [financialFilters, setFinancialFilters] = useState({
    type: 'All',
    paymentStatus: 'All',
    dateFrom: '',
    dateTo: ''
  });

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Partial':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFilterTransactions = () => {
    return transactions.filter(transaction => {
      if (financialFilters.type !== 'All' && transaction.type !== financialFilters.type) return false;
      if (financialFilters.paymentStatus !== 'All' && transaction.paymentStatus !== financialFilters.paymentStatus) return false;
      if (financialFilters.dateFrom && transaction.transactionDate < financialFilters.dateFrom) return false;
      if (financialFilters.dateTo && transaction.transactionDate > financialFilters.dateTo) return false;
      return true;
    });
  };

  const filteredTransactions = handleFilterTransactions();

  const columns = [
    {
      key: 'invoiceNumber',
      header: 'Invoice No',
      accessor: 'invoiceNumber',
      headerClassName: 'min-w-[140px]',
      cellClassName: 'text-sm font-medium text-gray-900 font-mono'
    },
    {
      key: 'transactionDate',
      header: 'Transaction Date',
      accessor: 'transactionDate',
      headerClassName: 'min-w-[130px]',
      cellClassName: 'text-sm text-gray-500'
    },
    {
      key: 'guestName',
      header: 'Guest Name',
      accessor: 'guestName',
      headerClassName: 'min-w-[150px]',
      cellClassName: 'text-sm font-medium text-gray-900'
    },
    {
      key: 'type',
      header: 'Booking Type',
      accessor: 'type',
      headerClassName: 'min-w-[140px]',
      cellClassName: 'text-sm text-gray-500'
    },
    {
      key: 'propertyName',
      header: 'Property/Hotel',
      accessor: 'propertyName',
      headerClassName: 'min-w-[160px]',
      cellClassName: 'text-sm text-gray-500'
    },
    {
      key: 'amount',
      header: 'Subtotal',
      accessor: 'amount',
      headerClassName: 'min-w-[100px]',
      render: (value) => `₹${value.toLocaleString('en-IN')}`,
      cellClassName: 'text-sm text-gray-500 font-medium'
    },
    {
      key: 'gstAmount',
      header: 'GST (18%)',
      accessor: 'gstAmount',
      headerClassName: 'min-w-[100px]',
      render: (value) => `₹${value.toLocaleString('en-IN')}`,
      cellClassName: 'text-sm text-gray-500 font-medium'
    },
    {
      key: 'totalAmount',
      header: 'Total Amount',
      accessor: 'totalAmount',
      headerClassName: 'min-w-[120px]',
      render: (value) => `₹${value.toLocaleString('en-IN')}`,
      cellClassName: 'text-sm font-semibold text-gray-900'
    },
    {
      key: 'paymentMethod',
      header: 'Payment Method',
      accessor: 'paymentMethod',
      headerClassName: 'min-w-[130px]',
      cellClassName: 'text-sm text-gray-500'
    },
    {
      key: 'paymentStatus',
      header: 'Status',
      accessor: 'paymentStatus',
      headerClassName: 'min-w-[100px]',
      render: (value) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(value)}`}>
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      accessor: (row) => row,
      headerClassName: 'min-w-[100px]',
      cellClassName: 'text-sm font-medium',
      render: (_, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleGenerateInvoice(row);
          }}
          className="text-orange-600 hover:text-orange-900 font-medium px-2 py-1 rounded hover:bg-orange-50 transition"
          title="Generate & Download Invoice"
        >
          📄 Invoice
        </button>
      )
    }
  ];

  const handleGenerateInvoice = (transaction) => {
    const invoiceData = {
      invoiceNumber: transaction.invoiceNumber,
      date: new Date().toLocaleDateString('en-IN'),
      guestName: transaction.guestName,
      bookingType: transaction.type,
      propertyName: transaction.propertyName,
      subtotal: transaction.amount,
      gstRate: 18,
      gstAmount: transaction.gstAmount,
      totalAmount: transaction.totalAmount,
      paymentMethod: transaction.paymentMethod,
      paymentStatus: transaction.paymentStatus,
      transactionDate: transaction.transactionDate
    };

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${invoiceData.invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .invoice-header { border-bottom: 2px solid #f97316; padding-bottom: 20px; margin-bottom: 30px; }
          .invoice-title { font-size: 28px; color: #f97316; font-weight: bold; }
          .invoice-details { display: flex; justify-content: space-between; margin-top: 20px; }
          .company-info { flex: 1; }
          .invoice-info { flex: 1; text-align: right; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f97316; color: white; }
          .total-section { margin-top: 20px; text-align: right; }
          .total-row { font-size: 18px; font-weight: bold; padding: 10px 0; }
          .gst-info { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <div class="invoice-title">TAX INVOICE</div>
          <div class="invoice-details">
            <div class="company-info">
              <h3>Travel Rumors</h3>
              <p>123 Travel Street, Tourism City</p>
              <p>GSTIN: 27AAAAA0000A1Z5</p>
              <p>Email: info@travelrumors.com</p>
            </div>
            <div class="invoice-info">
              <p><strong>Invoice No:</strong> ${invoiceData.invoiceNumber}</p>
              <p><strong>Date:</strong> ${invoiceData.date}</p>
              <p><strong>Transaction Date:</strong> ${invoiceData.transactionDate}</p>
            </div>
          </div>
        </div>
        
        <div>
          <h3>Bill To:</h3>
          <p><strong>${invoiceData.guestName}</strong></p>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Booking Type</th>
              <th>Payment Method</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${invoiceData.propertyName}</td>
              <td>${invoiceData.bookingType}</td>
              <td>${invoiceData.paymentMethod}</td>
              <td>₹${invoiceData.subtotal.toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="total-section">
          <div style="display: flex; justify-content: flex-end;">
            <div style="width: 300px;">
              <div style="display: flex; justify-content: space-between; padding: 5px 0;">
                <span>Subtotal:</span>
                <span>₹${invoiceData.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 5px 0;">
                <span>GST (18%):</span>
                <span>₹${invoiceData.gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div class="total-row" style="display: flex; justify-content: space-between; padding: 10px 0; border-top: 2px solid #f97316;">
                <span>Total Amount:</span>
                <span>₹${invoiceData.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="gst-info">
          <p><strong>Payment Status:</strong> ${invoiceData.paymentStatus}</p>
          <p>This is a computer-generated invoice and does not require a signature.</p>
          <p>GST Registration Number: 27AAAAA0000A1Z5</p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_${invoiceData.invoiceNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-full overflow-hidden">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Financial Management</h3>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-5 border border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-gray-600 text-sm font-medium mb-1">Total Revenue</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-800">
                ₹{transactions.filter(t => t.paymentStatus === 'Paid').reduce((sum, t) => sum + t.totalAmount, 0).toLocaleString('en-IN')}
              </p>
            </div>
            <div className="text-3xl lg:text-4xl ml-3">💰</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-5 border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-gray-600 text-sm font-medium mb-1">Total GST</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-800">
                ₹{transactions.filter(t => t.paymentStatus === 'Paid').reduce((sum, t) => sum + t.gstAmount, 0).toLocaleString('en-IN')}
              </p>
            </div>
            <div className="text-3xl lg:text-4xl ml-3">📊</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-md p-5 border border-orange-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-gray-600 text-sm font-medium mb-1">Pending Payments</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-800">
                ₹{transactions.filter(t => t.paymentStatus === 'Pending' || t.paymentStatus === 'Partial').reduce((sum, t) => sum + t.amount, 0).toLocaleString('en-IN')}
              </p>
            </div>
            <div className="text-3xl lg:text-4xl ml-3">⏳</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-md p-5 border border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-gray-600 text-sm font-medium mb-1">Total Transactions</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-800">{transactions.length}</p>
            </div>
            <div className="text-3xl lg:text-4xl ml-3">📈</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Booking Type</label>
            <select
              value={financialFilters.type}
              onChange={(e) => setFinancialFilters({ ...financialFilters, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="All">All Types</option>
              <option value="Property Booking">Property Booking</option>
              <option value="Hotel Booking">Hotel Booking</option>
              <option value="Flight Booking">Flight Booking</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
            <select
              value={financialFilters.paymentStatus}
              onChange={(e) => setFinancialFilters({ ...financialFilters, paymentStatus: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Partial">Partial</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date From</label>
            <input
              type="date"
              value={financialFilters.dateFrom}
              onChange={(e) => setFinancialFilters({ ...financialFilters, dateFrom: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date To</label>
            <input
              type="date"
              value={financialFilters.dateTo}
              onChange={(e) => setFinancialFilters({ ...financialFilters, dateTo: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="-mx-6 px-6">
        <CustomTable
          columns={columns}
          data={filteredTransactions}
          emptyMessage="No transactions found"
          tableClassName="w-full"
          containerClassName="overflow-x-auto"
          minWidth="1400px"
        />
      </div>

      {/* Export Options */}
      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={() => {
            const csvContent = [
              ['Invoice No', 'Date', 'Guest', 'Type', 'Property', 'Subtotal', 'GST', 'Total', 'Payment Method', 'Status'],
              ...filteredTransactions.map(t => [
                t.invoiceNumber,
                t.transactionDate,
                t.guestName,
                t.type,
                t.propertyName,
                t.amount,
                t.gstAmount,
                t.totalAmount,
                t.paymentMethod,
                t.paymentStatus
              ])
            ].map(row => row.join(',')).join('\n');
            
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Transactions_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
        >
          📊 Export to CSV
        </button>
      </div>
    </div>
  );
};

export default FinancialManagement;



