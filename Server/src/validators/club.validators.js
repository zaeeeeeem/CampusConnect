import { body } from 'express-validator';

export const clubValidator = [
  body('name').isString().isLength({ min: 3, max: 100 }),
  body('description').isString().isLength({ min: 10, max: 1000 }),
  body('category').isIn(['academic', 'cultural', 'sports', 'technical', 'social']),
  body('contactEmail').isEmail().normalizeEmail(),
  body('adminIds').optional().isArray(),
  body('adminIds.*').optional().isMongoId(),
  body('members').optional().isArray(),
  body('members.*').optional().isMongoId(),
];

export const clubUpdateValidator = [
  body('name').optional().isString().isLength({ min: 3, max: 100 }),
  body('description').optional().isString().isLength({ min: 10, max: 1000 }),
  body('category').optional().isIn(['academic', 'cultural', 'sports', 'technical', 'social']),
  body('contactEmail').optional().isEmail().normalizeEmail(),
  body('adminIds').optional().isArray(),
  body('adminIds.*').optional().isMongoId(),
  body('members').optional().isArray(),
  body('members.*').optional().isMongoId(),
];
