import express from 'express';
import {
  register,
  login,
  getMe,
  updateDetails,
  forgotPassword,
  resetPassword
} from '../controllers/auth.js';

const router = express.Router();

import { protect } from '../middleware/auth.js';

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

export default router;
