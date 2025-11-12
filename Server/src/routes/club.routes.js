import { Router } from 'express';
import {
  addClubMember,
  createClub,
  deleteClub,
  getClubById,
  getClubMembers,
  getClubs,
  removeClubMember,
  updateClub,
} from '../controllers/club.controller.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/upload.js';
import { clubUpdateValidator, clubValidator } from '../validators/club.validators.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { authorizeRoles } from '../middlewares/authorization.js';
import { Roles } from '../utils/roles.js';
import { body } from 'express-validator';

const router = Router();
const memberValidator = [body('userId').isMongoId()];

router.get('/', getClubs);
router.get('/:id', getClubById);
router.get(
  '/:id/members',
  requireAuth,
  authorizeRoles(Roles.ADMIN, Roles.CLUB_ADMIN),
  getClubMembers
);

router.post(
  '/',
  requireAuth,
  authorizeRoles(Roles.ADMIN),
  upload.single('image'),
  clubValidator,
  validateRequest,
  createClub
);

router.put(
  '/:id',
  requireAuth,
  authorizeRoles(Roles.ADMIN, Roles.CLUB_ADMIN),
  upload.single('image'),
  clubUpdateValidator,
  validateRequest,
  updateClub
);

router.delete('/:id', requireAuth, authorizeRoles(Roles.ADMIN), deleteClub);

router.post(
  '/:id/add-member',
  requireAuth,
  authorizeRoles(Roles.ADMIN, Roles.CLUB_ADMIN),
  memberValidator,
  validateRequest,
  addClubMember
);

router.delete(
  '/:id/remove-member/:userId',
  requireAuth,
  authorizeRoles(Roles.ADMIN, Roles.CLUB_ADMIN),
  removeClubMember
);

export default router;
