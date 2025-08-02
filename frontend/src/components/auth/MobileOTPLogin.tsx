import React, { useState, useEffect } from 'react';

interface MobileOTPLoginProps {
  onSuccess: (phoneNumber: string, otp: string) => void;
  onError: (error: string) => void;
  loading?: boolean;
}

const MobileOTPLogin: React.FC<MobileOTPLoginProps> = ({ onSuccess, onError, loading }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpMethod, setOtpMethod] = useState<'sms' | 'whatsapp'>('sms');
  const [isRequestingOTP, setIsRequestingOTP] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && step === 'otp') {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, step]);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '');
    
    // Format as +91 XXXXX XXXXX
    if (cleaned.length <= 10) {
      return cleaned.replace(/(\d{5})(\d{5})/, '$1 $2');
    }
    return cleaned.slice(0, 10).replace(/(\d{5})(\d{5})/, '$1 $2');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  };

  const requestOTP = async () => {
    if (!phoneNumber.trim()) {
      onError('Please enter your mobile number');
      return;
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      onError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsRequestingOTP(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/request-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: `+91${cleanPhone}`,
          method: otpMethod
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStep('otp');
        setCountdown(60); // 60 seconds countdown
        setCanResend(false);
        if (data.data.mock) {
          onError(`Development Mode: OTP is logged in console for ${data.data.phone}`);
        }
      } else {
        onError(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      onError('Network error. Please try again.');
    } finally {
      setIsRequestingOTP(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp.trim() || otp.length !== 6) {
      onError('Please enter the 6-digit OTP');
      return;
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    onSuccess(`+91${cleanPhone}`, otp);
  };

  const handleResendOTP = () => {
    setOtp('');
    setCanResend(false);
    requestOTP();
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setOtp('');
    setCountdown(0);
    setCanResend(false);
  };

  if (step === 'phone') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-cormorant font-bold text-gray-900 text-center">
            Sign in with Mobile
          </h2>
          <p className="text-gray-600 text-center mt-2">
            We'll send you a verification code
          </p>
        </div>

        <div className="space-y-4">
          {/* Phone Number Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm">+91</span>
              </div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="Enter your mobile number"
                className="block w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                maxLength={11}
              />
            </div>
          </div>

          {/* OTP Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How would you like to receive the OTP?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOtpMethod('sms')}
                className={`flex items-center justify-center px-4 py-3 border rounded-lg transition-colors ${
                  otpMethod === 'sms'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                SMS
              </button>
              
              <button
                type="button"
                onClick={() => setOtpMethod('whatsapp')}
                className={`flex items-center justify-center px-4 py-3 border rounded-lg transition-colors ${
                  otpMethod === 'whatsapp'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                WhatsApp
              </button>
            </div>
          </div>

          {/* Send OTP Button */}
          <button
            type="button"
            onClick={requestOTP}
            disabled={isRequestingOTP || !phoneNumber.trim()}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRequestingOTP ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Sending OTP...
              </div>
            ) : (
              `Send OTP via ${otpMethod === 'sms' ? 'SMS' : 'WhatsApp'}`
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-cormorant font-bold text-gray-900 text-center">
          Enter Verification Code
        </h2>
        <p className="text-gray-600 text-center mt-2">
          We sent a 6-digit code to +91 {phoneNumber}
        </p>
      </div>

      <div className="space-y-4">
        {/* OTP Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Verification Code
          </label>
          <input
            type="text"
            value={otp}
            onChange={handleOtpChange}
            placeholder="Enter 6-digit code"
            className="block w-full px-3 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            maxLength={6}
            autoComplete="one-time-code"
          />
        </div>

        {/* Verify Button */}
        <button
          type="button"
          onClick={verifyOTP}
          disabled={loading || otp.length !== 6}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Verifying...
            </div>
          ) : (
            'Verify & Continue'
          )}
        </button>

        {/* Resend OTP */}
        <div className="text-center">
          {countdown > 0 ? (
            <p className="text-sm text-gray-500">
              Resend OTP in {countdown} seconds
            </p>
          ) : canResend ? (
            <button
              type="button"
              onClick={handleResendOTP}
              className="text-sm text-primary-600 hover:text-primary-800 font-medium"
            >
              Resend OTP
            </button>
          ) : null}
        </div>

        {/* Back to Phone */}
        <div className="text-center">
          <button
            type="button"
            onClick={handleBackToPhone}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Change mobile number
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileOTPLogin;