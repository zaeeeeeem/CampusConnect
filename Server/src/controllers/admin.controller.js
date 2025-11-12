import { User } from '../models/User.js';
import { Club } from '../models/Club.js';
import { Event } from '../models/Event.js';
import { Feedback } from '../models/Feedback.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

export const getAdminStats = asyncHandler(async (_req, res) => {
  const [userCount, clubCount, eventCount, feedbackCount] = await Promise.all([
    User.countDocuments(),
    Club.countDocuments(),
    Event.countDocuments(),
    Feedback.countDocuments(),
  ]);

  res.json(
    new ApiResponse({
      data: { userCount, clubCount, eventCount, feedbackCount },
    })
  );
});

export const getActivityLogs = asyncHandler(async (req, res) => {
  const { limit = 50 } = req.query;
  const logs = await ActivityLog.find()
    .populate('user', 'name email role')
    .sort({ createdAt: -1 })
    .limit(Number(limit));

  res.json(new ApiResponse({ data: logs }));
});
