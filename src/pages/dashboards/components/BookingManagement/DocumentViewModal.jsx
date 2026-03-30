import React from 'react';
import { X, FileText, Image as ImageIcon } from 'lucide-react';

const DocumentViewModal = ({ isOpen, onClose, documents, loading, error }) => {
  if (!isOpen) return null;

  const renderDocument = (title, url) => {
    if (!url) {
      return (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl">
          <FileText className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 font-medium">No document uploaded</p>
        </div>
      );
    }

    const isPdf = url.toLowerCase().endsWith('.pdf');

    return (
      <div className="flex flex-col space-y-3">
        {isPdf ? (
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-orange-500" />
              <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">{title} Document.pdf</span>
            </div>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
            >
              View PDF
            </a>
          </div>
        ) : (
          <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50 aspect-video">
            <img 
              src={url} 
              alt={title} 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden absolute inset-0 flex-col items-center justify-center bg-gray-100 text-gray-500">
              <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
              <span className="text-sm font-medium">Failed to load image</span>
            </div>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-bold shadow-lg hover:scale-105 transition-transform"
              >
                Open in New Tab
              </a>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
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
          ) : !documents ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                <FileText className="w-8 h-8 opacity-50" />
              </div>
              <p className="text-gray-500 font-medium">No travel details found for this user.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Passport */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    Passport
                  </h4>
                  {documents.passportNumber && (
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">
                      {documents.passportNumber}
                    </span>
                  )}
                </div>
                {renderDocument('Passport', documents.passportPhoto)}
              </div>

              {/* PAN Card */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    PAN Card
                  </h4>
                  {documents.panNumber && (
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">
                      {documents.panNumber}
                    </span>
                  )}
                </div>
                {renderDocument('PAN Card', documents.panPhoto)}
              </div>

              {/* Aadhar Card */}
              <div className="space-y-3 md:col-span-2 max-w-md">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Aadhar Card
                  </h4>
                  {documents.aadharNumber && (
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">
                      {documents.aadharNumber}
                    </span>
                  )}
                </div>
                {renderDocument('Aadhar Card', documents.aadharPhoto)}
              </div>
              
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
