import { Router } from 'express';
import { createClub, getClubById, getClubs } from '../controllers/club.controller.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/upload.js';
import { clubValidator } from '../validators/club.validators.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = Router();

router.get('/', getClubs);
router.get('/:id', getClubById);
router.post('/', requireAuth, upload.single('image'), clubValidator, validateRequest, createClub);

export default router;
