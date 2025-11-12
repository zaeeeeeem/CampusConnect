import { Router } from 'express';
import { deleteUser, getUsers, updateUserRole } from '../controllers/user.controller.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/authorization.js';
import { Roles } from '../utils/roles.js';
import { userRoleValidator } from '../validators/user.validators.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = Router();

router.get('/', requireAuth, authorizeRoles(Roles.ADMIN), getUsers);
router.put(
  '/:id/role',
  requireAuth,
  authorizeRoles(Roles.ADMIN),
  userRoleValidator,
  validateRequest,
  updateUserRole
);
router.delete('/:id', requireAuth, authorizeRoles(Roles.ADMIN), deleteUser);

export default router;
