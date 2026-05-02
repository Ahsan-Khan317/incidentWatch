import mongoose, { Schema } from "mongoose";

const serviceSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organisation",
      required: true,
    },
    environment: {
      type: String,
      default: "development",
    },
    lastHeartbeat: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "error"],
      default: "active",
    },
    autoAssignEnabled: {
      type: Boolean,
      default: true,
    },
    assignmentRules: [
      {
        tagsRegex: { type: String, default: ".*" },
        teams: [{ type: Schema.Types.ObjectId, ref: "Team" }],
        members: [{ type: Schema.Types.ObjectId, ref: "User" }],
      },
    ],
    teams: [
      {
        type: Schema.Types.ObjectId,
        ref: "Team",
      },
    ],
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User", // Assuming User or Member model
      },
    ],
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

// Ensure service name is unique within an organization
serviceSchema.index({ organizationId: 1, name: 1 }, { unique: true });

const Service = mongoose.model("Service", serviceSchema);

export default Service;
