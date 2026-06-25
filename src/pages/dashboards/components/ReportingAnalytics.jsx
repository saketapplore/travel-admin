import React, { useState } from 'react';
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  XCircle,
  CircleDollarSign,
  RefreshCw,
  BedDouble,
  Hotel,
  Plane,
  Layers,
  ArrowLeftRight,
  Building2,
  DoorOpen,
  Briefcase
} from 'lucide-react';
import { useReporting } from './useReporting';
import CheckInsCheckouts from './CheckInsCheckouts';
import OccupancySummary from './OccupancySummary';
import VacantProperties from './VacantProperties';
import CorporateBookings from './CorporateBookings';

const inr = (n) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(n || 0));

const num = (n) => new Intl.NumberFormat('en-IN').format(Number(n || 0));

const VIEWS = [
  { id: 'consolidated', label: 'Consolidated', icon: Layers },
  { id: 'stays', label: 'Stays', icon: BedDouble },
  { id: 'hotels', label: 'Hotels', icon: Hotel },
  { id: 'flights', label: 'Flights', icon: Plane }
];

const EMPTY = { total: 0, confirmed: 0, cancelled: 0, bookingValue: 0 };

const MetricCard = ({ icon: Icon, label, value, tone }) => {
  const tones = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    orange: 'bg-orange-50 text-orange-600'
  };
  return (
    <div className="bg-white rounded-3xl shadow-md p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-gray-500 text-sm font-medium">{label}</p>
          <p className="text-3xl font-black text-gray-800 mt-1 truncate">{value}</p>
        </div>
        <div className={`p-3 rounded-2xl flex-shrink-0 ${tones[tone] || tones.blue}`}>
          <Icon className="w-7 h-7" />
        </div>
      </div>
    </div>
  );
};

const SECTIONS = [
  { id: 'overview', label: 'Bookings Overview', icon: BarChart3 },
  { id: 'movements', label: 'Check-ins & Check-outs', icon: ArrowLeftRight },
  { id: 'occupancy', label: 'Occupancy', icon: Building2 },
  { id: 'vacant', label: 'Vacant Properties', icon: DoorOpen },
  { id: 'corporate', label: 'Corporate', icon: Briefcase }
];

const ReportingAnalytics = () => {
  const [section, setSection] = useState('overview');
  const {
    from,
    setFrom,
    to,
    setTo,
    view,
    setView,
    setPreset,
    summary,
    loading,
    error,
    lastUpdated,
    refresh
  } = useReporting();

  const modules = summary?.modules || {};
  const selected =
    view === 'consolidated' ? summary?.consolidated || EMPTY : modules[view] || EMPTY;

  const breakdown = [
    { id: 'total', label: 'Total Bookings', value: summary?.consolidated?.total ?? 0, icon: Layers, tone: 'orange' },
    { id: 'stays', label: 'Stays', value: modules.stays?.total ?? 0, icon: BedDouble, tone: 'blue' },
    { id: 'hotels', label: 'Hotels', value: modules.hotels?.total ?? 0, icon: Hotel, tone: 'blue' },
    { id: 'flights', label: 'Flights', value: modules.flights?.total ?? 0, icon: Plane, tone: 'blue' }
  ];

  return (
    <div className="space-y-6">
      {/* Section tabs (Point 4 overview ↔ Point 5 movements) */}
      <div className="bg-white rounded-3xl shadow-md p-2 border border-gray-100 inline-flex flex-wrap gap-1">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          const active = section === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 ${
                active
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-gray-500 hover:bg-orange-50 hover:text-orange-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              {s.label}
            </button>
          );
        })}
      </div>

      {section === 'movements' ? (
        <CheckInsCheckouts />
      ) : section === 'occupancy' ? (
        <OccupancySummary />
      ) : section === 'vacant' ? (
        <VacantProperties />
      ) : section === 'corporate' ? (
        <CorporateBookings />
      ) : (
        <>
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-md p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-50 rounded-2xl">
              <BarChart3 className="w-7 h-7 text-orange-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-800 tracking-tight">
                Reporting &amp; Analytics
              </h2>
              <p className="text-sm text-gray-500">
                Consolidated bookings across Stays, Hotels &amp; Flights
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
                From
              </label>
              <input
                type="date"
                value={from}
                max={to}
                onChange={(e) => setFrom(e.target.value)}
                className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
                To
              </label>
              <input
                type="date"
                value={to}
                min={from}
                onChange={(e) => setTo(e.target.value)}
                className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none"
              />
            </div>
            <button
              onClick={refresh}
              disabled={loading}
              className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
              title="Refresh now"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Presets + status line */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {[
              { id: 'thisMonth', label: 'This Month' },
              { id: 'lastMonth', label: 'Last Month' },
              { id: 'last7', label: 'Last 7 Days' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPreset(p.id)}
                className="px-3 py-1.5 text-xs font-bold rounded-full bg-gray-50 text-gray-500 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5" />
            {lastUpdated
              ? `Updated ${lastUpdated.toLocaleTimeString()} · auto-refreshes every 60s`
              : 'Loading…'}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-2xl text-sm font-semibold">
          {error}
        </div>
      )}

      {/* Total bookings breakdown */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {breakdown.map((b) => (
          <MetricCard
            key={b.id}
            icon={b.icon}
            label={b.label}
            value={loading && !summary ? '…' : num(b.value)}
            tone={b.tone}
          />
        ))}
      </div>

      {/* View switcher */}
      <div className="bg-white rounded-3xl shadow-md p-2 border border-gray-100 inline-flex flex-wrap gap-1">
        {VIEWS.map((v) => {
          const Icon = v.icon;
          const active = view === v.id;
          return (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 ${
                active
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-gray-500 hover:bg-orange-50 hover:text-orange-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              {v.label}
            </button>
          );
        })}
      </div>

      {/* Metrics for the selected view */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={Layers}
          label="Total Bookings"
          value={loading && !summary ? '…' : num(selected.total)}
          tone="blue"
        />
        <MetricCard
          icon={CheckCircle2}
          label="Confirmed"
          value={loading && !summary ? '…' : num(selected.confirmed)}
          tone="green"
        />
        <MetricCard
          icon={XCircle}
          label="Cancelled"
          value={loading && !summary ? '…' : num(selected.cancelled)}
          tone="red"
        />
        <MetricCard
          icon={CircleDollarSign}
          label="Booking Value"
          value={loading && !summary ? '…' : inr(selected.bookingValue)}
          tone="orange"
        />
      </div>

      <p className="text-xs text-gray-400 px-1">
        Booking Value reflects confirmed bookings only.
        {view !== 'consolidated' && ` Showing ${view} only.`}
      </p>
        </>
      )}
    </div>
  );
};

export default ReportingAnalytics;
