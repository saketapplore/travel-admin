export const formatStatus = (status) => {
  if (!status) return 'N/A';
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const getPaymentStatusColor = (status) => {
  const statusLower = (status || '').toLowerCase();
  switch (statusLower) {
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    case 'refunded':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getBookingStatusColor = (status) => {
  const statusLower = (status || '').toLowerCase();
  switch (statusLower) {
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    case 'hold':
    case 'hold_flight':
    case 'hold_hotel':
    case 'hold_failed':
    case 'hold_released':
    case 'partial_hold':
      return 'bg-amber-100 text-amber-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
