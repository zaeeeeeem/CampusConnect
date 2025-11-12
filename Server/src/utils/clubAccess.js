import { ApiError } from './apiError.js';
import { Roles } from './roles.js';

export const assertCanManageClub = ({ user, club }) => {
  if (!club) {
    throw new ApiError(404, 'Club not found');
  }

  if (user.role === Roles.ADMIN) {
    return;
  }

  if (user.role === Roles.CLUB_ADMIN && club.admins?.some((adminId) => adminId.equals(user._id))) {
    return;
  }

  throw new ApiError(403, 'Only club admins can perform this action');
};

export const assertClubMember = ({ user, club }) => {
  if (!club) {
    throw new ApiError(404, 'Club not found');
  }

  if (club.members?.some((memberId) => memberId.equals(user._id))) {
    return;
  }

  throw new ApiError(403, 'You must be a club member to access this resource');
};
