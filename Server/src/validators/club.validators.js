import { body } from 'express-validator';

export const clubValidator = [
  body('name').isString().isLength({ min: 3, max: 100 }),
  body('description').isString().isLength({ min: 10, max: 1000 }),
  body('category').isIn(['academic', 'cultural', 'sports', 'technical', 'social']),
  body('contactEmail').isEmail().normalizeEmail(),
];
