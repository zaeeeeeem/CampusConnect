import { Notification } from '../models/Notification.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { Roles } from '../utils/roles.js';

const canSeeNotification = ({ notification, user }) => {
  if (!notification.targetRoles?.length) return true;
  if (notification.targetRoles.includes(user.role)) return true;
  if (user.role === Roles.ADMIN) return true;
  return false;
};

const canManageNotification = ({ notification, user }) => {
  if (user.role === Roles.ADMIN) return true;
  if (user.role === Roles.CLUB_ADMIN && notification.createdBy.equals(user._id)) return true;
  return false;
};

export const createNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.create({
    ...req.body,
    createdBy: req.user._id,
  });

  res.status(201).json(new ApiResponse({ data: notification, message: 'Notification created' }));
});

export const getNotifications = asyncHandler(async (req, res) => {
  const filters = {};
  if (req.query.clubId) filters.club = req.query.clubId;

  const notifications = await Notification.find(filters)
    .populate('club', 'name category')
    .sort({ createdAt: -1 });

  const visible = notifications.filter((notification) => canSeeNotification({ notification, user: req.user }));

  res.json(new ApiResponse({ data: visible }));
});

export const getNotificationById = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id).populate('club', 'name category');
  if (!notification) throw new ApiError(404, 'Notification not found');
  if (!canSeeNotification({ notification, user: req.user })) {
    throw new ApiError(403, 'Insufficient permissions');
  }
  res.json(new ApiResponse({ data: notification }));
});

export const updateNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) throw new ApiError(404, 'Notification not found');
  if (!canManageNotification({ notification, user: req.user })) {
    throw new ApiError(403, 'Insufficient permissions');
  }

  Object.assign(notification, req.body);
  await notification.save();

  res.json(new ApiResponse({ data: notification, message: 'Notification updated' }));
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) throw new ApiError(404, 'Notification not found');
  if (req.user.role !== Roles.ADMIN) {
    throw new ApiError(403, 'Only admins can delete notifications');
  }
  await notification.deleteOne();
  res.json(new ApiResponse({ data: true, message: 'Notification deleted' }));
});
