import { body } from 'express-validator';

export const notificationValidator = [
  body('title').isString().isLength({ min: 3, max: 150 }),
  body('message').isString().isLength({ min: 5, max: 1000 }),
  body('targetRoles').optional().isArray(),
  body('targetRoles.*').optional().isString(),
  body('link').optional().isString(),
  body('club').optional().isMongoId(),
];
