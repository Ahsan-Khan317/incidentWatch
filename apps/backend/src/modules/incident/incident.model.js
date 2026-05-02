import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema(
  {
    time: {
      type: Date,
      default: Date.now,
    },

    action: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const incidentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },

    status: {
      type: String,
      enum: ["open", "in-progress", "resolved"],
      default: "open",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },

    logs: [
      {
        type: String,
      },
    ],

    timeline: [timelineSchema],

    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const Incident = mongoose.model("Incident", incidentSchema);

export default Incident;
