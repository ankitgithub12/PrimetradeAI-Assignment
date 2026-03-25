import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const ResetPassword = () => {
  const { resettoken } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const getPasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length > 5) strength += 1;
    if (pass.length > 8) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
    return strength; // max 5
  };

  const strength = getPasswordStrength(password);
  
  let strengthLabel = 'Weak';
  let strengthColor = 'bg-red-400';
  if (strength >= 3) { strengthLabel = 'Medium'; strengthColor = 'bg-yellow-400'; }
  if (strength >= 5) { strengthLabel = 'Strong'; strengthColor = 'bg-green-500'; }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      await api.put(`/auth/resetpassword/${resettoken}`, { password });
      setMessage('Password successfully reset. You can now log in.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid or expired token');
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 text-center mb-6">
          Set New Password
        </h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm font-medium">
            {error}
          </div>
        )}
        
        {message ? (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg text-center font-medium">
            <p>{message}</p>
            <p className="text-sm mt-2">Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
              <input
                type="password"
                required
                minLength={6}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {password && (
                <div className="mt-2 text-xs">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-500">Password strength:</span>
                    <span className={`font-semibold ${strengthLabel === 'Weak' ? 'text-red-500' : strengthLabel === 'Medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                      {strengthLabel}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden flex">
                    <div className={`h-full ${strengthColor} transition-all duration-300`} style={{ width: `${(strength / 5) * 100}%` }}></div>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm New Password</label>
              <input
                type="password"
                required
                minLength={6}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none transition-all"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all shadow-md disabled:opacity-50 mt-4"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
