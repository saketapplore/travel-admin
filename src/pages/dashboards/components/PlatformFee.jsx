import React, { useState, useEffect, useCallback } from 'react';
import { BadgePercent, Plane, Building2, Layers, Globe, MapPin, Map, Trash2, Check } from 'lucide-react';
import { platformFeeService } from '../../../services/platformFeeService';
import { Country, State, City } from 'country-state-city';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';

const MODULES = [
  { id: 'both', label: 'Both', icon: Layers },
  { id: 'flight', label: 'Flights', icon: Plane },
  { id: 'hotel', label: 'Hotels', icon: Building2 }
];

const SCOPES = [
  { id: 'global', label: 'Global Default', icon: Globe, hint: 'Applies everywhere unless overridden' },
  { id: 'country', label: 'Country', icon: Map, hint: 'Applies to a whole country' },
  { id: 'city', label: 'City', icon: MapPin, hint: 'Applies to a specific city' }
];

const PlatformFee = () => {
  const [selectedModule, setSelectedModule] = useState('both');
  const [scope, setScope] = useState('global');

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCityObj, setSelectedCityObj] = useState(null);

  const [feeInput, setFeeInput] = useState('');
  const [allFees, setAllFees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  const countries = Country.getAllCountries();
  const states = selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : [];
  const cities = selectedState ? City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode) : [];

  const fetchFees = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await platformFeeService.getPlatformFees();
      setAllFees(response?.data || []);
    } catch (err) {
      setError(err?.message || 'Failed to load platform fees.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFees();
  }, [fetchFees]);

  const handleSave = async () => {
    setError('');
    if (feeInput === '' || isNaN(Number(feeInput))) return setError('Enter a valid percentage.');
    if (scope === 'country' && !selectedCountry) return setError('Please select a country.');
    if (scope === 'city' && !selectedCityObj) return setError('Please select a city.');

    const countryParam = scope === 'global' ? null : selectedCountry?.name || null;
    const cityParam = scope === 'city' ? selectedCityObj?.name || null : null;

    setIsSaving(true);
    try {
      await platformFeeService.updatePlatformFee(
        selectedModule,
        Number(feeInput),
        'percentage',
        cityParam,
        countryParam
      );
      await fetchFees();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
      setFeeInput('');
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to save fee.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await platformFeeService.deletePlatformFee(id);
      await fetchFees();
    } catch (err) {
      setError(err?.message || 'Failed to delete override.');
    }
  };

  const scopeLabel = (f) => {
    if (f.isDefault || (!f.country && !f.city)) return 'Global default';
    if (f.city) return `City · ${f.city}${f.country ? `, ${f.country}` : ''}`;
    return `Country · ${f.country}`;
  };

  const moduleIcon = (m) => (m === 'flight' ? Plane : Building2);

  return (
    <div className="premium-card p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-4">
            <div className="p-2 bg-orange-50 rounded-2xl border border-orange-100 shadow-sm">
              <BadgePercent className="w-8 h-8 text-orange-500" />
            </div>
            <span className="tracking-tight">Financial Settings</span>
          </h3>
          <p className="text-gray-500 mt-2 text-sm ml-[3.5rem]">
            Set markup globally, per country, or per city. City overrides country, which overrides the global default.
          </p>
        </div>
        {showSuccess && (
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
            <Check className="w-4 h-4" /> Saved
          </span>
        )}
      </div>

      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configure */}
        <div className="bg-orange-50/30 rounded-3xl p-6 border border-orange-100/60 space-y-6">
          {/* Module */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Module</label>
            <div className="grid grid-cols-3 gap-2">
              {MODULES.map((m) => {
                const Icon = m.icon;
                const active = selectedModule === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModule(m.id)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border-2 font-bold text-sm transition-all ${
                      active ? 'bg-orange-500 border-orange-500 text-white shadow-md' : 'bg-white border-transparent text-gray-500 hover:border-orange-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" /> {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scope */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Apply To</label>
            <div className="grid grid-cols-3 gap-2">
              {SCOPES.map((s) => {
                const Icon = s.icon;
                const active = scope === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setScope(s.id)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border-2 font-bold text-sm transition-all ${
                      active ? 'bg-white border-orange-400 text-orange-600 shadow-sm' : 'bg-white border-transparent text-gray-500 hover:border-orange-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" /> {s.label}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-400 mt-2">{SCOPES.find((s) => s.id === scope)?.hint}</p>
          </div>

          {/* Location pickers */}
          {scope !== 'global' && (
            <div className="space-y-3">
              <select
                value={selectedCountry?.isoCode || ''}
                onChange={(e) => {
                  setSelectedCountry(countries.find((c) => c.isoCode === e.target.value) || null);
                  setSelectedState(null);
                  setSelectedCityObj(null);
                }}
                className="w-full bg-white border border-gray-200 rounded-2xl py-3 px-4 font-semibold text-gray-700 outline-none focus:border-orange-400"
              >
                <option value="">Select country</option>
                {countries.map((c) => (
                  <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                ))}
              </select>

              {scope === 'city' && (
                <>
                  <select
                    value={selectedState?.isoCode || ''}
                    onChange={(e) => {
                      setSelectedState(states.find((s) => s.isoCode === e.target.value) || null);
                      setSelectedCityObj(null);
                    }}
                    disabled={!selectedCountry}
                    className="w-full bg-white border border-gray-200 rounded-2xl py-3 px-4 font-semibold text-gray-700 outline-none focus:border-orange-400 disabled:opacity-50"
                  >
                    <option value="">Select state / region</option>
                    {states.map((s) => (
                      <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                    ))}
                  </select>
                  <select
                    value={selectedCityObj?.name || ''}
                    onChange={(e) => setSelectedCityObj(cities.find((c) => c.name === e.target.value) || null)}
                    disabled={!selectedState}
                    className="w-full bg-white border border-gray-200 rounded-2xl py-3 px-4 font-semibold text-gray-700 outline-none focus:border-orange-400 disabled:opacity-50"
                  >
                    <option value="">Select city</option>
                    {cities.map((c) => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </>
              )}
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Markup (%)</label>
            <div className="relative">
              <input
                type="number"
                value={feeInput}
                onChange={(e) => setFeeInput(e.target.value)}
                placeholder="0"
                className="w-full bg-white border border-gray-200 rounded-2xl py-4 px-4 pr-10 text-2xl font-black text-gray-800 outline-none focus:border-orange-400"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-300">%</span>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black text-lg transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-orange-500/20"
          >
            {isSaving ? 'Saving…' : 'Save Markup'}
          </button>
        </div>

        {/* Configured rates */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100">
          <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Configured Rates</h4>
          {isLoading ? (
            <p className="text-gray-400 text-sm py-8 text-center">Loading…</p>
          ) : allFees.length === 0 ? (
            <p className="text-gray-400 text-sm py-8 text-center">No rates configured yet.</p>
          ) : (
            <div className="space-y-2 max-h-[460px] overflow-y-auto">
              {allFees.map((f) => {
                const Icon = moduleIcon(f.module);
                const isDefault = f.isDefault || (!f.country && !f.city);
                return (
                  <div
                    key={f._id}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-gray-100 hover:bg-gray-50"
                  >
                    <div className="p-2 rounded-xl bg-orange-50 text-orange-500">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-gray-800 capitalize text-sm">{f.module}</p>
                      <p className="text-xs text-gray-400 truncate">{scopeLabel(f)}</p>
                    </div>
                    <span className="font-black text-gray-800">
                      {f.amount}
                      {f.feeType === 'percentage' ? '%' : ''}
                    </span>
                    {!isDefault && (
                      <button
                        onClick={() => setDeleteConfirm({ open: true, id: f._id })}
                        className="p-1.5 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        title="Remove override"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm.open}
        title="Remove Override?"
        message="This location will fall back to the country or global default rate."
        confirmText="Remove"
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

export default PlatformFee;
