import { User } from '../models/User.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { Roles } from '../utils/roles.js';

const buildUpdates = (body) => {
  const allowed = ['name', 'department', 'year', 'bio', 'interests'];
  return allowed.reduce((acc, field) => {
    if (body[field] !== undefined) {
      if (field === 'year') {
        acc[field] = Number(body[field]);
      } else if (field === 'interests') {
        acc[field] = Array.isArray(body[field]) ? body[field] : [body[field]];
      } else {
        acc[field] = body[field];
      }
    }
    return acc;
  }, {});
};

export const getProfileById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId).select('-password');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  res.json(new ApiResponse({ data: user }));
});

export const updateProfileById = asyncHandler(async (req, res) => {
  if (!req.user._id.equals(req.params.userId) && req.user.role !== Roles.ADMIN) {
    throw new ApiError(403, 'You can only update your own profile');
  }

  const user = await User.findByIdAndUpdate(req.params.userId, buildUpdates(req.body), {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.json(new ApiResponse({ data: user, message: 'Profile updated' }));
});

export const uploadProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Avatar image is required');
  }

  req.user.avatarPath = req.file.filename;
  await req.user.save();

  res.json(new ApiResponse({ data: req.user, message: 'Avatar updated' }));
});
