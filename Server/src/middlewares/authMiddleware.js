import { ApiError } from '../utils/apiError.js';
import { verifyToken } from '../utils/token.js';
import { User } from '../models/User.js';
import { asyncHandler } from './asyncHandler.js';

export const requireAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Authentication required');
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);

  const user = await User.findById(payload.userId).select('-password').populate('club', 'name category');
  if (!user) {
    throw new ApiError(401, 'User no longer exists');
  }

  req.user = user;
  next();
});
