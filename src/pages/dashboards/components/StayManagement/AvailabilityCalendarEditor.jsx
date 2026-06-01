import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, History, AlertCircle, TrendingUp, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

const COLLAPSED_COUNT = 3;

/**
 * AvailabilityCalendarEditor
 * Inline (non-modal) editor for setting pricing & availability on custom property rooms.
 * Embedded directly in the PropertyDetail room section.
 */
const AvailabilityCalendarEditor = ({ room, property, onUpdate }) => {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    from: today,
    to: tomorrow,
    price1: room?.rackRate || 0,
    numAvail: 1,
    minStay: room?.minStay || 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [history, setHistory] = useState(room?.calendarHistory || []);
  const [historyExpanded, setHistoryExpanded] = useState(false);

  useEffect(() => {
    if (room?.calendarHistory) setHistory(room.calendarHistory);
  }, [room?.calendarHistory]);

  const set = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.to <= formData.from) {
      setError('"To" date must be after "From" date');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const payload = {
        from: formData.from,
        to: formData.to,
        price1: parseFloat(formData.price1) || 0,
        numAvail: parseInt(formData.numAvail) || 0,
        minStay: parseInt(formData.minStay) || 1,
      };
      const updatedHistory = await onUpdate(room.id, [payload]);
      if (updatedHistory) setHistory(updatedHistory);

      setSuccess(true);
      // Advance date range to continue where we left off
      setFormData(prev => ({
        ...prev,
        from: formData.to,
        to: new Date(new Date(formData.to + 'T00:00:00Z').getTime() + 86400000).toISOString().split('T')[0],
      }));
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update calendar');
    } finally {
      setLoading(false);
    }
  };

  const fmtDate = (d) => {
    if (!d) return '—';
    try {
      return new Date(d + 'T00:00:00Z').toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC'
      });
    } catch { return d; }
  };

  const currency = property?.currency || '₹';

  return (
    <div className="border-t border-dashed border-gray-200 pt-4 mt-2">

      {/* ── Form ─────────────────────────────────────────── */}
      <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <TrendingUp className="w-3.5 h-3.5" /> Set Pricing & Availability
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <div className="flex items-center gap-1.5 px-3 py-2 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Calendar updated successfully!
          </div>
        )}

        {/* Date range */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={LABEL}>From Date</label>
            <input type="date" required className={FIELD} value={formData.from} onChange={e => set('from', e.target.value)} />
          </div>
          <div>
            <label className={LABEL}>To Date</label>
            <input type="date" required className={FIELD} value={formData.to} onChange={e => set('to', e.target.value)} />
          </div>
        </div>

        {/* Price / qty / minStay */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className={LABEL}>Price ({currency})</label>
            <input
              type="number" required min="0" step="0.01" placeholder="0"
              className={FIELD} value={formData.price1}
              onChange={e => set('price1', e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL}>Avail. Qty</label>
            <input
              type="number" required min="0" placeholder="1"
              className={FIELD} value={formData.numAvail}
              onChange={e => set('numAvail', e.target.value)}
            />
          </div>
          <div>
            <label className={LABEL}>Min Stay</label>
            <input
              type="number" required min="1" placeholder="1"
              className={FIELD} value={formData.minStay}
              onChange={e => set('minStay', e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>

      {/* ── History Table (collapsible) ───────────────────── */}
      <div className="mt-4">
        <button
          type="button"
          onClick={() => setHistoryExpanded(v => !v)}
          className="w-full flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 hover:text-gray-600 transition-colors"
        >
          <History className="w-3.5 h-3.5" /> Calendar History
          {history.length > 0 && (
            <span className="font-normal normal-case tracking-normal">
              ({history.length} {history.length === 1 ? 'entry' : 'entries'})
            </span>
          )}
          {history.length > COLLAPSED_COUNT && (
            <span className="ml-auto inline-flex items-center gap-1 text-blue-600 font-semibold normal-case tracking-normal">
              {historyExpanded ? 'Show less' : `Show all ${history.length}`}
              {historyExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </span>
          )}
        </button>

        <div className="border border-gray-100 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className={TH}>From</th>
                <th className={TH}>To</th>
                <th className={TH}>Price</th>
                <th className={TH + ' text-center'}>Qty</th>
                <th className={TH + ' text-center'}>Min</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {history.length > 0 ? (
                (historyExpanded ? history : history.slice(0, COLLAPSED_COUNT)).map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className={TD}>{fmtDate(item.from)}</td>
                    <td className={TD}>{fmtDate(item.to)}</td>
                    <td className="px-3 py-2 font-bold text-blue-600 whitespace-nowrap">
                      {currency} {Number(item.price1 || 0).toLocaleString()}
                    </td>
                    <td className={TD + ' text-center'}>
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${item.numAvail > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                        {item.numAvail}
                      </span>
                    </td>
                    <td className={TD + ' text-center'}>{item.minStay}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-3 py-6 text-center text-gray-400 italic">
                    No entries yet. Use the form above to set pricing and open dates.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {!historyExpanded && history.length > COLLAPSED_COUNT && (
            <button
              type="button"
              onClick={() => setHistoryExpanded(true)}
              className="w-full px-3 py-2 bg-gray-50 border-t border-gray-100 text-center text-[10px] font-semibold text-blue-600 hover:bg-gray-100 transition-colors flex items-center justify-center gap-1"
            >
              <ChevronDown className="w-3.5 h-3.5" />
              {history.length - COLLAPSED_COUNT} more {history.length - COLLAPSED_COUNT === 1 ? 'entry' : 'entries'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const LABEL = 'block text-[10px] text-gray-400 font-bold uppercase mb-1';
const FIELD = 'w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all';
const TH = 'px-3 py-2 text-[10px] font-bold text-gray-400 uppercase';
const TD = 'px-3 py-2 font-medium text-gray-700 whitespace-nowrap';

export default AvailabilityCalendarEditor;
