import { Router } from 'express';
import {
  createEvent,
  deleteEvent,
  getEventById,
  getEventParticipants,
  getEvents,
  registerForEvent,
  updateEvent,
} from '../controllers/event.controller.js';
import { getEventFeedback, submitFeedback } from '../controllers/feedback.controller.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/upload.js';
import { eventUpdateValidator, eventValidator } from '../validators/event.validators.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { authorizeRoles } from '../middlewares/authorization.js';
import { Roles } from '../utils/roles.js';
import { feedbackValidator } from '../validators/feedback.validators.js';

const router = Router();

router.get('/', getEvents);
router.get('/:id', getEventById);

router.post('/',
  requireAuth,
  authorizeRoles(Roles.CLUB_ADMIN, Roles.ADMIN),
  upload.single('image'),
  eventValidator,
  validateRequest,
  createEvent
);

router.put('/:id',
  requireAuth,
  authorizeRoles(Roles.CLUB_ADMIN, Roles.ADMIN),
  upload.single('image'),
  eventUpdateValidator,
  validateRequest,
  updateEvent
);

router.delete('/:id', requireAuth, authorizeRoles(Roles.CLUB_ADMIN, Roles.ADMIN), deleteEvent);
router.post('/:id/register', requireAuth, registerForEvent);
router.get('/:id/participants',
  requireAuth,
  authorizeRoles(Roles.CLUB_ADMIN, Roles.ADMIN),
  getEventParticipants
);
router.post('/:id/feedback',
  requireAuth,
  feedbackValidator,
  validateRequest,
  submitFeedback
);
router.get('/:id/feedback', requireAuth, getEventFeedback);

export default router;
