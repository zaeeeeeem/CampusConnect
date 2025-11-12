import { Router } from 'express';
import { getEvents, getEventById, createEvent } from '../controllers/event.controller.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/upload.js';
import { eventValidator } from '../validators/event.validators.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = Router();

router.get('/', getEvents);
router.get('/:id', getEventById);
router.post(
  '/',
  requireAuth,
  upload.single('image'),
  eventValidator,
  validateRequest,
  createEvent
);

export default router;
