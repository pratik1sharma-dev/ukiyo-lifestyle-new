import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store';
import GoogleSignIn from '../components/auth/GoogleSignIn';
import MobileOTPLogin from '../components/auth/MobileOTPLogin';
import { authApi } from '../services/api';

const ModernLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setAuthenticated, loading } = useAuthStore();
  
  const [authMethod, setAuthMethod] = useState<'mobile' | 'google' | 'email'>('mobile');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Get the intended destination after login
  const from = (location.state as any)?.from?.pathname || '/';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await authApi.login(formData.email, formData.password);
      
      if (response.data.success) {
        const { user, accessToken, refreshToken } = response.data.data;
        
        // Store tokens
        localStorage.setItem('authToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        // Update auth state
        setUser(user);
        setAuthenticated(true);
        
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleMobileOTPSuccess = async (phoneNumber: string, otp: string) => {
    setError('');
    
    try {
      const response = await authApi.verifyOTP(phoneNumber, otp);
      
      if (response.data.success) {
        const { user, accessToken, refreshToken, isNewUser } = response.data.data;
        
        // Store tokens
        localStorage.setItem('authToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        // Update auth state
        setUser(user);
        setAuthenticated(true);
        
        // Show welcome message for new users
        if (isNewUser) {
          navigate('/profile?welcome=true');
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'OTP verification failed');
    }
  };

  const handleGoogleSuccess = async (idToken: string) => {
    setError('');
    
    try {
      const response = await authApi.googleLogin(idToken);
      
      if (response.data.success) {
        const { user, accessToken, refreshToken, isNewUser } = response.data.data;
        
        // Store tokens
        localStorage.setItem('authToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        // Update auth state
        setUser(user);
        setAuthenticated(true);
        
        // Show welcome message for new users
        if (isNewUser) {
          navigate('/profile?welcome=true');
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google login failed');
    }
  };

  const handleAuthMethodError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-cormorant font-bold text-primary-600">
              Ukiyo Lifestyle
            </h1>
          </Link>
          <h2 className="mt-6 text-3xl font-cormorant font-bold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue shopping
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Authentication Method Tabs */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setAuthMethod('mobile')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  authMethod === 'mobile'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📱 Mobile OTP
              </button>
              <button
                onClick={() => setAuthMethod('google')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  authMethod === 'google'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🔍 Google
              </button>
              <button
                onClick={() => setAuthMethod('email')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  authMethod === 'email'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ✉️ Email
              </button>
            </div>
          </div>

          {/* Authentication Forms */}
          <div className="space-y-6">
            {authMethod === 'mobile' && (
              <MobileOTPLogin
                onSuccess={handleMobileOTPSuccess}
                onError={handleAuthMethodError}
                loading={loading.isLoading}
              />
            )}

            {authMethod === 'google' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-cormorant font-semibold text-gray-900">
                    Continue with Google
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Sign in with your Google account
                  </p>
                </div>
                <GoogleSignIn
                  onSuccess={handleGoogleSuccess}
                  onError={handleAuthMethodError}
                  disabled={loading.isLoading}
                />
              </div>
            )}

            {authMethod === 'email' && (
              <form onSubmit={handleEmailLogin} className="space-y-6">
                <div>
                  <h3 className="text-xl font-cormorant font-semibold text-gray-900 text-center mb-6">
                    Sign in with Email
                  </h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878l-1.414-1.414M14.121 14.121l1.414 1.414" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading.isLoading}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading.isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>

                <div className="text-center">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary-600 hover:text-primary-800"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </form>
            )}
          </div>

          {/* Divider */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-primary-600 hover:text-primary-800"
                >
                  Create one now
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="text-center">
          <div className="grid grid-cols-3 gap-4 text-xs text-gray-500">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>Secure Login</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span>Mobile First</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span>Quick Access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernLogin;