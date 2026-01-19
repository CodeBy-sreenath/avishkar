import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: String,

    // department event OR common event
    eventCategory: {
      type: String,
      enum: ["department", "common"],
      required: true,
    },

    // Only for department events
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },

    // single / team
    type: {
      type: String,
      enum: ["single", "team"],
      required: true,
    },

    // only for team events
    teamSize: {
      type: Number,
      default: 1,
    },

    // 💰 Payment redirect link
    paymentUrl: {
      type: String,
      required: true,
    },

    // 🗓 Event schedule
    eventDate: {
      type: Date,
      required: true,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      required: true,
    },

    // ⏳ Last date to register
    registrationDeadline: {
      type: Date,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    isParticipated: {
  type: Boolean,
  default: false,
},

participatedAt: {
  type: Date,
  default: null,
},
  },
  { timestamps: true }
);

const Event = mongoose.models.Event || mongoose.model("Event", EventSchema);
export default Event;
