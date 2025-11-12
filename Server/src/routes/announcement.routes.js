import { Router } from 'express';
import {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  getAnnouncementsByCategory,
} from '../controllers/announcement.controller.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { announcementValidator } from '../validators/announcement.validators.js';

const router = Router();

router.get('/', getAnnouncements);
router.get('/category/:category', getAnnouncementsByCategory);
router.get('/:id', getAnnouncementById);
router.post('/', requireAuth, announcementValidator, validateRequest, createAnnouncement);

export default router;
