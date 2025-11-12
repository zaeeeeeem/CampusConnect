import { Router } from 'express';
import {
  createNotification,
  deleteNotification,
  getNotificationById,
  getNotifications,
  updateNotification,
} from '../controllers/notification.controller.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/authorization.js';
import { Roles } from '../utils/roles.js';
import { notificationValidator } from '../validators/notification.validators.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = Router();

router.get('/', requireAuth, getNotifications);
router.get('/:id', requireAuth, getNotificationById);
router.post('/',
  requireAuth,
  authorizeRoles(Roles.ADMIN, Roles.CLUB_ADMIN),
  notificationValidator,
  validateRequest,
  createNotification
);
router.put('/:id',
  requireAuth,
  authorizeRoles(Roles.ADMIN, Roles.CLUB_ADMIN),
  notificationValidator,
  validateRequest,
  updateNotification
);
router.delete('/:id', requireAuth, authorizeRoles(Roles.ADMIN), deleteNotification);

export default router;
