import { Router } from 'express';
import announcementRoutes from './announcement.routes.js';
import eventRoutes from './event.routes.js';
import clubRoutes from './club.routes.js';
import authRoutes from './auth.routes.js';

const router = Router();

router.use('/announcements', announcementRoutes);
router.use('/events', eventRoutes);
router.use('/clubs', clubRoutes);
router.use('/auth', authRoutes);

export default router;
