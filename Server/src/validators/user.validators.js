import { body } from 'express-validator';

export const userRoleValidator = [
  body('role').isIn(['student', 'faculty', 'club_admin', 'admin']),
  body('clubId').optional().isMongoId(),
  body('club').optional().isMongoId(),
];
