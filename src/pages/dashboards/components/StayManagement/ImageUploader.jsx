import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Plus, Loader2, Link, CheckCircle2 } from 'lucide-react';
import { trStaysService } from '../../../../services/trStaysService';

/**
 * ImageUploader - Displays existing images and allows adding via:
 *   1. Paste URL
 *   2. Upload from computer (drag & drop or click to browse)
 *
 * Uploaded files are sent to S3 via the backend, returning URLs.
 */
const ImageUploader = ({ images = [], onSave, saving = false, label = 'Images' }) => {
  const [imageUrls, setImageUrls] = useState([...images]);
  const [newUrl, setNewUrl] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const urlInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // ✅ FIX #3: Resync local state when parent images prop changes (e.g. after fetchProperties)
  useEffect(() => {
    setImageUrls([...images]);
    setIsDirty(false);
    setSaveError(null);
  }, [JSON.stringify(images)]);

  // Add URL from input
  const addUrl = () => {
    const trimmed = newUrl.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) return;
    if (imageUrls.includes(trimmed)) return;

    setImageUrls((prev) => [...prev, trimmed]);
    setNewUrl('');
    setIsDirty(true);
    setSaveError(null);
    setSaveSuccess(false);
    if (urlInputRef.current) urlInputRef.current.focus();
  };

  // Remove image by index
  const removeUrl = (index) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
    setIsDirty(true);
    setSaveError(null);
    setSaveSuccess(false);
  };

  // ✅ FIX #1 & #2: handleSave is now async, waits for API result, and only clears isDirty on success
  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      await onSave(imageUrls);
      setIsDirty(false);
      setSaveSuccess(true);
      // Auto-hide success after 3s
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Save images error:', err);
      setSaveError(err.message || 'Failed to save images. Please try again.');
      // Keep isDirty = true so user can retry
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addUrl();
    }
  };

  // Handle file selection (from input or drop)
  const handleFiles = useCallback(async (files) => {
    if (!files || files.length === 0) return;

    // Filter to only image files
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      setUploadError('Please select image files only (JPG, PNG, GIF, WebP)');
      setTimeout(() => setUploadError(null), 4000);
      return;
    }

    // Check file sizes (max 10MB each)
    const oversized = imageFiles.filter((f) => f.size > 10 * 1024 * 1024);
    if (oversized.length > 0) {
      setUploadError(`${oversized.map((f) => f.name).join(', ')} exceed${oversized.length === 1 ? 's' : ''} 10MB limit`);
      setTimeout(() => setUploadError(null), 4000);
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const response = await trStaysService.uploadFiles(imageFiles);
      const uploadedUrls = response.data?.urls || response.data?.data?.urls || response.data?.images || [];

      if (uploadedUrls.length > 0) {
        setImageUrls((prev) => [...prev, ...uploadedUrls]);
        setIsDirty(true);
        setSaveSuccess(false);
      } else {
        setUploadError('Upload succeeded but no URLs returned. Please try again.');
        setTimeout(() => setUploadError(null), 4000);
      }
    } catch (err) {
      console.error('File upload error:', err);
      setUploadError(err.message || 'Failed to upload images. Please try again.');
      setTimeout(() => setUploadError(null), 5000);
    } finally {
      setUploading(false);
    }
  }, []);

  // File input change
  const handleFileInputChange = (e) => {
    handleFiles(e.target.files);
    e.target.value = ''; // Reset so same file can be selected again
  };

  // Drag & Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const isProcessing = isSaving || saving;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-orange-500" />
          {label}
          <span className="text-xs font-normal text-gray-400">
            ({imageUrls.length} image{imageUrls.length !== 1 ? 's' : ''})
          </span>
        </h4>
        <div className="flex items-center gap-2">
          {/* Success indicator */}
          {saveSuccess && !isDirty && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 animate-in fade-in duration-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Saved
            </span>
          )}
          {/* Save button - only shows when there are unsaved changes */}
          {isDirty && (
            <button
              onClick={handleSave}
              disabled={isProcessing}
              className="text-xs font-semibold px-4 py-1.5 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-all duration-200 disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          )}
        </div>
      </div>

      {/* Save error */}
      {saveError && (
        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 animate-in fade-in duration-200">
          <X className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="flex-1">{saveError}</span>
          <button
            onClick={handleSave}
            disabled={isProcessing}
            className="text-xs font-semibold text-red-700 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Image grid */}
      {imageUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {imageUrls.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50 aspect-[4/3] cursor-pointer"
              onClick={() => setPreviewImage(url)}
            >
              <img
                src={url}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div
                className="w-full h-full items-center justify-center text-gray-400 text-xs"
                style={{ display: 'none' }}
              >
                <ImageIcon className="w-8 h-8" />
              </div>
              {/* Overlay with remove button */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeUrl(index);
                  }}
                  className="p-1.5 bg-red-500 rounded-full text-white shadow-lg hover:bg-red-600 transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {/* Index badge */}
              <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload from computer — Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl px-4 py-5 text-center cursor-pointer transition-all duration-200 ${
          dragOver
            ? 'border-orange-400 bg-orange-50'
            : 'border-gray-200 bg-gray-50/50 hover:border-orange-300 hover:bg-orange-50/30'
        } ${uploading ? 'pointer-events-none opacity-70' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-7 h-7 text-orange-500 animate-spin" />
            <span className="text-sm font-medium text-orange-600">Uploading...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <div className="p-2.5 bg-orange-100 rounded-xl">
              <Upload className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-700">
                Click to upload
              </span>
              <span className="text-sm text-gray-400"> or drag & drop</span>
            </div>
            <span className="text-[11px] text-gray-400">
              JPG, PNG, GIF, WebP — Max 10MB each
            </span>
          </div>
        )}
      </div>

      {/* Upload error */}
      {uploadError && (
        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 animate-in fade-in duration-200">
          <X className="w-3.5 h-3.5 flex-shrink-0" />
          {uploadError}
        </div>
      )}

      {/* OR divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">or paste URL</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Add URL input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            ref={urlInputRef}
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste image URL (https://...)"
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 outline-none transition-all placeholder:text-gray-400"
          />
        </div>
        <button
          onClick={addUrl}
          disabled={!newUrl.trim()}
          className="px-3 py-2 bg-gray-100 hover:bg-orange-50 text-gray-600 hover:text-orange-600 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed border border-gray-200"
          title="Add URL"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Lightbox preview */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-6 right-6 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
