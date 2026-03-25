import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, error: authError, clearError } = useAuth();
  
  const [validationError, setValidationError] = useState('');

  const validateForm = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) return "Please enter a valid, complete email address (e.g., name@domain.com).";
    if (!password) return "Password is required.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setValidationError('');

    const vErr = validateForm();
    if (vErr) {
      setValidationError(vErr);
      return;
    }

    setLoading(true);
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-[85vh] bg-gray-50/50">
      <div className="m-auto w-full max-w-5xl bg-white rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col md:flex-row-reverse border border-gray-100/50">
        
        {/* Right Side (Decorative) */}
        <div className="md:w-5/12 bg-gray-900 p-10 text-white flex flex-col justify-between hidden md:flex relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[url('https://images.unsplash.com/photo-1550439062-609e1531270e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center"></div>
          
          <div className="relative z-20 mt-8">
            <h2 className="text-4xl font-black mb-4 tracking-tight">Welcome Back to TaskFlow.</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6 font-medium">
              Pick up right where you left off.
            </p>
          </div>
          <div className="text-sm text-gray-400 relative z-20 font-medium pb-4">
            "The most beautiful UI is the one that disappears."
          </div>
        </div>

        {/* Left Side (Form) */}
        <div className="w-full md:w-7/12 p-8 md:p-12 lg:p-16">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Sign In</h2>
            <p className="text-gray-500 mb-8 font-medium">Please enter your credentials to access your account</p>
            
            {(authError || validationError) && (
              <div className="bg-red-50/80 border border-red-100 text-red-600 p-4 rounded-xl flex items-start gap-3 mb-6 animate-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="text-sm font-semibold">{validationError || authError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                  value={email}
                  onChange={(e) => {setEmail(e.target.value); setValidationError('');}}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-gray-700">Password</label>
                  <Link to="/forgot-password" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline underline-offset-2 transition-colors">
                    Forgot Password?
                  </Link>
                </div>
                
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all pr-12"
                    value={password}
                    onChange={(e) => {setPassword(e.target.value); setValidationError('');}}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-[0_4px_14px_0_rgb(147,51,234,0.2)] hover:shadow-[0_6px_20px_rgba(147,51,234,0.23)] disabled:opacity-70 mt-2 active:scale-[0.98]"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>

            <p className="mt-8 text-center text-sm font-medium text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline underline-offset-2 transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
