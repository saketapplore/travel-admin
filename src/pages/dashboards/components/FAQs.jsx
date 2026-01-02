import React, { useState, useEffect } from 'react';
import { faqService } from '../../../services/faqService';
import { EditIcon, DeleteIcon } from '../../../components/icons';

const FAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  });
  const [formError, setFormError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const PAGE_SIZE = 10;

  // Fetch FAQs
  useEffect(() => {
    fetchFAQs();
  }, [currentPage]);

  const fetchFAQs = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await faqService.getAll(currentPage, PAGE_SIZE);
      // Handle various response structures
      const data = response?.data?.data || response?.data || {};
      const faqsArray = Array.isArray(data) ? data : (data.faqs || data.items || []);
      
      setFaqs(faqsArray);
      
      // Handle pagination metadata
      if (data.totalPages !== undefined) {
        setTotalPages(data.totalPages);
      } else if (data.total !== undefined) {
        setTotalPages(Math.ceil(data.total / PAGE_SIZE));
      }
      
      if (data.total !== undefined) {
        setTotalItems(data.total);
      } else if (data.totalItems !== undefined) {
        setTotalItems(data.totalItems);
      }
      
      setError('');
    } catch (error) {
      console.error('FAQs fetch error:', error);
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.error ||
        error.message || 
        'Failed to load FAQs. Please try again.';
      setError(errorMessage);
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFaq = () => {
    setEditingFaq(null);
    setFormData({ question: '', answer: '' });
    setFormError('');
    setShowModal(true);
  };

  const handleEditFaq = (faq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question || '',
      answer: faq.answer || ''
    });
    setFormError('');
    setShowModal(true);
  };

  const handleDeleteFaq = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) {
      return;
    }
    
    try {
      // Based on screenshot, DELETE requires answer in body
      const faq = faqs.find(f => (f._id === id || f.id === id));
      await faqService.delete(id, { answer: faq?.answer || '' });
      await fetchFAQs();
    } catch (error) {
      console.error('Delete FAQ error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete FAQ';
      alert(errorMessage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.question.trim()) {
      setFormError('Question is required');
      return;
    }

    if (!formData.answer.trim()) {
      setFormError('Answer is required');
      return;
    }

    try {
      if (editingFaq) {
        // Update FAQ - based on screenshot, PUT only requires answer
        const faqId = editingFaq._id || editingFaq.id;
        await faqService.update(faqId, { answer: formData.answer.trim() });
      } else {
        // Create FAQ - requires both question and answer
        await faqService.create({
          question: formData.question.trim(),
          answer: formData.answer.trim()
        });
      }
      
      await fetchFAQs();
      setShowModal(false);
      setFormData({ question: '', answer: '' });
      setEditingFaq(null);
    } catch (error) {
      console.error('FAQ submit error:', error);
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.error ||
        error.message || 
        'Failed to save FAQ. Please try again.';
      setFormError(errorMessage);
    }
  };

  const columns = [
    {
      key: 'question',
      header: 'Question',
      accessor: 'question',
      cellClassName: 'text-sm font-medium text-gray-900'
    },
    {
      key: 'answer',
      header: 'Answer',
      accessor: 'answer',
      cellClassName: 'text-sm text-gray-600',
      render: (value) => (
        <div className="max-w-md truncate" title={value}>
          {value}
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      accessor: (row) => row,
      render: (_, row) => {
        const faqId = row._id || row.id;
        return (
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleEditFaq(row)}
              className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit"
            >
              <EditIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleDeleteFaq(faqId)}
              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <DeleteIcon className="w-5 h-5" />
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">FAQs</h3>
              <p className="text-sm text-gray-600">Manage frequently asked questions and answers</p>
            </div>
            <button
              onClick={handleAddFaq}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition duration-200"
            >
              + Add FAQ
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-6 text-center text-sm text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : faqs.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-6 text-center text-sm text-gray-500">
                      No FAQs available.
                    </td>
                  </tr>
                ) : (
                  faqs.map((faq) => {
                    const faqId = faq._id || faq.id;
                    return (
                      <tr key={faqId} className="hover:bg-gray-50">
                        {columns.map((col) => {
                          const value = typeof col.accessor === 'function' 
                            ? col.accessor(faq) 
                            : faq[col.accessor];
                          
                          return (
                            <td
                              key={col.key}
                              className={`px-6 py-4 whitespace-nowrap ${col.cellClassName || ''}`}
                            >
                              {col.render ? col.render(value, faq) : value}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t text-sm text-gray-700">
              <span>
                Showing {(currentPage - 1) * PAGE_SIZE + 1}-
                {Math.min(currentPage * PAGE_SIZE, totalItems)} of {totalItems}
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded border ${
                    currentPage === 1
                      ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  Prev
                </button>
                <span className="px-3 py-1">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className={`px-3 py-1 rounded border ${
                    currentPage >= totalPages
                      ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FAQ Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 my-8 max-h-[90vh] flex flex-col">
            <h3 className="text-2xl font-bold mb-6 flex-shrink-0">
              {editingFaq ? 'Edit FAQ' : 'Add FAQ'}
            </h3>
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-2">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.question}
                    onChange={(e) => {
                      setFormData({ ...formData, question: e.target.value });
                      if (formError) setFormError('');
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                    disabled={!!editingFaq}
                    placeholder="Enter the question"
                  />
                  {editingFaq && (
                    <p className="mt-1 text-xs text-gray-500">Question cannot be edited after creation</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Answer <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.answer}
                    onChange={(e) => {
                      setFormData({ ...formData, answer: e.target.value });
                      if (formError) setFormError('');
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows="6"
                    required
                    placeholder="Enter the answer"
                  />
                </div>
                {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
                    {formError}
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3 mt-6 flex-shrink-0">
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition duration-200"
                >
                  {editingFaq ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormError('');
                    setFormData({ question: '', answer: '' });
                    setEditingFaq(null);
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-semibold transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FAQs;

