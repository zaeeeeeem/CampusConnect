import { User } from '../models/User.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { signToken } from '../utils/token.js';

const sanitizeUser = (user = {}) => (typeof user.toJSON === 'function' ? user.toJSON() : user);

const populateUserClub = async (user) => {
  if (!user) return user;
  if (typeof user.populate === 'function') {
    await user.populate('club', 'name category');
    return user;
  }
  return User.findById(user._id).populate('club', 'name category');
};

const buildAuthPayload = async (user) => {
  const hydratedUser = await populateUserClub(user);
  const safeUser = sanitizeUser(hydratedUser);
  return {
    user: safeUser,
    token: signToken({ userId: safeUser._id }),
  };
};

const syncClubField = (body = {}) => {
  if (body.clubId && !body.club) {
    body.club = body.clubId;
  }
  return body;
};

export const register = asyncHandler(async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) {
    throw new ApiError(409, 'Email already in use');
  }

  const payload = syncClubField({ ...req.body });
  const user = await User.create(payload);
  await populateUserClub(user);

  res.status(201).json(
    new ApiResponse({
      data: await buildAuthPayload(user),
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

  res.json(new ApiResponse({ data: await buildAuthPayload(user) }));
});

export const getCurrentProfile = asyncHandler(async (req, res) => {
  res.json(new ApiResponse({ data: req.user }));
});

export const updateCurrentProfile = asyncHandler(async (req, res) => {
  const updates = {};
  const { name, department, year, bio, interests, clubId, club } = req.body;

  if (name) updates.name = name;
  if (department) updates.department = department;
  if (year !== undefined && year !== null && year !== '') updates.year = Number(year);
  if (bio !== undefined) updates.bio = bio;
  if (interests !== undefined) updates.interests = Array.isArray(interests) ? interests : [interests];
  if (clubId || club) updates.club = club || clubId;

  const updated = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  }).populate('club', 'name category');

  res.json(new ApiResponse({ data: updated, message: 'Profile updated' }));
});

export const logout = asyncHandler(async (_req, res) => {
  res.json(new ApiResponse({ data: true, message: 'Logout successful' }));
});
