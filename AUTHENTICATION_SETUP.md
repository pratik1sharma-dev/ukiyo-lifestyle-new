# 🔐 Authentication Setup Guide

This guide will help you set up the modern authentication system for Ukiyo Lifestyle with **Mobile OTP**, **Google OAuth**, and **Email/Password** login methods.

## 📱 **CURRENT AUTHENTICATION METHODS**

### **🥇 PRIMARY: Mobile OTP (SMS + WhatsApp)**
- **User Preference**: 65% in India
- **Benefits**: No passwords, instant verification, high trust
- **Providers**: Twilio (SMS + WhatsApp)

### **🥈 SECONDARY: Google OAuth**
- **User Preference**: 25% globally
- **Benefits**: One-click login, pre-filled profile data
- **Provider**: Google Identity Services

### **🥉 FALLBACK: Email + Password**
- **User Preference**: 10% (traditional users)
- **Benefits**: Works offline, full control
- **Provider**: Built-in JWT system

---

## 🚀 **QUICK START (Development)**

### **1. Clone and Install**
```bash
# Already done - you have the latest code!
git pull origin main
cd backend && npm install
cd ../frontend && npm install
```

### **2. Environment Setup**
```bash
# Backend (.env)
cp backend/.env.example backend/.env

# Frontend (.env.local)
cp frontend/env.example frontend/.env.local
```

### **3. Test in Development Mode**
```bash
# Start backend
cd backend && npm run dev

# Start frontend (new terminal)
cd frontend && npm run dev
```

**🎉 You can now test:**
- ✅ **Mobile OTP**: Works in mock mode (OTP logged to console)
- ✅ **Email Login**: Works with existing system
- ⚠️ **Google OAuth**: Needs Google Client ID (see setup below)

---

## 🔧 **PRODUCTION SETUP**

### **📱 1. TWILIO SETUP (Mobile OTP)**

#### **Create Twilio Account:**
1. Go to [Twilio Console](https://console.twilio.com/)
2. Sign up for free account
3. Get **$15 free credit** (enough for 1000+ OTPs)

#### **Get Credentials:**
```bash
# From Twilio Console Dashboard
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### **SMS Setup:**
1. Go to **Phone Numbers** → **Manage** → **Buy a number**
2. Choose a number (free with trial credit)
```bash
TWILIO_PHONE_NUMBER=+1234567890
```

#### **WhatsApp Setup (Optional):**
1. Go to **Messaging** → **Try it out** → **Send a WhatsApp message**
2. Use Twilio's sandbox number for testing:
```bash
TWILIO_WHATSAPP_NUMBER=+14155238886
```

#### **Production WhatsApp (Later):**
- Apply for WhatsApp Business API approval
- Takes 2-3 weeks for approval
- For now, SMS + sandbox WhatsApp works perfectly

---

### **🔍 2. GOOGLE OAUTH SETUP**

#### **Create Google Cloud Project:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "Ukiyo Lifestyle Auth"
3. Enable **Google Identity Services API**

#### **Create OAuth Credentials:**
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client IDs**
3. Application type: **Web application**
4. Name: "Ukiyo Lifestyle Web"

#### **Configure URLs:**
```bash
# Authorized JavaScript origins
http://localhost:5173
https://your-domain.com

# Authorized redirect URIs
http://localhost:5173/login
https://your-domain.com/login
```

#### **Get Client ID:**
```bash
# Add to backend/.env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx

# Add to frontend/.env.local
VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
```

---

### **🗄️ 3. DATABASE UPDATES**

The User model has been updated to support new authentication methods:

```javascript
// New fields added to User schema:
{
  isPhoneVerified: Boolean,
  googleId: String,
  profilePicture: String
}
```

**Migration is automatic** - existing users will work fine, new fields will be added as needed.

---

## 🎯 **TESTING GUIDE**

### **📱 Test Mobile OTP**

#### **Development Mode:**
```bash
# OTP will be logged to backend console
curl -X POST http://localhost:5000/api/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+919876543210", "method": "sms"}'

# Check backend console for OTP, then verify:
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+919876543210", "otp": "123456"}'
```

#### **Production Mode:**
1. Add Twilio credentials to `.env`
2. Restart backend
3. Test with real phone number
4. You'll receive actual SMS/WhatsApp

### **🔍 Test Google OAuth**

#### **Frontend Test:**
1. Add Google Client ID to frontend `.env.local`
2. Restart frontend
3. Go to `/login`
4. Click "Google" tab
5. Click "Continue with Google"

#### **Backend Test:**
```bash
# Test with valid Google ID token
curl -X POST http://localhost:5000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"idToken": "google_id_token_here"}'
```

### **✉️ Test Email Login**
```bash
# Works with existing system
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "demo@ukiyo.com", "password": "password123"}'
```

---

## 🌟 **FEATURES IMPLEMENTED**

### **📱 Mobile OTP Features:**
- ✅ SMS and WhatsApp OTP delivery
- ✅ 6-digit OTP with 5-minute expiry
- ✅ Resend OTP functionality
- ✅ Rate limiting (3 attempts max)
- ✅ Auto-registration for new users
- ✅ Phone number formatting for India (+91)
- ✅ Fallback to SMS if WhatsApp fails

### **🔍 Google OAuth Features:**
- ✅ One-click Google sign-in
- ✅ Auto-registration with Google profile data
- ✅ Profile picture import
- ✅ Email verification status
- ✅ Secure token verification

### **🎨 Frontend Features:**
- ✅ Modern tabbed interface
- ✅ Mobile-first design
- ✅ Real-time OTP input validation
- ✅ Countdown timer for resend
- ✅ Error handling and loading states
- ✅ Responsive design for all devices

---

## 💰 **COST BREAKDOWN**

### **Development/Testing (FREE):**
```bash
🆓 Twilio Trial: $15 credit (1000+ OTPs)
🆓 Google OAuth: Free up to 100,000 requests/month
🆓 MongoDB Atlas: 512MB free tier
🆓 Railway: $5 credit for hosting
```

### **Production (Low Cost):**
```bash
📱 Twilio SMS: $0.0075 per SMS (~₹0.60)
📱 Twilio WhatsApp: $0.005 per message (~₹0.40)
🔍 Google OAuth: Free up to 100,000 requests/month
🗄️ MongoDB Atlas: $9/month for 2GB
☁️ Railway: $5/month for hosting

TOTAL: ~$15-20/month for 10,000+ users
```

---

## 🔧 **DEPLOYMENT CHECKLIST**

### **Backend Deployment:**
- [ ] Set all environment variables in Railway
- [ ] Verify Twilio credentials
- [ ] Test MongoDB connection
- [ ] Enable CORS for frontend domain

### **Frontend Deployment:**
- [ ] Set `VITE_GOOGLE_CLIENT_ID` in Vercel
- [ ] Update Google OAuth authorized origins
- [ ] Test all authentication flows
- [ ] Verify API endpoints

### **Security Checklist:**
- [ ] JWT secrets are strong (32+ characters)
- [ ] Twilio webhook signatures verified
- [ ] Google OAuth domain restrictions enabled
- [ ] Rate limiting enabled for OTP requests
- [ ] HTTPS enabled in production

---

## 🚨 **TROUBLESHOOTING**

### **Mobile OTP Issues:**

#### **"OTP not received"**
```bash
# Check backend logs for Twilio errors
# Verify phone number format (+91xxxxxxxxxx)
# Check Twilio account balance
# Try WhatsApp method as fallback
```

#### **"Invalid OTP"**
```bash
# Check if OTP expired (5 minutes)
# Verify phone number matches exactly
# Check for typos in 6-digit code
```

### **Google OAuth Issues:**

#### **"Google sign-in failed"**
```bash
# Verify GOOGLE_CLIENT_ID is correct
# Check authorized origins in Google Console
# Ensure Google Identity Services script loads
# Check browser console for errors
```

### **General Issues:**

#### **"Network error"**
```bash
# Check backend is running on port 5000
# Verify VITE_API_URL in frontend
# Check CORS configuration
# Verify all environment variables
```

---

## 🎯 **NEXT STEPS**

### **Phase 1: Launch (Current)**
- ✅ Mobile OTP (SMS + WhatsApp sandbox)
- ✅ Google OAuth
- ✅ Email/Password fallback

### **Phase 2: Scale (After 1000 users)**
- 📱 WhatsApp Business API approval
- 🔒 Two-factor authentication
- 📊 Analytics and user behavior tracking
- 🎨 Social login (Facebook, Apple)

### **Phase 3: Advanced (After 10,000 users)**
- 🤖 AI-powered fraud detection
- 🌐 Multi-language OTP messages
- 📱 Biometric authentication
- 🔐 Hardware security keys

---

## 📞 **SUPPORT**

### **Need Help?**
1. **Check logs first**: Backend console shows detailed errors
2. **Test in development**: Use mock mode to isolate issues
3. **Verify credentials**: Double-check all API keys and secrets
4. **Check documentation**: Twilio and Google have excellent docs

### **Common Commands:**
```bash
# View backend logs
cd backend && npm run dev

# Test API endpoints
curl -X POST http://localhost:5000/api/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+919876543210", "method": "sms"}'

# Check environment variables
cd backend && cat .env
cd frontend && cat .env.local
```

---

## 🎉 **CONGRATULATIONS!**

You now have a **world-class authentication system** with:

- 📱 **Mobile-first** experience (preferred by 65% of Indian users)
- 🔍 **One-click Google** login (trusted and fast)
- ✉️ **Traditional email** login (reliable fallback)
- 🔐 **Enterprise-grade** security (JWT + OAuth + OTP)
- 💰 **Cost-effective** solution (starts free, scales affordably)

**Your users will love the modern, secure, and convenient login experience!** 🌟