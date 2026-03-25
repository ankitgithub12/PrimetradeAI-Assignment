import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', status: 'pending' });

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
        status: task.status
      });
    } else {
      setEditingTask(null);
      setFormData({ title: '', description: '', status: 'pending' });
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
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${id}`);
        fetchTasks();
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete task');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">
          {user.role === 'admin' ? 'All Tasks Overview' : 'My Tasks'}
        </h1>
        <div className="space-x-4">
          <button 
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-semibold transition shadow-sm"
          >
            + New Task
          </button>
          <button 
            onClick={logout}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-semibold transition"
          >
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm font-medium border border-red-100">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 mb-4">No tasks found. Create your first task!</p>
          <button 
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100 font-semibold transition"
          >
            Create Task
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map(task => (
            <div key={task._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{task.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  task.status === 'completed' ? 'bg-green-100 text-green-700' :
                  task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {task.status.replace('-', ' ')}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3 min-h-[60px]">{task.description}</p>
              
              <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
                <span>{format(new Date(task.createdAt), 'MMM dd, yyyy')}</span>
                <div className="space-x-2">
                  <button onClick={() => handleOpenModal(task)} className="text-purple-600 hover:text-purple-800 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(task._id)} className="text-red-600 hover:text-red-800 hover:underline">Delete</button>
                </div>
              </div>
              
              {user.role === 'admin' && task.user && (
                <div className="mt-3 text-xs bg-gray-50 p-2 rounded text-gray-600 truncate">
                  <span className="font-semibold">User:</span> {typeof task.user === 'object' ? task.user.name : task.user}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-5">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  maxLength={500}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 outline-none transition resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 outline-none transition bg-white"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium transition shadow-sm"
                >
                  {editingTask ? 'Update Task' : 'Create Task'}
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
