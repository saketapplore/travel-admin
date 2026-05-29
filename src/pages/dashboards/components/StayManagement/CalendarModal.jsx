import React, { useState } from 'react';
import { X, Calendar, Save, RefreshCw, History, AlertCircle, TrendingUp, BedDouble } from 'lucide-react';

/**
 * CalendarModal - Manage date-specific pricing and availability on Beds24
 */
const CalendarModal = ({ isOpen, onClose, room, property, onUpdate }) => {
  const [formData, setFormData] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    price1: 0,
    numAvail: 1,
    minStay: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState(room?.calendarHistory || []);

  // Sync history when room changes or modal opens
  React.useEffect(() => {
    if (room?.calendarHistory) {
      setHistory(room.calendarHistory);
    }
  }, [room]);

  if (!isOpen || !room) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const updatedHistory = await onUpdate(room.beds24RoomId, [formData]);
      if (updatedHistory) {
        setHistory(updatedHistory);
      }
      // Keep modal open but show success/reset form
      setFormData({
        ...formData,
        from: formData.to, // Start next range from where we left off
        to: new Date(new Date(formData.to).getTime() + 86400000).toISOString().split('T')[0]
      });
    } catch (err) {
      setError(err.message || 'Failed to update calendar');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Manage Pricing & Availability</h3>
              <p className="text-xs text-gray-500 truncate max-w-md">
                {room.name} {room.name.includes(property?.name) ? '' : `— ${property?.name}`}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Section 1: Update Form */}
          <div className="p-6 border-b border-gray-100">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Set New Rates
            </h4>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 ml-1">From Date</label>
                  <input
                    type="date"
                    required
                    value={formData.from}
                    onChange={e => setFormData({ ...formData, from: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 ml-1">To Date</label>
                  <input
                    type="date"
                    required
                    value={formData.to}
                    onChange={e => setFormData({ ...formData, to: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 ml-1">Price ({property?.currency || '₹'})</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    value={formData.price1}
                    onChange={e => {
                      const val = e.target.value.replace(/[^0-9.]/g, '');
                      setFormData({ ...formData, price1: val });
                    }}
                    placeholder="0"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 ml-1">Available Qty</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    value={formData.numAvail}
                    onChange={e => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setFormData({ ...formData, numAvail: val });
                    }}
                    placeholder="1"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 ml-1">Min Stay</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    value={formData.minStay}
                    onChange={e => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setFormData({ ...formData, minStay: val });
                    }}
                    placeholder="1"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {loading ? 'Updating Beds24...' : 'Update Calendar'}
                </button>
              </div>
            </form>
          </div>

          {/* Section 2: History Table */}
          <div className="p-6 bg-gray-50/30">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <History className="w-4 h-4" /> Pricing Update History
            </h4>

            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase">From</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase">To</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase">Price</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase text-center">Qty</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase text-center">Min</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase text-right">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {history.length > 0 ? (
                    history.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3 text-xs font-medium text-gray-700 whitespace-nowrap">{formatDate(item.from)}</td>
                        <td className="px-4 py-3 text-xs font-medium text-gray-700 whitespace-nowrap">{formatDate(item.to)}</td>
                        <td className="px-4 py-3 text-xs font-bold text-blue-600 whitespace-nowrap">
                          {property?.currency || '₹'} {item.price1?.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-xs font-semibold text-gray-600 text-center">{item.numAvail}</td>
                        <td className="px-4 py-3 text-xs font-semibold text-gray-600 text-center">{item.minStay}</td>
                        <td className="px-4 py-3 text-[10px] text-gray-400 text-right whitespace-nowrap">
                          {formatDateTime(item.updatedAt)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-gray-400 italic text-xs">
                        No pricing history available for this room.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end">
          <p className="text-[10px] text-gray-400 italic mr-auto">
            Note: All updates are pushed directly to Beds24 API.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-bold text-gray-700 hover:bg-gray-200 rounded-xl transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;
