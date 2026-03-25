import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, error: authError, clearError } = useAuth();
  
  const [validationError, setValidationError] = useState('');

  const getPasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length > 5) strength += 1;
    if (pass.length >= 8) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
    return strength; 
  };

  const strength = getPasswordStrength(password);
  
  let strengthLabel = '';
  let strengthColor = 'bg-gray-200';
  let strengthTextColor = 'text-gray-400';
  
  if (password.length > 0) {
    if (strength < 3) { 
      strengthLabel = 'Weak'; 
      strengthColor = 'bg-rose-400'; 
      strengthTextColor = 'text-rose-500';
    } else if (strength < 5) { 
      strengthLabel = 'Medium'; 
      strengthColor = 'bg-amber-400'; 
      strengthTextColor = 'text-amber-500';
    } else { 
      strengthLabel = 'Strong'; 
      strengthColor = 'bg-emerald-500'; 
      strengthTextColor = 'text-emerald-600';
    }
  }

  const validateForm = () => {
    if (name.trim().length < 2) return "Name must be at least 2 characters long.";
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) return "Please enter a valid, complete email address (e.g., name@domain.com).";
    if (password.length < 6) return "Password must be at least 6 characters long.";
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
    const success = await register(name, email, password, role);
    if (success) {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-[85vh] bg-gray-50/50">
      <div className="m-auto w-full max-w-5xl bg-white rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col md:flex-row border border-gray-100/50">
        
        {/* Left Side (Decorative) */}
        <div className="md:w-5/12 bg-gradient-to-br from-indigo-600 to-purple-700 p-10 text-white flex flex-col justify-between hidden md:flex relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/4 -left-12 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-4 tracking-tight">Join TaskFlow Today.</h2>
            <p className="text-indigo-100 text-lg leading-relaxed mb-6 font-medium">
              Experience seamless task management, built to scale with your ambitions.
            </p>
            <div className="space-y-4 text-sm font-medium text-indigo-100/80">
              <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-300"/> Secure role-based access</div>
              <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-300"/> Real-time CRUD operations</div>
              <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-300"/> Scalable architecture</div>
            </div>
          </div>
          <div className="text-sm text-indigo-200/60 relative z-10 font-medium">
            © 2026 Primetrade Assignment
          </div>
        </div>

        {/* Right Side (Form) */}
        <div className="w-full md:w-7/12 p-8 md:p-12 lg:p-16">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Create Account</h2>
            <p className="text-gray-500 mb-8 font-medium">Get started with your free account</p>
            
            {(authError || validationError) && (
              <div className="bg-red-50/80 border border-red-100 text-red-600 p-4 rounded-xl flex items-start gap-3 mb-6 animate-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="text-sm font-semibold">{validationError || authError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                    value={name}
                    onChange={(e) => {setName(e.target.value); setValidationError('');}}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Account Role</label>
                  <select
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all appearance-none cursor-pointer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

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
                <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Create a strong password"
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
                
                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <div className="mt-3 animate-in fade-in duration-300">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Password strength</span>
                      <span className={`text-xs font-bold ${strengthTextColor}`}>
                        {strengthLabel}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden flex gap-1">
                      <div className={`h-full ${strength >= 1 ? strengthColor : 'bg-transparent'} transition-all duration-300`} style={{ width: '20%' }}></div>
                      <div className={`h-full ${strength >= 2 ? strengthColor : 'bg-transparent'} transition-all duration-300`} style={{ width: '20%' }}></div>
                      <div className={`h-full ${strength >= 3 ? strengthColor : 'bg-transparent'} transition-all duration-300`} style={{ width: '20%' }}></div>
                      <div className={`h-full ${strength >= 4 ? strengthColor : 'bg-transparent'} transition-all duration-300`} style={{ width: '20%' }}></div>
                      <div className={`h-full ${strength >= 5 ? strengthColor : 'bg-transparent'} transition-all duration-300`} style={{ width: '20%' }}></div>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.18)] disabled:opacity-70 mt-4 active:scale-[0.98]"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            <p className="mt-8 text-center text-sm font-medium text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline underline-offset-2 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
