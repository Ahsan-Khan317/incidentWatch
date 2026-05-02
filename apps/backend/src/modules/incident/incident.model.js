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
      enum: ["low", "medium", "high", "SEV1", "SEV2", "SEV3"],
      default: "low",
    },

    status: {
      type: String,
      enum: ["open", "acknowledged", "resolved"],
      default: "open",
    },

    source: {
      type: String,
      enum: ["sdk", "manual", "api", "sdk-auto", "sdk-manual"],
      default: "manual",
    },

    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },

    tags: [
      {
        type: String,
      },
    ],

    context: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    breadcrumbs: [
      {
        type: mongoose.Schema.Types.Mixed,
      },
    ],

    serverId: {
      type: String,
      trim: true,
    },

    environment: {
      type: String,
      trim: true,
      default: "production",
    },

    stack: {
      type: String,
    },

    assignedMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    assignedTeams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
      },
    ],

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
