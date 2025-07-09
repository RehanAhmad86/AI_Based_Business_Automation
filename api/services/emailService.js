import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "EXISTS" : "MISSING");

export const sendOrderEmail = async ({
  to,
  supplierName,
  productName,
  category,
  quantity,
  notes,
}) => {
  const sanitizedSupplierName = supplierName.replace(/[<>]/g, "");
  const sanitizedProductName = productName.replace(/[<>]/g, "");
  const sanitizedCategory = category.replace(/[<>]/g, "");
  const sanitizedNotes = notes ? notes.replace(/[<>]/g, "") : "";

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: `New Order Request - ${sanitizedProductName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #333333; line-height: 1.6;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 32px 24px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">
            Order Request
          </h1>
          <p style="color: #e2e8f0; margin: 8px 0 0; font-size: 14px; opacity: 0.9;">
            Reference: ORD-${Date.now().toString().slice(-6)}
          </p>
        </div>

        <!-- Content -->
        <div style="padding: 32px 24px; background-color: #ffffff;">
          <p style="margin: 0 0 24px; font-size: 16px; color: #2d3748;">
            Dear <strong>${sanitizedSupplierName}</strong>,
          </p>
          
          <p style="margin: 0 0 24px; font-size: 16px; color: #4a5568;">
            We would like to place an order for the following item and would appreciate your prompt attention to this request.
          </p>

          <!-- Order Details Card -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; margin: 24px 0;">
            <h3 style="margin: 0 0 16px; color: #2d3748; font-size: 18px; font-weight: 600; border-bottom: 2px solid #667eea; padding-bottom: 8px; display: inline-block;">
              Order Details
            </h3>
            
            <div style="display: grid; gap: 12px;">
              <div style="display: flex; align-items: center; padding: 8px 0;">
                <span style="font-weight: 600; color: #4a5568; min-width: 80px; display: inline-block;">Product:</span>
                <span style="color: #2d3748; font-size: 15px;">${sanitizedProductName}</span>
              </div>
              
              <div style="display: flex; align-items: center; padding: 8px 0;">
                <span style="font-weight: 600; color: #4a5568; min-width: 80px; display: inline-block;">Category:</span>
                <span style="color: #2d3748; font-size: 15px;">${sanitizedCategory}</span>
              </div>
              
              <div style="display: flex; align-items: center; padding: 8px 0;">
                <span style="font-weight: 600; color: #4a5568; min-width: 80px; display: inline-block;">Quantity:</span>
                <span style="color: #2d3748; font-size: 15px; font-weight: 600;">${quantity} units</span>
              </div>
              
              ${sanitizedNotes ? `
                <div style="margin-top: 8px; padding: 16px; background-color: #edf2f7; border-radius: 6px; border-left: 4px solid #667eea;">
                  <span style="font-weight: 600; color: #4a5568; display: block; margin-bottom: 8px;">Additional Notes:</span>
                  <span style="color: #2d3748; font-size: 15px;">${sanitizedNotes}</span>
                </div>
              ` : ""}
            </div>
          </div>

          <p style="margin: 24px 0 16px; font-size: 16px; color: #4a5568;">
            Please confirm the availability and provide us with:
          </p>
          <ul style="margin: 0 0 24px; padding-left: 24px; color: #4a5568; font-size: 15px; line-height: 1.6;">
            <li>Delivery timeline</li>
            <li>Total cost</li>
            <li>Any additional terms</li>
          </ul>

          <p style="margin: 24px 0 0; font-size: 16px; color: #4a5568;">
            Thank you for your continued partnership and prompt attention to this request.
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; font-size: 16px; color: #2d3748; font-weight: 500;">
            Best regards,
          </p>
          <p style="margin: 8px 0 0; font-size: 14px; color: #667eea; font-weight: 600;">
            Inventory Management System
          </p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};