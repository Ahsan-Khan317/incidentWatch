import mongoose from "mongoose";

const apiKeySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, "API key is required"],
      unique: true,
      trim: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: [true, "Organization ID is required"],
    },
    name: {
      type: String,
      trim: true,
      default: "Default API Key",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastUsed: {
      type: Date,
    },
    expiresAt: {
      type: Date,
      default: null, // null means infinite
    },
  },
  { timestamps: true },
);

const ApiKey = mongoose.model("ApiKey", apiKeySchema);
export default ApiKey;
