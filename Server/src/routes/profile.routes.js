import { Router } from 'express';
import { getProfileById, updateProfileById, uploadProfileImage } from '../controllers/profile.controller.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { profileUpdateValidator } from '../validators/profile.validators.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

router.get('/:userId', requireAuth, getProfileById);
router.put('/:userId',
  requireAuth,
  profileUpdateValidator,
  validateRequest,
  updateProfileById
);
router.post('/upload-image', requireAuth, upload.single('avatar'), uploadProfileImage);

export default router;
