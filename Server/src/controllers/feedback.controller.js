import { Feedback } from '../models/Feedback.js';
import { Event } from '../models/Event.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { Club } from '../models/Club.js';
import { Roles } from '../utils/roles.js';

export const submitFeedback = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) throw new ApiError(404, 'Event not found');

  if (!event.attendees.some((attendeeId) => attendeeId.equals(req.user._id))) {
    throw new ApiError(403, 'You must attend the event before leaving feedback');
  }

  const feedback = await Feedback.findOneAndUpdate(
    { event: event._id, user: req.user._id },
    { rating: req.body.rating, comment: req.body.comment },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.status(201).json(new ApiResponse({ data: feedback, message: 'Feedback submitted' }));
});

export const getEventFeedback = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) throw new ApiError(404, 'Event not found');
  const club = await Club.findById(event.club);
  if (!club) throw new ApiError(404, 'Club not found');

  if (
    req.user.role !== Roles.ADMIN &&
    !(
      req.user.role === Roles.CLUB_ADMIN &&
      club.admins.some((adminId) => adminId.equals(req.user._id))
    )
  ) {
    throw new ApiError(403, 'Only club admins can view feedback');
  }

  const feedback = await Feedback.find({ event: req.params.id })
    .populate('user', 'name email role')
    .sort({ createdAt: -1 });

  res.json(new ApiResponse({ data: feedback }));
});

export const deleteFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findByIdAndDelete(req.params.id);
  if (!feedback) throw new ApiError(404, 'Feedback not found');
  res.json(new ApiResponse({ data: true, message: 'Feedback deleted' }));
});
