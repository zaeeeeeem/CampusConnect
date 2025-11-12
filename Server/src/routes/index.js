import { Router } from 'express';
import announcementRoutes from './announcement.routes.js';
import eventRoutes from './event.routes.js';
import clubRoutes from './club.routes.js';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import notificationRoutes from './notification.routes.js';
import feedbackRoutes from './feedback.routes.js';
import certificateRoutes from './certificate.routes.js';
import adminRoutes from './admin.routes.js';
import profileRoutes from './profile.routes.js';

const router = Router();

router.use('/announcements', announcementRoutes);
router.use('/events', eventRoutes);
router.use('/clubs', clubRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/notifications', notificationRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/certificates', certificateRoutes);
router.use('/admin', adminRoutes);
router.use('/profile', profileRoutes);

export default router;
