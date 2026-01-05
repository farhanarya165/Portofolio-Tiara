import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, ArrowLeft, Shield } from 'lucide-react';
import { auth } from '../utils/auth';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaValue, setCaptchaValue] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaQuestion, setCaptchaQuestion] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Generate simple math captcha
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const answer = num1 + num2;
    setCaptchaAnswer(answer.toString());
    setCaptchaQuestion(`${num1} + ${num2} = ?`);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    
    // Prevent multiple submissions
    if (loading) {
      console.log('⚠️ Already processing login...');
      return;
    }
    
    setError('');
    setLoading(true);

    console.log('🔐 Login process started...');

    try {
      // Validate captcha
      if (captchaValue !== captchaAnswer) {
        console.log('❌ Captcha validation failed');
        setError('Incorrect captcha answer');
        setLoading(false);
        setCaptchaValue('');
        generateCaptcha();
        return;
      }

      console.log('✅ Captcha validated successfully');

      // Validate credentials
      if (!auth.verify(username, password)) {
        console.log('❌ Invalid credentials');
        setError('Invalid username or password');
        setLoading(false);
        setPassword('');
        setCaptchaValue('');
        generateCaptcha();
        return;
      }

      console.log('✅ Credentials verified successfully');
      console.log('💾 Attempting to save session...');

      // Set authentication
      const loginSuccess = auth.login();

      if (!loginSuccess) {
        console.error('❌ Failed to save authentication');
        setError('Failed to save session. Please try again.');
        setLoading(false);
        return;
      }

      console.log('✅ Session saved successfully');

      // Small delay to ensure storage is written
      await new Promise(resolve => setTimeout(resolve, 200));

      // Verify authentication was saved
      const isAuth = auth.isAuthenticated();
      console.log('🔍 Authentication check:', isAuth);

      if (!isAuth) {
        console.error('❌ Authentication verification failed');
        setError('Session verification failed. Please try again.');
        setLoading(false);
        return;
      }

      console.log('🚀 Redirecting to admin dashboard...');

      // Reset loading BEFORE redirect
      setLoading(false);

      // FORCE REDIRECT: Use window.location directly (most reliable)
      window.location.href = '/admin';
      
      // Safety net: Force redirect after 1 second if still not redirected
      setTimeout(() => {
        if (window.location.pathname !== '/admin') {
          console.log('⚠️ Forcing redirect with location.replace...');
          window.location.replace('/admin');
        }
      }, 1000);

    } catch (error) {
      console.error('❌ Login error:', error);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
      setCaptchaValue('');
      generateCaptcha();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-br from-beige-lightest to-beige-lighter">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-beige-dark transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-inter font-medium">Back to Home</span>
        </button>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 animate-scaleIn">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-beige-lighter rounded-full mb-4">
              <Shield className="w-8 h-8 text-beige-dark" />
            </div>
            <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-2">
              Admin Login
            </h2>
            <p className="text-gray-600 font-inter text-sm">
              Access your dashboard to manage content
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 animate-fadeIn">
              <p className="font-inter text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-gray-700 font-inter font-medium mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl font-inter focus:border-beige-dark focus:outline-none transition-colors"
                  placeholder="Enter username"
                  required
                  disabled={loading}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-inter font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl font-inter focus:border-beige-dark focus:outline-none transition-colors"
                  placeholder="Enter password"
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Captcha */}
            <div>
              <label className="block text-gray-700 font-inter font-medium mb-2">
                Security Check
              </label>
              <div className="bg-beige-lighter rounded-xl p-4 mb-3">
                <p className="text-center font-inter font-bold text-2xl text-gray-800">
                  {captchaQuestion}
                </p>
              </div>
              <input
                type="text"
                value={captchaValue}
                onChange={(e) => setCaptchaValue(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-inter focus:border-beige-dark focus:outline-none transition-colors"
                placeholder="Enter answer"
                required
                disabled={loading}
                autoComplete="off"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-full font-inter font-bold transition-all shadow-lg ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-beige-dark text-white hover:bg-beige hover:shadow-xl transform hover:-translate-y-1 active:scale-95'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                'Login'
              )}
            </button>

            {/* Emergency Manual Redirect Button */}
            {loading && (
              <button
                type="button"
                onClick={() => {
                  console.log('🆘 Emergency redirect triggered');
                  window.location.replace('/admin');
                }}
                className="w-full mt-3 py-3 bg-red-500 text-white rounded-xl font-inter font-semibold hover:bg-red-600 transition-colors"
              >
                ⚠️ Click Here If Stuck
              </button>
            )}
          </form>

          {/* Debug Info (Remove in production) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs font-mono text-gray-500">
              <p>Debug Mode: Check browser console for logs</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;