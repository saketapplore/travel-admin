import React, { useState, useEffect, useCallback } from 'react';
import { Ticket, Plus, RefreshCw } from 'lucide-react';
import { EditIcon, DeleteIcon } from '@/components/icons';
import { useAuth } from '@/context/AuthContext';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { discountService } from '@/services/discountService';

const BOOKING_TYPES = ['STAY', 'HOTEL', 'FLIGHT'];

const INP =
  'w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm';

const emptyForm = () => ({
  code: '',
  description: '',
  discountType: 'percentage',
  value: '',
  maxDiscount: '',
  minBookingAmount: '',
  validFrom: '',
  validTo: '',
  usageLimit: '',
  oncePerUser: true,
  applicableBookingTypes: [],
  isActive: true
});

const dateInput = (v) => (v ? String(v).slice(0, 10) : '');

const Field = ({ label, children }) => (
  <div>
    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
      {label}
    </label>
    {children}
  </div>
);

const DiscountsPackages = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'Super Admin' || user?.roleKey === 'super-admin';
  const hasPermission = (m, a) => isSuperAdmin || user?.permissions?.[m]?.[a] === true;
  const canCreate = hasPermission('discounts', 'create');
  const canEdit = hasPermission('discounts', 'edit');
  const canDelete = hasPermission('discounts', 'delete');

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await discountService.getAll({ limit: 100 });
      const data = res?.data?.data || res?.data || [];
      setCoupons(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || 'Failed to load coupons.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({
      code: c.code || '',
      description: c.description || '',
      discountType: c.discountType || 'percentage',
      value: c.value ?? '',
      maxDiscount: c.maxDiscount ?? '',
      minBookingAmount: c.minBookingAmount ?? '',
      validFrom: dateInput(c.validFrom),
      validTo: dateInput(c.validTo),
      usageLimit: c.usageLimit ?? '',
      oncePerUser: c.oncePerUser !== false,
      applicableBookingTypes: c.applicableBookingTypes || [],
      isActive: c.isActive !== false
    });
    setFormError('');
    setShowModal(true);
  };

  const toggleType = (t) => {
    setForm((prev) => ({
      ...prev,
      applicableBookingTypes: prev.applicableBookingTypes.includes(t)
        ? prev.applicableBookingTypes.filter((x) => x !== t)
        : [...prev.applicableBookingTypes, t]
    }));
  };

  const handleSave = async () => {
    setFormError('');
    if (!form.code.trim()) return setFormError('Coupon code is required.');
    if (form.value === '' || Number(form.value) <= 0)
      return setFormError('Enter a valid discount value.');

    const payload = {
      code: form.code.trim().toUpperCase(),
      description: form.description.trim(),
      discountType: form.discountType,
      value: Number(form.value),
      maxDiscount: form.maxDiscount === '' ? undefined : Number(form.maxDiscount),
      minBookingAmount: form.minBookingAmount === '' ? 0 : Number(form.minBookingAmount),
      validFrom: form.validFrom || undefined,
      validTo: form.validTo || undefined,
      usageLimit: form.usageLimit === '' ? undefined : Number(form.usageLimit),
      oncePerUser: form.oncePerUser,
      applicableBookingTypes: form.applicableBookingTypes,
      isActive: form.isActive
    };

    setSaving(true);
    try {
      if (editing) {
        await discountService.update(editing._id || editing.id, payload);
      } else {
        await discountService.create(payload);
      }
      setShowModal(false);
      await fetchCoupons();
    } catch (err) {
      setFormError(err?.response?.data?.message || err?.message || 'Failed to save coupon.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await discountService.delete(id);
      await fetchCoupons();
    } catch (err) {
      setError(err?.message || 'Failed to delete coupon.');
    }
  };

  const fmtValue = (c) => (c.discountType === 'percentage' ? `${c.value}%` : `₹${c.value}`);
  const fmtValidity = (c) => {
    const f = dateInput(c.validFrom);
    const t = dateInput(c.validTo);
    if (!f && !t) return 'No limit';
    return `${f || '—'} → ${t || '—'}`;
  };

  return (
    <div className="bg-white rounded-3xl shadow-md p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-50 rounded-2xl">
            <Ticket className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-800">Discount Coupons</h3>
            <p className="text-sm text-gray-500">One-time-use coupons (single user)</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchCoupons}
            disabled={loading}
            className="p-2.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          {canCreate && (
            <button
              onClick={openCreate}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-2xl font-bold transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Create Coupon
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3">Validity</th>
              <th className="px-4 py-3">Usage</th>
              <th className="px-4 py-3">Per user</th>
              <th className="px-4 py-3">Status</th>
              {(canEdit || canDelete) && <th className="px-4 py-3">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                  Loading…
                </td>
              </tr>
            ) : coupons.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                  No coupons yet
                </td>
              </tr>
            ) : (
              coupons.map((c) => (
                <tr key={c._id || c.id} className="border-b border-gray-50 hover:bg-gray-50/60">
                  <td className="px-4 py-3">
                    <span className="font-bold text-gray-800">{c.code}</span>
                    {c.description && <p className="text-xs text-gray-400">{c.description}</p>}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-700">{fmtValue(c)}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{fmtValidity(c)}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {c.usedCount || 0}
                    {c.usageLimit ? ` / ${c.usageLimit}` : ''}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-semibold ${
                        c.oncePerUser !== false ? 'text-emerald-600' : 'text-gray-400'
                      }`}
                    >
                      {c.oncePerUser !== false ? 'Once' : 'Multiple'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        c.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {c.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  {(canEdit || canDelete) && (
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {canEdit && (
                          <button
                            onClick={() => openEdit(c)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Edit"
                          >
                            <EditIcon className="w-5 h-5" />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => setDeleteConfirm({ open: true, id: c._id || c.id })}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete"
                          >
                            <DeleteIcon className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-black text-gray-800 mb-6">
              {editing ? 'Edit Coupon' : 'Create Coupon'}
            </h3>
            {formError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-sm">
                {formError}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Coupon Code *">
                  <input
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    className={INP}
                    placeholder="SAVE20"
                  />
                </Field>
                <Field label="Status">
                  <select
                    value={form.isActive ? '1' : '0'}
                    onChange={(e) => setForm({ ...form, isActive: e.target.value === '1' })}
                    className={INP}
                  >
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </Field>
              </div>

              <Field label="Description">
                <input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={INP}
                  placeholder="Optional"
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Discount Type">
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                    className={INP}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat (₹)</option>
                  </select>
                </Field>
                <Field label={form.discountType === 'percentage' ? 'Value (%) *' : 'Value (₹) *'}>
                  <input
                    type="number"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    className={INP}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {form.discountType === 'percentage' && (
                  <Field label="Max Discount (₹)">
                    <input
                      type="number"
                      value={form.maxDiscount}
                      onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                      className={INP}
                      placeholder="No cap"
                    />
                  </Field>
                )}
                <Field label="Min Booking Amount (₹)">
                  <input
                    type="number"
                    value={form.minBookingAmount}
                    onChange={(e) => setForm({ ...form, minBookingAmount: e.target.value })}
                    className={INP}
                    placeholder="0"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Valid From">
                  <input
                    type="date"
                    value={form.validFrom}
                    onChange={(e) => setForm({ ...form, validFrom: e.target.value })}
                    className={INP}
                  />
                </Field>
                <Field label="Valid To">
                  <input
                    type="date"
                    value={form.validTo}
                    onChange={(e) => setForm({ ...form, validTo: e.target.value })}
                    className={INP}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Global Usage Limit">
                  <input
                    type="number"
                    value={form.usageLimit}
                    onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                    className={INP}
                    placeholder="Unlimited"
                  />
                </Field>
                <Field label="One-time use per user">
                  <select
                    value={form.oncePerUser ? '1' : '0'}
                    onChange={(e) => setForm({ ...form, oncePerUser: e.target.value === '1' })}
                    className={INP}
                  >
                    <option value="1">Yes (once per user)</option>
                    <option value="0">No</option>
                  </select>
                </Field>
              </div>

              <Field label="Applicable Booking Types (none = all)">
                <div className="flex gap-2">
                  {BOOKING_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleType(t)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                        form.applicableBookingTypes.includes(t)
                          ? 'bg-orange-500 text-white border-orange-500'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-[2] bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-2xl font-black disabled:opacity-50"
              >
                {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Coupon'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-500 py-3.5 rounded-2xl font-black"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.open}
        title="Delete Coupon?"
        message="Are you sure you want to delete this coupon? This cannot be undone."
        confirmText="Delete"
        onConfirm={async () => {
          await handleDelete(deleteConfirm.id);
          setDeleteConfirm({ open: false, id: null });
        }}
        onCancel={() => setDeleteConfirm({ open: false, id: null })}
        type="danger"
      />
    </div>
  );
};

export default DiscountsPackages;
