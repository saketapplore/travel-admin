import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Images, Plus, Trash2 } from 'lucide-react';
import ImageUploader from './ImageUploader';
import { PHOTO_CATEGORIES } from '@/constants/photoCategories';

/**
 * Category-wise property photo manager (Point 8).
 *
 * Categories are fully manual — the admin types any category name. The
 * predefined list (Living Room, Full Kitchen, …) is offered only as optional
 * quick-add chips. Each category has a description and a (reused) ImageUploader.
 *
 * Controlled component: `value` is the [{ category, description, images }] array
 * and every change is emitted via `onChange` (empty categories are kept while
 * editing; the parent prunes empties on save).
 */
const CategoryPhotoManager = ({ value = [], onChange }) => {
  const cats = Array.isArray(value) ? value : [];
  const [openIdx, setOpenIdx] = useState(cats.length ? 0 : null);
  const [newCat, setNewCat] = useState('');

  const emit = (next) => onChange?.(next);

  const findIndex = (name) =>
    cats.findIndex((c) => (c.category || '').toLowerCase() === name.toLowerCase());

  const addCategory = (name) => {
    const v = (name ?? newCat).trim();
    if (!v) return;
    const existing = findIndex(v);
    if (existing !== -1) {
      setOpenIdx(existing); // already there — just open it
      setNewCat('');
      return;
    }
    const next = [...cats, { category: v, description: '', images: [] }];
    emit(next);
    setOpenIdx(next.length - 1);
    setNewCat('');
  };

  const removeCategory = (idx) => {
    emit(cats.filter((_, i) => i !== idx));
    setOpenIdx(null);
  };

  const updateCategory = (idx, patch) =>
    emit(cats.map((c, i) => (i === idx ? { ...c, ...patch } : c)));

  const totalPhotos = cats.reduce((sum, c) => sum + (c.images?.length || 0), 0);
  const suggestions = PHOTO_CATEGORIES.filter((p) => findIndex(p) === -1);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Images className="w-4 h-4 text-orange-500" />
          Photos by category
        </h4>
        <span className="text-xs font-medium text-gray-400">{totalPhotos} total</span>
      </div>

      {/* Configured categories */}
      <div className="space-y-2">
        {cats.length === 0 && (
          <p className="text-xs text-gray-400 italic px-1">
            No categories yet — add one below to start uploading photos.
          </p>
        )}
        {cats.map((entry, idx) => {
          const count = entry.images?.length || 0;
          const open = openIdx === idx;
          return (
            <div key={`${entry.category}-${idx}`} className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
              <div className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
                <button
                  type="button"
                  onClick={() => setOpenIdx(open ? null : idx)}
                  className="flex items-center gap-2 font-semibold text-gray-700 text-sm flex-1 text-left"
                >
                  {open ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                  {entry.category}
                </button>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      count ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {count} {count === 1 ? 'photo' : 'photos'}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeCategory(idx)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="Remove category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {open && (
                <div className="px-4 pb-4 pt-1 space-y-3 border-t border-gray-100">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Description
                    </label>
                    <textarea
                      value={entry.description || ''}
                      onChange={(e) => updateCategory(idx, { description: e.target.value })}
                      placeholder={`Describe the ${entry.category.toLowerCase()} (optional)…`}
                      rows={2}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none resize-y"
                    />
                  </div>
                  <ImageUploader
                    images={entry.images || []}
                    onChange={(imgs) => updateCategory(idx, { images: imgs })}
                    label={`${entry.category} photos`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add a category (manual) */}
      <div className="border border-dashed border-gray-200 rounded-2xl p-3 bg-gray-50/50 space-y-2">
        <div className="flex gap-2">
          <input
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
            placeholder="Enter a category name (e.g. Garden, Pool)"
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
          />
          <button
            type="button"
            onClick={() => addCategory()}
            disabled={!newCat.trim()}
            className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all disabled:opacity-40 flex items-center gap-1 text-sm font-semibold"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
        {suggestions.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-1">
              Quick add:
            </span>
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addCategory(s)}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-600 transition-colors"
              >
                + {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPhotoManager;
