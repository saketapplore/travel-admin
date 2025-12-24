import React, { useState } from 'react';
import { EditIcon, DeleteIcon } from '../../../components/icons';

const DiscountsPackages = () => {
  const [discountsSubSection, setDiscountsSubSection] = useState('discounts');
  
  const [discounts, setDiscounts] = useState([
    {
      id: 1,
      code: 'SUMMER2024',
      type: 'Percentage',
      value: 20,
      description: 'Summer special discount',
      validFrom: '2024-06-01',
      validTo: '2024-08-31',
      minPurchase: 100,
      maxDiscount: 500,
      usageLimit: 100,
      usedCount: 45,
      status: 'Active'
    },
    {
      id: 2,
      code: 'WEEKEND50',
      type: 'Fixed',
      value: 50,
      description: 'Weekend getaway discount',
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      minPurchase: 200,
      maxDiscount: null,
      usageLimit: 50,
      usedCount: 12,
      status: 'Active'
    }
  ]);
  const [packages, setPackages] = useState([
    {
      id: 1,
      name: 'Honeymoon Package',
      description: 'Special package for honeymooners with romantic amenities',
      price: 2999,
      duration: 7,
      includes: 'Breakfast, Spa, Romantic dinner, Room upgrade',
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Family Fun Package',
      description: 'Perfect for families with kids',
      price: 1999,
      duration: 5,
      includes: 'Breakfast, Kids activities, Pool access, Family room',
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      status: 'Active'
    }
  ]);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [editingPackage, setEditingPackage] = useState(null);
  const [discountFormData, setDiscountFormData] = useState({
    code: '',
    type: 'Percentage',
    value: '',
    description: '',
    validFrom: '',
    validTo: '',
    minPurchase: '',
    maxDiscount: '',
    usageLimit: '',
    status: 'Active'
  });
  const [packageFormData, setPackageFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    includes: '',
    validFrom: '',
    validTo: '',
    status: 'Active'
  });

  const handleAddDiscount = () => {
    setEditingDiscount(null);
    setDiscountFormData({
      code: '',
      type: 'Percentage',
      value: '',
      description: '',
      validFrom: '',
      validTo: '',
      minPurchase: '',
      maxDiscount: '',
      usageLimit: '',
      status: 'Active'
    });
    setShowDiscountModal(true);
  };

  const handleEditDiscount = (discount) => {
    setEditingDiscount(discount);
    setDiscountFormData({
      code: discount.code,
      type: discount.type,
      value: discount.value,
      description: discount.description,
      validFrom: discount.validFrom,
      validTo: discount.validTo,
      minPurchase: discount.minPurchase,
      maxDiscount: discount.maxDiscount || '',
      usageLimit: discount.usageLimit,
      status: discount.status
    });
    setShowDiscountModal(true);
  };

  const handleDeleteDiscount = (id) => {
    if (window.confirm('Are you sure you want to delete this discount code?')) {
      setDiscounts(discounts.filter(d => d.id !== id));
    }
  };

  const handleDiscountSubmit = (e) => {
    e.preventDefault();
    if (editingDiscount) {
      setDiscounts(discounts.map(d =>
        d.id === editingDiscount.id ? { ...discountFormData, id: editingDiscount.id, usedCount: editingDiscount.usedCount } : d
      ));
    } else {
      setDiscounts([...discounts, {
        ...discountFormData,
        id: Date.now(),
        usedCount: 0,
        value: parseFloat(discountFormData.value),
        minPurchase: parseFloat(discountFormData.minPurchase) || 0,
        maxDiscount: discountFormData.maxDiscount ? parseFloat(discountFormData.maxDiscount) : null,
        usageLimit: parseFloat(discountFormData.usageLimit) || 0
      }]);
    }
    setShowDiscountModal(false);
  };

  const handleAddPackage = () => {
    setEditingPackage(null);
    setPackageFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      includes: '',
      validFrom: '',
      validTo: '',
      status: 'Active'
    });
    setShowPackageModal(true);
  };

  const handleEditPackage = (pkg) => {
    setEditingPackage(pkg);
    setPackageFormData({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      duration: pkg.duration,
      includes: pkg.includes,
      validFrom: pkg.validFrom,
      validTo: pkg.validTo,
      status: pkg.status
    });
    setShowPackageModal(true);
  };

  const handleDeletePackage = (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      setPackages(packages.filter(p => p.id !== id));
    }
  };

  const handlePackageSubmit = (e) => {
    e.preventDefault();
    if (editingPackage) {
      setPackages(packages.map(p =>
        p.id === editingPackage.id ? { ...packageFormData, id: editingPackage.id, price: parseFloat(packageFormData.price), duration: parseFloat(packageFormData.duration) } : p
      ));
    } else {
      setPackages([...packages, {
        ...packageFormData,
        id: Date.now(),
        price: parseFloat(packageFormData.price),
        duration: parseFloat(packageFormData.duration)
      }]);
    }
    setShowPackageModal(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 w-full">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Discounts & Packages</h3>
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setDiscountsSubSection('discounts')}
              className={`px-6 py-2 rounded-lg font-semibold transition duration-200 ${
                discountsSubSection === 'discounts'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🎫 Discount Codes
            </button>
            <button
              onClick={() => setDiscountsSubSection('packages')}
              className={`px-6 py-2 rounded-lg font-semibold transition duration-200 ${
                discountsSubSection === 'packages'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📦 Packages
            </button>
          </div>
        </div>

        {/* Discount Codes Section */}
        {discountsSubSection === 'discounts' && (
        <>
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-lg font-semibold text-gray-800">Discount Codes</h4>
          <button
            onClick={handleAddDiscount}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition duration-200 shadow-md"
          >
            + Create Discount Code
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {discounts.map((discount) => (
                <tr key={discount.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-mono">{discount.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{discount.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {discount.type === 'Percentage' ? `${discount.value}%` : `$${discount.value}`}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{discount.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {discount.validFrom} to {discount.validTo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {discount.usedCount} / {discount.usageLimit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      discount.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {discount.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEditDiscount(discount)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteDiscount(discount.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
        )}

        {/* Packages Section */}
        {discountsSubSection === 'packages' && (
        <>
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-lg font-semibold text-gray-800">Custom Packages</h4>
          <button
            onClick={handleAddPackage}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition duration-200 shadow-md"
          >
            + Create Package
          </button>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[1200px]">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Includes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 min-w-[180px]">{pkg.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 min-w-[200px] max-w-[300px]">{pkg.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">${pkg.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pkg.duration} days</td>
                  <td className="px-6 py-4 text-sm text-gray-500 min-w-[200px] max-w-[300px]">{pkg.includes}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 min-w-[180px]">
                    <div className="flex flex-col">
                      <span>{pkg.validFrom}</span>
                      <span className="text-gray-400 text-xs">to</span>
                      <span>{pkg.validTo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      pkg.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {pkg.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleEditPackage(pkg)}
                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <EditIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeletePackage(pkg.id)}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <DeleteIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
        )}
      </div>

      {/* Discount Modal */}
      {showDiscountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 my-8 max-h-[90vh] flex flex-col">
            <h3 className="text-2xl font-bold mb-6 flex-shrink-0">
              {editingDiscount ? 'Edit Discount Code' : 'Create Discount Code'}
            </h3>
            <form onSubmit={handleDiscountSubmit} className="flex-1 overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Code <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={discountFormData.code}
                    onChange={(e) => setDiscountFormData({ ...discountFormData, code: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono"
                    placeholder="SUMMER2024"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type <span className="text-red-500">*</span></label>
                  <select
                    value={discountFormData.type}
                    onChange={(e) => setDiscountFormData({ ...discountFormData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Fixed">Fixed Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Value <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={discountFormData.value}
                    onChange={(e) => setDiscountFormData({ ...discountFormData, value: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder={discountFormData.type === 'Percentage' ? '20' : '50'}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Purchase ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={discountFormData.minPurchase}
                    onChange={(e) => setDiscountFormData({ ...discountFormData, minPurchase: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="100"
                  />
                </div>
                {discountFormData.type === 'Percentage' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Discount ($)</label>
                    <input
                      type="number"
                      min="0"
                      value={discountFormData.maxDiscount}
                      onChange={(e) => setDiscountFormData({ ...discountFormData, maxDiscount: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="500"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Usage Limit</label>
                  <input
                    type="number"
                    min="0"
                    value={discountFormData.usageLimit}
                    onChange={(e) => setDiscountFormData({ ...discountFormData, usageLimit: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valid From <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={discountFormData.validFrom}
                    onChange={(e) => setDiscountFormData({ ...discountFormData, validFrom: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valid To <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={discountFormData.validTo}
                    onChange={(e) => setDiscountFormData({ ...discountFormData, validTo: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={discountFormData.status}
                    onChange={(e) => setDiscountFormData({ ...discountFormData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={discountFormData.description}
                    onChange={(e) => setDiscountFormData({ ...discountFormData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows="3"
                    placeholder="Enter discount description..."
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6 flex-shrink-0 pt-4 border-t">
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition duration-200"
                >
                  {editingDiscount ? 'Update Discount' : 'Create Discount'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDiscountModal(false);
                    setEditingDiscount(null);
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

      {/* Package Modal */}
      {showPackageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 my-8 max-h-[90vh] flex flex-col">
            <h3 className="text-2xl font-bold mb-6 flex-shrink-0">
              {editingPackage ? 'Edit Package' : 'Create Package'}
            </h3>
            <form onSubmit={handlePackageSubmit} className="flex-1 overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Package Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={packageFormData.name}
                    onChange={(e) => setPackageFormData({ ...packageFormData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Honeymoon Package"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description <span className="text-red-500">*</span></label>
                  <textarea
                    value={packageFormData.description}
                    onChange={(e) => setPackageFormData({ ...packageFormData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows="3"
                    placeholder="Enter package description..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={packageFormData.price}
                    onChange={(e) => setPackageFormData({ ...packageFormData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="2999"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (days) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    min="1"
                    value={packageFormData.duration}
                    onChange={(e) => setPackageFormData({ ...packageFormData, duration: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="7"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Includes <span className="text-red-500">*</span></label>
                  <textarea
                    value={packageFormData.includes}
                    onChange={(e) => setPackageFormData({ ...packageFormData, includes: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows="3"
                    placeholder="Breakfast, Spa, Romantic dinner, Room upgrade"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate items with commas</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valid From <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={packageFormData.validFrom}
                    onChange={(e) => setPackageFormData({ ...packageFormData, validFrom: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valid To <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={packageFormData.validTo}
                    onChange={(e) => setPackageFormData({ ...packageFormData, validTo: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={packageFormData.status}
                    onChange={(e) => setPackageFormData({ ...packageFormData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3 mt-6 flex-shrink-0 pt-4 border-t">
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition duration-200"
                >
                  {editingPackage ? 'Update Package' : 'Create Package'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPackageModal(false);
                    setEditingPackage(null);
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

export default DiscountsPackages;



