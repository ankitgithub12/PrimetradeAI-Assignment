import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid, complete email address (e.g., name@domain.com).');
      setLoading(false);
      return;
    }
    
    try {
      const res = await api.post('/auth/forgotpassword', { email });
      setMessage(res.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 text-center mb-2">
          Forgot Password
        </h2>
        <p className="text-center text-sm text-gray-500 mb-8">
          Enter your email and we will send you a reset link.
        </p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-start gap-2 mb-6 text-sm font-medium">
            {error}
          </div>
        )}
        
        {message && (
          <div className="bg-green-50 text-green-700 p-3 rounded-lg flex items-start gap-2 mb-6 text-sm font-medium">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all shadow-md disabled:opacity-50 mt-4"
          >
            {loading ? 'Sending link...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Remember your password?{' '}
          <Link to="/login" className="text-purple-600 font-semibold hover:text-purple-700 hover:underline transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
