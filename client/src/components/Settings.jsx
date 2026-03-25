import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Settings as SettingsIcon, User as UserIcon, Mail, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';

const Settings = () => {
  const { user, setUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const res = await api.put('/auth/updatedetails', formData);
      setUser(res.data.data);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    }
    
    setLoading(false);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100/50">
        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white shadow-lg shadow-indigo-500/30">
          <SettingsIcon className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Account Settings</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage your personal profile and preferences.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 overflow-hidden">
        <div className="p-8 md:p-12">
          
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 flex items-center justify-center text-3xl font-black shadow-inner border border-indigo-200/50">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-black rounded-md border ${user?.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                  {user?.role} Role
                </span>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> {user?.email}
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50/80 border border-red-100 text-red-600 p-4 rounded-xl flex items-start gap-3 mb-8 animate-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span className="text-sm font-semibold">{error}</span>
            </div>
          )}

          {message && (
            <div className="bg-emerald-50/80 border border-emerald-100 text-emerald-700 p-4 rounded-xl flex items-start gap-3 mb-8 animate-in slide-in-from-top-2 duration-300">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <span className="text-sm font-semibold">{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-gray-400" /> Full Name
              </label>
              <input
                type="text"
                required
                minLength={2}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/80 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" /> Email Address
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200/80 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            {user?.role === 'admin' && (
              <div className="mt-8 p-6 bg-purple-50/50 rounded-2xl border border-purple-100/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Shield className="w-24 h-24 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-purple-900 mb-2 flex items-center gap-2 relative z-10">
                  <Shield className="w-5 h-5" /> Administrative Features
                </h3>
                <p className="text-sm text-purple-800/80 font-medium relative z-10">
                  As an administrator, you have elevated access. Additional system configuration options and global security policies will appear here in future updates.
                </p>
              </div>
            )}

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading || (formData.name === user?.name && formData.email === user?.email)}
                className="py-3.5 px-8 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.18)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {loading ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
