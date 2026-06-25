import React, { useState, useEffect, useCallback } from 'react';
import { Briefcase, FileText, BarChart2, Trophy, RefreshCw } from 'lucide-react';
import { corporateService } from '@/services/corporateService';

const inr = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(n || 0));
const num = (n) => new Intl.NumberFormat('en-IN').format(Number(n || 0));
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '');

const INP = 'px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-500';

const SUB_TABS = [
  { id: 'report', label: 'Report', icon: FileText },
  { id: 'summary', label: 'Summary', icon: BarChart2 },
  { id: 'ranking', label: 'Ranking', icon: Trophy }
];

const StatusBadge = ({ status }) => {
  const s = String(status || '').toLowerCase();
  const tone = s.includes('confirm')
    ? 'bg-green-100 text-green-700'
    : s.includes('cancel')
      ? 'bg-red-100 text-red-700'
      : 'bg-gray-100 text-gray-500';
  return <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${tone}`}>{status}</span>;
};

const CorporateBookings = () => {
  const [tab, setTab] = useState('report');

  // shared
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // report
  const [filters, setFilters] = useState({ gstNumber: '', companyName: '', bookingType: '', status: '', from: '', to: '' });
  const [bookings, setBookings] = useState([]);

  // summary / ranking
  const [summary, setSummary] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [sortBy, setSortBy] = useState('value');

  const loadReport = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await corporateService.getBookings(filters);
      setBookings(res?.data?.data || []);
    } catch (e) { setError(e?.message || 'Failed to load report.'); }
    finally { setLoading(false); }
  }, [filters]);

  const loadSummary = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await corporateService.getSummary({ from: filters.from, to: filters.to });
      setSummary(res?.data?.data || []);
    } catch (e) { setError(e?.message || 'Failed to load summary.'); }
    finally { setLoading(false); }
  }, [filters.from, filters.to]);

  const loadRanking = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await corporateService.getRanking({ sort: sortBy, from: filters.from, to: filters.to, limit: 10 });
      setRanking(res?.data?.data || []);
    } catch (e) { setError(e?.message || 'Failed to load ranking.'); }
    finally { setLoading(false); }
  }, [sortBy, filters.from, filters.to]);

  useEffect(() => {
    if (tab === 'report') loadReport();
    else if (tab === 'summary') loadSummary();
    else loadRanking();
  }, [tab, loadReport, loadSummary, loadRanking]);

  const setF = (k, v) => setFilters((p) => ({ ...p, [k]: v }));

  return (
    <div className="space-y-5">
      {/* Header + sub-tabs */}
      <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-orange-50 rounded-2xl"><Briefcase className="w-6 h-6 text-orange-500" /></div>
          <div>
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">Corporate Bookings</h2>
            <p className="text-sm text-gray-500">GST-linked business bookings, summary &amp; top clients</p>
          </div>
        </div>
        <div className="inline-flex bg-gray-50 rounded-2xl p-1 gap-1">
          {SUB_TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${active ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-500 hover:text-orange-600'}`}>
                <Icon className="w-4 h-4" /> {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-2xl text-sm">{error}</div>}

      {/* REPORT */}
      {tab === 'report' && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 bg-gray-50/70 border-b border-gray-100 grid grid-cols-2 md:grid-cols-6 gap-2">
            <input className={INP} placeholder="GST Number" value={filters.gstNumber} onChange={(e) => setF('gstNumber', e.target.value)} />
            <input className={INP} placeholder="Company" value={filters.companyName} onChange={(e) => setF('companyName', e.target.value)} />
            <select className={INP} value={filters.bookingType} onChange={(e) => setF('bookingType', e.target.value)}>
              <option value="">All types</option>
              <option value="FLIGHT">Flight</option>
              <option value="HOTEL">Hotel</option>
              <option value="STAY">Stay</option>
            </select>
            <select className={INP} value={filters.status} onChange={(e) => setF('status', e.target.value)}>
              <option value="">All status</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <input type="date" className={INP} value={filters.from} onChange={(e) => setF('from', e.target.value)} />
            <input type="date" className={INP} value={filters.to} onChange={(e) => setF('to', e.target.value)} />
          </div>
          <div className="px-4 py-2 flex justify-between items-center">
            <span className="text-xs font-bold text-gray-400">{bookings.length} bookings</span>
            <button onClick={loadReport} disabled={loading} className="p-2 text-gray-400 hover:text-orange-600 rounded-lg"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="px-4 py-3">Ref</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">GST</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Revenue</th><th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400">Loading…</td></tr>
                  : bookings.length === 0 ? <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400">No corporate bookings</td></tr>
                    : bookings.map((b) => (
                      <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                        <td className="px-4 py-3 font-mono text-xs">{b.bookingRef}</td>
                        <td className="px-4 py-3">{b.bookingType}</td>
                        <td className="px-4 py-3 font-semibold text-gray-700">{b.companyName || '—'}</td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-500">{b.gstNumber}</td>
                        <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                        <td className="px-4 py-3">{inr(b.amount)}</td>
                        <td className="px-4 py-3 text-orange-600 font-semibold">{inr(b.revenue)}</td>
                        <td className="px-4 py-3 text-gray-400 text-xs">{fmtDate(b.createdAt)}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUMMARY */}
      {tab === 'summary' && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 bg-gray-50/70 border-b border-gray-100 flex items-center gap-2">
            <input type="date" className={INP} value={filters.from} onChange={(e) => setF('from', e.target.value)} />
            <input type="date" className={INP} value={filters.to} onChange={(e) => setF('to', e.target.value)} />
            <span className="ml-auto text-xs font-bold text-gray-400">{summary.length} clients</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="px-4 py-3">Company</th><th className="px-4 py-3">GST Number</th>
                  <th className="px-4 py-3">Bookings</th><th className="px-4 py-3">Booking Value</th><th className="px-4 py-3">Platform Revenue</th>
                </tr>
              </thead>
              <tbody>
                {loading ? <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-400">Loading…</td></tr>
                  : summary.length === 0 ? <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-400">No corporate clients</td></tr>
                    : summary.map((c) => (
                      <tr key={c.gstNumber} className="border-b border-gray-50 hover:bg-gray-50/60">
                        <td className="px-4 py-3 font-semibold text-gray-700">{c.companyName || '—'}</td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-500">{c.gstNumber}</td>
                        <td className="px-4 py-3">{num(c.bookingCount)}</td>
                        <td className="px-4 py-3">{inr(c.bookingValue)}</td>
                        <td className="px-4 py-3 text-orange-600 font-semibold">{inr(c.revenue)}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RANKING */}
      {tab === 'ranking' && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 bg-gray-50/70 border-b border-gray-100 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black text-gray-400 uppercase tracking-wider mr-1">Rank by</span>
            {[{ id: 'bookings', label: 'Bookings' }, { id: 'value', label: 'Booking Value' }, { id: 'revenue', label: 'Revenue' }].map((o) => (
              <button key={o.id} onClick={() => setSortBy(o.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${sortBy === o.id ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-500 border-gray-200 hover:border-orange-300'}`}>
                {o.label}
              </button>
            ))}
            <input type="date" className={`${INP} ml-auto`} value={filters.from} onChange={(e) => setF('from', e.target.value)} />
            <input type="date" className={INP} value={filters.to} onChange={(e) => setF('to', e.target.value)} />
          </div>
          <div className="divide-y divide-gray-50">
            {loading ? <div className="px-4 py-10 text-center text-gray-400 text-sm">Loading…</div>
              : ranking.length === 0 ? <div className="px-4 py-10 text-center text-gray-400 text-sm">No corporate clients</div>
                : ranking.map((c) => (
                  <div key={c.gstNumber} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/60">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm ${c.rank <= 3 ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'}`}>{c.rank}</div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-gray-800 truncate">{c.companyName || c.gstNumber}</p>
                      <p className="text-xs text-gray-400 font-mono">{c.gstNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-gray-800">
                        {sortBy === 'bookings' ? `${num(c.bookingCount)} bookings` : sortBy === 'revenue' ? inr(c.revenue) : inr(c.bookingValue)}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {num(c.bookingCount)} bookings · {inr(c.bookingValue)} · {inr(c.revenue)} rev
                      </p>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CorporateBookings;
