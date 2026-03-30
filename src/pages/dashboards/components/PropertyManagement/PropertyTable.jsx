import React from 'react';
import CustomTable from '../../../../components/CustomTable';
import { EditIcon, DeleteIcon } from '../../../../components/icons';

const PropertyTable = ({ properties, onEdit, onDelete }) => {
  const columns = [
    {
      key: 'name',
      header: 'Property Name',
      accessor: 'name',
      cellClassName: 'text-sm font-medium text-gray-900'
    },
    {
      key: 'location',
      header: 'Location',
      accessor: 'location',
      cellClassName: 'text-sm text-gray-500'
    },
    {
      key: 'rooms',
      header: 'Rooms',
      accessor: 'rooms',
      cellClassName: 'text-sm text-gray-500'
    },
    {
      key: 'price',
      header: 'Price',
      accessor: 'price',
      cellClassName: 'text-sm text-gray-500'
    },
    {
      key: 'assignedToName',
      header: 'Assigned To',
      accessor: 'assignedToName',
      cellClassName: 'text-sm text-gray-500'
    },
    {
      key: 'status',
      header: 'Status',
      accessor: 'status',
      render: (value) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            value === 'Available' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
          }`}
        >
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      accessor: (row) => row,
      cellClassName: 'text-sm font-medium space-x-2',
      render: (_, row) => (
        <div className="flex items-center space-x-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(row);
            }}
            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <EditIcon className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(row.id);
            }}
            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <DeleteIcon className="w-5 h-5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <CustomTable
      columns={columns}
      data={properties}
      emptyMessage="No properties added yet. Click 'Add Property' to create one."
    />
  );
};

export default PropertyTable;
