import React, { useState } from 'react';
import { Plus, X, Search } from 'lucide-react';

/**
 * Configures a property's Search Filter Amenities (Point 9) — searchable tags
 * that appear as filters on the app's property search page.
 *
 * Display/informational amenities are NOT configured here: the app shows each
 * room's own amenities (editable per-room in the Edit Room modal).
 *
 * Emits { searchFilterAmenities: string[] }.
 */
const AmenityManager = ({ value = {}, onChange }) => {
  const searchFilterAmenities = value.searchFilterAmenities || [];
  const [newFilter, setNewFilter] = useState('');

  const emit = (next) => onChange?.({ searchFilterAmenities: next });

  const addFilter = () => {
    const v = newFilter.trim();
    if (!v) return;
    if (searchFilterAmenities.some((a) => a.toLowerCase() === v.toLowerCase())) {
      setNewFilter('');
      return;
    }
    emit([...searchFilterAmenities, v]);
    setNewFilter('');
  };
  const removeFilter = (i) => emit(searchFilterAmenities.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Search className="w-4 h-4 text-orange-500" />
        <h4 className="text-sm font-semibold text-gray-700">Search Filter Amenities</h4>
      </div>
      <p className="text-xs text-gray-400 mb-3">
        Searchable tags. These appear as filters on the property search page. (Amenities shown on
        the details page come from each room&apos;s own amenities.)
      </p>
      <div className="flex flex-wrap gap-2 mb-3">
        {searchFilterAmenities.length === 0 && (
          <span className="text-xs text-gray-300 italic">No search filter amenities yet</span>
        )}
        {searchFilterAmenities.map((a, i) => (
          <span
            key={`${a}-${i}`}
            className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 border border-orange-100 px-3 py-1.5 rounded-full text-xs font-semibold"
          >
            {a}
            <button onClick={() => removeFilter(i)} className="hover:text-orange-900" title="Remove">
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={newFilter}
          onChange={(e) => setNewFilter(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFilter())}
          placeholder="e.g. WiFi, Pool, Pet friendly"
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
        />
        <button
          onClick={addFilter}
          disabled={!newFilter.trim()}
          className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all disabled:opacity-40 flex items-center gap-1 text-sm font-semibold"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>
    </div>
  );
};

export default AmenityManager;
