import { Order } from "../types";

export function generateInvoiceHtml(order: Order): string {
  const dateFormatted = new Date(order.date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const invoiceNum = order.invoiceNumber || `INV-${order.id.replace(/[^A-Z0-9]/gi, "")}`;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>ILens Tax Invoice - ${order.id}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #171717; margin: 0; padding: 40px; background: #fff; line-height: 1.5; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e5e5e5; padding-bottom: 24px; margin-bottom: 24px; }
          .logo { font-size: 28px; font-weight: 900; letter-spacing: -1px; color: #0a0a0a; }
          .logo span { color: #f59e0b; }
          .badge { display: inline-block; padding: 4px 12px; background: #ecfdf5; color: #047857; font-weight: 700; border-radius: 9999px; font-size: 12px; text-transform: uppercase; border: 1px solid #a7f3d0; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; }
          .card { background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 12px; padding: 16px; font-size: 13px; }
          .card h4 { margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px; }
          th { text-align: left; padding: 12px; background: #f3f4f6; border-bottom: 1px solid #e5e5e5; font-weight: 700; color: #374151; }
          td { padding: 12px; border-bottom: 1px solid #f3f4f6; }
          .text-right { text-align: right; }
          .totals { width: 300px; margin-left: auto; font-size: 13px; }
          .totals .row { display: flex; justify-content: space-between; padding: 6px 0; }
          .totals .total-row { border-top: 2px solid #171717; font-size: 16px; font-weight: 800; padding-top: 12px; margin-top: 6px; }
          .footer { margin-top: 48px; border-top: 1px solid #e5e5e5; padding-top: 24px; text-align: center; font-size: 12px; color: #6b7280; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 20px; text-align: right;">
          <button onclick="window.print()" style="background: #171717; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; cursor: pointer;">
            🖨️ Print / Download Invoice PDF
          </button>
        </div>

        <div class="header">
          <div>
            <div class="logo">ILENS<span>.</span></div>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">Certified Precision Optical Craftsmen</p>
            <p style="margin: 2px 0 0 0; font-size: 11px; color: #9ca3af;">GSTIN: 27AABCU9603R1ZM | CIN: U52399MH2026PTC384910</p>
          </div>
          <div class="text-right">
            <h2 style="margin: 0; font-size: 20px; font-weight: 800;">TAX INVOICE</h2>
            <p style="margin: 4px 0; font-size: 13px; font-weight: 700; color: #374151;">Invoice #: ${invoiceNum}</p>
            <p style="margin: 0; font-size: 12px; color: #6b7280;">Date: ${dateFormatted}</p>
            <div style="margin-top: 8px;">
              <span class="badge">${order.paymentStatus}</span>
            </div>
          </div>
        </div>

        <div class="grid">
          <div class="card">
            <h4>Billed & Shipped To</h4>
            <p style="font-weight: 700; margin: 0 0 4px 0; font-size: 14px;">${order.shippingAddress.fullName}</p>
            <p style="margin: 0;">${order.shippingAddress.street}${order.shippingAddress.street2 ? `, ${order.shippingAddress.street2}` : ''}</p>
            <p style="margin: 0;">${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.zip}</p>
            <p style="margin: 0;">${order.shippingAddress.country}</p>
            <p style="margin: 4px 0 0 0; color: #4b5563;">Phone: ${order.shippingAddress.phone}</p>
            <p style="margin: 0; color: #4b5563;">Email: ${order.customerEmail}</p>
          </div>

          <div class="card">
            <h4>Order & Logistics Summary</h4>
            <p style="margin: 0 0 4px 0;"><strong>Order ID:</strong> ${order.id}</p>
            <p style="margin: 0 0 4px 0;"><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            <p style="margin: 0 0 4px 0;"><strong>Delivery Option:</strong> ${order.deliveryMethod?.name || 'Standard Express'}</p>
            <p style="margin: 0 0 4px 0;"><strong>Estimated Delivery:</strong> ${order.estimatedDelivery}</p>
            ${order.trackingNumber ? `<p style="margin: 0; color: #047857;"><strong>AWB Tracking:</strong> ${order.trackingNumber} (${order.courierPartner || 'BlueDart'})</p>` : ''}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item & Lens Details</th>
              <th class="text-right">Unit Price</th>
              <th class="text-right">Qty</th>
              <th class="text-right">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>
                  <strong style="font-size: 14px;">${item.product.name}</strong>
                  <div style="font-size: 11px; color: #6b7280; margin-top: 2px;">
                    Color: ${item.selectedColor.name} | Frame Size: ${item.product.dimensions?.sizeCategory || 'Medium'}
                  </div>
                  ${item.lensConfig ? `
                    <div style="font-size: 11px; color: #b45309; margin-top: 2px; font-weight: 600;">
                      Lens: ${item.lensConfig.usageLabel} (${item.lensConfig.indexLabel})
                    </div>
                  ` : ''}
                </td>
                <td class="text-right">₹${Math.round(item.totalItemPrice / item.quantity).toLocaleString("en-IN")}</td>
                <td class="text-right">${item.quantity}</td>
                <td class="text-right" style="font-weight: 700;">₹${Math.round(item.totalItemPrice).toLocaleString("en-IN")}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <div class="row">
            <span>Subtotal:</span>
            <span>₹${Math.round(order.subtotal).toLocaleString("en-IN")}</span>
          </div>
          ${order.discount > 0 ? `
            <div class="row" style="color: #b45309;">
              <span>Discount (${order.couponCode || 'Promo'}):</span>
              <span>-₹${Math.round(order.discount).toLocaleString("en-IN")}</span>
            </div>
          ` : ''}
          <div class="row">
            <span>Shipping Fee:</span>
            <span>${order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
          </div>
          <div class="row" style="color: #6b7280;">
            <span>Estimated GST (18% Incl.):</span>
            <span>₹${Math.round(order.tax || (order.subtotal * 0.18)).toLocaleString("en-IN")}</span>
          </div>
          <div class="row total-row">
            <span>Grand Total:</span>
            <span>₹${Math.round(order.total).toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for choosing ILens. All prescription lenses are custom-manufactured in our ISO-certified optical laboratory.</p>
          <p style="margin-top: 4px;">For support or warranty claims, contact support@ilens.com or call 1800-555-ILENS.</p>
        </div>
      </body>
    </html>
  `;
}

export function printOrderInvoice(order: Order) {
  const html = generateInvoiceHtml(order);
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
}
