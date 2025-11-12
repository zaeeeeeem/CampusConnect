import { Router } from 'express';
import {
  getCurrentProfile,
  login,
  logout,
  register,
  updateCurrentProfile,
} from '../controllers/auth.controller.js';
import { registerValidator, loginValidator } from '../validators/auth.validators.js';
import { profileUpdateValidator } from '../validators/profile.validators.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/register', registerValidator, validateRequest, register);
router.post('/login', loginValidator, validateRequest, login);
router.get('/me', requireAuth, getCurrentProfile);
router.get('/profile', requireAuth, getCurrentProfile);
router.put('/profile', requireAuth, profileUpdateValidator, validateRequest, updateCurrentProfile);
router.post('/logout', requireAuth, logout);

export default router;
