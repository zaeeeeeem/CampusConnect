import { body } from 'express-validator';

export const announcementValidator = [
  body('title').isString().isLength({ min: 5, max: 200 }),
  body('content').isString().isLength({ min: 10, max: 5000 }),
  body('category').isIn(['academic', 'event', 'administrative', 'club', 'general']),
  body('isPinned').optional().isBoolean(),
  body('tags').optional().isArray({ max: 10 }),
  body('tags.*').optional().isString().isLength({ min: 2, max: 30 }),
];
