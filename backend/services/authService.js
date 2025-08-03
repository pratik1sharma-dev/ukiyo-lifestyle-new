const twilio = require('twilio');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Initialize Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Store OTP temporarily (in production, use Redis)
const otpStore = new Map();

class AuthService {
  // Generate 6-digit OTP
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send OTP via SMS
  async sendSMSOTP(phoneNumber, otp) {
    try {
      if (!process.env.TWILIO_ACCOUNT_SID) {
        console.log(`Mock SMS OTP for ${phoneNumber}: ${otp}`);
        return { success: true, mock: true };
      }

      const message = await twilioClient.messages.create({
        body: `Your Ukiyo Lifestyle verification code is: ${otp}. Valid for 5 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
      });

      return { success: true, messageId: message.sid };
    } catch (error) {
      console.error('SMS OTP Error:', error);
      throw new Error('Failed to send SMS OTP');
    }
  }

  // Send OTP via WhatsApp (Twilio)
  async sendWhatsAppOTP(phoneNumber, otp) {
    try {
      if (!process.env.TWILIO_ACCOUNT_SID) {
        console.log(`Mock WhatsApp OTP for ${phoneNumber}: ${otp}`);
        return { success: true, mock: true };
      }

      const message = await twilioClient.messages.create({
        body: `🌸 *Ukiyo Lifestyle* 🌸\n\nYour verification code is: *${otp}*\n\nValid for 5 minutes. Welcome to our lifestyle community!`,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${phoneNumber}`
      });

      return { success: true, messageId: message.sid };
    } catch (error) {
      console.error('WhatsApp OTP Error:', error);
      // Fallback to SMS if WhatsApp fails
      return await this.sendSMSOTP(phoneNumber, otp);
    }
  }

  // Request OTP for phone number
  async requestOTP(phoneNumber, method = 'sms') {
    try {
      // Validate phone number format
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        throw new Error('Invalid phone number format');
      }

      // Format phone number for India
      const formattedPhone = cleanPhone.startsWith('91') 
        ? `+${cleanPhone}` 
        : `+91${cleanPhone}`;

      // Generate OTP
      const otp = this.generateOTP();
      
      // Store OTP with expiration (5 minutes)
      const otpData = {
        otp,
        phone: formattedPhone,
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
        attempts: 0
      };
      
      otpStore.set(formattedPhone, otpData);

      // Send OTP based on method
      let result;
      if (method === 'whatsapp') {
        result = await this.sendWhatsAppOTP(formattedPhone, otp);
      } else {
        result = await this.sendSMSOTP(formattedPhone, otp);
      }

      return {
        success: true,
        phone: formattedPhone,
        method,
        messageId: result.messageId,
        mock: result.mock || false
      };
    } catch (error) {
      console.error('Request OTP Error:', error);
      throw error;
    }
  }

  // Verify OTP and login/register user
  async verifyOTP(phoneNumber, otp) {
    try {
      const formattedPhone = phoneNumber.startsWith('+') 
        ? phoneNumber 
        : `+91${phoneNumber.replace(/\D/g, '')}`;

      // Get stored OTP
      const storedData = otpStore.get(formattedPhone);
      
      if (!storedData) {
        throw new Error('OTP not found or expired');
      }

      // Check expiration
      if (Date.now() > storedData.expiresAt) {
        otpStore.delete(formattedPhone);
        throw new Error('OTP has expired');
      }

      // Check attempts
      if (storedData.attempts >= 3) {
        otpStore.delete(formattedPhone);
        throw new Error('Too many invalid attempts');
      }

      // Verify OTP
      if (storedData.otp !== otp) {
        storedData.attempts++;
        throw new Error('Invalid OTP');
      }

      // OTP verified, clear from store
      otpStore.delete(formattedPhone);

      // Find or create user
      let user = await User.findOne({ phone: formattedPhone });
      
      if (!user) {
        // Create new user with phone number
        user = new User({
          phone: formattedPhone,
          isPhoneVerified: true,
          role: 'customer',
          isActive: true,
          // Temporary fields - user can update later
          firstName: 'User',
          lastName: '',
          email: `${formattedPhone.replace('+', '')}@ukiyo.temp`
        });
        await user.save();
      } else {
        // Update phone verification status
        user.isPhoneVerified = true;
        user.lastLogin = new Date();
        await user.save();
      }

      // Generate JWT tokens
      const accessToken = jwt.sign(
        { 
          _id: user._id, 
          phone: user.phone, 
          role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
      );

      const refreshToken = jwt.sign(
        { 
          _id: user._id, 
          phone: user.phone 
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
      );

      return {
        success: true,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isPhoneVerified: user.isPhoneVerified
        },
        accessToken,
        refreshToken,
        isNewUser: !user.email || user.email.includes('@ukiyo.temp')
      };
    } catch (error) {
      console.error('Verify OTP Error:', error);
      throw error;
    }
  }

  // Google OAuth verification
  async verifyGoogleToken(idToken) {
    try {
      // Check if Google Client ID is configured
      if (!process.env.GOOGLE_CLIENT_ID) {
        throw new Error('Google OAuth is not configured. Please set GOOGLE_CLIENT_ID environment variable.');
      }

      // Verify the Google ID token
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      const {
        sub: googleId,
        email,
        given_name: firstName,
        family_name: lastName,
        picture: profilePicture,
        email_verified: emailVerified
      } = payload;

      if (!emailVerified) {
        throw new Error('Google email not verified');
      }

      // Find or create user
      let user = await User.findOne({ 
        $or: [
          { email },
          { googleId }
        ]
      });

      if (!user) {
        // Create new user with Google data
        try {
          user = new User({
            googleId,
            email,
            firstName: firstName || 'User',
            lastName: lastName || '',
            profilePicture,
            emailVerified: true,
            role: 'customer',
            isActive: true,
            // Generate temporary phone for compatibility
            phone: `+91${Date.now().toString().slice(-10)}`
          });
          await user.save();
        } catch (saveError) {
          console.error('Error creating Google OAuth user:', saveError);
          throw new Error(`Failed to create user account: ${saveError.message}`);
        }
      } else {
        // Update existing user with Google data
        if (!user.googleId) user.googleId = googleId;
        if (!user.profilePicture) user.profilePicture = profilePicture;
        if (!user.emailVerified) user.emailVerified = true;
        user.lastLogin = new Date();
        await user.save();
      }

      // Generate JWT tokens
      const accessToken = jwt.sign(
        { 
          _id: user._id, 
          email: user.email, 
          role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
      );

      const refreshToken = jwt.sign(
        { 
          _id: user._id, 
          email: user.email 
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
      );

      return {
        success: true,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          profilePicture: user.profilePicture,
          emailVerified: user.emailVerified
        },
        accessToken,
        refreshToken,
        isNewUser: !user.phone || user.phone.includes(Date.now().toString())
      };
    } catch (error) {
      console.error('Google OAuth Error:', error);
      throw error;
    }
  }

  // Clear expired OTPs (cleanup function)
  clearExpiredOTPs() {
    const now = Date.now();
    for (const [phone, data] of otpStore.entries()) {
      if (now > data.expiresAt) {
        otpStore.delete(phone);
      }
    }
  }
}

// Clean up expired OTPs every 5 minutes
setInterval(() => {
  new AuthService().clearExpiredOTPs();
}, 5 * 60 * 1000);

module.exports = new AuthService();