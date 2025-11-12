import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 200,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 2000,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator(value) {
          return value > new Date();
        },
        message: 'startDate must be in the future',
      },
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator(value) {
          return this.startDate ? value > this.startDate : true;
        },
        message: 'endDate must be after startDate',
      },
    },
    location: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
    },
    category: {
      type: String,
      enum: ['academic', 'sports', 'cultural', 'technical', 'social'],
      required: true,
    },
    maxAttendees: {
      type: Number,
      min: 1,
    },
    attendees: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      default: [],
    },
    imagePath: {
      type: String,
    },
    tags: {
      type: [String],
      validate: [(value) => value.length <= 10, 'Max 10 tags'],
      default: [],
    },
  },
  { timestamps: true }
);

export const Event = mongoose.model('Event', eventSchema);
