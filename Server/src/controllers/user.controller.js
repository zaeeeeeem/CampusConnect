import { User } from '../models/User.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { Roles } from '../utils/roles.js';
import { recordActivity } from '../utils/activityLogger.js';

export const getUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select('-password');
  res.json(new ApiResponse({ data: users }));
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!Object.values(Roles).includes(role)) {
    throw new ApiError(400, 'Invalid role supplied');
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  await recordActivity({
    userId: req.user._id,
    action: 'user.role.update',
    entity: 'User',
    entityId: user._id,
    metadata: { role },
  });

  res.json(new ApiResponse({ data: user, message: 'Role updated' }));
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  await recordActivity({
    userId: req.user._id,
    action: 'user.delete',
    entity: 'User',
    entityId: user._id,
  });

  res.json(new ApiResponse({ data: true, message: 'User removed' }));
});
