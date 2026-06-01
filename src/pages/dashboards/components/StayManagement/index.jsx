import React, { useEffect, useState } from 'react';
import { useStayManagement } from './useStayManagement';
import PropertyList from './PropertyList';
import PropertyDetail from './PropertyDetail';
import CreatePropertyModal from './CreatePropertyModal';
import { useAuth } from '../../../../context/AuthContext';
import {
  Search,
  RefreshCw,
  Loader2,
  CheckCircle2,
  XCircle,
  X,
  Building2,
  Plus
} from 'lucide-react';

/**
 * StayManagement - Main component for the "Stay Management" sidebar tab
 * Handles discovery of Beds24 properties, sync, and image branding.
 */
const StayManagement = () => {
  const { user } = useAuth();
  const [createPropertyOpen, setCreatePropertyOpen] = useState(false);

  const {
    properties,
    totalCount,
    loading,
    error,
    selectedProperty,
    detailOpen,
    syncingPropertyId,
    bulkSyncing,
    syncResult,
    searchQuery,
    filterStatus,
    updatingImages,
    imageUpdateTarget,
    setSearchQuery,
    setFilterStatus,
    fetchProperties,
    syncProperty,
    syncAllProperties,
    updateImages,
    openDetail,
    closeDetail,
    clearSyncResult,
    updatePropertyDetail,
    updateRoomDetail,
    updateRoomCalendar,
    createCustomProperty,
    createCustomRoom,
    deleteCustomProperty,
  } = useStayManagement();

  const isSuperAdmin = user?.role === 'Super Admin' || user?.roleKey === 'super-admin';
  const canEdit = isSuperAdmin || user?.permissions?.['stays']?.['edit'] === true;

  // Auto-dismiss sync result after 5s
  useEffect(() => {
    if (syncResult) {
      const timer = setTimeout(clearSyncResult, 5000);
      return () => clearTimeout(timer);
    }
  }, [syncResult, clearSyncResult]);

  const customCount = properties.filter((p) => p.isCustomProperty).length;
  const syncedCount = properties.filter((p) => p.isSynced && !p.isCustomProperty).length;
  const unsyncedCount = properties.filter((p) => !p.isSynced && !p.isCustomProperty).length;

  return (
    <>
      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2.5">
              <div className="p-2 bg-orange-50 rounded-xl">
                <Building2 className="w-5 h-5 text-orange-500" />
              </div>
              Stay Management
            </h3>
            <p className="text-sm text-gray-500 mt-1 ml-11">
              Discover, sync, and brand your Beds24 properties
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Refresh */}
            <button
              onClick={fetchProperties}
              disabled={loading}
              className="p-2.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all disabled:opacity-50 border border-gray-200"
              title="Refresh properties"
            >
              <RefreshCw className={`w-4.5 h-4.5 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Create Custom Property */}
            {canEdit && (
              <button
                onClick={() => setCreatePropertyOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-orange-50 text-orange-600 text-sm font-semibold rounded-2xl transition-all duration-300 border border-orange-300 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Create Property
              </button>
            )}

            {/* Bulk Sync */}
            {canEdit && (
              <button
                onClick={syncAllProperties}
                disabled={bulkSyncing || loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-2xl transition-all duration-300 shadow-md active:scale-95 disabled:opacity-50"
              >
                {bulkSyncing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                {bulkSyncing ? 'Syncing All...' : 'Sync All Properties'}
              </button>
            )}
          </div>
        </div>

        {/* Stats pills */}
        <div className="flex items-center gap-3 mt-4 ml-11">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
            Total: {totalCount}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            TR Custom: {customCount}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Beds24: {syncedCount}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Pending: {unsyncedCount}
          </span>
        </div>
      </div>

      {/* Toast Notification */}
      {syncResult && (
        <div
          className={`mb-4 px-5 py-3.5 rounded-2xl flex items-center justify-between shadow-sm border animate-in slide-in-from-top-2 duration-300 ${
            syncResult.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {syncResult.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            <span className="text-sm font-medium">{syncResult.message}</span>
          </div>
          <button
            onClick={clearSyncResult}
            className="p-1 hover:bg-black/5 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-4 border border-gray-100">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, city, or address..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-1.5 bg-gray-100 rounded-xl p-1">
            {[
              { key: 'all', label: 'All' },
              { key: 'custom', label: 'TR Custom' },
              { key: 'synced', label: 'Beds24' },
              { key: 'unsynced', label: 'Pending' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilterStatus(key)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                  filterStatus === key
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm p-16 border border-gray-100 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-3" />
          <p className="text-sm text-gray-500 font-medium">Loading properties...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 border border-red-100 flex flex-col items-center justify-center">
          <XCircle className="w-8 h-8 text-red-400 mb-3" />
          <p className="text-sm text-red-600 font-medium mb-3">{error}</p>
          <button
            onClick={fetchProperties}
            className="text-sm text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      ) : (
        <PropertyList
          properties={properties}
          onViewDetail={openDetail}
          onSync={syncProperty}
          syncingPropertyId={syncingPropertyId}
        />
      )}

      {/* Detail Slide-in Panel */}
      <PropertyDetail
        property={selectedProperty}
        open={detailOpen}
        onClose={closeDetail}
        onSync={syncProperty}
        syncing={syncingPropertyId === selectedProperty?.id}
        onUpdateImages={updateImages}
        updatingImages={updatingImages}
        imageUpdateTarget={imageUpdateTarget}
        onUpdatePropertyDetail={updatePropertyDetail}
        onUpdateRoomDetail={updateRoomDetail}
        onUpdateRoomCalendar={updateRoomCalendar}
        onCreateRoom={createCustomRoom}
        onDeleteProperty={deleteCustomProperty}
      />

      {/* Create Custom Property Modal */}
      <CreatePropertyModal
        isOpen={createPropertyOpen}
        onClose={() => setCreatePropertyOpen(false)}
        onCreate={createCustomProperty}
      />
    </>
  );
};

export default StayManagement;
