import Task from '../models/Task.js';
import User from '../models/User.js';

// @desc    Get all tasks for logged in user (Admins get all tasks)
// @route   GET /api/v1/tasks
// @access  Private
export const getTasks = async (req, res, next) => {
  try {
    let query;

    // If admin, get all tasks. If user, get only their tasks
    if (req.user.role === 'admin') {
      query = Task.find().populate({
        path: 'user',
        select: 'name email'
      });
    } else {
      query = Task.find({ user: req.user.id });
    }

    const tasks = await query;

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single task
// @route   GET /api/v1/tasks/:id
// @access  Private
export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    // Make sure user is task owner or admin
    if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized to access this task' });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new task
// @route   POST /api/v1/tasks
// @access  Private
export const createTask = async (req, res, next) => {
  try {
    // Add user to req.body
    if (req.user.role === 'admin' && req.body.assigneeEmail) {
      const assigneeUser = await User.findOne({ email: req.body.assigneeEmail });
      if (!assigneeUser) {
        return res.status(404).json({ success: false, error: 'Assignee email not found' });
      }
      req.body.user = assigneeUser._id;
    } else {
      req.body.user = req.user.id;
    }

    const task = await Task.create(req.body);

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update task
// @route   PUT /api/v1/tasks/:id
// @access  Private
export const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    // Make sure user is task owner
    if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized to update this task' });
    }

    if (req.user.role === 'admin' && req.body.assigneeEmail) {
      const assigneeUser = await User.findOne({ email: req.body.assigneeEmail });
      if (!assigneeUser) {
        return res.status(404).json({ success: false, error: 'Assignee email not found' });
      }
      req.body.user = assigneeUser._id;
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete task
// @route   DELETE /api/v1/tasks/:id
// @access  Private
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    // Make sure user is task owner
    if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized to delete this task' });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};
