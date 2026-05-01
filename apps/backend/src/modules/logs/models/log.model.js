import mongoose, { Schema } from "mongoose";

const logSchema = new Schema(
  {
    message: {
      type: String,
      required: [true, "Log message is required"],
      trim: true,
    },
    level: {
      type: String,
      enum: ["info", "warn", "error"],
      required: [true, "Log level is required"],
      lowercase: true,
    },
    service: {
      type: String,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    orgId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    apiKey: {
      type: String,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
logSchema.index({ orgId: 1, level: 1, service: 1, timestamp: -1 });

const Log = mongoose.model("Log", logSchema);

export default Log;
