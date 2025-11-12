import { User } from '../models/User.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { signToken } from '../utils/token.js';

const sanitizeUser = (user = {}) => (typeof user.toJSON === 'function' ? user.toJSON() : user);

const buildAuthPayload = (user) => {
  const safeUser = sanitizeUser(user);
  return {
    user: safeUser,
    token: signToken({ userId: safeUser._id }),
  };
};

export const register = asyncHandler(async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) {
    throw new ApiError(409, 'Email already in use');
  }

  const user = await User.create(req.body);

  res.status(201).json(
    new ApiResponse({
      data: buildAuthPayload(user),
      message: 'Registration successful',
    })
  );
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select('+password');

  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const passwordMatch = await user.comparePassword(req.body.password);
  if (!passwordMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  res.json(new ApiResponse({ data: buildAuthPayload(user) }));
});

export const getProfile = asyncHandler(async (req, res) => {
  res.json(new ApiResponse({ data: req.user }));
});

export const logout = asyncHandler(async (_req, res) => {
  res.json(new ApiResponse({ data: true, message: 'Logout successful' }));
});
