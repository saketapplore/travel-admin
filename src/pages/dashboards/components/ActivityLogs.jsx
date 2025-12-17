import React, { useState } from 'react';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([
    {
      id: 1,
      managerName: 'John Property',
      managerEmail: 'john.property@email.com',
      managerType: 'Property Manager',
      activity: 'Created Property',
      details: 'Created new property: Sunset Villa',
      timestamp: '2024-01-15 10:30:45',
      ipAddress: '192.168.1.100'
    },
    {
      id: 2,
      managerName: 'Sarah Booking',
      managerEmail: 'sarah.booking@email.com',
      managerType: 'Booking Manager',
      activity: 'Approved Booking',
      details: 'Approved booking #BK001 for John Smith',
      timestamp: '2024-01-15 11:15:20',
      ipAddress: '192.168.1.101'
    },
    {
      id: 3,
      managerName: 'Mike Staff',
      managerEmail: 'mike.staff@email.com',
      managerType: 'Staff Manager',
      activity: 'Added Staff Member',
      details: 'Added new staff member: Jane Doe',
      timestamp: '2024-01-15 12:00:10',
      ipAddress: '192.168.1.102'
    },
    {
      id: 4,
      managerName: 'John Property',
      managerEmail: 'john.property@email.com',
      managerType: 'Property Manager',
      activity: 'Updated Property',
      details: 'Updated property: Ocean View Resort - Changed pricing',
      timestamp: '2024-01-15 13:45:30',
      ipAddress: '192.168.1.100'
    },
    {
      id: 5,
      managerName: 'Sarah Booking',
      managerEmail: 'sarah.booking@email.com',
      managerType: 'Booking Manager',
      activity: 'Rejected Booking',
      details: 'Rejected booking #BK002 for Emily Davis',
      timestamp: '2024-01-15 14:20:15',
      ipAddress: '192.168.1.101'
    },
    {
      id: 6,
      managerName: 'Mike Staff',
      managerEmail: 'mike.staff@email.com',
      managerType: 'Staff Manager',
      activity: 'Updated Staff Member',
      details: 'Updated staff member: John Doe - Changed status to Active',
      timestamp: '2024-01-15 15:10:50',
      ipAddress: '192.168.1.102'
    },
    {
      id: 7,
      managerName: 'John Property',
      managerEmail: 'john.property@email.com',
      managerType: 'Property Manager',
      activity: 'Deleted Property',
      details: 'Deleted property: Old Mountain Cabin',
      timestamp: '2024-01-15 16:30:25',
      ipAddress: '192.168.1.100'
    },
    {
      id: 8,
      managerName: 'Sarah Booking',
      managerEmail: 'sarah.booking@email.com',
      managerType: 'Booking Manager',
      activity: 'Updated Booking',
      details: 'Updated booking #BK003 - Changed check-in date',
      timestamp: '2024-01-15 17:00:40',
      ipAddress: '192.168.1.101'
    },
    {
      id: 9,
      managerName: 'Mike Staff',
      managerEmail: 'mike.staff@email.com',
      managerType: 'Staff Manager',
      activity: 'Deleted Staff Member',
      details: 'Deleted staff member: Bob Smith',
      timestamp: '2024-01-15 18:15:55',
      ipAddress: '192.168.1.102'
    },
    {
      id: 10,
      managerName: 'John Property',
      managerEmail: 'john.property@email.com',
      managerType: 'Property Manager',
      activity: 'Uploaded Property Image',
      details: 'Uploaded new image for property: Beach House',
      timestamp: '2024-01-15 19:20:30',
      ipAddress: '192.168.1.100'
    }
  ]);
  const [logsFilters, setLogsFilters] = useState({
    managerType: 'All',
    activityType: 'All',
    dateFrom: '',
    dateTo: ''
  });

  const getFilteredLogs = () => {
    let filteredLogs = logs;
    
    if (logsFilters.managerType !== 'All') {
      filteredLogs = filteredLogs.filter(log => log.managerType === logsFilters.managerType);
    }
    
    if (logsFilters.activityType !== 'All') {
      filteredLogs = filteredLogs.filter(log => log.activity.startsWith(logsFilters.activityType));
    }
    
    if (logsFilters.dateFrom) {
      filteredLogs = filteredLogs.filter(log => {
        const logDate = log.timestamp.split(' ')[0];
        return logDate >= logsFilters.dateFrom;
      });
    }
    
    if (logsFilters.dateTo) {
      filteredLogs = filteredLogs.filter(log => {
        const logDate = log.timestamp.split(' ')[0];
        return logDate <= logsFilters.dateTo;
      });
    }
    
    return filteredLogs;
  };

  const filteredLogs = getFilteredLogs();

  const handleExportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Manager Name', 'Manager Email', 'Manager Type', 'Activity', 'Details', 'IP Address'],
      ...filteredLogs.map(log => [
        log.timestamp,
        log.managerName,
        log.managerEmail,
        log.managerType,
        log.activity,
        log.details,
        log.ipAddress
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Activity_Logs_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-full overflow-hidden">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Activity Logs</h3>
        <p className="text-sm text-gray-600">Monitor all activities performed by Property Managers, Staff Managers, and Booking Managers</p>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Manager Type</label>
            <select
              value={logsFilters.managerType}
              onChange={(e) => setLogsFilters({ ...logsFilters, managerType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="All">All Managers</option>
              <option value="Property Manager">Property Manager</option>
              <option value="Booking Manager">Booking Manager</option>
              <option value="Staff Manager">Staff Manager</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Activity Type</label>
            <select
              value={logsFilters.activityType}
              onChange={(e) => setLogsFilters({ ...logsFilters, activityType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="All">All Activities</option>
              <option value="Created">Created</option>
              <option value="Updated">Updated</option>
              <option value="Deleted">Deleted</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Uploaded">Uploaded</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date From</label>
            <input
              type="date"
              value={logsFilters.dateFrom}
              onChange={(e) => setLogsFilters({ ...logsFilters, dateFrom: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date To</label>
            <input
              type="date"
              value={logsFilters.dateTo}
              onChange={(e) => setLogsFilters({ ...logsFilters, dateTo: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No activity logs found
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{log.managerName}</div>
                      <div className="text-sm text-gray-500">{log.managerEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      log.managerType === 'Property Manager' ? 'bg-blue-100 text-blue-800' :
                      log.managerType === 'Booking Manager' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {log.managerType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      log.activity.includes('Created') || log.activity.includes('Added') || log.activity.includes('Uploaded') ? 'bg-green-100 text-green-800' :
                      log.activity.includes('Updated') ? 'bg-yellow-100 text-yellow-800' :
                      log.activity.includes('Deleted') || log.activity.includes('Rejected') ? 'bg-red-100 text-red-800' :
                      log.activity.includes('Approved') ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {log.activity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {log.details}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {log.ipAddress}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Export Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleExportLogs}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
        >
          📄 Export Logs
        </button>
      </div>
    </div>
  );
};

export default ActivityLogs;

