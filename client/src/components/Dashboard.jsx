import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { format } from 'date-fns';
import { Plus, Edit2, Trash2, LogOut, CheckCircle2, Clock, Circle, LayoutDashboard, Users, Activity, Target, Calendar } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', status: 'pending', deadline: '', assigneeEmail: '' });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tasks');
      setTasks(res.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '',
        assigneeEmail: typeof task.user === 'object' ? task.user.email : ''
      });
    } else {
      setEditingTask(null);
      setFormData({ title: '', description: '', status: 'pending', deadline: '', assigneeEmail: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, formData);
      } else {
        await api.post('/tasks', formData);
      }
      setIsModalOpen(false);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save task');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you certain you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${id}`);
        fetchTasks();
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete task');
      }
    }
  };

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status !== 'completed').length;

  // Render Admin View
  const renderAdminView = () => {
    // Collect unique users
    const uniqueUsersCount = new Set(tasks.map(t => typeof t.user === 'object' ? t.user._id : t.user)).size;

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-indigo-100">Total System Tasks</h3>
              <div className="p-2 bg-white/20 rounded-lg"><LayoutDashboard className="w-5 h-5 text-white" /></div>
            </div>
            <p className="text-4xl font-black">{tasks.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-500">Active Users w/ Tasks</h3>
              <div className="p-2 bg-blue-50 rounded-lg"><Users className="w-5 h-5 text-blue-500" /></div>
            </div>
            <p className="text-4xl font-black text-gray-800">{uniqueUsersCount}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-500">Platform Completion Rate</h3>
              <div className="p-2 bg-emerald-50 rounded-lg"><Activity className="w-5 h-5 text-emerald-500" /></div>
            </div>
            <p className="text-4xl font-black text-gray-800">
              {tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}%
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-gray-900 mb-4 border-b pb-4">Administrative Task Control</h2>
        
        {tasks.length === 0 ? (
          <div className="py-20 text-center text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-sm">
            No tasks exist across the platform yet.
          </div>
        ) : (
          <div className="overflow-x-auto shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl border border-gray-100 bg-white">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-sm font-bold tracking-wider">
                  <th className="p-4 border-b border-gray-100">Task Title</th>
                  <th className="p-4 border-b border-gray-100">Assignee</th>
                  <th className="p-4 border-b border-gray-100">Status</th>
                  <th className="p-4 border-b border-gray-100">Deadline</th>
                  <th className="p-4 border-b border-gray-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/80">
                {tasks.map(task => (
                  <tr key={task._id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="p-4 font-bold text-gray-800 max-w-xs truncate">{task.title}</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 text-sm">{typeof task.user === 'object' ? task.user.name : task.user}</span>
                        <span className="text-xs text-indigo-500">{typeof task.user === 'object' ? task.user.email : ''}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        task.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                        task.status === 'in-progress' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {task.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-bold text-gray-600">
                      {task.deadline ? (
                        <span className={`flex items-center gap-1.5 ${new Date(task.deadline) < new Date() && task.status !== 'completed' ? 'text-red-500' : ''}`}>
                          <Calendar className="w-4 h-4" /> {format(new Date(task.deadline), 'MMM dd, yyyy')}
                        </span>
                      ) : (
                        <span className="text-gray-400">No Deadline</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleOpenModal(task)} className="text-indigo-600 hover:text-indigo-800 p-2"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(task._id)} className="text-rose-500 hover:text-rose-700 p-2"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  // Render Personal User View
  const renderUserView = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* User Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-3xl p-6 flex items-center gap-6 shadow-sm border border-gray-100">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
            <Target className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Active Tasks</p>
            <h4 className="text-3xl font-black text-gray-900">{pendingTasks}</h4>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 flex items-center gap-6 shadow-sm border border-gray-100">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Completed Tasks</p>
            <h4 className="text-3xl font-black text-gray-900">{completedTasks}</h4>
          </div>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100/50 text-center px-4">
          <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
            <LayoutDashboard className="w-10 h-10 text-indigo-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Your slate is clean!</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">You don't have any tasks assigned right now. Ready to be productive?</p>
          <button 
            onClick={() => handleOpenModal()}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 font-bold transition-all shadow-md active:scale-95"
          >
            Create Your First Task
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tasks.map(task => {
            const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'completed';
            return (
            <div key={task._id} className="group bg-white rounded-2xl shadow-sm border border-gray-100/80 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col">
              
              <div className={`absolute top-0 left-0 w-full h-1.5 ${
                task.status === 'completed' ? 'bg-emerald-500' :
                isOverdue ? 'bg-rose-500' :
                task.status === 'in-progress' ? 'bg-amber-500' :
                'bg-gray-300'
              }`}></div>

              <div className="flex justify-between items-start mb-4 pt-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  task.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                  isOverdue ? 'bg-rose-100 text-rose-700' :
                  task.status === 'in-progress' ? 'bg-amber-100 text-amber-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {task.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {isOverdue && task.status !== 'completed' && <AlertCircle className="w-3.5 h-3.5" />}
                  {!isOverdue && task.status === 'in-progress' && <Clock className="w-3.5 h-3.5" />}
                  {!isOverdue && task.status === 'pending' && <Circle className="w-3.5 h-3.5" />}
                  {isOverdue && task.status !== 'completed' ? 'Overdue' : task.status.replace('-', ' ')}
                </span>
                
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                  <button onClick={() => handleOpenModal(task)} className="text-indigo-600 hover:text-indigo-800 transition-colors p-1" title="Edit">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(task._id)} className="text-rose-500 hover:text-rose-700 transition-colors p-1" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="font-extrabold text-xl text-gray-900 mb-3 line-clamp-2 leading-tight">{task.title}</h3>
              <p className="text-gray-500 text-sm mb-6 flex-grow line-clamp-3 leading-relaxed">{task.description}</p>
              
              <div className="pt-4 border-t border-gray-100 mt-auto space-y-2">
                {task.deadline && (
                  <div className={`flex items-center text-xs font-bold ${isOverdue ? 'text-rose-500' : 'text-indigo-600'}`}>
                    <Calendar className="w-3.5 h-3.5 mr-1.5" /> Due: {format(new Date(task.deadline), 'MMM dd, yyyy')}
                  </div>
                )}
                <div className="flex justify-between items-center text-xs font-bold text-gray-400">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Created {format(new Date(task.createdAt), 'MMM dd')}</span>
                </div>
              </div>
            </div>
          )})}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Unified Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <div className={`p-2.5 rounded-xl text-white ${user.role === 'admin' ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-gradient-to-br from-rose-400 to-orange-500'}`}>
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                {user.role === 'admin' ? 'Admin Control Center' : 'My Workspace'}
                <span className={`px-2.5 py-1 text-xs uppercase tracking-wider font-black rounded-lg ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                  {user.role}
                </span>
              </div>
            </div>
          </h1>
          <p className="text-gray-500 mt-2 font-medium ml-1">
            {user.role === 'admin' ? 'Manage system tasks and oversee platform metrics.' : 'Track your personal progression and tasks.'}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
          <button 
            onClick={() => handleOpenModal()}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 font-bold transition-all shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.18)] active:scale-[0.98]"
          >
            <Plus className="w-5 h-5" /> New Task
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 inline-flex items-center gap-2 p-4 rounded-xl text-sm font-bold border border-red-100 w-full animate-in slide-in-from-top-2">
          <Circle className="w-5 h-5" /> {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        user.role === 'admin' ? renderAdminView() : renderUserView()
      )}

      {/* Shared Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg p-8 animate-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                {editingTask ? <Edit2 className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
              </div>
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Task Title *</label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  placeholder="e.g. Redesign landing page"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description *</label>
                <textarea
                  required
                  maxLength={500}
                  rows={3}
                  placeholder="Provide context and details..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Stage</label>
                  <select
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Deadline</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  />
                </div>
              </div>

              {user.role === 'admin' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Delegate to User (Email)</label>
                  <input
                    type="email"
                    placeholder="e.g. test@example.com (Optional)"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
                    value={formData.assigneeEmail}
                    onChange={(e) => setFormData({...formData, assigneeEmail: e.target.value})}
                  />
                  <p className="text-xs text-gray-500 mt-2 font-medium">Leave blank to assign the task to yourself.</p>
                </div>
              )}
              
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-8">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3.5 text-gray-700 hover:bg-gray-100 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold transition-all shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.18)] active:scale-[0.98]"
                >
                  {editingTask ? 'Save Changes' : 'Publish Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
