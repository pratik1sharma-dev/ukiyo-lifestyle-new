# Email Notifications Setup Guide

## Overview
This guide explains how to set up email notifications for admin order alerts in the Ukiyo Lifestyle e-commerce platform.

## Features Implemented
- ✅ Admin email notifications when new orders are placed
- ✅ Professional HTML email templates
- ✅ Fallback text-only emails
- ✅ Error handling (doesn't break order flow if email fails)
- ✅ Works with both database and mock order systems

## Email Configuration

### 1. Gmail Setup (Recommended)

#### Step 1: Enable 2-Step Verification
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to Security → 2-Step Verification
3. Enable 2-Step Verification if not already enabled

#### Step 2: Generate App Password
1. Go to Security → App Passwords
2. Select "Mail" as the app
3. Generate a new app password
4. Copy the 16-character password

#### Step 3: Update Environment Variables
Edit `backend/env.local` and `backend/env.atlas`:

```bash
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM=noreply@ukiyolifestyle.com
ADMIN_EMAIL=admin@ukiyo.com
```

### 2. Alternative Email Providers

You can use other email providers by updating the configuration:

```bash
# For Outlook/Hotmail
EMAIL_SERVICE=outlook
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-app-password

# For Custom SMTP
EMAIL_SERVICE=smtp
EMAIL_HOST=smtp.yourprovider.com
EMAIL_PORT=587
EMAIL_USER=your-email@domain.com
EMAIL_PASSWORD=your-password
```

## Testing Email Configuration

### Run Email Test
```bash
cd backend
node test-email.js
```

### Expected Output
```
🧪 Testing Email Service...
1. Testing email connection...
✅ Email service connected successfully

2. Testing admin notification...
✅ Admin notification test completed

🎉 Email service is working correctly!
```

### Troubleshooting

#### Connection Failed
- ✅ Check if Gmail App Password is correct
- ✅ Ensure 2-Step Verification is enabled
- ✅ Verify EMAIL_USER and ADMIN_EMAIL are correct
- ✅ Check if Gmail account has "Less secure app access" enabled

#### Email Not Received
- ✅ Check spam/junk folder
- ✅ Verify ADMIN_EMAIL address is correct
- ✅ Check Gmail account settings

## How It Works

### 1. Order Creation Flow
When a customer places an order:

1. Order is created in database/mock storage
2. Admin notification email is sent automatically
3. Order processing continues regardless of email success/failure

### 2. Email Content
Admin notifications include:
- Order number and date
- Customer details
- Order items with images
- Shipping address
- Total amount
- Payment method

### 3. Email Templates
- **HTML Version**: Professional, branded email with styling
- **Text Version**: Plain text fallback for email clients that don't support HTML

## Production Deployment

### Railway (Backend)
1. Add email environment variables in Railway dashboard
2. Use the same configuration as `backend/env.atlas`

### Vercel (Frontend)
No email configuration needed on frontend

## Security Notes

- ✅ App passwords are more secure than regular passwords
- ✅ Email notifications don't contain sensitive payment information
- ✅ Failed emails don't break order processing
- ✅ Admin email address is configurable

## Customization

### Change Admin Email
Update `ADMIN_EMAIL` in environment files:
```bash
ADMIN_EMAIL=your-admin@yourdomain.com
```

### Multiple Admin Recipients
To send to multiple admins, modify `emailService.js`:
```javascript
const adminEmails = process.env.ADMIN_EMAIL.split(',');
// Send to each admin email
```

### Custom Email Templates
Edit the HTML/text templates in `backend/services/emailService.js`:
- `generateAdminOrderNotificationHTML()`
- `generateAdminOrderNotificationText()`

## Support

If you encounter issues:
1. Run the email test script: `node test-email.js`
2. Check the troubleshooting section above
3. Verify Gmail account settings
4. Contact support if problems persist 