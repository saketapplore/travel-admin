import React, { useState, useEffect, useCallback } from 'react';
import { Ban, ShieldOff, RefreshCw, Search, UserX } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { guestService } from '@/services/guestService';

const INP =
  'w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm';

const GuestManagement = () => {
  const { canAccess } = useAuth();
  const canEdit = canAccess('bookings', 'edit');

  const [blocked, setBlocked] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({ phone: '', email: '', reason: '' });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [unblockConfirm, setUnblockConfirm] = useState({ open: false, id: null });

  const fetchBlocked = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await guestService.getBlocked({ limit: 200, search });
      setBlocked(res?.data?.data || []);
    } catch (err) {
      setError(err?.message || 'Failed to load blocked guests.');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetchBlocked, 300);
    return () => clearTimeout(t);
  }, [fetchBlocked]);

  const handleBlock = async () => {
    setFormError('');
    if (!form.phone.trim() && !form.email.trim()) {
      return setFormError('Enter a phone number or an email.');
    }
    if (!form.reason.trim()) return setFormError('A reason is required.');

    setSaving(true);
    try {
      await guestService.block({
        phone: form.phone.trim() || undefined,
        email: form.email.trim() || undefined,
        reason: form.reason.trim()
      });
      setForm({ phone: '', email: '', reason: '' });
      await fetchBlocked();
    } catch (err) {
      setFormError(err?.response?.data?.message || err?.message || 'Failed to block guest.');
    } finally {
      setSaving(false);
    }
  };

  const handleUnblock = async (id) => {
    try {
      await guestService.unblock(id);
      await fetchBlocked();
    } catch (err) {
      setError(err?.message || 'Failed to unblock guest.');
    }
  };

  const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '');

  return (
    <div className="space-y-6">
      {/* Block form */}
      {canEdit && (
        <div className="bg-white rounded-3xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 bg-red-50 rounded-2xl">
              <UserX className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-800">Block a Guest</h3>
              <p className="text-sm text-gray-500">Blocked phone OR email cannot create new bookings.</p>
            </div>
          </div>

          {formError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-sm">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Mobile Number</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={INP} placeholder="9321352193" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Email</label>
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={INP} placeholder="guest@example.com" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Reason *</label>
              <input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className={INP} placeholder="Reason for blocking" />
            </div>
          </div>
          <button
            onClick={handleBlock}
            disabled={saving}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-2xl font-bold transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
          >
            <Ban className="w-5 h-5" /> {saving ? 'Blocking…' : 'Block Guest'}
          </button>
        </div>
      )}

      {/* Blocked list */}
      <div className="bg-white rounded-3xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
          <h3 className="text-lg font-black text-gray-800">Blocked Guests</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search phone or email"
                className="pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-500"
              />
            </div>
            <button onClick={fetchBlocked} disabled={loading} className="p-2.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl" title="Refresh">
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-sm">{error}</div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="px-4 py-3">Mobile</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Blocked On</th>
                {canEdit && <th className="px-4 py-3">Action</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-400">Loading…</td></tr>
              ) : blocked.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-400">No blocked guests</td></tr>
              ) : (
                blocked.map((b) => (
                  <tr key={b._id} className="border-b border-gray-50 hover:bg-gray-50/60">
                    <td className="px-4 py-3 font-mono text-xs text-gray-700">{b.phone || '—'}</td>
                    <td className="px-4 py-3 text-gray-700">{b.email || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{b.reason}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{fmtDate(b.createdAt)}</td>
                    {canEdit && (
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setUnblockConfirm({ open: true, id: b._id })}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200"
                        >
                          <ShieldOff className="w-3.5 h-3.5" /> Unblock
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={unblockConfirm.open}
        title="Unblock Guest?"
        message="This contact will be able to make bookings again."
        confirmText="Unblock"
        onConfirm={async () => {
          await handleUnblock(unblockConfirm.id);
          setUnblockConfirm({ open: false, id: null });
        }}
        onCancel={() => setUnblockConfirm({ open: false, id: null })}
      />
    </div>
  );
};

export default GuestManagement;
