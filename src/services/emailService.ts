import nodemailer from 'nodemailer';
import { CheckoutFormData } from '@/components/Checkout/CheckoutForm';

interface SendOrderEmailProps {
  pdfBuffer: Buffer;
  customerInfo: CheckoutFormData;
  orderNumber: string;
}

export const sendOrderEmail = async ({
  pdfBuffer,
  customerInfo,
  orderNumber
}: SendOrderEmailProps) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // Email to owner
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: 'catering@hardal.de',
    subject: `Neue Bestellung #${orderNumber}`,
    html: `
      <h2>Neue Bestellung eingegangen</h2>
      <p>Bestellnummer: ${orderNumber}</p>
      <h3>Kundeninformationen:</h3>
      <p>
        Name: ${customerInfo.firstName} ${customerInfo.lastName}<br>
        Email: ${customerInfo.email}<br>
        Telefon: ${customerInfo.phone}<br>
        Adresse: ${customerInfo.address}<br>
        ${customerInfo.postalCode} ${customerInfo.city}
      </p>
    `,
    attachments: [{
      filename: `Bestellung-${orderNumber}.pdf`,
      content: pdfBuffer
    }]
  });

  // Email to customer
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: customerInfo.email,
    subject: `Ihre Bestellung #${orderNumber} bei Hardal Restaurant`,
    html: `
      <h2>Vielen Dank für Ihre Bestellung!</h2>
      <p>Ihre Bestellnummer: ${orderNumber}</p>
      <p>Wir werden uns in Kürze bei ihnen Melden und ihre Bestellung bestätigen.</p>
    `,
    attachments: [{
      filename: `Bestellung-${orderNumber}.pdf`,
      content: pdfBuffer
    }]
  });
}; 