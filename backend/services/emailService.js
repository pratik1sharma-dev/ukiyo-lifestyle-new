const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  // Initialize email transporter
  initializeTransporter() {
    // Gmail configuration (can be changed to other providers)
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your-app-password'
      }
    });

    // Alternative SMTP configuration
    // this.transporter = nodemailer.createTransport({
    //   host: process.env.SMTP_HOST || 'smtp.gmail.com',
    //   port: process.env.SMTP_PORT || 587,
    //   secure: false,
    //   auth: {
    //     user: process.env.SMTP_USER,
    //     pass: process.env.SMTP_PASSWORD
    //   }
    // });
  }

  // Verify email configuration
  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Email service connected successfully');
      return true;
    } catch (error) {
      console.error('❌ Email service connection failed:', error.message);
      return false;
    }
  }

  // Send order confirmation email
  async sendOrderConfirmation(order) {
    try {
      const emailContent = this.generateOrderConfirmationHTML(order);
      
      const mailOptions = {
        from: {
          name: 'Ukiyo Lifestyle',
          address: process.env.EMAIL_FROM || 'noreply@ukiyolifestyle.com'
        },
        to: order.email,
        subject: `Order Confirmation - ${order.orderNumber}`,
        html: emailContent,
        text: this.generateOrderConfirmationText(order)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Order confirmation email sent to ${order.email}`);
      return result;
    } catch (error) {
      console.error('❌ Failed to send order confirmation email:', error.message);
      throw error;
    }
  }

  // Send order status update email
  async sendOrderStatusUpdate(order, previousStatus) {
    try {
      const emailContent = this.generateStatusUpdateHTML(order, previousStatus);
      
      const mailOptions = {
        from: {
          name: 'Ukiyo Lifestyle',
          address: process.env.EMAIL_FROM || 'noreply@ukiyolifestyle.com'
        },
        to: order.email,
        subject: `Order Update - ${order.orderNumber}`,
        html: emailContent,
        text: this.generateStatusUpdateText(order, previousStatus)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Order status update email sent to ${order.email}`);
      return result;
    } catch (error) {
      console.error('❌ Failed to send order status update email:', error.message);
      throw error;
    }
  }

  // Send shipping notification email
  async sendShippingNotification(order) {
    try {
      const emailContent = this.generateShippingNotificationHTML(order);
      
      const mailOptions = {
        from: {
          name: 'Ukiyo Lifestyle',
          address: process.env.EMAIL_FROM || 'noreply@ukiyolifestyle.com'
        },
        to: order.email,
        subject: `Your Order is Shipped - ${order.orderNumber}`,
        html: emailContent,
        text: this.generateShippingNotificationText(order)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Shipping notification email sent to ${order.email}`);
      return result;
    } catch (error) {
      console.error('❌ Failed to send shipping notification email:', error.message);
      throw error;
    }
  }

  // Send admin notification for new order
  async sendAdminOrderNotification(order) {
    try {
      const emailContent = this.generateAdminOrderNotificationHTML(order);
      
      const mailOptions = {
        from: {
          name: 'Ukiyo Lifestyle',
          address: process.env.EMAIL_FROM || 'noreply@ukiyolifestyle.com'
        },
        to: process.env.ADMIN_EMAIL || 'admin@ukiyo.com',
        subject: `🆕 New Order Received - ${order.orderNumber}`,
        html: emailContent,
        text: this.generateAdminOrderNotificationText(order)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Admin notification email sent for order ${order.orderNumber}`);
      return result;
    } catch (error) {
      console.error('❌ Failed to send admin notification email:', error.message);
      // Don't throw error to avoid breaking order flow
      console.log('⚠️ Admin notification failed, but order processing continues');
    }
  }

  // Generate order confirmation HTML
  generateOrderConfirmationHTML(order) {
    const itemsHTML = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <img src="${item.productImage}" alt="${item.productName}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${item.productName}</strong><br>
          Quantity: ${item.quantity}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          ₹${item.totalPrice.toLocaleString('en-IN')}
        </td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
      </head>
      <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Ukiyo Lifestyle</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Thank you for your order!</p>
          </div>

          <!-- Order Details -->
          <div style="padding: 30px;">
            <h2 style="color: #333; margin-top: 0;">Order Confirmation</h2>
            <p style="color: #666; line-height: 1.6;">
              Hi ${order.shippingAddress.firstName},<br>
              Your order has been confirmed and is being processed. Here are your order details:
            </p>

            <!-- Order Info -->
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 5px 0;"><strong>Order Number:</strong></td>
                  <td style="padding: 5px 0; text-align: right;">${order.orderNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;"><strong>Order Date:</strong></td>
                  <td style="padding: 5px 0; text-align: right;">${new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;"><strong>Payment Method:</strong></td>
                  <td style="padding: 5px 0; text-align: right;">${order.paymentMethod.toUpperCase()}</td>
                </tr>
              </table>
            </div>

            <!-- Items -->
            <h3 style="color: #333; margin-top: 30px;">Order Items</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              ${itemsHTML}
            </table>

            <!-- Pricing -->
            <div style="border-top: 2px solid #eee; padding-top: 20px; margin-top: 20px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 5px 0;">Subtotal:</td>
                  <td style="padding: 5px 0; text-align: right;">₹${order.pricing.subtotal.toLocaleString('en-IN')}</td>
                </tr>
                ${order.pricing.discount > 0 ? `
                <tr>
                  <td style="padding: 5px 0; color: #28a745;">Discount:</td>
                  <td style="padding: 5px 0; text-align: right; color: #28a745;">-₹${order.pricing.discount.toLocaleString('en-IN')}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 5px 0;">Shipping:</td>
                  <td style="padding: 5px 0; text-align: right;">₹${order.pricing.shippingCost.toLocaleString('en-IN')}</td>
                </tr>
                <tr style="border-top: 1px solid #ddd;">
                  <td style="padding: 10px 0; font-size: 18px; font-weight: bold;">Total:</td>
                  <td style="padding: 10px 0; text-align: right; font-size: 18px; font-weight: bold;">₹${order.pricing.total.toLocaleString('en-IN')}</td>
                </tr>
              </table>
            </div>

            <!-- Shipping Address -->
            <h3 style="color: #333; margin-top: 30px;">Shipping Address</h3>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px;">
              <p style="margin: 0; line-height: 1.6;">
                ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
                ${order.shippingAddress.street}<br>
                ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}<br>
                Phone: ${order.shippingAddress.phone}
              </p>
            </div>

            <!-- Next Steps -->
            <div style="margin-top: 30px; padding: 20px; background-color: #e3f2fd; border-radius: 6px;">
              <h4 style="margin-top: 0; color: #1976d2;">What's Next?</h4>
              <ul style="margin: 0; padding-left: 20px; color: #666;">
                <li>We'll process your order within 1-2 business days</li>
                <li>You'll receive a shipping confirmation with tracking details</li>
                <li>Estimated delivery: 3-7 business days</li>
              </ul>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              Need help? Contact us at <a href="mailto:support@ukiyolifestyle.com" style="color: #667eea;">support@ukiyolifestyle.com</a>
            </p>
            <p style="margin: 10px 0 0 0; color: #999; font-size: 12px;">
              © 2025 Ukiyo Lifestyle. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Generate order confirmation text
  generateOrderConfirmationText(order) {
    const itemsText = order.items.map(item => 
      `${item.productName} (Qty: ${item.quantity}) - ₹${item.totalPrice.toLocaleString('en-IN')}`
    ).join('\n');

    return `
UKIYO LIFESTYLE - ORDER CONFIRMATION

Hi ${order.shippingAddress.firstName},

Thank you for your order! Here are your order details:

Order Number: ${order.orderNumber}
Order Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}
Payment Method: ${order.paymentMethod.toUpperCase()}

ORDER ITEMS:
${itemsText}

PRICING:
Subtotal: ₹${order.pricing.subtotal.toLocaleString('en-IN')}
${order.pricing.discount > 0 ? `Discount: -₹${order.pricing.discount.toLocaleString('en-IN')}\n` : ''}Shipping: ₹${order.pricing.shippingCost.toLocaleString('en-IN')}
Total: ₹${order.pricing.total.toLocaleString('en-IN')}

SHIPPING ADDRESS:
${order.shippingAddress.firstName} ${order.shippingAddress.lastName}
${order.shippingAddress.street}
${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}
Phone: ${order.shippingAddress.phone}

We'll process your order within 1-2 business days and send you tracking details.

Need help? Contact us at support@ukiyolifestyle.com

© 2025 Ukiyo Lifestyle. All rights reserved.
    `;
  }

  // Generate status update HTML
  generateStatusUpdateHTML(order, previousStatus) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Status Update</title>
      </head>
      <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Ukiyo Lifestyle</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Order Status Update</p>
          </div>

          <!-- Status Update -->
          <div style="padding: 30px;">
            <h2 style="color: #333; margin-top: 0;">Order #${order.orderNumber}</h2>
            <p style="color: #666; line-height: 1.6;">
              Hi ${order.shippingAddress.firstName},<br>
              Your order status has been updated:
            </p>

            <div style="background-color: #e8f5e8; border-left: 4px solid #28a745; padding: 20px; margin: 20px 0; border-radius: 0 6px 6px 0;">
              <p style="margin: 0; font-size: 18px; color: #155724;">
                <strong>Status:</strong> ${order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
              </p>
              ${previousStatus ? `<p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">Previous status: ${previousStatus}</p>` : ''}
            </div>

            ${order.orderStatus === 'shipped' && order.shipping.trackingNumber ? `
            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 20px 0; border-radius: 0 6px 6px 0;">
              <p style="margin: 0; color: #856404;">
                <strong>Tracking Number:</strong> ${order.shipping.trackingNumber}<br>
                <strong>Courier Partner:</strong> ${order.shipping.courierPartner}
              </p>
            </div>
            ` : ''}
          </div>

          <!-- Footer -->
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              Need help? Contact us at <a href="mailto:support@ukiyolifestyle.com" style="color: #667eea;">support@ukiyolifestyle.com</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Generate status update text
  generateStatusUpdateText(order, previousStatus) {
    return `
UKIYO LIFESTYLE - ORDER STATUS UPDATE

Hi ${order.shippingAddress.firstName},

Your order #${order.orderNumber} status has been updated:

Status: ${order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
${previousStatus ? `Previous status: ${previousStatus}\n` : ''}
${order.orderStatus === 'shipped' && order.shipping.trackingNumber ? `
Tracking Number: ${order.shipping.trackingNumber}
Courier Partner: ${order.shipping.courierPartner}
` : ''}

Need help? Contact us at support@ukiyolifestyle.com

© 2025 Ukiyo Lifestyle. All rights reserved.
    `;
  }

  // Generate shipping notification HTML
  generateShippingNotificationHTML(order) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Shipped</title>
      </head>
      <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">📦 Order Shipped!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your order is on its way</p>
          </div>

          <!-- Shipping Details -->
          <div style="padding: 30px;">
            <h2 style="color: #333; margin-top: 0;">Order #${order.orderNumber}</h2>
            <p style="color: #666; line-height: 1.6;">
              Hi ${order.shippingAddress.firstName},<br>
              Great news! Your order has been shipped and is on its way to you.
            </p>

            <div style="background-color: #d4edda; border-left: 4px solid #28a745; padding: 20px; margin: 20px 0; border-radius: 0 6px 6px 0;">
              <p style="margin: 0; color: #155724;">
                <strong>Tracking Number:</strong> ${order.shipping.trackingNumber}<br>
                <strong>Courier Partner:</strong> ${order.shipping.courierPartner}<br>
                <strong>Shipped Date:</strong> ${new Date(order.shipping.shippedAt).toLocaleDateString('en-IN')}
                ${order.shipping.estimatedDelivery ? `<br><strong>Estimated Delivery:</strong> ${new Date(order.shipping.estimatedDelivery).toLocaleDateString('en-IN')}` : ''}
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="#" style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Track Your Order</a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              Need help? Contact us at <a href="mailto:support@ukiyolifestyle.com" style="color: #667eea;">support@ukiyolifestyle.com</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Generate shipping notification text
  generateShippingNotificationText(order) {
    return `
UKIYO LIFESTYLE - ORDER SHIPPED

Hi ${order.shippingAddress.firstName},

Great news! Your order #${order.orderNumber} has been shipped.

SHIPPING DETAILS:
Tracking Number: ${order.shipping.trackingNumber}
Courier Partner: ${order.shipping.courierPartner}
Shipped Date: ${new Date(order.shipping.shippedAt).toLocaleDateString('en-IN')}
${order.shipping.estimatedDelivery ? `Estimated Delivery: ${new Date(order.shipping.estimatedDelivery).toLocaleDateString('en-IN')}\n` : ''}

You can track your order using the tracking number provided.

Need help? Contact us at support@ukiyolifestyle.com

© 2025 Ukiyo Lifestyle. All rights reserved.
    `;
  }

  // Generate admin order notification HTML
  generateAdminOrderNotificationHTML(order) {
    const itemsHTML = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <img src="${item.productImage}" alt="${item.productName}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${item.productName}</strong><br>
          Quantity: ${item.quantity}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          ₹${item.totalPrice.toLocaleString('en-IN')}
        </td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Order Notification</title>
      </head>
      <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Ukiyo Lifestyle</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">🆕 New Order Received!</p>
          </div>

          <!-- Order Details -->
          <div style="padding: 30px;">
            <h2 style="color: #333; margin-top: 0;">Order #${order.orderNumber}</h2>
            <p style="color: #666; line-height: 1.6;">
              A new order has been placed on your website. Here are the details:
            </p>

            <!-- Order Info -->
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 5px 0;"><strong>Order Number:</strong></td>
                  <td style="padding: 5px 0; text-align: right;">${order.orderNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;"><strong>Order Date:</strong></td>
                  <td style="padding: 5px 0; text-align: right;">${new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;"><strong>Payment Method:</strong></td>
                  <td style="padding: 5px 0; text-align: right;">${order.paymentMethod.toUpperCase()}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;"><strong>Total Amount:</strong></td>
                  <td style="padding: 5px 0; text-align: right;">₹${order.pricing.total.toLocaleString('en-IN')}</td>
                </tr>
              </table>
            </div>

            <!-- Items -->
            <h3 style="color: #333; margin-top: 30px;">Order Items</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              ${itemsHTML}
            </table>

            <!-- Shipping Address -->
            <h3 style="color: #333; margin-top: 30px;">Shipping Address</h3>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px;">
              <p style="margin: 0; line-height: 1.6;">
                ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
                ${order.shippingAddress.street}<br>
                ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}<br>
                Phone: ${order.shippingAddress.phone}
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              Need help? Contact us at <a href="mailto:support@ukiyolifestyle.com" style="color: #4f46e5;">support@ukiyolifestyle.com</a>
            </p>
            <p style="margin: 10px 0 0 0; color: #999; font-size: 12px;">
              © 2025 Ukiyo Lifestyle. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Generate admin order notification text
  generateAdminOrderNotificationText(order) {
    const itemsText = order.items.map(item => 
      `${item.productName} (Qty: ${item.quantity}) - ₹${item.totalPrice.toLocaleString('en-IN')}`
    ).join('\n');

    return `
UKIYO LIFESTYLE - NEW ORDER RECEIVED

A new order has been placed on your website. Here are the details:

Order Number: ${order.orderNumber}
Order Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}
Payment Method: ${order.paymentMethod.toUpperCase()}
Total Amount: ₹${order.pricing.total.toLocaleString('en-IN')}

ORDER ITEMS:
${itemsText}

SHIPPING ADDRESS:
${order.shippingAddress.firstName} ${order.shippingAddress.lastName}
${order.shippingAddress.street}
${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}
Phone: ${order.shippingAddress.phone}

Need help? Contact us at support@ukiyolifestyle.com

© 2025 Ukiyo Lifestyle. All rights reserved.
    `;
  }
}

module.exports = new EmailService();