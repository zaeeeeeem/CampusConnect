import { Event } from '../models/Event.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

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
  const event = await Event.findById(req.params.id).populate('organizer attendees', 'name email role');

  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  res.json(new ApiResponse({ data: event }));
});

export const createEvent = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    organizer: req.user._id,
    imagePath: req.file ? req.file.filename : undefined,
  };

  const event = await Event.create(payload);

  res.status(201).json(
    new ApiResponse({
      data: await event.populate('organizer', 'name email role department'),
      message: 'Event created successfully',
    })
  );
});
