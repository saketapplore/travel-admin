import React, { useState } from 'react';
import CustomTable from '../../../components/CustomTable';

const ReportingAnalytics = () => {
  const [reportingSubSection, setReportingSubSection] = useState('reports');
  
  const [reportFilters, setReportFilters] = useState({
    dateFrom: '2024-01-01',
    dateTo: '2024-12-31',
    reportType: 'All'
  });

  // Sample analytics data
  const analyticsData = {
    nightsBooked: 245,
    revenueEarned: 83780,
    totalRooms: 50,
    occupiedRooms: 38,
    occupancyPercentage: 76,
    monthlyTrends: [
      { month: 'Jan', nights: 45, revenue: 12500, bookings: 12 },
      { month: 'Feb', nights: 52, revenue: 14500, bookings: 15 },
      { month: 'Mar', nights: 48, revenue: 13800, bookings: 14 },
      { month: 'Apr', nights: 55, revenue: 16200, bookings: 18 },
      { month: 'May', nights: 45, revenue: 13200, bookings: 13 }
    ]
  };

  const staffPerformance = [
    {
      id: 1,
      name: 'John Manager',
      role: 'Property Manager',
      assignedBookings: 25,
      completedTasks: 48,
      pendingTasks: 5,
      completionRate: 90.6,
      revenueGenerated: 45000
    },
    {
      id: 2,
      name: 'Sarah Coordinator',
      role: 'Booking Manager',
      assignedBookings: 32,
      completedTasks: 62,
      pendingTasks: 3,
      completionRate: 95.4,
      revenueGenerated: 58000
    },
    {
      id: 3,
      name: 'Mike Supervisor',
      role: 'Staff Manager',
      assignedBookings: 18,
      completedTasks: 35,
      pendingTasks: 8,
      completionRate: 81.4,
      revenueGenerated: 32000
    },
    {
      id: 4,
      name: 'Emily Assistant',
      role: 'Property Manager',
      assignedBookings: 20,
      completedTasks: 40,
      pendingTasks: 2,
      completionRate: 95.2,
      revenueGenerated: 38000
    }
  ];

  const isRevenueReport = reportFilters.reportType === 'All' || reportFilters.reportType === 'Revenue';
  const isOccupancyReport = reportFilters.reportType === 'All' || reportFilters.reportType === 'Occupancy';
  const isBookingsReport = reportFilters.reportType === 'All' || reportFilters.reportType === 'Bookings';

  const staffPerformanceColumns = [
    {
      key: 'name',
      header: 'Staff Name',
      accessor: 'name',
      cellClassName: 'text-sm font-medium text-gray-900'
    },
    {
      key: 'role',
      header: 'Role',
      accessor: 'role',
      cellClassName: 'text-sm text-gray-500'
    },
    {
      key: 'assignedBookings',
      header: 'Assigned Bookings',
      accessor: 'assignedBookings',
      cellClassName: 'text-sm text-gray-500 font-medium'
    },
    {
      key: 'completedTasks',
      header: 'Completed Tasks',
      accessor: 'completedTasks',
      cellClassName: 'text-sm text-gray-500 font-medium'
    },
    {
      key: 'pendingTasks',
      header: 'Pending Tasks',
      accessor: 'pendingTasks',
      cellClassName: 'text-sm text-gray-500'
    },
    {
      key: 'completionRate',
      header: 'Completion Rate',
      accessor: 'completionRate',
      render: (value) => (
        <div className="flex items-center">
          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
            <div
              className={`h-2 rounded-full ${
                value >= 90 ? 'bg-green-500' :
                value >= 75 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${value}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium text-gray-700">{value}%</span>
        </div>
      )
    },
    {
      key: 'revenueGenerated',
      header: 'Revenue Generated',
      accessor: 'revenueGenerated',
      render: (value) => `₹${value.toLocaleString('en-IN')}`,
      cellClassName: 'text-sm font-semibold text-gray-900'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-full overflow-hidden">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Reporting & Analytics</h3>
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setReportingSubSection('reports')}
            className={`px-6 py-2 rounded-lg font-semibold transition duration-200 ${
              reportingSubSection === 'reports'
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            📈 Reports
          </button>
          <button
            onClick={() => setReportingSubSection('staff')}
            className={`px-6 py-2 rounded-lg font-semibold transition duration-200 ${
              reportingSubSection === 'staff'
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            👥 Staff Performance
          </button>
        </div>
      </div>

      {/* Reports Section */}
      {reportingSubSection === 'reports' && (
      <>
      {/* Date Filters */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date From</label>
            <input
              type="date"
              value={reportFilters.dateFrom}
              onChange={(e) => setReportFilters({ ...reportFilters, dateFrom: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date To</label>
            <input
              type="date"
              value={reportFilters.dateTo}
              onChange={(e) => setReportFilters({ ...reportFilters, dateTo: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={reportFilters.reportType}
              onChange={(e) => setReportFilters({ ...reportFilters, reportType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="All">All Reports</option>
              <option value="Revenue">Revenue Report</option>
              <option value="Occupancy">Occupancy Report</option>
              <option value="Bookings">Bookings Report</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {(isBookingsReport || isOccupancyReport) && (
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-5 border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium mb-1">Nights Booked</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-800">
                  {analyticsData.nightsBooked}
                </p>
                <p className="text-xs text-gray-500 mt-1">Total nights</p>
              </div>
              <div className="text-3xl lg:text-4xl ml-3">🌙</div>
            </div>
          </div>
        )}

        {isRevenueReport && (
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-5 border border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium mb-1">Revenue Earned</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-800">
                  ₹{analyticsData.revenueEarned.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-gray-500 mt-1">Total revenue</p>
              </div>
              <div className="text-3xl lg:text-4xl ml-3">💰</div>
            </div>
          </div>
        )}

        {isOccupancyReport && (
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-md p-5 border border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium mb-1">Occupancy %</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-800">
                  {analyticsData.occupancyPercentage}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {analyticsData.occupiedRooms}/{analyticsData.totalRooms} rooms
                </p>
              </div>
              <div className="text-3xl lg:text-4xl ml-3">📊</div>
            </div>
          </div>
        )}

        {isBookingsReport && (
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-md p-5 border border-orange-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium mb-1">Total Bookings</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-800">
                  {analyticsData.monthlyTrends.reduce((sum, m) => sum + m.bookings, 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">All time</p>
              </div>
              <div className="text-3xl lg:text-4xl ml-3">📅</div>
            </div>
          </div>
        )}
      </div>

      {/* Booking Trends Chart */}
      {(isBookingsReport || isOccupancyReport) && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Monthly Booking Trends</h4>
          <div className="space-y-4">
            {analyticsData.monthlyTrends.map((month, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{month.month}</span>
                  <span className="text-sm text-gray-500">{month.bookings} bookings</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                  <div
                    className="bg-orange-500 h-4 rounded-full"
                    style={{ width: `${(month.bookings / 20) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{month.nights} nights</span>
                  <span>₹{month.revenue.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revenue Chart */}
      {isRevenueReport && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Revenue Trends</h4>
          <div className="space-y-4">
            {analyticsData.monthlyTrends.map((month, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{month.month}</span>
                  <span className="text-sm font-semibold text-gray-800">
                    ₹{month.revenue.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-green-500 h-4 rounded-full"
                    style={{ width: `${(month.revenue / 20000) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Export Options */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => {
            const reportData = {
              period: `${reportFilters.dateFrom} to ${reportFilters.dateTo}`,
              nightsBooked: analyticsData.nightsBooked,
              revenueEarned: analyticsData.revenueEarned,
              occupancyPercentage: analyticsData.occupancyPercentage,
              monthlyTrends: analyticsData.monthlyTrends
            };
            const reportText = `
REPORTING & ANALYTICS REPORT
Period: ${reportData.period}

KEY METRICS:
- Nights Booked: ${reportData.nightsBooked}
- Revenue Earned: ₹${reportData.revenueEarned.toLocaleString('en-IN')}
- Occupancy Percentage: ${reportData.occupancyPercentage}%
- Total Rooms: ${analyticsData.totalRooms}
- Occupied Rooms: ${analyticsData.occupiedRooms}

MONTHLY TRENDS:
${reportData.monthlyTrends.map(m => `${m.month}: ${m.bookings} bookings, ${m.nights} nights, ₹${m.revenue.toLocaleString('en-IN')}`).join('\n')}

Generated on: ${new Date().toLocaleString('en-IN')}
            `;
            const blob = new Blob([reportText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Analytics_Report_${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
        >
          📄 Export Report
        </button>
      </div>
      </>
      )}

      {/* Staff Performance Section */}
      {reportingSubSection === 'staff' && (
      <>
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Staff Performance Metrics</h4>
        <p className="text-sm text-gray-600">View performance metrics based on assigned bookings and tasks completed</p>
      </div>

      <div className="-mx-6 px-6">
        <CustomTable
          columns={staffPerformanceColumns}
          data={staffPerformance}
          emptyMessage="No staff performance data available"
          tableClassName="w-full"
          containerClassName="overflow-x-auto"
          minWidth="1000px"
        />
      </div>

      {/* Export Staff Performance */}
      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={() => {
            const csvContent = [
              ['Staff Name', 'Role', 'Assigned Bookings', 'Completed Tasks', 'Pending Tasks', 'Completion Rate %', 'Revenue Generated'],
              ...staffPerformance.map(s => [
                s.name,
                s.role,
                s.assignedBookings,
                s.completedTasks,
                s.pendingTasks,
                s.completionRate,
                s.revenueGenerated
              ])
            ].map(row => row.join(',')).join('\n');
            
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Staff_Performance_${new Date().toISOString().split('T')[0]}.csv`;
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
      </>
      )}
    </div>
  );
};

export default ReportingAnalytics;



