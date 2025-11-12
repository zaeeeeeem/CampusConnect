import { Router } from 'express';
import { getActivityLogs, getAdminStats } from '../controllers/admin.controller.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/authorization.js';
import { Roles } from '../utils/roles.js';

const router = Router();

router.get('/stats', requireAuth, authorizeRoles(Roles.ADMIN), getAdminStats);
router.get('/logs', requireAuth, authorizeRoles(Roles.ADMIN), getActivityLogs);

export default router;
