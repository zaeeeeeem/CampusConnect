import { ActivityLog } from '../models/ActivityLog.js';

export const recordActivity = async ({ userId, action, entity = null, entityId = null, metadata = {} }) => {
  try {
    await ActivityLog.create({ user: userId, action, entity, entityId, metadata });
  } catch (error) {
    console.error('Failed to record activity log', error.message);
  }
};
