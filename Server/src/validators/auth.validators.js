import { body } from 'express-validator';

export const registerValidator = [
  body('name').isString().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').optional().isIn(['student', 'faculty', 'club_admin', 'admin']),
  body('department').optional().isLength({ min: 2, max: 100 }),
  body('year').optional().isInt({ min: 1, max: 6 }),
];

export const loginValidator = [
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];
