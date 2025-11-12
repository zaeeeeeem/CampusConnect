import { ApiError } from './apiError.js';
import { Roles } from './roles.js';

export const assertEventManager = ({ user, event, club }) => {
  if (!event) throw new ApiError(404, 'Event not found');
  if (user.role === Roles.ADMIN) return;
  if (event.organizer.equals(user._id)) return;
  if (user.role === Roles.CLUB_ADMIN && club?.admins?.some((adminId) => adminId.equals(user._id))) return;
  throw new ApiError(403, 'Insufficient permissions for this event');
};
