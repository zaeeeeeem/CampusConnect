import { Club } from '../models/Club.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

export const getClubs = asyncHandler(async (_req, res) => {
  const clubs = await Club.find().populate('members', 'name email role');
  res.json(new ApiResponse({ data: clubs }));
});

export const getClubById = asyncHandler(async (req, res) => {
  const club = await Club.findById(req.params.id).populate('members', 'name email role');

  if (!club) {
    throw new ApiError(404, 'Club not found');
  }

  res.json(new ApiResponse({ data: club }));
});

export const createClub = asyncHandler(async (req, res) => {
  const club = await Club.create({
    ...req.body,
    members: [req.user._id],
    imagePath: req.file ? req.file.filename : undefined,
  });

  res.status(201).json(
    new ApiResponse({
      data: await club.populate('members', 'name email role'),
      message: 'Club created successfully',
    })
  );
});
