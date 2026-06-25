import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LogIn, LogOut, RefreshCw, CalendarDays, Search, X, Inbox } from 'lucide-react';
import { reportingService } from '@/services/reportingService';

const todayStr = () => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
};

const formatDate = (d) => {
  if (!d) return '';
  const dt = new Date(d);
  return isNaN(dt.getTime())
    ? String(d)
    : dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const EMPTY_FILTERS = { clientName: '', propertyName: '', mobile: '', type: 'all', date: '' };

const rowMatches = (row, f) => {
  const inc = (val, q) => !q || String(val ?? '').toLowerCase().includes(q.trim().toLowerCase());
  return (
    inc(row.clientName, f.clientName) &&
    inc(row.propertyName, f.propertyName) &&
    inc(row.mobile, f.mobile) &&
    (f.type === 'all' || row.source === f.type) &&
    inc(formatDate(row.date), f.date)
  );
};

const Avatar = ({ name }) => (
  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
    {(name || '?').charAt(0).toUpperCase()}
  </div>
);

const TypePill = ({ source }) => (
  <span
    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
      source === 'hotel' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
    }`}
  >
    {source === 'hotel' ? 'Hotel' : 'Stay'}
  </span>
);

const MovementsTable = ({ title, icon: Icon, accent, rows, loading }) => {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const setFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const hasActiveFilters =
    filters.clientName || filters.propertyName || filters.mobile || filters.date || filters.type !== 'all';

  const filtered = rows.filter((r) => rowMatches(r, filters));

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Card header */}
      <div className={`px-6 py-4 flex items-center gap-3 border-b border-gray-100 ${accent.headerBg}`}>
        <div className={`p-2.5 rounded-2xl bg-white/70 ${accent.text}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-800 leading-tight">{title}</h3>
          <p className="text-xs text-gray-500">
            {rows.length} {rows.length === 1 ? 'booking' : 'bookings'}
          </p>
        </div>
        <span
          className={`ml-auto text-sm font-bold px-3 py-1 rounded-full bg-white ${accent.text} shadow-sm`}
        >
          {filtered.length}
        </span>
      </div>

      {/* Filter bar — column-level filters + search, kept out of the table header */}
      <div className="px-4 py-3 bg-gray-50/70 border-b border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
          <FilterInput label="Client name" value={filters.clientName} onChange={(v) => setFilter('clientName', v)} />
          <FilterInput label="Property" value={filters.propertyName} onChange={(v) => setFilter('propertyName', v)} />
          <FilterInput label="Mobile" value={filters.mobile} onChange={(v) => setFilter('mobile', v)} />
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 ml-0.5">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilter('type', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
            >
              <option value="all">All</option>
              <option value="stay">Stay</option>
              <option value="hotel">Hotel</option>
            </select>
          </div>
          <FilterInput label="Date" value={filters.date} onChange={(v) => setFilter('date', v)} />
        </div>
        {hasActiveFilters && (
          <button
            onClick={() => setFilters(EMPTY_FILTERS)}
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-orange-600"
          >
            <X className="w-3.5 h-3.5" /> Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
              <th className="px-6 py-3">Client</th>
              <th className="px-4 py-3">Property</th>
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">
                  Loading…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Inbox className="w-8 h-8" />
                    <p className="text-sm font-medium">
                      {rows.length === 0 ? 'None scheduled for this date' : 'No rows match your filters'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr
                  key={`${row.source}-${row.id}`}
                  className="border-b border-gray-50 last:border-0 hover:bg-orange-50/30 transition-colors"
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={row.clientName} />
                      <span className="font-semibold text-gray-800">{row.clientName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-gray-600">{row.propertyName}</td>
                  <td className="px-4 py-3.5">
                    {row.mobile ? (
                      <a href={`tel:${row.mobile}`} className="text-gray-600 font-mono text-xs hover:text-orange-600">
                        {row.mobile}
                      </a>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <TypePill source={row.source} />
                  </td>
                  <td className="px-4 py-3.5 text-gray-500">{formatDate(row.date)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const FilterInput = ({ label, value, onChange }) => (
  <div>
    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 ml-0.5">
      {label}
    </label>
    <div className="relative">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search"
        className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
      />
    </div>
  </div>
);

const SummaryCard = ({ icon: Icon, label, total, stays, hotels, accent }) => (
  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
    <div className={`p-3.5 rounded-2xl ${accent.bg} ${accent.text}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-3xl font-black text-gray-800 leading-tight">{total}</p>
      <p className="text-xs text-gray-400 mt-0.5">
        {stays} {stays === 1 ? 'stay' : 'stays'} · {hotels} {hotels === 1 ? 'hotel' : 'hotels'}
      </p>
    </div>
  </div>
);

const countBy = (rows, source) => rows.filter((r) => r.source === source).length;

const CheckInsCheckouts = () => {
  const [date, setDate] = useState(todayStr());
  const [data, setData] = useState({ checkIns: [], checkOuts: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const mounted = useRef(true);

  const fetchMovements = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await reportingService.getMovements({ date });
      const d = res?.data?.data || {};
      if (!mounted.current) return;
      setData({ checkIns: d.checkIns || [], checkOuts: d.checkOuts || [] });
    } catch (err) {
      if (mounted.current) setError(err?.message || 'Failed to load check-ins / check-outs.');
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    mounted.current = true;
    fetchMovements();
    return () => {
      mounted.current = false;
    };
  }, [fetchMovements]);

  const isToday = date === todayStr();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Check-ins &amp; Check-outs</h2>
          <p className="text-sm text-gray-500">
            {isToday ? 'Scheduled for today' : `Scheduled for ${formatDate(date)}`} · stays &amp; hotels
          </p>
        </div>
        <div className="flex items-end gap-2">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
            />
          </div>
          {!isToday && (
            <button
              onClick={() => setDate(todayStr())}
              className="px-3 py-2.5 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 text-gray-500 rounded-xl font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <CalendarDays className="w-4 h-4" /> Today
            </button>
          )}
          <button
            onClick={fetchMovements}
            disabled={loading}
            className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-sm transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-2xl text-sm font-semibold">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SummaryCard
          icon={LogIn}
          label="Check-ins (arrivals)"
          total={data.checkIns.length}
          stays={countBy(data.checkIns, 'stay')}
          hotels={countBy(data.checkIns, 'hotel')}
          accent={{ bg: 'bg-green-50', text: 'text-green-600' }}
        />
        <SummaryCard
          icon={LogOut}
          label="Check-outs (departures)"
          total={data.checkOuts.length}
          stays={countBy(data.checkOuts, 'stay')}
          hotels={countBy(data.checkOuts, 'hotel')}
          accent={{ bg: 'bg-amber-50', text: 'text-amber-600' }}
        />
      </div>

      {/* Tables */}
      <MovementsTable
        title="Check-ins"
        icon={LogIn}
        accent={{ headerBg: 'bg-green-50/50', text: 'text-green-600' }}
        rows={data.checkIns}
        loading={loading}
      />
      <MovementsTable
        title="Check-outs"
        icon={LogOut}
        accent={{ headerBg: 'bg-amber-50/50', text: 'text-amber-600' }}
        rows={data.checkOuts}
        loading={loading}
      />
    </div>
  );
};

export default CheckInsCheckouts;
