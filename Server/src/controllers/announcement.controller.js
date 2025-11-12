import { Announcement } from '../models/Announcement.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

const buildFilters = ({ category }) => {
  const filters = {};
  if (category) {
    filters.category = category;
  }
  return filters;
};

const buildPagination = (page = 1, limit = 20) => {
  const sanitizedLimit = Math.min(50, Math.max(1, Number(limit) || 20));
  const sanitizedPage = Math.max(1, Number(page) || 1);
  return {
    limit: sanitizedLimit,
    page: sanitizedPage,
    skip: (sanitizedPage - 1) * sanitizedLimit,
  };
};

const fetchAnnouncements = async ({ filters, pagination }) => {
  const items = await Announcement.find(filters)
    .populate('author', '-password')
    .sort({ createdAt: -1 })
    .skip(pagination.skip)
    .limit(pagination.limit);

  const total = await Announcement.countDocuments(filters);
  return {
    items,
    pagination: {
      total,
      page: pagination.page,
      pages: Math.ceil(total / pagination.limit) || 1,
    },
  };
};

export const getAnnouncements = asyncHandler(async (req, res) => {
  const { category, page = 1, limit = 20 } = req.query;
  const filters = buildFilters({ category });
  const pagination = buildPagination(page, limit);
  const payload = await fetchAnnouncements({ filters, pagination });

  res.json(new ApiResponse({ data: payload }));
});

export const getAnnouncementById = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id).populate('author', '-password');

  if (!announcement) {
    throw new ApiError(404, 'Announcement not found');
  }

  res.json(new ApiResponse({ data: announcement }));
});

export const createAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.create({
    ...req.body,
    author: req.user._id,
  });

  res.status(201).json(
    new ApiResponse({
      data: await announcement.populate('author', '-password'),
      message: 'Announcement created successfully',
    })
  );
});


export const getAnnouncementsByCategory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const filters = buildFilters({ category: req.params.category });
  const pagination = buildPagination(page, limit);

  const payload = await fetchAnnouncements({ filters, pagination });
  res.json(new ApiResponse({ data: payload }));
});
