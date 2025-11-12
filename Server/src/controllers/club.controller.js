import { Club } from '../models/Club.js';
import { User } from '../models/User.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { assertCanManageClub } from '../utils/clubAccess.js';
import { recordActivity } from '../utils/activityLogger.js';
import { Roles } from '../utils/roles.js';

const populateClub = (clubQuery) =>
  clubQuery.populate([
    { path: 'members', select: 'name email role' },
    { path: 'admins', select: 'name email role' },
  ]);

const resolveAdminIds = async ({ adminIds = [], creatorId }) => {
  const uniqueIds = [...new Set([...(adminIds || []), creatorId].filter(Boolean))];
  if (!uniqueIds.length) return [];
  const users = await User.find({ _id: { $in: uniqueIds } }).select('_id');
  return users.map((user) => user._id);
};

export const getClubs = asyncHandler(async (_req, res) => {
  const clubs = await Club.find().populate('members', 'name email role');
  res.json(new ApiResponse({ data: clubs }));
});

export const getClubById = asyncHandler(async (req, res) => {
  const club = await populateClub(Club.findById(req.params.id));

  if (!club) {
    throw new ApiError(404, 'Club not found');
  }

  res.json(new ApiResponse({ data: club }));
});

export const createClub = asyncHandler(async (req, res) => {
  const admins = await resolveAdminIds({ adminIds: req.body.adminIds, creatorId: req.user._id });
  const membersInput = req.body.members ?? [];
  const members = [...new Set([...membersInput.map((id) => id.toString()), ...admins.map((id) => id.toString())])];
  const club = await Club.create({
    ...req.body,
    admins,
    members,
    createdBy: req.user._id,
    imagePath: req.file ? req.file.filename : undefined,
  });

  await recordActivity({
    userId: req.user._id,
    action: 'club.create',
    entity: 'Club',
    entityId: club._id,
  });

  await populateClub(club);

  res.status(201).json(
    new ApiResponse({
      data: club,
      message: 'Club created successfully',
    })
  );
});

export const updateClub = asyncHandler(async (req, res) => {
  const club = await Club.findById(req.params.id);
  assertCanManageClub({ user: req.user, club });

  const updates = { ...req.body };
  if (req.file) updates.imagePath = req.file.filename;
  if (updates.adminIds) {
    updates.admins = await resolveAdminIds({
      adminIds: updates.adminIds,
      creatorId: req.user.role === Roles.ADMIN ? null : req.user._id,
    });
    delete updates.adminIds;
  }

  Object.assign(club, updates);
  await club.save();

  await recordActivity({
    userId: req.user._id,
    action: 'club.update',
    entity: 'Club',
    entityId: club._id,
  });

  await populateClub(club);
  res.json(new ApiResponse({ data: club, message: 'Club updated' }));
});

export const deleteClub = asyncHandler(async (req, res) => {
  const club = await Club.findById(req.params.id);
  if (!club) throw new ApiError(404, 'Club not found');
  await club.deleteOne();

  await recordActivity({
    userId: req.user._id,
    action: 'club.delete',
    entity: 'Club',
    entityId: club._id,
  });

  res.json(new ApiResponse({ data: true, message: 'Club deleted' }));
});

export const getClubMembers = asyncHandler(async (req, res) => {
  const club = await Club.findById(req.params.id).populate('members', 'name email role');
  assertCanManageClub({ user: req.user, club });
  res.json(new ApiResponse({ data: club.members }));
});

export const addClubMember = asyncHandler(async (req, res) => {
  const club = await Club.findById(req.params.id);
  assertCanManageClub({ user: req.user, club });

  if (club.members.some((memberId) => memberId.equals(req.body.userId))) {
    throw new ApiError(400, 'User already part of club');
  }

  const user = await User.findById(req.body.userId);
  if (!user) throw new ApiError(404, 'User not found');

  club.members.push(user._id);
  await club.save();

  await club.populate('members', 'name email role');
  res.json(new ApiResponse({ data: club.members, message: 'Member added' }));
});

export const removeClubMember = asyncHandler(async (req, res) => {
  const club = await Club.findById(req.params.id);
  assertCanManageClub({ user: req.user, club });

  club.members = club.members.filter((memberId) => memberId.toString() !== req.params.userId);
  await club.save();

  await club.populate('members', 'name email role');
  res.json(new ApiResponse({ data: club.members, message: 'Member removed' }));
});
