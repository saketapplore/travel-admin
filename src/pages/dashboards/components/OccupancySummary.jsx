import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Building2, Users, RefreshCw, Info, BedDouble, Hotel } from 'lucide-react';
import { reportingService } from '@/services/reportingService';

const AUTO_REFRESH_MS = 60000;
const EMPTY = {
  occupiedProperties: 0,
  inHouseGuests: 0,
  stays: { occupiedProperties: 0, inHouseGuests: 0 },
  hotels: { occupiedProperties: 0, inHouseGuests: 0 }
};

const num = (n) => new Intl.NumberFormat('en-IN').format(Number(n || 0));

const HeroCard = ({ icon: Icon, label, value, hint, accent, loading }) => (
  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-5xl font-black text-gray-800 mt-2 leading-none">
          {loading ? '…' : num(value)}
        </p>
      </div>
      <div className={`p-3.5 rounded-2xl ${accent.bg} ${accent.text}`}>
        <Icon className="w-7 h-7" />
      </div>
    </div>
    <p className="text-xs text-gray-400 mt-4">{hint}</p>
  </div>
);

const SplitRow = ({ data }) => (
  <div className="grid grid-cols-2 gap-4">
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
      <div className="p-3 rounded-2xl bg-orange-50 text-orange-600">
        <BedDouble className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-bold text-gray-800">Stays</p>
        <p className="text-xs text-gray-500 mt-1">
          {num(data.stays.occupiedProperties)} occupied · {num(data.stays.inHouseGuests)} guests
        </p>
      </div>
    </div>
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
      <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
        <Hotel className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-bold text-gray-800">Hotels</p>
        <p className="text-xs text-gray-500 mt-1">
          {num(data.hotels.occupiedProperties)} occupied · {num(data.hotels.inHouseGuests)} guests
        </p>
      </div>
    </div>
  </div>
);

const OccupancySummary = () => {
  const [data, setData] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [asOf, setAsOf] = useState(null);
  const mounted = useRef(true);

  const fetchOccupancy = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setError('');
    try {
      const res = await reportingService.getOccupancy();
      const d = res?.data?.data;
      if (!mounted.current) return;
      if (d) setData({ ...EMPTY, ...d, stays: d.stays || EMPTY.stays, hotels: d.hotels || EMPTY.hotels });
      setAsOf(new Date());
    } catch (err) {
      if (mounted.current) setError(err?.message || 'Failed to load occupancy.');
    } finally {
      if (mounted.current && !silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    fetchOccupancy();
    const id = setInterval(() => fetchOccupancy({ silent: true }), AUTO_REFRESH_MS);
    return () => {
      mounted.current = false;
      clearInterval(id);
    };
  }, [fetchOccupancy]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Occupancy</h2>
          <p className="text-sm text-gray-500">
            {asOf ? `As of ${asOf.toLocaleTimeString()} · auto-refreshes every 60s` : 'Loading…'}
          </p>
        </div>
        <button
          onClick={() => fetchOccupancy()}
          disabled={loading}
          className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-sm transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-2xl text-sm font-semibold">
          {error}
        </div>
      )}

      {/* Hero metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <HeroCard
          icon={Building2}
          label="Occupied Properties"
          value={data.occupiedProperties}
          hint="Unique properties with a guest currently staying"
          accent={{ bg: 'bg-indigo-50', text: 'text-indigo-600' }}
          loading={loading && !asOf}
        />
        <HeroCard
          icon={Users}
          label="In-House Guests"
          value={data.inHouseGuests}
          hint="Guests who checked in before today and aren't leaving today"
          accent={{ bg: 'bg-emerald-50', text: 'text-emerald-600' }}
          loading={loading && !asOf}
        />
      </div>

      {/* Stay / hotel split */}
      <SplitRow data={data} />

      {/* Definitions */}
      <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 flex gap-3">
        <Info className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-gray-500 space-y-1">
          <p>
            <span className="font-semibold text-gray-600">Occupied Properties</span> — unique
            properties where check-in is before now and check-out is after now (includes today's
            arrivals).
          </p>
          <p>
            <span className="font-semibold text-gray-600">In-House Guests</span> — guests who
            checked in yesterday or earlier and are not checking out today (today's check-ins and
            check-outs are excluded).
          </p>
        </div>
      </div>
    </div>
  );
};

export default OccupancySummary;
