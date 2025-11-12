import { Router } from 'express';
import { deleteFeedback } from '../controllers/feedback.controller.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/authorization.js';
import { Roles } from '../utils/roles.js';

const router = Router();

router.delete('/:id', requireAuth, authorizeRoles(Roles.ADMIN), deleteFeedback);

export default router;
