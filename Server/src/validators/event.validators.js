import { body } from 'express-validator';

export const eventValidator = [
  body('title').isString().isLength({ min: 5, max: 200 }),
  body('description').isString().isLength({ min: 10, max: 2000 }),
  body('startDate')
    .isISO8601()
    .withMessage('startDate must be ISO8601')
    .custom((value) => new Date(value) > new Date())
    .withMessage('startDate must be in the future'),
  body('endDate')
    .isISO8601()
    .withMessage('endDate must be ISO8601')
    .custom((value, { req }) => new Date(value) > new Date(req.body.startDate))
    .withMessage('endDate must be after startDate'),
  body('location').isString().isLength({ min: 3, max: 100 }),
  body('category').isIn(['academic', 'sports', 'cultural', 'technical', 'social']),
  body('maxAttendees').optional().isInt({ min: 1 }),
  body('tags').optional().isArray({ max: 10 }),
  body('tags.*').optional().isString().isLength({ min: 2, max: 30 }),
];
