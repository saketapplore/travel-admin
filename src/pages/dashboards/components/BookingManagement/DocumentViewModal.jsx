import React from 'react';
import { X, FileText, ExternalLink } from 'lucide-react';

const DocumentViewModal = ({ isOpen, onClose, documents, loading, error }) => {
  if (!isOpen) return null;

  const getDocumentUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    
    let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/admin';
    if (baseUrl.includes('/api/admin')) {
      baseUrl = baseUrl.replace('/api/admin', '');
    }
    
    const formattedUrl = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl}${formattedUrl}`;
  };

  const renderDocumentCard = (title, number, url, dotColor) => {
    const hasDocument = !!url;
    const fullUrl = hasDocument ? getDocumentUrl(url) : '';

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3 shadow-sm">
        {/* Title row */}
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-gray-800 flex items-center gap-2 text-[15px]">
            <div className={`w-2.5 h-2.5 rounded-full ${dotColor}`}></div>
            {title}
          </h4>
          {number && (
            <span className="text-xs font-mono bg-gray-100 px-2.5 py-1 rounded-md text-gray-600 border border-gray-200">
              {number}
            </span>
          )}
        </div>

        {/* Status + View button */}
        {hasDocument ? (
          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-green-700">Document uploaded</span>
            </div>
            <a
              href={fullUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm active:scale-95"
            >
              <ExternalLink className="w-4 h-4" />
              View
            </a>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-500 font-medium">No document uploaded</span>
            </div>
            <span className="px-4 py-2 text-sm font-semibold text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed border border-gray-200">
              View
            </span>
          </div>
        )}
      </div>
    );
  };

  const userDocs = documents?.userDocuments || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Travel Documents</h3>
            <p className="text-sm text-gray-500 mt-1">User identity and travel verification documents</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500 font-medium">Loading documents...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                <X className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">Failed to load documents</h4>
              <p className="text-gray-500 max-w-md">{error}</p>
            </div>
          ) : !userDocs ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                <FileText className="w-8 h-8 opacity-50" />
              </div>
              <p className="text-gray-500 font-medium">No travel details found for this user.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {renderDocumentCard(
                'Passport',
                userDocs.passportNumber,
                userDocs.passportPhoto,
                'bg-blue-500'
              )}
              {renderDocumentCard(
                'PAN Card',
                userDocs.panNumber,
                userDocs.panPhoto,
                'bg-orange-500'
              )}
              {renderDocumentCard(
                'Aadhar Card',
                userDocs.aadharNumber,
                userDocs.aadharPhoto,
                'bg-green-500'
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-semibold transition-all shadow-sm active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewModal;
