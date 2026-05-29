import React from 'react';
import CustomTable from '../../../../components/CustomTable';
import { useAuth } from '../../../../context/AuthContext';
import {
  RefreshCw,
  MapPin,
  BedDouble,
  Eye,
  Loader2
} from 'lucide-react';

/**
 * PropertyList - Table view of all discovered Beds24 properties
 */
const PropertyList = ({
  properties,
  onViewDetail,
  onSync,
  syncingPropertyId
}) => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'Super Admin' || user?.roleKey === 'super-admin';
  const hasPermission = (module, action) => isSuperAdmin || user?.permissions?.[module]?.[action] === true;

  const canView = hasPermission('stays', 'view');
  const canEdit = hasPermission('stays', 'edit');

  const columns = [
    {
      key: 'name',
      header: 'Property',
      accessor: (row) => row,
      cellClassName: 'text-sm',
      render: (_, row) => (
        <div className="flex items-center gap-3 min-w-0">
          {/* Thumbnail */}
          <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
            {row.images && row.images.length > 0 ? (
              <img
                src={row.images[0]}
                alt={row.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <BedDouble className="w-5 h-5" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">{row.name}</p>
            <p className="text-xs text-gray-400 capitalize mt-0.5">
              {row.propertyType || 'Property'}
            </p>
          </div>
        </div>
      )
    },
    {
      key: 'city',
      header: 'Location',
      accessor: (row) => row,
      cellClassName: 'text-sm',
      render: (_, row) => (
        <div className="flex items-center gap-1.5 text-gray-600">
          <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="truncate max-w-[200px]">
            {row.city || row.address || '—'}
          </span>
        </div>
      )
    },
    {
      key: 'rooms',
      header: 'Rooms',
      accessor: (row) => row.roomTypes?.length || 0,
      cellClassName: 'text-sm text-gray-600',
      render: (value) => (
        <div className="flex items-center gap-1.5">
          <BedDouble className="w-3.5 h-3.5 text-gray-400" />
          {value}
        </div>
      )
    },
    {
      key: 'currency',
      header: 'Currency',
      accessor: 'currency',
      cellClassName: 'text-sm text-gray-600 font-medium'
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (row) => row.isSynced,
      cellClassName: 'text-sm',
      render: (isSynced) => (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
          <span
            className={`w-2 h-2 rounded-full ${
              isSynced ? 'bg-emerald-500' : 'bg-amber-400'
            }`}
          />
          <span className={isSynced ? 'text-emerald-700' : 'text-amber-700'}>
            {isSynced ? 'Synced' : 'Not Synced'}
          </span>
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      accessor: (row) => row,
      cellClassName: 'text-sm',
      render: (_, row) => {
        const isSyncing = syncingPropertyId === row.id;
        return (
          <div className="flex items-center gap-2">
            {canView && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetail(row);
                }}
                className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all"
                title="View Details"
              >
                <Eye className="w-4.5 h-4.5" />
              </button>
            )}
            {canEdit && !row.isSynced && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSync(row.id);
                }}
                disabled={isSyncing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-all disabled:opacity-50"
                title="Sync this property"
              >
                {isSyncing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
                {isSyncing ? 'Syncing...' : 'Sync'}
              </button>
            )}
            {canEdit && row.isSynced && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetail(row);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-all"
              >
                Edit
              </button>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <CustomTable
      columns={columns}
      data={properties}
      emptyMessage="No properties found. Check your Beds24 integration."
      onRowClick={(row) => onViewDetail(row)}
    />
  );
};

export default PropertyList;
