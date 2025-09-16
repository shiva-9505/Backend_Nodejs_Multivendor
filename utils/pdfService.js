// const PDFDocument = require('pdfkit');
// const fs = require('fs');
// const path = require('path');

// const generateOrderPDF = (order, firmName,vendorEmail) => {
//   return new Promise((resolve, reject) => {
//     const doc = new PDFDocument();
//     const filename = `Order_${order.customOrderId}.pdf`;
//     const outputPath = path.join(__dirname, '..', 'orders', filename);

//     const writeStream = fs.createWriteStream(outputPath);
//     doc.pipe(writeStream);

//     doc.fontSize(20).text('Order Confirmation', { align: 'center' });
//     doc.moveDown();

//     doc.fontSize(14).text(`Order ID: ${order.customOrderId}`);
//     doc.text(`Order Date: ${new Date(order.createdAt).toLocaleString()}`);
//     doc.text(`Vendor: ${firmName}`);
//     doc.text(`Mail: ${vendorEmail}`)
//     doc.moveDown();

//     doc.fontSize(16).text('Customer Details:', { underline: true });
//     doc.fontSize(14).text(`Name: ${order.user.name}`);
//     doc.text(`Email: ${order.user.email}`);
//     doc.text(`Mobile: ${order.user.mobile}`);
//     doc.moveDown();

//     doc.fontSize(16).text('Order Items:', { underline: true });
//     order.items.forEach((item, index) => {
//       doc.fontSize(14).text(`${index + 1}. ${item.productName} x ${item.quantity} - ₹${item.price}`);
//     });
//     doc.moveDown();

//     doc.fontSize(14).text(`Total Amount: ₹${order.totalAmount}`, { bold: true });

//     doc.end();

//     writeStream.on('finish', () => {
//       resolve(outputPath);
//     });

//     writeStream.on('error', (err) => {
//       reject(err);
//     });
//   });
// };

// module.exports = { generateOrderPDF };

// const PDFDocument = require('pdfkit');
// const fs = require('fs');
// const path = require('path');
// const qr = require('qr-image');

// const generateOrderPDF = (order, firmName, vendorEmail) => {
//   return new Promise((resolve, reject) => {
//     const doc = new PDFDocument({ size: 'A4', margin: 40 });
//     const filename = `Order_${order.customOrderId}.pdf`;
//     const outputPath = path.join(__dirname, '..', 'orders', filename);
//     const writeStream = fs.createWriteStream(outputPath);

//     doc.pipe(writeStream);

//     // Load a Unicode-safe font (like DejaVu or Roboto)
//     const fontPath = path.join(__dirname, 'utils', 'Roboto-VariableFont_wdth,wght.ttf'); // place the .ttf file inside /fonts
//     if (fs.existsSync(fontPath)) {
//       doc.font(fontPath);
//     }

//     const trackingUrl = `${order.customOrderId}`;
//     const qrImage = qr.imageSync(trackingUrl, { type: 'png' });

//     const sectionSpacing = 20;
//     const lineHeight = 16;

//     // HEADER
//     doc
//       .fontSize(22)
//       .fillColor('#2E86DE')
//       .text('ORDER CONFIRMATION', { align: 'center' })
//       .moveDown(1);

//     // ORDER DETAILS
//     doc
//       .fillColor('#000')
//       .fontSize(12)
//       .text(`Order ID: ${order.customOrderId}`)
//       .text(`Order Date: ${new Date(order.createdAt).toLocaleString()}`)
//       .text(`Vendor: ${firmName}`)
//       .text(`Vendor Email: ${vendorEmail}`)
//       .moveDown();

//     // CUSTOMER DETAILS BOX
//     doc
//       .fontSize(14)
//       .fillColor('#2E86DE')
//       .text('Customer Details', { underline: true });

//     doc
//       .fillColor('#000')
//       .fontSize(12)
//       .text(`Name: ${order.user.name}`)
//       .text(`Email: ${order.user.email}`)
//       .text(`Mobile: ${order.user.mobile}`)
//       .moveDown();

//     // ORDER ITEMS
//     doc
//       .fontSize(14)
//       .fillColor('#2E86DE')
//       .text('Order Items', { underline: true });

//     doc
//       .fillColor('#000')
//       .fontSize(12);

//     order.items.forEach((item, index) => {
//       const total = item.price * item.quantity;
//       doc.text(`${index + 1}. ${item.productName} x ${item.quantity} = ₹${total}`);
//     });

//     doc.moveDown();

//     // PRICING
//     const tax = order.tax || 0;
//     const delivery = order.deliveryCharge || 0;
//     const subtotal = order.totalAmount - tax - delivery;

//     doc
//       .fontSize(14)
//       .fillColor('#2E86DE')
//       .text('Pricing Breakdown', { underline: true });

//     doc
//       .fillColor('#000')
//       .fontSize(12)
//       .text(`Subtotal: ₹${subtotal.toFixed(2)}`)
//       .text(`Tax: ₹${tax.toFixed(2)}`)
//       .text(`Delivery Charge: ₹${delivery.toFixed(2)}`)
//       .text(`Total: ₹${order.totalAmount.toFixed(2)}`)
//       .moveDown();

//     // TRACKING QR
//     doc
//       .fontSize(14)
//       .fillColor('#2E86DE')
//       .text('Live Order Tracking', { underline: true });

//     doc.image(qrImage, {
//       fit: [100, 100],
//       align: 'left',
//     });

//     doc
//       .fontSize(10)
//       .fillColor('blue')
//       .text(trackingUrl, { link: trackingUrl, underline: true })
//       .moveDown();

//     doc.end();

//     writeStream.on('finish', () => resolve(outputPath));
//     writeStream.on('error', (err) => reject(err));
//   });
// };

// module.exports = { generateOrderPDF };
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateOrderPDF = (order, firmName, vendorEmail) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const outputPath = path.join(__dirname, '..', 'orders', `Order_${order.customOrderId}.pdf`);
    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

    // Load custom font (optional, use default if not found)
    const fontPath = path.join(__dirname, '../utils/Roboto-VariableFont_wdth,wght.ttf');
    if (fs.existsSync(fontPath)) {
      doc.font(fontPath);
    }

    const red = '#A93226';
    const lightGray = '#F2F3F4';

    // Header
    doc.rect(40, 40, 515, 40).fill(red);
    doc.fillColor('white').fontSize(18).text('HUNGRYPLATE', 50, 50);
    doc.fontSize(14).text('Service Order Confirmation', 350, 50, { align: 'right' });

    doc.moveDown(2);
    doc.fillColor('black').fontSize(11);

    // Order Info
    const startY = 100;
    doc.text(`Order Number:`, 400, startY);
    doc.text(`${order.customOrderId}`,400, startY+15);
    doc.text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`, 400, startY + 30);

    // Billing & Shipping
    doc.fontSize(12).text('Billing Information', 50, startY + 50);
    doc.fontSize(10)
      .text(`Name: ${order.user.name}`, 50)
      .text(`Phone: ${order.user.mobile}`, 50)
      .text(`Email: ${order.user.email}`, 50)
      .text(`Address: Not Provided`, 50); // Modify if address available

    doc.fontSize(12).text('Shipping Information', 300, startY + 50);
    doc.fontSize(10)
      .text(`Name: ${order.user.name}`, 300)
      .text(`Phone: ${order.user.mobile}`, 300)
      .text(`Email: ${order.user.email}`, 300)
      .text(`Address: Not Provided`, 300);

    doc.moveDown(2);

    // Table Header
    const tableTop = doc.y + 10;
    const colWidths = [60, 120, 60, 40, 60, 60, 70];
    const headers = ['Code', 'Item', 'UOM', 'Qty', 'Price', 'Disc', 'Total'];

    let x = 50;
    doc.fillColor(red).fontSize(10).fillColor('white');
    headers.forEach((h, i) => {
      doc.rect(x, tableTop, colWidths[i], 20).fill(red).stroke();
      doc.fillColor('white').text(h, x + 5, tableTop + 5);
      x += colWidths[i];
    });

    // Table Rows
    doc.fontSize(10).fillColor('black');
    let y = tableTop + 20;
    order.items.forEach((item, idx) => {
      let x = 50;
      const itemTotal = item.price * item.quantity;
      const discount = item.discount || '0%';

      const row = [
        `B00${idx + 1}`,
        item.productName,
        'Each',
        item.quantity,
        `₹${item.price}`,
        discount,
        `₹${itemTotal}`,
      ];

      row.forEach((text, i) => {
        doc.rect(x, y, colWidths[i], 20).stroke();
        doc.text(text, x + 5, y + 5);
        x += colWidths[i];
      });
      y += 20;
    });

    // Totals
    const tax = order.tax || 0;
    const delivery = order.deliveryCharge || 0;
    const subtotal = order.totalAmount - tax - delivery;
    const grandTotal = order.totalAmount;

    y += 30;
    doc.fontSize(10)
      .text(`Sub Total: ₹${subtotal.toFixed(2)}`, 400, y)
      .text(`Tax: ₹${tax.toFixed(2)}`, 400, y + 15)
      .fontSize(12)
      .fillColor(red)
      .text(`Grand Total: ₹${grandTotal.toFixed(2)}`, 400, y + 35)
      .fillColor('black');

    // Payment Method
    doc.fontSize(10)
      .text(`Payment History: Payment done through [Cash On Delivery]`, 50, y + 60)
      // .text(`[Cash on Delivery]`, 50, y + 75);

    // Footer
    doc.fontSize(10).fillColor(red).text('Thank you for your order!!', 50, y + 100);

    doc.end();

    writeStream.on('finish', () => resolve(outputPath));
    writeStream.on('error', reject);
  });
};

module.exports = { generateOrderPDF };
