import React from 'react';

const FileUpload = ({ uploadedFiles, onUpload, onRemove, errors }) => {
  return (
    <div className="col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Media (images/documents)
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        <input
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx"
          onChange={onUpload}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center justify-center py-4"
        >
          <svg
            className="w-12 h-12 text-gray-400 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span className="text-sm text-gray-600 font-medium">
            Click to upload images or documents
          </span>
          <span className="text-xs text-gray-500 mt-1">
            Supports: Images (JPG, PNG, GIF) and Documents (PDF, DOC, DOCX)
          </span>
        </label>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {uploadedFiles.map((file, index) => {
            const fileError = errors[`file_${index}`];
            return (
              <div key={file.id} className="relative group">
                {file.type.startsWith('image/') ? (
                  <div className="relative">
                    <img
                      src={file.url}
                      alt={file.name}
                      className={`w-full h-32 object-cover rounded-lg border ${
                        fileError ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => onRemove(file.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div
                    className={`border rounded-lg p-4 bg-gray-50 relative ${
                      fileError ? 'border-red-500' : 'border-gray-200'
                    }`}
                  >
                    <svg
                      className="w-8 h-8 text-gray-400 mx-auto mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-xs text-gray-600 text-center truncate">{file.name}</p>
                    <button
                      type="button"
                      onClick={() => onRemove(file.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1 truncate">{file.name}</p>
                {fileError && <p className="text-red-500 text-xs mt-1">{fileError}</p>}
              </div>
            );
          })}
        </div>
      )}

      {Object.keys(errors).filter((key) => key.startsWith('file_')).length > 0 && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-left">
          <p className="text-sm font-semibold text-red-700 mb-1">File Upload Errors:</p>
          <ul className="text-xs text-red-600 list-disc list-inside">
            {Object.keys(errors)
              .filter((key) => key.startsWith('file_'))
              .map((key) => (
                <li key={key}>{errors[key]}</li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
