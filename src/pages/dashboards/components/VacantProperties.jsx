import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Building2, RefreshCw, CalendarDays, Search, DoorOpen, DoorClosed, MapPin } from 'lucide-react';
import { reportingService } from '@/services/reportingService';

const todayStr = () => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
};

const formatDate = (s) => {
  if (!s) return '';
  const d = new Date(s);
  return isNaN(d.getTime())
    ? s
    : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const num = (n) => new Intl.NumberFormat('en-IN').format(Number(n || 0));

const StatCard = ({ icon: Icon, label, value, accent }) => (
  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
    <div className={`p-3 rounded-2xl ${accent.bg} ${accent.text}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-2xl font-black text-gray-800 leading-tight">{value}</p>
    </div>
  </div>
);

const FILTERS = [
  { id: 'vacant', label: 'Vacant' },
  { id: 'occupied', label: 'Occupied' },
  { id: 'all', label: 'All' }
];

const PropertyCard = ({ p }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
    <div className="h-32 bg-gray-100 relative">
      {p.image ? (
        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-300">
          <Building2 className="w-8 h-8" />
        </div>
      )}
      <span
        className={`absolute top-2 right-2 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm ${
          p.occupied ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
        }`}
      >
        {p.occupied ? 'Occupied' : 'Vacant'}
      </span>
    </div>
    <div className="p-4">
      <p className="font-bold text-gray-800 truncate">{p.name}</p>
      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 truncate">
        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
        {[p.city, p.country].filter(Boolean).join(', ') || p.address || '—'}
      </p>
      {p.type && (
        <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-gray-100 text-gray-500">
          {p.type}
        </span>
      )}
    </div>
  </div>
);

const VacantProperties = () => {
  const [date, setDate] = useState(todayStr());
  const [data, setData] = useState({ totalProperties: 0, vacantCount: 0, occupiedCount: 0, properties: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('vacant');
  const [search, setSearch] = useState('');
  const mounted = useRef(true);

  const fetchVacant = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await reportingService.getVacantProperties({ date });
      const d = res?.data?.data || {};
      if (!mounted.current) return;
      setData({
        totalProperties: d.totalProperties || 0,
        vacantCount: d.vacantCount || 0,
        occupiedCount: d.occupiedCount || 0,
        properties: d.properties || []
      });
    } catch (err) {
      if (mounted.current) setError(err?.message || 'Failed to load properties.');
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    mounted.current = true;
    fetchVacant();
    return () => {
      mounted.current = false;
    };
  }, [fetchVacant]);

  const isToday = date === todayStr();

  const visible = data.properties
    .filter((p) => (statusFilter === 'all' ? true : statusFilter === 'occupied' ? p.occupied : !p.occupied))
    .filter((p) => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return (
        (p.name || '').toLowerCase().includes(q) ||
        (p.city || '').toLowerCase().includes(q) ||
        (p.address || '').toLowerCase().includes(q)
      );
    });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Vacant Properties</h2>
          <p className="text-sm text-gray-500">
            Properties with no active ongoing stay on{' '}
            {isToday ? 'today' : formatDate(date)}
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
            onClick={fetchVacant}
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Building2} label="Total Properties" value={num(data.totalProperties)} accent={{ bg: 'bg-indigo-50', text: 'text-indigo-600' }} />
        <StatCard icon={DoorOpen} label="Vacant" value={num(data.vacantCount)} accent={{ bg: 'bg-emerald-50', text: 'text-emerald-600' }} />
        <StatCard icon={DoorClosed} label="Occupied" value={num(data.occupiedCount)} accent={{ bg: 'bg-rose-50', text: 'text-rose-600' }} />
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="inline-flex bg-white rounded-2xl shadow-sm border border-gray-100 p-1 gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                statusFilter === f.id ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-500 hover:bg-orange-50 hover:text-orange-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, city or address"
            className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
          />
        </div>
        <span className="text-xs font-bold text-gray-400 sm:ml-auto">{visible.length} shown</span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center text-gray-400 text-sm">
          Loading…
        </div>
      ) : visible.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 flex flex-col items-center gap-2 text-gray-400">
          <Building2 className="w-8 h-8" />
          <p className="text-sm font-medium">No properties to show</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {visible.map((p) => (
            <PropertyCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default VacantProperties;
