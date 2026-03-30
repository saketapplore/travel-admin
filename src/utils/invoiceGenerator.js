export const generateBookingInvoice = (booking) => {
  const basePrice = booking.basePrice || booking.amount || 0;
  const discount = booking.discount || 0;
  const subtotal = basePrice - discount;
  
  const platformFee = booking.platformFee || 0;
  const convenienceFee = booking.convenienceFee || 0;

  const gstRate = 18;
  const gstAmount = (subtotal * gstRate) / 100;
  const totalAmount = subtotal + platformFee + convenienceFee + gstAmount;

  const invoiceNumber = `INV-BK-${String(booking.id || booking._id).padStart(4, '0')}`;

  const invoiceData = {
    invoiceNumber: invoiceNumber,
    date: new Date().toLocaleDateString('en-IN'),
    guestName: booking.guestName || 'Valued Guest',
    guestEmail: booking.guestEmail || 'N/A',
    guestPhone: booking.guestPhone || 'N/A',
    propertyName: booking.propertyName || 'N/A',
    checkIn: booking.checkIn || 'N/A',
    checkOut: booking.checkOut || 'N/A',
    guests: booking.guests || 1,
    basePrice: basePrice,
    discount: discount,
    subtotal: subtotal,
    platformFee: platformFee,
    convenienceFee: convenienceFee,
    gstRate: gstRate,
    gstAmount: gstAmount,
    totalAmount: totalAmount,
    paymentStatus: booking.paymentStatus || 'Pending',
    bookingStatus: booking.bookingStatus || 'Confirmed',
    bookingDate: booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-IN') : 'N/A'
  };

  const invoiceHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice ${invoiceData.invoiceNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
        .invoice-header { border-bottom: 2px solid #E07A5F; padding-bottom: 20px; margin-bottom: 30px; }
        .invoice-title { font-size: 28px; color: #E07A5F; font-weight: bold; }
        .invoice-details { display: flex; justify-content: space-between; margin-top: 20px; }
        .company-info { flex: 1; }
        .invoice-info { flex: 1; text-align: right; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #E07A5F; color: white; }
        .total-section { margin-top: 20px; text-align: right; }
        .total-row { font-size: 18px; font-weight: bold; padding: 10px 0; }
        .gst-info { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        .booking-details { background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="invoice-header">
        <div class="invoice-title">TAX INVOICE</div>
        <div class="invoice-details">
          <div class="company-info">
            <h3>Travel Rumours</h3>
            <p>123 Travel Street, Tourism City</p>
            <p>GSTIN: 27AAAAA0000A1Z5</p>
            <p>Email: info@travelrumours.com</p>
          </div>
          <div class="invoice-info">
            <p><strong>Invoice No:</strong> ${invoiceData.invoiceNumber}</p>
            <p><strong>Date:</strong> ${invoiceData.date}</p>
            <p><strong>Booking Date:</strong> ${invoiceData.bookingDate}</p>
          </div>
        </div>
      </div>
      
      <div>
        <h3>Bill To:</h3>
        <p><strong>${invoiceData.guestName}</strong></p>
        <p>${invoiceData.guestEmail}</p>
        <p>${invoiceData.guestPhone}</p>
      </div>
      
      <div class="booking-details">
        <h4>Booking Details:</h4>
        <p><strong>Property:</strong> ${invoiceData.propertyName}</p>
        <p><strong>Check In:</strong> ${invoiceData.checkIn}</p>
        <p><strong>Check Out:</strong> ${invoiceData.checkOut}</p>
        <p><strong>Number of Guests:</strong> ${invoiceData.guests}</p>
        <p><strong>Booking Status:</strong> ${invoiceData.bookingStatus}</p>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${invoiceData.propertyName} - ${invoiceData.checkIn} to ${invoiceData.checkOut}</td>
            <td>${invoiceData.checkIn}</td>
            <td>${invoiceData.checkOut}</td>
            <td>₹${invoiceData.basePrice.toLocaleString('en-IN')}</td>
          </tr>
        </tbody>
      </table>
      
      <div class="total-section">
        <div style="display: flex; justify-content: flex-end;">
          <div style="width: 350px;">
            <div style="display: flex; justify-content: space-between; padding: 5px 0;">
              <span>Base Price:</span>
              <span>₹${invoiceData.basePrice.toLocaleString('en-IN')}</span>
            </div>
            ${invoiceData.discount > 0 ? `
            <div style="display: flex; justify-content: space-between; padding: 5px 0; color: #E07A5F;">
              <span>Discount:</span>
              <span>-₹${invoiceData.discount.toLocaleString('en-IN')}</span>
            </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-top: 1px dashed #ddd; border-bottom: 1px dashed #ddd; margin: 5px 0; font-weight: bold;">
              <span>Subtotal:</span>
              <span>₹${invoiceData.subtotal.toLocaleString('en-IN')}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; padding: 5px 0; margin-top: 10px;">
              <span>Platform Fee:</span>
              <span>₹${invoiceData.platformFee.toLocaleString('en-IN')}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 5px 0;">
              <span>Convenience Fee:</span>
              <span>₹${invoiceData.convenienceFee.toLocaleString('en-IN')}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; padding: 5px 0; margin-top: 10px;">
              <span>GST (${invoiceData.gstRate}%):</span>
              <span>₹${invoiceData.gstAmount.toLocaleString('en-IN')}</span>
            </div>
            <div class="total-row" style="display: flex; justify-content: space-between; padding: 10px 0; border-top: 2px solid #E07A5F; margin-top: 10px;">
              <span>Total Payable:</span>
              <span>₹${invoiceData.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="gst-info">
        <p><strong>Payment Status:</strong> ${invoiceData.paymentStatus}</p>
        <p>This is a computer-generated invoice and does not require a signature.</p>
        <p>GST Registration Number: 27AAAAA0000A1Z5</p>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob([invoiceHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Invoice_${invoiceData.invoiceNumber}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
