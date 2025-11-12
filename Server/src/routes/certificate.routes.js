import { Router } from 'express';
import {
  deleteCertificate,
  generateCertificates,
  getCertificateForEvent,
  getMyCertificates,
} from '../controllers/certificate.controller.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/authorization.js';
import { Roles } from '../utils/roles.js';

const router = Router();

router.post('/generate/:eventId',
  requireAuth,
  authorizeRoles(Roles.CLUB_ADMIN, Roles.ADMIN),
  generateCertificates
);
router.get('/', requireAuth, getMyCertificates);
router.get('/:userId/:eventId', requireAuth, getCertificateForEvent);
router.delete('/:id', requireAuth, authorizeRoles(Roles.ADMIN), deleteCertificate);

export default router;
