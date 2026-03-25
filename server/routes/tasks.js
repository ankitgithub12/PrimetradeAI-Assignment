import express from 'express';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/tasks.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All task routes require authentication

router
  .route('/')
  .get(getTasks)
  .post(createTask);

router
  .route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

export default router;
