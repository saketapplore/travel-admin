import React, { useState, useEffect, useCallback } from 'react';
import { Ban, ShieldOff, RefreshCw, Search, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { guestService } from '@/services/guestService';

const INP =
  'w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm';

const GuestManagement = () => {
  const { canAccess } = useAuth();
  const canEdit = canAccess('bookings', 'edit');

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [actingId, setActingId] = useState(null);

  // Unblock confirm dialog: { open, user }
  const [unblockConfirm, setUnblockConfirm] = useState({ open: false, user: null });
  // Block dialog (asks for a reason): { open, user, reason, error }
  const [blockDialog, setBlockDialog] = useState({ open: false, user: null, reason: '', error: '' });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await guestService.getUsers({ limit: 500, search });
      setUsers(res?.data?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetchUsers, 300);
    return () => clearTimeout(t);
  }, [fetchUsers]);

  const handleBlock = async () => {
    const { user, reason } = blockDialog;
    if (!user) return;
    if (!reason.trim()) {
      setBlockDialog((d) => ({ ...d, error: 'A reason is required.' }));
      return;
    }
    setActingId(user._id);
    try {
      await guestService.blockUser(user._id, reason.trim());
      setBlockDialog({ open: false, user: null, reason: '', error: '' });
      await fetchUsers();
    } catch (err) {
      setBlockDialog((d) => ({
        ...d,
        error: err?.response?.data?.message || err?.message || 'Failed to block user.'
      }));
    } finally {
      setActingId(null);
    }
  };

  const handleUnblock = async () => {
    const user = unblockConfirm.user;
    if (!user) return;
    setUnblockConfirm({ open: false, user: null });
    setActingId(user._id);
    try {
      await guestService.unblockUser(user._id);
      await fetchUsers();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to unblock user.');
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-50 rounded-2xl">
              <Users className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-800">Users</h3>
              <p className="text-sm text-gray-500">All app users. Blocked users cannot book or sign in.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, phone or email"
                className="pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-500"
              />
            </div>
            <button onClick={fetchUsers} disabled={loading} className="p-2.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl" title="Refresh">
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
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Mobile</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Status</th>
                {canEdit && <th className="px-4 py-3 text-right">Action</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-400">Loading…</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-400">No users found</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50/60">
                    <td className="px-4 py-3 font-semibold text-gray-700">{u.name || '—'}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-700">{u.phone || '—'}</td>
                    <td className="px-4 py-3 text-gray-700">{u.email || '—'}</td>
                    <td className="px-4 py-3">
                      {u.isBlocked ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Blocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                        </span>
                      )}
                    </td>
                    {canEdit && (
                      <td className="px-4 py-3 text-right">
                        {u.isBlocked ? (
                          <button
                            onClick={() => setUnblockConfirm({ open: true, user: u })}
                            disabled={actingId === u._id}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 disabled:opacity-50"
                          >
                            <ShieldOff className="w-3.5 h-3.5" /> Unblock
                          </button>
                        ) : (
                          <button
                            onClick={() => setBlockDialog({ open: true, user: u, reason: '', error: '' })}
                            disabled={actingId === u._id}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-200 disabled:opacity-50"
                          >
                            <Ban className="w-3.5 h-3.5" /> Block
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Unblock confirm */}
      <ConfirmDialog
        isOpen={unblockConfirm.open}
        title="Unblock User?"
        message={`${unblockConfirm.user?.name || 'This user'} will regain access to book and sign in.`}
        confirmText="Unblock"
        onConfirm={handleUnblock}
        onCancel={() => setUnblockConfirm({ open: false, user: null })}
      />

      {/* Block — reason dialog */}
      {blockDialog.open && (
        <div
          className="fixed inset-0 bg-black/50 z-[120] flex items-center justify-center p-4"
          onClick={() => setBlockDialog({ open: false, user: null, reason: '', error: '' })}
        >
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-red-50 rounded-2xl">
                <Ban className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-800">Block User</h3>
                <p className="text-sm text-gray-500">
                  {blockDialog.user?.name || blockDialog.user?.phone || blockDialog.user?.email}
                </p>
              </div>
            </div>

            {blockDialog.error && (
              <div className="mb-3 bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-sm">
                {blockDialog.error}
              </div>
            )}

            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Reason *</label>
            <textarea
              value={blockDialog.reason}
              onChange={(e) => setBlockDialog((d) => ({ ...d, reason: e.target.value, error: '' }))}
              rows={3}
              className={INP}
              placeholder="Reason for blocking this user"
              autoFocus
            />

            <div className="flex gap-3 mt-5">
              <button
                onClick={handleBlock}
                disabled={actingId === blockDialog.user?._id}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-2xl font-bold transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Ban className="w-4 h-4" /> {actingId === blockDialog.user?._id ? 'Blocking…' : 'Block User'}
              </button>
              <button
                onClick={() => setBlockDialog({ open: false, user: null, reason: '', error: '' })}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 py-2.5 rounded-2xl font-bold transition-all active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestManagement;
