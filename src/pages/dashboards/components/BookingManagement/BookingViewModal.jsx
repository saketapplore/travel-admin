import React, { useState } from 'react';
import { bookingService } from '../../../../services/bookingService';

const BookingViewModal = ({ isOpen, onClose, booking, loading, error }) => {
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [voucherResult, setVoucherResult] = useState(null);
  const [voucherError, setVoucherError] = useState('');
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  const [syncError, setSyncError] = useState('');

  const handleSyncFromTBO = async () => {
    if (!booking?._id) return;
    setSyncLoading(true);
    setSyncError('');
    setSyncResult(null);
    try {
      const res = await bookingService.syncFromTBO(booking._id);
      setSyncResult(res.data);
    } catch (err) {
      setSyncError(err?.response?.data?.message || err?.message || 'Sync failed.');
    } finally {
      setSyncLoading(false);
    }
  };

  const handleGenerateVoucher = async () => {
    if (!booking?._id) return;
    setVoucherLoading(true);
    setVoucherError('');
    setVoucherResult(null);
    try {
      const res = await bookingService.generateVoucher(booking._id);
      setVoucherResult(res.data?.data || res.data);
    } catch (err) {
      setVoucherError(err?.response?.data?.message || err?.message || 'Voucher generation failed.');
    } finally {
      setVoucherLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-4xl w-full mx-4 my-8 max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-orange-600 px-8 py-6 flex justify-between items-center text-white flex-shrink-0">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">INVOICE</h2>
            <p className="text-orange-100 text-sm mt-1">
              Booking ID: <span className="font-mono">{booking?._id || booking?.id || 'N/A'}</span>
            </p>
            {booking?.invoiceUrl && (
              <p className="text-orange-100 text-sm mt-1">
                Invoice URL: <a href={booking.invoiceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-white font-mono break-all">{booking.invoiceUrl}</a>
              </p>
            )}
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-2 mb-1">
              <div className="w-10 h-10  rounded-full flex items-center justify-center">
                <img
                  src="/src/assets/platform-fee.png"
                  alt=""
                  className="w-9 h-9 rounded-full flen object-contain"
                  onError={(e) =>
                    (e.target.src = 'src/assets/logo.png')
                  }
                />
              </div>
              <span className="text-xl font-bold">TRAVEL RUMOURS</span>
            </div>
            <p className="text-orange-100 text-xs">www.travelrumours.com</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 animate-pulse font-medium">Preparing your invoice...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          ) : booking ? (
            <div className="space-y-10">
              <div className="grid grid-cols-2 gap-12 border-b pb-8 border-gray-100">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Billed To
                  </h4>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-gray-900">
                      {booking.user?.name ||
                        booking.passengers?.[0] && `${booking.passengers[0].FirstName || ''} ${booking.passengers[0].LastName || ''}`.trim() ||
                        booking.guestName ||
                        'N/A'}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {booking.user?.email || booking.guestEmail || ''}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {booking.user?.phone || booking.user?.mobileNumber || booking.guestPhone || ''}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Booking Summary
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <span className="text-gray-500">Invoice Date:</span>
                    <span className="text-gray-900 font-semibold">
                      {new Date().toLocaleDateString()}
                    </span>
                    <span className="text-gray-500">Booking Type:</span>
                    <span className="text-gray-900 font-semibold capitalize">
                      {booking.bookingType || 'N/A'}
                    </span>
                    <span className="text-gray-500">Payment Status:</span>
                    <span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                          booking.paymentStatus === 'paid'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {booking.paymentStatus || 'Pending'}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                  Travel Information
                </h4>
                <div className="grid grid-cols-3 gap-8">
                  {(booking.bookingType === 'FLIGHT' || booking.bookingType === 'DOMESTIC_RETURN' || booking.flightDetails) ? (
                    <>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Airline</p>
                        <p className="font-bold text-gray-900">
                          {booking.flightDetails?.AirlineName || booking.bookingDetails?.flightDetails?.AirlineName || '—'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {booking.flightDetails?.FlightNumber || booking.bookingDetails?.flightDetails?.FlightNumber || ''}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Route</p>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">
                            {booking.flightDetails?.Origin || booking.bookingDetails?.flightDetails?.Origin || '—'}
                          </span>
                          <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                          <span className="font-bold text-gray-900">
                            {booking.flightDetails?.Destination || booking.bookingDetails?.flightDetails?.Destination || '—'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Departure</p>
                        <p className="font-bold text-gray-900">
                          {(booking.flightDetails?.DepartureTime || booking.bookingDetails?.flightDetails?.DepartureTime)
                            ? new Date(booking.flightDetails?.DepartureTime || booking.bookingDetails?.flightDetails?.DepartureTime)
                                .toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                            : '—'}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-span-2">
                        <p className="text-xs text-gray-400 mb-1">Property</p>
                        <p className="font-bold text-gray-900 text-lg leading-tight">
                          {booking.hotelDetails?.HotelName || booking.propertyName || '—'}
                        </p>
                        {booking.hotelDetails?.ConfirmationNo && (
                          <p className="text-xs text-gray-400 mt-1">
                            Conf# <span className="font-mono text-gray-600">{booking.hotelDetails.ConfirmationNo}</span>
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 mb-1">Stay Duration</p>
                        <p className="font-bold text-gray-900">
                          {booking.hotelDetails?.checkIn || booking.checkIn || '—'}
                          {' — '}
                          {booking.hotelDetails?.checkOut || booking.checkOut || '—'}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                  Service Details
                </h4>
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs font-bold text-gray-400 uppercase border-b border-gray-100">
                      <th className="pb-3 pl-2">Description</th>
                      <th className="pb-3 text-center">Type</th>
                      <th className="pb-3 text-right pr-2">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <tr className="text-sm">
                      <td className="py-5 pl-2">
                        <p className="font-bold text-gray-900">Base Booking Fee</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Primary booking service for {booking.guests || 1} guest(s)
                        </p>
                      </td>
                      <td className="py-5 text-center">
                        <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-[10px] font-bold uppercase tracking-wider">
                          Base
                        </span>
                      </td>
                      <td className="py-5 text-right font-bold text-gray-900 pr-2">
                        ₹{Number(booking.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-6 border-t-2 border-orange-100">
                <div className="w-1/2 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-semibold text-gray-900">
                      ₹{Number(booking.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-lg font-bold text-gray-900 underline decoration-orange-300 decoration-4">
                      Grand Total
                    </span>
                    <span className="text-3xl font-black text-orange-600">
                      ₹{Number(booking.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {booking.bookingType === 'HOTEL' && (
                <div className="border border-gray-200 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Voucher Status
                    </h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      booking.voucherStatus
                        ? 'bg-green-100 text-green-700'
                        : booking.autoVoucherTriggered
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {booking.voucherStatus ? '✓ Generated' : booking.autoVoucherTriggered ? 'Quarantined' : 'Pending'}
                    </span>
                  </div>

                  {typeof booking.voucherAttempts === 'number' && booking.voucherAttempts > 0 && (
                    <p className="text-sm text-gray-500">
                      Attempts: <span className="font-semibold text-gray-900">{booking.voucherAttempts}</span>
                    </p>
                  )}

                  {booking.voucherFailureReason && (
                    <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                      Last error: {booking.voucherFailureReason}
                    </p>
                  )}

                  {voucherResult && (
                    <div className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2 space-y-1">
                      <p className="font-bold">Voucher Generated Successfully!</p>
                      {voucherResult.InvoiceNumber && <p>Invoice No: {voucherResult.InvoiceNumber}</p>}
                      {voucherResult.ConfirmationNo && <p>Confirmation No: {voucherResult.ConfirmationNo}</p>}
                    </div>
                  )}

                  {voucherError && (
                    <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{voucherError}</p>
                  )}

                  {!booking.voucherStatus && !voucherResult && (
                    <button
                      onClick={handleGenerateVoucher}
                      disabled={voucherLoading}
                      className="w-full mt-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95"
                    >
                      {voucherLoading ? 'Generating...' : 'Generate Voucher'}
                    </button>
                  )}

                  <div className="border-t border-gray-100 pt-4 mt-2">
                    <p className="text-xs text-gray-400 mb-2 uppercase tracking-widest font-bold">Debug</p>
                    {syncResult && (
                      <div className={`text-sm rounded-lg px-3 py-2 mb-2 space-y-1 ${syncResult.success ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                        <p className="font-bold">{syncResult.message}</p>
                        {syncResult.updatedFields?.length > 0 && (
                          <p className="text-xs">Updated: {syncResult.updatedFields.join(', ')}</p>
                        )}
                        {syncResult.raw && (
                          <details className="text-xs mt-1">
                            <summary className="cursor-pointer font-semibold">Raw TBO Response</summary>
                            <pre className="mt-1 whitespace-pre-wrap break-all text-[10px] bg-white rounded p-2 border border-gray-200 max-h-40 overflow-y-auto">
                              {JSON.stringify(syncResult.raw, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    )}
                    {syncError && (
                      <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-2">{syncError}</p>
                    )}
                    <button
                      onClick={handleSyncFromTBO}
                      disabled={syncLoading}
                      className="w-full bg-gray-800 hover:bg-gray-900 disabled:opacity-60 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95"
                    >
                      {syncLoading ? 'Syncing...' : 'Sync from TBO'}
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-12 mt-12 bg-gray-900 p-8 rounded-2xl text-gray-400 text-[10px] leading-relaxed">
                <div>
                  <h5 className="text-white font-bold uppercase mb-2">Terms & Conditions</h5>
                  <p>
                    Full payment is required to confirm booking. Cancellation policies apply as per
                    standard travel industry regulations.
                  </p>
                </div>
                <div className="text-right">
                  <h5 className="text-white font-bold uppercase mb-2">Contact Support</h5>
                  <p>Email: support@travelrumours.com</p>
                  <p className="mt-2 text-gray-500 font-mono">
                    Invoice generated on {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-medium">
                No booking details found for this reference.
              </p>
            </div>
          )}
        </div>

        <div className="px-8 py-5 bg-gray-50 flex justify-end items-center border-t border-gray-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2.5 rounded-2xl font-bold transition-all duration-300 shadow-md active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingViewModal;
