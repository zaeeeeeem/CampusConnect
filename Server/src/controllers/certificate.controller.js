import path from 'path';
import fs from 'fs';
import { Certificate } from '../models/Certificate.js';
import { Event } from '../models/Event.js';
import { Club } from '../models/Club.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { generateCertificatePdf } from '../utils/certificateGenerator.js';
import { env } from '../config/env.js';
import { assertEventManager } from '../utils/eventAccess.js';
import { Roles } from '../utils/roles.js';
import { recordActivity } from '../utils/activityLogger.js';

export const generateCertificates = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.eventId).populate('attendees', 'name email');
  if (!event) throw new ApiError(404, 'Event not found');
  const club = await Club.findById(event.club);
  assertEventManager({ user: req.user, event, club });

  if (!event.attendees.length) {
    throw new ApiError(400, 'No attendees registered for this event');
  }

  const certificates = [];
  for (const attendee of event.attendees) {
    const fileName = await generateCertificatePdf({ user: attendee, event });
    const certificate = await Certificate.findOneAndUpdate(
      { event: event._id, user: attendee._id },
      { fileName, issuedAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    certificates.push(certificate);
  }

  event.certificatesIssuedAt = new Date();
  await event.save();

  await recordActivity({
    userId: req.user._id,
    action: 'certificates.generate',
    entity: 'Event',
    entityId: event._id,
    metadata: { count: certificates.length },
  });

  res.json(new ApiResponse({ data: certificates, message: 'Certificates generated' }));
});

export const getCertificateForEvent = asyncHandler(async (req, res) => {
  if (!req.user._id.equals(req.params.userId) && req.user.role !== Roles.ADMIN) {
    throw new ApiError(403, 'You can only view your certificates');
  }

  const certificate = await Certificate.findOne({ event: req.params.eventId, user: req.params.userId });
  if (!certificate) throw new ApiError(404, 'Certificate not found');

  const filePath = path.join(env.certificateBasePath, certificate.fileName);
  res.sendFile(filePath);
});

export const getMyCertificates = asyncHandler(async (req, res) => {
  const certificates = await Certificate.find({ user: req.user._id }).populate('event', 'title startDate');
  res.json(new ApiResponse({ data: certificates }));
});

export const deleteCertificate = asyncHandler(async (req, res) => {
  const certificate = await Certificate.findById(req.params.id);
  if (!certificate) throw new ApiError(404, 'Certificate not found');
  if (req.user.role !== Roles.ADMIN) {
    throw new ApiError(403, 'Only admins can delete certificates');
  }
  const filePath = path.join(env.certificateBasePath, certificate.fileName);
  await certificate.deleteOne();
  fs.promises.unlink(filePath).catch(() => {});
  res.json(new ApiResponse({ data: true, message: 'Certificate deleted' }));
});
