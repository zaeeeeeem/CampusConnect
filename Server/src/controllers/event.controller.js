import { Event } from '../models/Event.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { Club } from '../models/Club.js';
import { Roles } from '../utils/roles.js';
import { assertCanManageClub } from '../utils/clubAccess.js';
import { recordActivity } from '../utils/activityLogger.js';
import { assertEventManager } from '../utils/eventAccess.js';

export const getEvents = asyncHandler(async (req, res) => {
  const { category, page = 1, limit = 20 } = req.query;
  const filters = {};

  if (category) {
    filters.category = category;
  }

  const sanitizedLimit = Math.min(50, Math.max(1, Number(limit) || 20));
  const sanitizedPage = Math.max(1, Number(page) || 1);

  const events = await Event.find(filters)
    .populate('organizer', 'name email role department')
    .populate('club', 'name category')
    .sort({ startDate: 1 })
    .skip((sanitizedPage - 1) * sanitizedLimit)
    .limit(sanitizedLimit);

  const total = await Event.countDocuments(filters);

  res.json(
    new ApiResponse({
      data: {
        items: events,
        pagination: {
          total,
          page: sanitizedPage,
          pages: Math.ceil(total / sanitizedLimit) || 1,
        },
      },
    })
  );
});

export const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)
    .populate('organizer attendees', 'name email role')
    .populate('club', 'name category');

  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  res.json(new ApiResponse({ data: event }));
});

export const createEvent = asyncHandler(async (req, res) => {
  const { clubId, ...body } = req.body;
  const club = await Club.findById(clubId || body.club);
  assertCanManageClub({ user: req.user, club });

  const payload = {
    ...body,
    club: club._id,
    organizer: req.user._id,
    imagePath: req.file ? req.file.filename : undefined,
  };

  const event = await Event.create(payload);

  await recordActivity({
    userId: req.user._id,
    action: 'event.create',
    entity: 'Event',
    entityId: event._id,
    metadata: { club: club._id },
  });

  res.status(201).json(
    new ApiResponse({
      data: await event.populate([
        { path: 'organizer', select: 'name email role department' },
        { path: 'club', select: 'name category' },
      ]),
      message: 'Event created successfully',
    })
  );
});

export const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) throw new ApiError(404, 'Event not found');
  const club = await Club.findById(event.club);
  assertEventManager({ user: req.user, event, club });

  const updates = { ...req.body };
  if (req.file) {
    updates.imagePath = req.file.filename;
  }

  Object.assign(event, updates);
  await event.save();

  await recordActivity({
    userId: req.user._id,
    action: 'event.update',
    entity: 'Event',
    entityId: event._id,
  });

  res.json(
    new ApiResponse({
      data: await event.populate([
        { path: 'organizer', select: 'name email role' },
        { path: 'club', select: 'name category' },
      ]),
      message: 'Event updated',
    })
  );
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) throw new ApiError(404, 'Event not found');
  const club = await Club.findById(event.club);
  assertEventManager({ user: req.user, event, club });

  await event.deleteOne();
  await recordActivity({
    userId: req.user._id,
    action: 'event.delete',
    entity: 'Event',
    entityId: event._id,
  });

  res.json(new ApiResponse({ data: true, message: 'Event removed' }));
});

export const registerForEvent = asyncHandler(async (req, res) => {
  if (req.user.role !== Roles.STUDENT) {
    throw new ApiError(403, 'Only students can register for events');
  }

  const event = await Event.findById(req.params.id);
  if (!event) throw new ApiError(404, 'Event not found');

  if (event.registrationDeadline && event.registrationDeadline < new Date()) {
    throw new ApiError(400, 'Registration window has closed');
  }

  if (event.attendees.some((userId) => userId.equals(req.user._id))) {
    throw new ApiError(400, 'You are already registered');
  }

  if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
    throw new ApiError(400, 'Event capacity reached');
  }

  event.attendees.push(req.user._id);
  await event.save();

  res.json(new ApiResponse({ data: true, message: 'Registration successful' }));
});

export const getEventParticipants = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate('attendees', 'name email role');
  if (!event) throw new ApiError(404, 'Event not found');
  const club = await Club.findById(event.club);
  assertEventManager({ user: req.user, event, club });

  res.json(new ApiResponse({ data: event.attendees }));
});
