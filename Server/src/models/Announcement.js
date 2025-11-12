import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 200,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 5000,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      enum: ['academic', 'event', 'administrative', 'club', 'general'],
      required: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      validate: [(value) => value.length <= 10, 'Max 10 tags'],
      default: [],
    },
  },
  { timestamps: true }
);

export const Announcement = mongoose.model('Announcement', announcementSchema);
